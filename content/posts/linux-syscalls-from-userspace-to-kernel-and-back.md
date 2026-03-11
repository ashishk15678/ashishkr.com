---
title: "Linux Syscalls: From Userspace to Kernel and Back"
excerpt: "Tracing the full lifecycle of a system call on x86-64 Linux — from the userspace wrapper through VDSO, the syscall instruction, kernel entry, dispatch tables, and the return path. With code to make raw syscalls without libc."
date: "2026-01-27"
tags: ["LINUX", "KERNEL", "SYSCALL", "x86-64", "C"]
heroImage: "/blog/syscall-hero.png"
---

Every interaction your program has with the outside world — opening a file, sending a network packet, allocating memory, spawning a thread — goes through a system call. It's the only legal gateway between unprivileged userspace code and the kernel.

Most programmers use syscalls through libc wrappers (\`read()\`, \`write()\`, \`open()\`) and never think about what happens beneath. This post traces the full path of a syscall on x86-64 Linux, from the C library down to the kernel dispatch table and back.

## What Is a System Call, Really?

A syscall is a controlled transition from user mode (Ring 3) to kernel mode (Ring 0). The CPU provides a dedicated instruction for this — \`syscall\` on x86-64 — that atomically:

1. Saves the user return address (\`RIP\`) into \`RCX\`
2. Saves \`RFLAGS\` into \`R11\`
3. Loads the kernel entry point from \`IA32_LSTAR\` MSR
4. Loads the kernel code segment from \`IA32_STAR\` MSR
5. Masks \`RFLAGS\` with \`IA32_FMASK\` MSR (disables interrupts)
6. Jumps to kernel code

> [!definition] Ring 0 / Ring 3 — x86 privilege levels. Ring 0 (kernel mode) can execute any instruction and access any memory. Ring 3 (user mode) is restricted — it cannot directly access hardware, other processes' memory, or kernel data structures. The \`syscall\` instruction is the controlled transition between them.

The return is done with the \`sysret\` instruction, which reverses the process — restoring \`RIP\` from \`RCX\` and \`RFLAGS\` from \`R11\`.

## The Calling Convention

On x86-64 Linux, the syscall ABI uses these registers:

\`\`\`c
// x86-64 Linux syscall calling convention:
//
// RAX = syscall number
// RDI = arg1
// RSI = arg2
// RDX = arg3
// R10 = arg4    (NOTE: not RCX — the syscall instruction clobbers RCX)
// R8  = arg5
// R9  = arg6
//
// Return value: RAX
//   Negative values in range [-4095, -1] indicate errors
//   (the negated errno value)
//
// Clobbered by kernel: RCX, R11
// Preserved: all others (RBX, RBP, RSP, R12-R15)
\`\`\`

> [!warning] The syscall convention uses \`R10\` for the 4th argument, NOT \`RCX\`. This is because the \`syscall\` instruction itself overwrites \`RCX\` with the return address. The libc wrapper for any 4+ argument syscall must move \`RCX\` to \`R10\` before issuing the instruction. Getting this wrong causes silent corruption.

## Making Raw Syscalls Without libc

You don't need libc to make syscalls. Here's how to do it with inline assembly:

\`\`\`c
#include <stdint.h>
#include <sys/syscall.h>  // for SYS_write, SYS_exit, etc.

// Generic syscall wrapper — up to 6 arguments
static inline long raw_syscall(long nr,
    long a1, long a2, long a3,
    long a4, long a5, long a6)
{
    long ret;
    register long r10 __asm__("r10") = a4;
    register long r8  __asm__("r8")  = a5;
    register long r9  __asm__("r9")  = a6;

    __asm__ __volatile__ (
        "syscall"
        : "=a"(ret)
        : "a"(nr), "D"(a1), "S"(a2), "d"(a3),
          "r"(r10), "r"(r8), "r"(r9)
        : "rcx", "r11", "memory"
    );
    return ret;
}

// Convenience wrappers
static inline long sys_write(int fd, const void *buf, long len) {
    return raw_syscall(SYS_write, fd, (long)buf, len, 0, 0, 0);
}

static inline long sys_exit(int code) {
    return raw_syscall(SYS_exit_group, code, 0, 0, 0, 0, 0);
}

static inline long sys_open(const char *path, int flags, int mode) {
    return raw_syscall(SYS_openat, -100 /*AT_FDCWD*/, (long)path, flags, mode, 0, 0);
}

static inline long sys_read(int fd, void *buf, long len) {
    return raw_syscall(SYS_read, fd, (long)buf, len, 0, 0, 0);
}

static inline long sys_close(int fd) {
    return raw_syscall(SYS_close, fd, 0, 0, 0, 0, 0);
}

// A "hello world" with zero libc dependency
// Compile: gcc -nostdlib -static -o hello hello.c
void _start(void) {
    const char msg[] = "hello from raw syscall\
";
    sys_write(1, msg, sizeof(msg) - 1);
    sys_exit(0);
}
\`\`\`

\`\`\`bash
$ gcc -nostdlib -static -o hello hello.c
$ ./hello
hello from raw syscall
$ strace ./hello
execve("./hello", ...) = 0
write(1, "hello from raw syscall\
", 23) = 23
exit_group(0)                           = ?
$ ls -la hello
-rwxr-xr-x 1 user user 9.2K  hello    ← 9KB, no libc!
\`\`\`

> [!tip] Building with \`-nostdlib -static\` produces tiny binaries with zero dependencies. This technique is used by container base images (\`scratch\`), embedded systems, and exploit payloads. The entire binary is just your code and the raw syscall instructions.

## The Kernel Side: Entry and Dispatch

When the \`syscall\` instruction fires, the CPU jumps to the address in the \`IA32_LSTAR\` MSR. On Linux, this is \`entry_SYSCALL_64\`:

\`\`\`c
// Simplified kernel entry path (arch/x86/entry/entry_64.S)
//
// entry_SYSCALL_64:
//   swapgs                    ; switch to kernel GS base (per-CPU data)
//   mov %rsp, PER_CPU(rsp_scratch)  ; save user stack pointer
//   mov PER_CPU(cpu_tss + TSS_sp0), %rsp  ; load kernel stack
//
//   ; Push a pt_regs frame on the kernel stack
//   push $__USER_DS            ; user SS
//   push PER_CPU(rsp_scratch)  ; user RSP
//   push %r11                  ; user RFLAGS (saved by syscall)
//   push $__USER_CS            ; user CS
//   push %rcx                  ; user RIP (saved by syscall)
//   push %rax                  ; orig_rax = syscall number
//   ; ... push all general registers ...
//
//   ; Dispatch
//   mov %rax, %rdi
//   call do_syscall_64
\`\`\`

> [!definition] swapgs — An x86-64 instruction that swaps the \`GS\` base register between userspace and kernel values. The kernel uses GS-relative addressing to access per-CPU data structures. \`swapgs\` runs at kernel entry and exit to switch between user and kernel GS bases.

The dispatch function looks up the syscall number in the syscall table:

\`\`\`c
// Simplified from arch/x86/entry/common.c
__visible noinstr void do_syscall_64(struct pt_regs *regs, int nr) {
    // Bounds check the syscall number
    if (likely(nr < NR_syscalls)) {
        nr = array_index_nospec(nr, NR_syscalls);
        regs->ax = sys_call_table[nr](regs);
    } else {
        regs->ax = -ENOSYS;  // "Function not implemented"
    }

    // regs->ax now contains the return value
    // The asm stub will sysret back to userspace
}

// The syscall table (auto-generated from syscall_64.tbl)
const sys_call_ptr_t sys_call_table[NR_syscalls] = {
    [0]   = sys_read,
    [1]   = sys_write,
    [2]   = sys_open,
    [3]   = sys_close,
    // ...
    [59]  = sys_execve,
    [60]  = sys_exit,
    // ...
    [435] = sys_cachestat,     // added in Linux 6.5
};
\`\`\`

> [!error] If you pass a syscall number that's out of range, the kernel returns \`-ENOSYS\` (errno 38, "Function not implemented"). Your program won't crash — the syscall just fails. But if you pass valid-looking but wrong arguments to a valid syscall, you can corrupt kernel state or hit a kernel bug. The kernel validates arguments, but edge cases exist.

## The VDSO: Syscalls That Don't Enter the Kernel

Some "syscalls" are so frequent that the cost of a real kernel transition is unacceptable. \`gettimeofday()\` and \`clock_gettime()\` are called millions of times per second by some workloads. For these, the kernel provides the **VDSO** (Virtual Dynamic Shared Object).

The VDSO is a small shared library that the kernel maps into every process's address space. It contains userspace implementations of certain syscalls that read kernel data structures directly, without a ring transition.

\`\`\`c
// The VDSO for clock_gettime:
// 1. Kernel updates a shared page with current time data
// 2. VDSO code reads that shared page from userspace
// 3. No syscall instruction needed — pure userspace read
// 4. Result: ~20ns instead of ~200ns

#include <time.h>
#include <stdio.h>

int main(void) {
    struct timespec ts;

    // This does NOT enter the kernel!
    // It calls the VDSO implementation which reads
    // a kernel-mapped shared page directly.
    clock_gettime(CLOCK_MONOTONIC, &ts);

    printf("Time: %ld.%09ld\
", ts.tv_sec, ts.tv_nsec);
    return 0;
}
\`\`\`

You can see the VDSO in any process's memory map:

\`\`\`bash
$ cat /proc/self/maps | grep vdso
7ffd12ffe000-7ffd13000000 r-xp 00000000 00:00 0  [vdso]

# Dump and disassemble the VDSO
$ dd if=/proc/self/mem bs=1 skip=$((0x7ffd12ffe000)) count=8192 2>/dev/null > vdso.so
$ objdump -d vdso.so | head -40
\`\`\`

> [!definition] VDSO (Virtual Dynamic Shared Object) — A kernel-provided shared library mapped into every process at a random address. Contains userspace implementations of high-frequency syscalls like \`clock_gettime\` and \`gettimeofday\` that avoid the overhead of a real ring transition by reading kernel-updated shared memory directly.

## Tracing Syscalls: strace Internals

\`strace\` uses the \`ptrace\` syscall to intercept every syscall a program makes. It stops the process at syscall entry and exit, inspects the registers, and prints the decoded call.

\`\`\`bash
# Basic syscall trace
$ strace -c ./my_program
% time     seconds  usecs/call     calls    errors syscall
------ ----------- ----------- --------- --------- ------
 45.23    0.002341          23       102           read
 30.12    0.001558          15       104           write
 12.45    0.000644          32        20           openat
  8.67    0.000448          22        20           close
  3.53    0.000183          91         2           mmap

# Filter for specific syscalls
$ strace -e trace=write,read ./my_program

# Show timing per syscall
$ strace -T ./my_program 2>&1 | head -5
write(1, "hello\
", 6)  = 6 <0.000023>
read(0, "", 4096)       = 0 <0.000004>
\`\`\`

> [!warning] \`ptrace\`-based tracing is invasive. It stops the process twice per syscall (entry and exit), copies register state to the tracer, and resumes. This can slow programs by 10-100x. For production profiling, use eBPF-based tools like \`bpftrace\` or \`perf\` instead — they run inside the kernel with no context-switch overhead.

## Writing a Minimal Syscall Tracer

Here's a simplified \`strace\` in under 80 lines:

\`\`\`c
#include <sys/ptrace.h>
#include <sys/wait.h>
#include <sys/user.h>
#include <sys/syscall.h>
#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>

// Syscall name table (partial)
static const char *syscall_names[] = {
    [SYS_read]  = "read",  [SYS_write] = "write",
    [SYS_openat]= "openat",[SYS_close] = "close",
    [SYS_mmap]  = "mmap",  [SYS_brk]   = "brk",
    [SYS_exit_group] = "exit_group",
};
#define MAX_NAMES (sizeof(syscall_names) / sizeof(syscall_names[0]))

int main(int argc, char **argv) {
    if (argc < 2) {
        fprintf(stderr, "Usage: %s <program> [args...]\
", argv[0]);
        return 1;
    }

    pid_t child = fork();
    if (child == 0) {
        // Child: request tracing, then exec the target
        ptrace(PTRACE_TRACEME, 0, NULL, NULL);
        execvp(argv[1], argv + 1);
        perror("execvp");
        _exit(1);
    }

    // Parent: trace syscalls
    int status;
    waitpid(child, &status, 0);  // wait for exec stop

    // Set options to stop at syscall entry/exit
    ptrace(PTRACE_SETOPTIONS, child, 0, PTRACE_O_TRACESYSGOOD);

    int entering = 1;  // toggle: entry vs exit
    long syscall_count = 0;

    while (1) {
        // Resume until next syscall
        ptrace(PTRACE_SYSCALL, child, NULL, NULL);
        waitpid(child, &status, 0);

        if (WIFEXITED(status)) {
            printf("\
--- %s exited (code %d) ---\
",
                   argv[1], WEXITSTATUS(status));
            printf("Total syscalls: %ld\
", syscall_count);
            break;
        }

        if (entering) {
            // Syscall entry: read the syscall number from RAX
            struct user_regs_struct regs;
            ptrace(PTRACE_GETREGS, child, NULL, &regs);

            long nr = regs.orig_rax;
            const char *name = (nr < (long)MAX_NAMES && syscall_names[nr])
                               ? syscall_names[nr] : "???";

            printf("[%3ld] %s(%lld, %lld, %lld)",
                   nr, name,
                   (long long)regs.rdi,
                   (long long)regs.rsi,
                   (long long)regs.rdx);
            fflush(stdout);
            syscall_count++;
        } else {
            // Syscall exit: read the return value from RAX
            struct user_regs_struct regs;
            ptrace(PTRACE_GETREGS, child, NULL, &regs);
            printf(" = %lld\
", (long long)regs.rax);
        }

        entering = !entering;
    }

    return 0;
}
\`\`\`

\`\`\`bash
$ gcc -o minitrace minitrace.c
$ ./minitrace /bin/echo "hello"
[  1] write(1, 140234871234560, 6) = 6
[ 12] brk(0, 0, 0) = 94287361847296
[  3] close(1, 0, 0) = 0
[231] exit_group(0, 0, 0)
--- /bin/echo exited (code 0) ---
Total syscalls: 42
\`\`\`

## Syscall Cost: How Expensive Is a Ring Transition?

The cost varies by CPU and kernel configuration:

| CPU | syscall + sysret | With KPTI (Meltdown fix) |
|-----|-----------------|--------------------------|
| Intel Skylake | ~100 ns | ~700 ns |
| Intel Alder Lake | ~80 ns | ~400 ns |
| AMD Zen 3 | ~70 ns | ~90 ns (not affected) |
| AMD Zen 4 | ~60 ns | ~65 ns |

> [!definition] KPTI (Kernel Page Table Isolation) — A mitigation for the Meltdown vulnerability that maintains separate page tables for user and kernel mode. On every syscall entry/exit, the CPU must switch page tables and flush TLB entries, adding significant overhead. AMD processors are mostly unaffected by Meltdown and can skip KPTI.

The Meltdown mitigation (KPTI) nearly 7x-ed the cost of syscalls on affected Intel CPUs. This is why \`io_uring\` was invented — it amortizes syscall overhead by batching I/O operations in a shared ring buffer, avoiding per-operation transitions.

\`\`\`bash
# Check if KPTI is active on your system
$ cat /sys/devices/system/cpu/vulnerabilities/meltdown
Mitigation: PTI

# Benchmark raw syscall cost
$ cat bench.c
#include <unistd.h>
#include <time.h>
#include <stdio.h>
int main(void) {
    struct timespec t1, t2;
    int N = 1000000;
    clock_gettime(CLOCK_MONOTONIC, &t1);
    for (int i = 0; i < N; i++)
        getpid();  // minimal syscall
    clock_gettime(CLOCK_MONOTONIC, &t2);
    double ns = ((t2.tv_sec - t1.tv_sec) * 1e9 + t2.tv_nsec - t1.tv_nsec) / N;
    printf("%.0f ns/syscall\
", ns);
    return 0;
}
$ gcc -O2 -o bench bench.c && ./bench
87 ns/syscall
\`\`\`

## Conclusion

A system call is a handshake between two worlds. Userspace sets up registers according to a rigid convention, executes a single privileged instruction, and the CPU atomically transitions to kernel code that validates, dispatches, and returns a result — all in a few hundred nanoseconds.

This machinery — the \`syscall\`/\`sysret\` instructions, the kernel entry trampoline, the dispatch table, the VDSO fast path, the \`ptrace\` interception layer — is the foundation of everything Linux does. Every file read, every network packet, every process fork goes through this exact path.

Understanding syscalls at this level means you can write programs that minimize kernel transitions, debug impossible-looking failures with \`strace\`, build custom tracing tools, and reason about the performance characteristics of your system from first principles.

The kernel is not magic. It's a function call with a very expensive calling convention.
    