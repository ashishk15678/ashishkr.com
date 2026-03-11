---
title: "Writing a Memory Allocator from Scratch in C"
excerpt: "Step-by-step construction of a production-quality memory allocator — covering free lists, coalescing, splitting, alignment, and the dark arts of sbrk and mmap."
date: "2026-02-18"
tags: ["C", "MEMORY", "ALLOCATOR", "LOW-LEVEL"]
heroImage: "/blog/allocator-hero.png"
---

Every C programmer uses \`malloc\` and \`free\` daily, but few understand what happens inside them. Writing your own allocator is one of the most instructive exercises in systems programming. It teaches you about memory layout, alignment, fragmentation, and the trade-offs that define real-world systems.

In this post, we'll build a fully functional memory allocator from scratch. Not a toy — a real allocator with free-list management, block splitting, coalescing, and proper alignment.

## How malloc Gets Memory from the OS

\`malloc\` doesn't allocate memory itself. It requests large chunks from the operating system and then subdivides them. On Linux, there are two mechanisms:

- **\`brk\`/\`sbrk\`** — Extends the program's data segment (heap). Simple but limited to contiguous growth.
- **\`mmap\`** — Maps anonymous pages anywhere in the virtual address space. Used for large allocations.

\`\`\`c
#include <unistd.h>
#include <sys/mman.h>

// sbrk: extend the heap by 'increment' bytes
// Returns pointer to the OLD break (start of new region)
void *heap_alloc(size_t size) {
    void *ptr = sbrk(size);
    if (ptr == (void *)-1)
        return NULL;
    return ptr;
}

// mmap: allocate pages from anywhere in virtual memory
void *page_alloc(size_t size) {
    void *ptr = mmap(NULL, size,
                     PROT_READ | PROT_WRITE,
                     MAP_PRIVATE | MAP_ANONYMOUS,
                     -1, 0);
    if (ptr == MAP_FAILED)
        return NULL;
    return ptr;
}
\`\`\`

Our allocator will use \`sbrk\` for small allocations and \`mmap\` for anything larger than 128KB (same threshold as glibc).

## Block Header Design

Every allocated block needs metadata. We store this in a header immediately before the returned pointer:

\`\`\`c
#include <stddef.h>
#include <stdint.h>
#include <stdbool.h>

// Block header — sits right before user data
// Total: 32 bytes on 64-bit (padded for alignment)
typedef struct block_header {
    size_t size;               // Size of user data (not including header)
    bool is_free;              // Is this block available?
    struct block_header *next; // Next block in the free list
    struct block_header *prev; // Previous block in the free list
} block_header_t;

#define HEADER_SIZE sizeof(block_header_t)
#define ALIGNMENT 16  // Must be power of 2

// Align size up to ALIGNMENT boundary
static inline size_t align_up(size_t size) {
    return (size + (ALIGNMENT - 1)) & ~(ALIGNMENT - 1);
}

// Get the user data pointer from a header
static inline void *header_to_payload(block_header_t *hdr) {
    return (void *)((char *)hdr + HEADER_SIZE);
}

// Get the header from a user data pointer
static inline block_header_t *payload_to_header(void *ptr) {
    return (block_header_t *)((char *)ptr - HEADER_SIZE);
}
\`\`\`

> [!warning] Alignment is critical. On x86-64, SSE instructions require 16-byte alignment. An allocator that returns misaligned pointers will cause segfaults or silent performance degradation. glibc's \`malloc\` guarantees 16-byte alignment on 64-bit systems.

> [!definition] Alignment — The requirement that a memory address be a multiple of some power of 2. A 16-byte-aligned address has its lowest 4 bits all zero. Misaligned access on x86 is legal but slower; on ARM and RISC-V it can trap.

The memory layout looks like this:

\`\`\`c
// Memory layout:
//
// +----------------+--------------------+----------------+-------
// | block_header_t |    user data       | block_header_t |  ...
// |   (32 bytes)   |  (aligned size)    |   (32 bytes)   |
// +----------------+--------------------+----------------+-------
//                  ^                    ^
//                  |                    |
//           ptr returned          next header
//           to caller
\`\`\`

## The Free List

We maintain a doubly-linked list of free blocks. When \`malloc\` is called, we search this list for a suitable block:

\`\`\`c
#include <unistd.h>
#include <string.h>
#include <pthread.h>

static block_header_t *free_list_head = NULL;
static pthread_mutex_t alloc_lock = PTHREAD_MUTEX_INITIALIZER;

// Find a free block using first-fit strategy
static block_header_t *find_free_block(size_t size) {
    block_header_t *current = free_list_head;

    while (current != NULL) {
        if (current->is_free && current->size >= size) {
            return current;
        }
        current = current->next;
    }

    return NULL;  // No suitable block found
}

// Request more memory from the OS
static block_header_t *request_space(size_t size) {
    size_t total = HEADER_SIZE + size;

    block_header_t *block;

    if (total >= 128 * 1024) {
        // Large allocation — use mmap
        block = mmap(NULL, total,
                     PROT_READ | PROT_WRITE,
                     MAP_PRIVATE | MAP_ANONYMOUS,
                     -1, 0);
        if (block == MAP_FAILED)
            return NULL;
    } else {
        // Small allocation — extend the heap
        block = sbrk(total);
        if (block == (void *)-1)
            return NULL;
    }

    block->size = size;
    block->is_free = false;
    block->next = NULL;
    block->prev = NULL;

    return block;
}
\`\`\`

## Block Splitting

If we find a free block that's much larger than requested, we split it to avoid wasting memory:

\`\`\`c
#define MIN_BLOCK_SIZE 64  // Don't create tiny fragments

// Split a block if it's large enough
static void split_block(block_header_t *block, size_t size) {
    size_t remaining = block->size - size - HEADER_SIZE;

    // Only split if the remainder is large enough to be useful
    if (remaining < MIN_BLOCK_SIZE)
        return;

    // Create a new block header in the remaining space
    block_header_t *new_block = (block_header_t *)(
        (char *)header_to_payload(block) + size
    );

    new_block->size = remaining;
    new_block->is_free = true;
    new_block->next = block->next;
    new_block->prev = block;

    if (block->next)
        block->next->prev = new_block;

    block->next = new_block;
    block->size = size;
}
\`\`\`

## Coalescing: Merging Adjacent Free Blocks

The most important operation for combating fragmentation. When a block is freed, we check if its neighbors are also free and merge them:

\`\`\`c
// Merge adjacent free blocks
static void coalesce(block_header_t *block) {
    // Merge with next block if it's free
    if (block->next && block->next->is_free) {
        block->size += HEADER_SIZE + block->next->size;
        block->next = block->next->next;
        if (block->next)
            block->next->prev = block;
    }

    // Merge with previous block if it's free
    if (block->prev && block->prev->is_free) {
        block->prev->size += HEADER_SIZE + block->size;
        block->prev->next = block->next;
        if (block->next)
            block->next->prev = block->prev;
    }
}
\`\`\`

Without coalescing, your heap fragments into thousands of tiny free blocks that can't satisfy larger allocations — even if the total free memory is sufficient. This is called **external fragmentation** and it's the bane of long-running processes.

> [!definition] External Fragmentation — When total free memory is sufficient to satisfy a request but no single contiguous block is large enough. Distinct from internal fragmentation, where allocated blocks are larger than needed.

> [!error] A common bug in coalescing logic: forgetting to update the \`prev\` pointer of the block *after* the merged block. This corrupts the doubly-linked list and will cause a crash on the next \`free()\` call — often far from the original bug. Always draw the pointer diagram before writing this code.

## Putting It All Together: malloc and free

\`\`\`c
void *my_malloc(size_t size) {
    if (size == 0)
        return NULL;

    size = align_up(size);

    pthread_mutex_lock(&alloc_lock);

    // First, search the free list
    block_header_t *block = find_free_block(size);

    if (block != NULL) {
        // Found a free block — try to split it
        split_block(block, size);
        block->is_free = false;
        pthread_mutex_unlock(&alloc_lock);
        return header_to_payload(block);
    }

    // No free block found — request from OS
    block = request_space(size);
    if (block == NULL) {
        pthread_mutex_unlock(&alloc_lock);
        return NULL;
    }

    // Add to the linked list
    if (free_list_head == NULL) {
        free_list_head = block;
    } else {
        // Find the last block
        block_header_t *last = free_list_head;
        while (last->next)
            last = last->next;
        last->next = block;
        block->prev = last;
    }

    pthread_mutex_unlock(&alloc_lock);
    return header_to_payload(block);
}

void my_free(void *ptr) {
    if (ptr == NULL)
        return;

    pthread_mutex_lock(&alloc_lock);

    block_header_t *block = payload_to_header(ptr);
    block->is_free = true;

    // Coalesce adjacent free blocks
    coalesce(block);

    pthread_mutex_unlock(&alloc_lock);
}

// Bonus: calloc and realloc
void *my_calloc(size_t nmemb, size_t size) {
    size_t total = nmemb * size;

    // Check for overflow
    if (nmemb != 0 && total / nmemb != size)
        return NULL;

    void *ptr = my_malloc(total);
    if (ptr)
        memset(ptr, 0, total);
    return ptr;
}

void *my_realloc(void *ptr, size_t size) {
    if (ptr == NULL)
        return my_malloc(size);
    if (size == 0) {
        my_free(ptr);
        return NULL;
    }

    block_header_t *block = payload_to_header(ptr);

    if (block->size >= size)
        return ptr;  // Current block is big enough

    // Allocate new block and copy
    void *new_ptr = my_malloc(size);
    if (new_ptr == NULL)
        return NULL;

    memcpy(new_ptr, ptr, block->size);
    my_free(ptr);
    return new_ptr;
}
\`\`\`

## Testing the Allocator

\`\`\`c
#include <stdio.h>
#include <assert.h>

int main(void) {
    // Basic allocation
    int *a = my_malloc(sizeof(int) * 100);
    assert(a != NULL);
    for (int i = 0; i < 100; i++)
        a[i] = i * i;

    // Check alignment
    void *p = my_malloc(1);
    assert(((uintptr_t)p & (ALIGNMENT - 1)) == 0);
    printf("Alignment check passed: %p\
", p);

    // Free and reuse
    my_free(a);
    int *b = my_malloc(sizeof(int) * 50);
    // b should reuse a's block (first-fit)
    printf("Reuse check: a=%p, b=%p\
", (void *)a, (void *)b);

    // Stress test — alloc/free pattern
    void *ptrs[1000];
    for (int i = 0; i < 1000; i++)
        ptrs[i] = my_malloc(64 + (i % 256));

    for (int i = 0; i < 1000; i += 2)
        my_free(ptrs[i]);  // Free every other block

    for (int i = 0; i < 1000; i += 2)
        ptrs[i] = my_malloc(64 + (i % 128));  // Reallocate

    for (int i = 0; i < 1000; i++)
        my_free(ptrs[i]);

    printf("Stress test passed!\
");
    return 0;
}
\`\`\`

## How Production Allocators Do Better

Our allocator works, but production allocators like \`jemalloc\`, \`tcmalloc\`, and \`mimalloc\` go further:

- **Thread-local caches** — Each thread has its own pool, eliminating lock contention. Our global mutex is a bottleneck.
- **Size classes** — Instead of one free list, they maintain separate lists for 16, 32, 64, 128... byte blocks. This eliminates searching and splitting.
- **Slab allocation** — Pre-allocated pools of fixed-size objects. The kernel's SLAB/SLUB allocator uses this for \`struct task_struct\`, \`struct inode\`, etc.
- **Bitmap-based tracking** — Instead of linked-list headers, use bitmaps to track which blocks are free. Better cache locality.

> [!tip] The single biggest optimization is **per-thread arenas**. In a 64-core server running 128 threads, a single global lock serializes every allocation. \`jemalloc\` eliminates this by giving each thread its own arena:

\`\`\`c
// Conceptual per-thread arena (simplified)
__thread struct arena {
    block_header_t *free_lists[NUM_SIZE_CLASSES];
    char *slab_current;
    size_t slab_remaining;
} thread_arena;
\`\`\`

## Conclusion

Building a memory allocator teaches you that there are no free abstractions. Every \`malloc\` call is searching a free list, potentially splitting blocks, and possibly calling into the kernel. Every \`free\` is coalescing neighbors and updating metadata.

Understanding these mechanics makes you a better systems programmer. When you know the cost of allocation, you design your data structures to minimize it — using arenas, pool allocators, and region-based allocation where they make sense.

The allocator is the foundation everything else is built on. Know thy foundation.
    