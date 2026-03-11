---
title: "GOT/PLT: The Dark Art of Dynamic Linking on Linux"
excerpt: "How your program actually calls shared library functions at runtime — the Global Offset Table, Procedure Linkage Table, lazy binding, and why understanding this machinery is critical for security and performance."
date: "2026-02-03"
tags: ["ELF", "LINKER", "LINUX", "x86-64", "SECURITY"]
heroImage: "/blog/got-plt-hero.png"
---

When you call \`printf("hello")\` in a C program linked against \`libc.so\`, what actually happens at the machine level? The answer involves two of the most elegant — and most exploited — data structures in systems programming: the **Global Offset Table (GOT)** and the **Procedure Linkage Table (PLT)**.

Understanding GOT/PLT is not optional if you work on security, reverse engineering, performance-sensitive code, or anything that touches the ELF loader. This post tears the whole mechanism apart.

## Why Dynamic Linking Needs Indirection

Static linking is simple: the linker resolves every function address at build time and patches it directly into the call instruction. But shared libraries are loaded at arbitrary addresses (thanks to ASLR), so the addresses aren't known until runtime.

> [!definition] ASLR (Address Space Layout Randomization) — A security technique where the OS loads shared libraries, the stack, heap, and the executable itself at randomized virtual addresses on each execution. This makes it harder for attackers to predict the location of code and data.

The naive solution would be: at load time, scan the entire binary for every reference to a shared library symbol and patch them all. This is called **eager relocation**, and it's slow — a large binary might have thousands of such references. It also means every page containing a relocation gets dirtied (written to), defeating shared page mapping between processes.

The real solution: **indirection through tables**. The code never references library addresses directly. Instead, it goes through the GOT and PLT, which are small tables that the dynamic linker patches.

## The Global Offset Table (GOT)

The GOT is an array of pointers in the program's writable data segment. Each entry corresponds to one external symbol (function or global variable). At runtime, the dynamic linker fills each slot with the symbol's actual address.

\`\`\`c
// Conceptual view of the GOT
// Located in .got and .got.plt sections
//
// .got.plt layout:
//   GOT[0] → address of _DYNAMIC section
//   GOT[1] → link_map pointer (for the dynamic linker)
//   GOT[2] → address of _dl_runtime_resolve
//   GOT[3] → resolved address of first external function
//   GOT[4] → resolved address of second external function
//   ...
\`\`\`

> [!definition] GOT (Global Offset Table) — A table of pointers in the writable data segment of an ELF binary. Each slot holds the runtime address of an external symbol. The dynamic linker populates it at load time (eager binding) or on first call (lazy binding).

You can inspect the GOT of any binary:

\`\`\`bash
# Show GOT entries
$ objdump -R /usr/bin/ls

DYNAMIC RELOCATION RECORDS
OFFSET           TYPE              VALUE
000000000021ef08 R_X86_64_GLOB_DAT  __ctype_toupper_loc@GLIBC_2.3
000000000021ef10 R_X86_64_GLOB_DAT  __ctype_b_loc@GLIBC_2.3
000000000021ef60 R_X86_64_JUMP_SLOT printf@GLIBC_2.2.5
000000000021ef68 R_X86_64_JUMP_SLOT fwrite@GLIBC_2.2.5
\`\`\`

\`R_X86_64_GLOB_DAT\` entries are for global data. \`R_X86_64_JUMP_SLOT\` entries are for functions — these go through the PLT.

## The Procedure Linkage Table (PLT)

The PLT is a table of small code stubs in the executable \`.text\` section (read-only). Each PLT entry is a trampoline that jumps through the corresponding GOT entry.

Here's what a PLT stub looks like in x86-64:

\`\`\`asm
; PLT entry for printf (PLT[1])
; Located in the .plt section

printf@plt:
    jmp    QWORD PTR [rip + 0x200a42]   ; jump through GOT[3]
    push   0x0                            ; push relocation index
    jmp    PLT[0]                         ; jump to resolver stub

; PLT[0] — the resolver stub (common to all PLT entries)
PLT[0]:
    push   QWORD PTR [rip + 0x200a02]   ; push link_map (GOT[1])
    jmp    QWORD PTR [rip + 0x200a04]   ; jump to _dl_runtime_resolve (GOT[2])
\`\`\`

> [!definition] PLT (Procedure Linkage Table) — A table of small assembly trampolines in the read-only code segment. Each entry jumps through a GOT pointer. On the first call, the GOT pointer points back into the PLT stub which triggers the dynamic linker to resolve the symbol. After resolution, the GOT pointer is overwritten with the real address, so subsequent calls jump directly.

## Lazy Binding: The First Call

This is where it gets clever. With lazy binding (the default), the dynamic linker does NOT resolve all function addresses at load time. Instead:

**First call to \`printf\`:**

1. Code calls \`printf@plt\`
2. PLT stub does \`jmp [GOT[3]]\`
3. But GOT[3] initially points back to the PLT stub's \`push 0x0\` instruction (the next instruction after the jmp)
4. The stub pushes the relocation index (0x0 = first function) and the \`link_map\`
5. It jumps to \`_dl_runtime_resolve\`
6. The resolver looks up \`printf\` in \`libc.so\`, finds its address
7. **It overwrites GOT[3] with the real address of \`printf\`**
8. It jumps to \`printf\` to complete the call

**Second call to \`printf\`:**

1. Code calls \`printf@plt\`
2. PLT stub does \`jmp [GOT[3]]\`
3. GOT[3] now contains the real address → **jumps directly to \`printf\`**

> [!tip] After the first call, the PLT stub adds only a single indirect jump (one \`jmp\` through a pointer). This is 1-2 cycles overhead. The lazy resolution path only runs once per symbol, amortizing the cost of dynamic linking across the program's lifetime.

Let's watch this happen in real time:

\`\`\`bash
# Compile a simple program
$ cat test.c
#include <stdio.h>
int main(void) {
    printf("first\
");
    printf("second\
");
    return 0;
}
$ gcc -o test test.c -no-pie

# Set breakpoint at printf@plt and watch GOT
$ gdb ./test
(gdb) disas 'printf@plt'
   0x401030 <printf@plt>:    jmp    *0x2fe2(%rip)    # 0x404018 <printf@GOT>
   0x401036 <printf@plt+6>:  push   $0x0
   0x40103b <printf@plt+11>: jmp    0x401020

(gdb) x/gx 0x404018
0x404018 <printf@GOT>:  0x0000000000401036    ← points back into PLT!

(gdb) break printf
(gdb) run
Breakpoint hit...

(gdb) x/gx 0x404018
0x404018 <printf@GOT>:  0x00007ffff7e12e10    ← now points to real printf!
\`\`\`

## Why GOT/PLT Matters for Security

The GOT is writable. This is by design — the dynamic linker needs to write resolved addresses into it. But it also means an attacker who can write to arbitrary memory can **overwrite a GOT entry** to redirect function calls.

> [!warning] GOT overwrite is one of the oldest and most reliable exploitation techniques. If an attacker can write 8 bytes to a known GOT address, they can redirect the next call to that function anywhere — typically to a \`system("/bin/sh")\` gadget or a ROP chain.

### GOT Overwrite Attack

\`\`\`c
// Simplified GOT overwrite exploit concept
//
// Suppose we have a buffer overflow that lets us
// write to an arbitrary address.
//
// Step 1: Find GOT address of a frequently-called function
//   $ objdump -R target | grep puts
//   0x404018  R_X86_64_JUMP_SLOT  puts@GLIBC_2.2.5
//
// Step 2: Find address of system()
//   (leaked or calculated from libc base + offset)
//
// Step 3: Overwrite GOT[puts] with address of system()
//
// Step 4: Next time the program calls puts(user_input),
//          it actually calls system(user_input)
//
// If user_input = "/bin/sh", you get a shell.
\`\`\`

### Mitigations

Several defences exist against GOT overwrites:

- **RELRO (Relocation Read-Only):**
  - **Partial RELRO** (default): the \`.got\` section (for data) is read-only after relocation, but \`.got.plt\` (for functions) stays writable.
  - **Full RELRO** (\`-Wl,-z,relro,-z,now\`): ALL GOT entries are resolved at load time and the entire GOT is made read-only via \`mprotect\`. No lazy binding — **completely prevents GOT overwrites**.

\`\`\`bash
# Check RELRO status of a binary
$ checksec --file=/usr/bin/ls
    RELRO           STACK CANARY      NX
    Full RELRO      Canary found      NX enabled

# Compile with full RELRO
$ gcc -o hardened test.c -Wl,-z,relro,-z,now

# Compile with no RELRO (for testing/CTF)
$ gcc -o vulnerable test.c -Wl,-z,norelro
\`\`\`

> [!error] Full RELRO has a startup cost: every external function must be resolved at load time, not lazily. For a program that links thousands of symbols from dozens of shared libraries, this can add noticeable latency to startup. But for security-critical services, it's the right trade-off.

- **PIE (Position-Independent Executable):** Combined with ASLR, makes GOT addresses unpredictable.
- **Stack canaries, NX, CFI:** Defence-in-depth layers that make exploitation harder even if GOT is writable.

## Performance: GOT and the Data Cache

Every PLT call does an indirect jump through a GOT pointer. This means the GOT entry must be in the data cache (L1d) for the call to be fast. For hot functions called millions of times per second, this matters.

\`\`\`c
// The cost of a PLT call vs a direct call:
//
// Direct call (static linking):
//     call printf          ; 1 cycle (direct, predicted)
//
// PLT call (dynamic linking):
//     call printf@plt      ; → jmp [GOT entry]
//     ; indirect branch through GOT pointer
//     ; 2-3 cycles if GOT entry is in L1 cache
//     ; 10+ cycles on L1 miss (L2 hit)
//     ; 50+ cycles on L2 miss (L3/RAM)
\`\`\`

> [!tip] For extreme performance, use \`-fno-plt\` (GCC 6+). This replaces the PLT trampoline with a direct indirect call: \`call *printf@GOTPCREL(%rip)\`. It eliminates one indirection level and is slightly faster because the branch predictor sees the indirect call directly rather than going through a PLT stub.

\`\`\`bash
# Compare generated code with and without PLT

# Default (with PLT):
$ gcc -S -O2 test.c -o with_plt.s
# Generates: call printf@PLT

# Without PLT:
$ gcc -S -O2 -fno-plt test.c -o no_plt.s
# Generates: call *printf@GOTPCREL(%rip)
\`\`\`

## Writing a GOT/PLT Inspector

Here's a C program that reads its own GOT entries at runtime using \`dl_iterate_phdr\`:

\`\`\`c
#define _GNU_SOURCE
#include <link.h>
#include <stdio.h>
#include <elf.h>
#include <string.h>

// Callback for dl_iterate_phdr — called for each loaded shared object
static int callback(struct dl_phdr_info *info, size_t size, void *data) {
    const char *name = info->dlpi_name;
    if (name[0] == '\\0') name = "[main executable]";

    printf("\
%s (base: %p)\
", name, (void *)info->dlpi_addr);

    // Walk program headers looking for PT_DYNAMIC
    for (int i = 0; i < info->dlpi_phnum; i++) {
        if (info->dlpi_phdr[i].p_type != PT_DYNAMIC)
            continue;

        ElfW(Dyn) *dyn = (ElfW(Dyn) *)(
            info->dlpi_addr + info->dlpi_phdr[i].p_vaddr
        );

        ElfW(Addr) jmprel = 0, pltgot = 0;
        size_t pltrelsz = 0;
        char *strtab = NULL;
        ElfW(Sym) *symtab = NULL;

        // Parse dynamic section entries
        for (; dyn->d_tag != DT_NULL; dyn++) {
            switch (dyn->d_tag) {
                case DT_JMPREL:  jmprel  = dyn->d_un.d_ptr; break;
                case DT_PLTGOT:  pltgot  = dyn->d_un.d_ptr; break;
                case DT_PLTRELSZ: pltrelsz = dyn->d_un.d_val; break;
                case DT_STRTAB:  strtab  = (char *)dyn->d_un.d_ptr; break;
                case DT_SYMTAB:  symtab  = (ElfW(Sym) *)dyn->d_un.d_ptr; break;
            }
        }

        if (!jmprel || !strtab || !symtab) break;

        printf("  GOT.PLT at %p\
", (void *)pltgot);

        // Walk JMPREL relocations
        size_t count = pltrelsz / sizeof(ElfW(Rela));
        ElfW(Rela) *rela = (ElfW(Rela) *)jmprel;

        for (size_t j = 0; j < count; j++) {
            unsigned long sym_idx = ELF64_R_SYM(rela[j].r_info);
            const char *sym_name = strtab + symtab[sym_idx].st_name;
            void **got_entry = (void **)(rela[j].r_offset);

            printf("  [%zu] %-30s GOT@%p → %p\
",
                   j, sym_name, (void *)got_entry, *got_entry);
        }
        break;
    }
    return 0;
}

int main(void) {
    printf("=== GOT/PLT Inspector ===\
");
    printf("PID: %d\
", getpid());

    // Call printf once to trigger lazy resolution
    // Then the GOT entry will point to the real printf

    dl_iterate_phdr(callback, NULL);
    return 0;
}
\`\`\`

\`\`\`bash
$ gcc -o gotinspect gotinspect.c -ldl
$ ./gotinspect
=== GOT/PLT Inspector ===
PID: 12345

[main executable] (base: 0x555555554000)
  GOT.PLT at 0x555555557fd8
  [0] printf                         GOT@0x555555558018 → 0x7ffff7e12e10
  [1] dl_iterate_phdr                GOT@0x555555558020 → 0x7ffff7fce230
  [2] getpid                         GOT@0x555555558028 → 0x555555555036
\`\`\`

Notice that \`getpid\` still points back into the PLT (\`0x5555...\`) because we haven't called it yet at that point. After the call, the GOT would be updated.

## LD_BIND_NOW and LD_DEBUG

Two environment variables give you deep visibility into the dynamic linker:

\`\`\`bash
# Force eager binding (resolve everything at load time)
$ LD_BIND_NOW=1 ./test

# Watch the dynamic linker resolve every symbol
$ LD_DEBUG=bindings ./test 2>&1 | head -20
     12345: binding file ./test [0] to /lib/x86_64-linux-gnu/libc.so.6 [0]:
            normal symbol \`printf' [GLIBC_2.2.5]
     12345: binding file ./test [0] to /lib/x86_64-linux-gnu/libc.so.6 [0]:
            normal symbol \`__libc_start_main' [GLIBC_2.34]

# See ALL dynamic linker activity
$ LD_DEBUG=all ./test 2>&1 | wc -l
4217    ← a simple "hello world" triggers thousands of linker events
\`\`\`

> [!warning] Never set \`LD_DEBUG\` in production. It writes massive amounts of output to stderr and significantly slows execution. It is also a security risk — it leaks internal addresses that could help an attacker defeat ASLR.

## Conclusion

The GOT/PLT mechanism is a masterwork of engineering trade-offs. It gives us shared libraries with lazy binding, ASLR compatibility, and memory savings from shared code pages — at the cost of one level of indirection per external call and a writable data section that attackers love to target.

When you type \`gcc -o hello hello.c\`, the linker generates PLT stubs, allocates GOT entries, emits relocation records, and sets up the dynamic section — all so that at runtime, the first call to \`printf\` triggers a chain reaction of symbol lookup, GOT patching, and transparent redirection that makes it look like the function was always there.

Know your GOT. Know your PLT. They are the seams of every dynamically-linked program on Linux, and understanding them gives you power over both performance and security.
    