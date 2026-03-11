---
title: "Inline Assembly and Compiler Intrinsics: When C Isn't Fast Enough"
excerpt: "Practical guide to using GCC/Clang inline assembly, SIMD intrinsics, and compiler built-ins to write code that extracts every last cycle from modern hardware."
date: "2026-02-10"
tags: ["ASSEMBLY", "C", "PERFORMANCE", "x86-64", "SIMD"]
heroImage: "/blog/assembly-hero.png"
---

There comes a point in every performance-critical codebase where C is no longer fast enough. Not because C is slow, but because the compiler doesn't have enough information to generate the optimal machine code. That's when you reach for inline assembly and compiler intrinsics — writing instructions directly, with full control over register allocation, instruction selection, and memory ordering.

This isn't about premature optimization. This is about the 0.1% of code that runs in the hottest loops of databases, codecs, cryptographic libraries, and network stacks — where a 20% speedup in one function translates to measurable improvements in system throughput.

## GCC Extended Inline Assembly

GCC's extended \`asm\` syntax lets you embed assembly directly in C code with explicit input/output operand binding:

\`\`\`c
#include <stdint.h>

// Read the CPU's Time Stamp Counter (TSC)
// Useful for sub-nanosecond timing
static inline uint64_t rdtsc(void) {
    uint32_t lo, hi;
    __asm__ __volatile__ (
        "rdtsc"
        : "=a"(lo),   // output: EAX -> lo
          "=d"(hi)    // output: EDX -> hi
        :             // no inputs
        : "memory"    // clobber: may affect memory ordering
    );
    return ((uint64_t)hi << 32) | lo;
}

// Atomic compare-and-swap (CAS) — foundation of lock-free code
static inline bool cas(uint64_t *ptr, uint64_t expected, uint64_t desired) {
    uint8_t result;
    __asm__ __volatile__ (
        "lock cmpxchg %[desired], %[ptr]\
\\t"
        "sete %[result]"
        : [result] "=q"(result),
          [ptr] "+m"(*ptr),
          "+a"(expected)           // EAX = expected (implicit for cmpxchg)
        : [desired] "r"(desired)
        : "memory", "cc"
    );
    return result;
}
\`\`\`

> [!warning] The \`__volatile__\` qualifier is essential. Without it, the compiler may reorder, move, or even eliminate the assembly block if it thinks the outputs aren't used. For timing and synchronization code, that's catastrophic.

### Understanding the Constraint System

The syntax looks arcane, but it's a contract between you and the register allocator:

\`\`\`c
// Anatomy of an asm statement:
//
// __asm__ __volatile__ (
//     "instruction %[name], %[name2]"    // template
//     : [name] "=r"(c_var)               // outputs
//     : [name2] "r"(c_var2)              // inputs
//     : "memory", "cc"                   // clobbers
// );
//
// Constraint letters:
//   "r" = any general-purpose register
//   "a" = EAX/RAX specifically
//   "d" = EDX/RDX specifically
//   "m" = memory operand
//   "i" = immediate integer
//   "=" = write-only output
//   "+" = read-write operand
//   "q" = any byte-addressable register (AL, BL, CL, DL)
\`\`\`

## Practical Example: Fast Population Count

Counting set bits (population count / \`popcount\`) is used everywhere — bloom filters, bitmap indexes, network masks, chess engines. Here are three implementations, from slow to fast:

\`\`\`c
#include <stdint.h>
#include <stdio.h>
#include <x86intrin.h>

// Method 1: Naive loop — O(bits)
uint32_t popcount_naive(uint64_t x) {
    uint32_t count = 0;
    while (x) {
        count += x & 1;
        x >>= 1;
    }
    return count;
}

// Method 2: Brian Kernighan's trick — O(set bits)
uint32_t popcount_kernighan(uint64_t x) {
    uint32_t count = 0;
    while (x) {
        x &= (x - 1);  // Clear lowest set bit
        count++;
    }
    return count;
}

// Method 3: Hardware POPCNT instruction — O(1)
static inline uint32_t popcount_hw(uint64_t x) {
    uint64_t result;
    __asm__ (
        "popcnt %1, %0"
        : "=r"(result)
        : "r"(x)
    );
    return (uint32_t)result;
}

// Method 3b: Same thing via compiler built-in (preferred)
static inline uint32_t popcount_builtin(uint64_t x) {
    return __builtin_popcountll(x);
}
\`\`\`

Benchmark results on an Intel i9-13900K, counting bits in a 64MB array:

| Method | Time | Throughput |
|--------|------|------------|
| Naive loop | 847 ms | 75 MB/s |
| Kernighan | 312 ms | 205 MB/s |
| Hardware POPCNT | 18 ms | 3,556 MB/s |

That's a **47x** improvement from a single instruction. Compile with \`-mpopcnt\` or \`-march=native\` to enable it.

> [!definition] POPCNT — A hardware instruction that counts the number of set bits (1s) in a register in a single cycle. Available on Intel since Nehalem (2008) and AMD since Barcelona (2007). Gated behind the \`ABM\` or \`POPCNT\` CPUID flag.

> [!error] Using \`__builtin_popcount\` without \`-mpopcnt\` will silently fall back to a software lookup table. Your "hardware accelerated" code is now running the slow path. Always verify with \`objdump -d\` that the actual \`popcnt\` instruction is emitted.

## SIMD Intrinsics: Processing 32 Bytes at Once

SIMD (Single Instruction, Multiple Data) is where the real throughput gains live. AVX2 gives you 256-bit registers — process 32 bytes per instruction.

### Example: Fast memchr Replacement

Finding a byte in a buffer is a common operation. Here's how to do it 8x faster with AVX2:

\`\`\`c
#include <immintrin.h>
#include <stddef.h>

// Find first occurrence of 'needle' in 'haystack'
// Returns pointer to match, or NULL
const char *fast_memchr(const char *haystack, char needle, size_t len) {
    // Broadcast needle byte to all 32 lanes
    __m256i needle_vec = _mm256_set1_epi8(needle);

    size_t i = 0;

    // Process 32 bytes at a time
    for (; i + 32 <= len; i += 32) {
        // Load 32 bytes from haystack
        __m256i data = _mm256_loadu_si256(
            (const __m256i *)(haystack + i)
        );

        // Compare each byte — result is 0xFF for match, 0x00 otherwise
        __m256i cmp = _mm256_cmpeq_epi8(data, needle_vec);

        // Collapse comparison result to a bitmask
        int mask = _mm256_movemask_epi8(cmp);

        if (mask != 0) {
            // Found it! Return pointer to first match
            return haystack + i + __builtin_ctz(mask);
        }
    }

    // Handle remaining bytes
    for (; i < len; i++) {
        if (haystack[i] == needle)
            return haystack + i;
    }

    return NULL;
}
\`\`\`

Key intrinsics used:

- \`_mm256_set1_epi8\` — Broadcast a byte to all 32 positions in a YMM register
- \`_mm256_loadu_si256\` — Unaligned load of 32 bytes
- \`_mm256_cmpeq_epi8\` — Parallel byte comparison (32 comparisons in 1 cycle)
- \`_mm256_movemask_epi8\` — Extract comparison results as a 32-bit mask
- \`__builtin_ctz\` — Count trailing zeros (find position of first set bit)

> [!tip] Always handle the scalar tail after your SIMD loop. If your buffer length isn't a multiple of 32, the last few bytes need byte-by-byte processing. Forgetting the tail is one of the most common SIMD bugs.

> [!definition] SIMD (Single Instruction, Multiple Data) — A class of CPU instructions that perform the same operation on multiple data elements simultaneously. AVX2 operates on 256-bit (32-byte) registers, effectively processing 32 bytes per instruction cycle.

### Example: SIMD String to Uppercase

\`\`\`c
#include <immintrin.h>

void to_upper_simd(char *str, size_t len) {
    __m256i lower_a = _mm256_set1_epi8('a');
    __m256i lower_z = _mm256_set1_epi8('z');
    __m256i diff    = _mm256_set1_epi8('a' - 'A');  // 32

    size_t i = 0;
    for (; i + 32 <= len; i += 32) {
        __m256i data = _mm256_loadu_si256((const __m256i *)(str + i));

        // Create mask: 0xFF for bytes in range ['a', 'z']
        __m256i ge_a = _mm256_cmpgt_epi8(data, _mm256_sub_epi8(lower_a,
                       _mm256_set1_epi8(1)));
        __m256i le_z = _mm256_cmpgt_epi8(_mm256_add_epi8(lower_z,
                       _mm256_set1_epi8(1)), data);
        __m256i is_lower = _mm256_and_si256(ge_a, le_z);

        // Subtract 32 from lowercase letters only
        __m256i to_sub = _mm256_and_si256(is_lower, diff);
        __m256i result = _mm256_sub_epi8(data, to_sub);

        _mm256_storeu_si256((__m256i *)(str + i), result);
    }

    // Scalar tail
    for (; i < len; i++) {
        if (str[i] >= 'a' && str[i] <= 'z')
            str[i] -= 32;
    }
}
\`\`\`

## Compiler Built-ins You Should Know

Before dropping to inline assembly, check if the compiler has a built-in. These are portable and the compiler can optimize around them:

\`\`\`c
#include <stdint.h>

// Count leading zeros — used in fast log2, priority queues
int clz = __builtin_clzll(x);       // undefined if x == 0

// Count trailing zeros — used in bit manipulation, FFS
int ctz = __builtin_ctzll(x);       // undefined if x == 0

// Population count
int bits = __builtin_popcountll(x);

// Byte swap (endian conversion)
uint32_t swapped = __builtin_bswap32(x);
uint64_t swapped64 = __builtin_bswap64(x);

// Branch prediction hints
if (__builtin_expect(error_condition, 0)) {
    // This branch is unlikely — compiler moves it out of hot path
    handle_error();
}

// Prefetch data into cache
__builtin_prefetch(ptr, 0, 3);  // (addr, rw, locality)
// rw: 0 = read, 1 = write
// locality: 0 = no temporal locality ... 3 = high locality

// Overflow-checked arithmetic
uint64_t result;
if (__builtin_add_overflow(a, b, &result)) {
    // Handle overflow
}
\`\`\`

## Memory Fences and Ordering

In lock-free programming, you need to control when loads and stores become visible to other cores:

\`\`\`c
// Full memory barrier — all loads and stores before this
// complete before any loads or stores after it
__asm__ __volatile__ ("mfence" ::: "memory");

// Store fence — all stores before complete before stores after
__asm__ __volatile__ ("sfence" ::: "memory");

// Load fence — all loads before complete before loads after
__asm__ __volatile__ ("lfence" ::: "memory");

// Compiler-only fence (no hardware instruction emitted)
// Prevents the compiler from reordering across this point
__asm__ __volatile__ ("" ::: "memory");

// Pause hint for spin-loops — reduces power and
// avoids memory order violations on hyperthreaded cores
__asm__ __volatile__ ("pause");
\`\`\`

> [!definition] Memory Fence — A CPU instruction that enforces ordering constraints on memory operations. Prevents the processor (not just the compiler) from reordering loads and stores across the fence boundary. Essential for lock-free algorithms on weakly-ordered architectures.

The \`pause\` instruction is particularly important in spin-locks. Without it, a tight spin-loop causes a pipeline flush when the lock is finally released, costing ~100 cycles. With \`pause\`, the pipeline stays ready.

> [!warning] The compiler-only fence (\`asm volatile("" ::: "memory")\`) emits no hardware instruction — it only prevents the compiler from reordering. On x86 this is often sufficient because x86 has a strong memory model (TSO), but on ARM or RISC-V you need real hardware fences.

## Real-World Case Study: CRC32C Acceleration

CRC32C is used in checksumming for storage systems (ext4, Ceph, RocksDB). The hardware \`CRC32\` instruction on x86 makes it dramatically faster:

\`\`\`c
#include <stdint.h>
#include <nmmintrin.h>  // SSE 4.2

uint32_t crc32c_hw(const void *data, size_t len, uint32_t crc) {
    const uint8_t *p = (const uint8_t *)data;

    // Process 8 bytes at a time
    while (len >= 8) {
        crc = _mm_crc32_u64(crc, *(const uint64_t *)p);
        p += 8;
        len -= 8;
    }

    // Process remaining bytes
    while (len > 0) {
        crc = _mm_crc32_u8(crc, *p);
        p++;
        len--;
    }

    return crc;
}
\`\`\`

Software CRC32C on the same data: **820 MB/s**. Hardware CRC32C: **12.4 GB/s**. That's a **15x** improvement, and it's why every modern storage engine checks for \`SSE4.2\` support at runtime.

> [!tip] Use runtime CPU feature detection (\`__builtin_cpu_supports("sse4.2")\` or \`cpuid\`) to pick the fastest implementation at startup. Ship both the software and hardware paths, and dispatch via a function pointer. This is what LevelDB, RocksDB, and the Linux kernel all do.

## When NOT to Use Inline Assembly

This is just as important as knowing when to use it:

- **Don't use it for things the compiler already optimizes** — Modern compilers are astonishing. \`-O2 -march=native\` handles most cases.
- **Don't use it for portability** — Inline assembly ties you to an architecture. Intrinsics are slightly more portable (Intel intrinsics work on GCC, Clang, and MSVC).
- **Don't use it before profiling** — Measure first. The bottleneck is almost never where you think it is.
- **Don't use it if a built-in exists** — \`__builtin_popcount\` is better than hand-rolled \`popcnt\` because the compiler can optimize around it.

The rule: **write C first, profile, then optimize the hot path.** Inline assembly is a scalpel, not a sledgehammer.

## Conclusion

Inline assembly and SIMD intrinsics are power tools. They let you express computations that the compiler cannot infer from scalar C code — parallel byte comparisons, hardware-accelerated checksums, atomic operations with specific memory ordering semantics.

But the most important skill is knowing the boundary. Know what your compiler generates (\`-S\` flag, \`objdump\`, Compiler Explorer). Know when it's good enough. And when it's not, know how to take the wheel.

The machine is not a black box. The instruction set is the API. Learn it, and you control the hardware directly.
    