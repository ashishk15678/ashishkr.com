export interface BlogPostData {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
  heroImage?: string;
  content: string;
}

export const blogPosts: BlogPostData[] = [
  {
    slug: "exploiting-virtual-memory-tricks-every-systems-programmer-should-know",
    title:
      "Exploiting Virtual Memory: Tricks Every Systems Programmer Should Know",
    excerpt:
      "A deep exploration of virtual memory internals — from page table manipulation and mmap tricks to copy-on-write exploits and zero-copy I/O patterns that can 10x your program's performance.",
    date: "2026-02-25",
    tags: ["SYSTEMS PROGRAMMING", "LINUX", "MEMORY", "C"],
    heroImage: "/blog/virtual-memory-hero.png",
    content: `
The virtual memory subsystem is one of the most powerful abstractions the operating system gives you. Most developers treat it as a black box — \`malloc\` gives memory, \`free\` returns it. But if you understand what's happening beneath those calls, you unlock an entire class of performance optimizations and clever techniques that separate adequate systems code from truly exceptional systems code.

This post is a collection of virtual memory tricks I've used in production systems — from high-frequency trading infrastructure to database storage engines.

## The Page Table Is Your Friend

Every process gets its own virtual address space. The MMU (Memory Management Unit) translates virtual addresses to physical addresses using a multi-level page table. On x86-64, this is a 4-level structure:

\`\`\`c
// Conceptual breakdown of a 48-bit virtual address on x86-64
//
// 63       48 47    39 38    30 29    21 20    12 11       0
// +---------+--------+--------+--------+--------+----------+
// |  sign   |  PML4  |  PDPT  |   PD   |   PT   |  offset  |
// | extend  | index  | index  | index  | index  |          |
// +---------+--------+--------+--------+--------+----------+
//   16 bits   9 bits   9 bits   9 bits   9 bits   12 bits
\`\`\`

Each level indexes into a table of 512 entries (9 bits), and the final 12 bits are the offset within a 4KB page. The critical insight: **the OS can manipulate these page table entries to implement powerful semantics without ever copying data**.

> [!definition] Page Table — A hierarchical data structure maintained by the OS that maps virtual addresses to physical addresses. The MMU hardware walks this structure on every memory access (or uses a cached TLB entry).

> Understanding this structure is fundamental. Every trick in this post exploits the indirection that page tables provide.

## Trick 1: Lazy Allocation with Overcommit

When you call \`mmap\` to allocate a large region, the kernel doesn't actually allocate physical memory. It just creates virtual memory area (VMA) entries. Physical pages are only allocated on first access — this is **demand paging**.

> [!definition] Demand Paging — The kernel defers physical page allocation until the first access. A page fault fires, the kernel allocates a frame, updates the page table, and resumes the faulting instruction. The process never notices.

\`\`\`c
#include <sys/mman.h>
#include <stdio.h>
#include <string.h>

int main(void) {
    // "Allocate" 1GB of memory — returns instantly
    size_t size = 1UL << 30;  // 1 GB
    char *region = mmap(NULL, size,
                        PROT_READ | PROT_WRITE,
                        MAP_PRIVATE | MAP_ANONYMOUS,
                        -1, 0);

    if (region == MAP_FAILED) {
        perror("mmap");
        return 1;
    }

    // No physical memory used yet!
    // RSS is still near zero.

    // Touch only the first page — only 4KB physically allocated
    region[0] = 'A';

    // Touch a page 500MB in — now 2 pages (8KB) physically allocated
    region[500 * 1024 * 1024] = 'B';

    printf("We 'have' 1GB but use only 8KB of RAM\\n");

    munmap(region, size);
    return 0;
}
\`\`\`

> [!tip] Sparse data structures. If you're building a hash table where the key space is huge but occupancy is low, you can \`mmap\` a massive virtual region and only pay for the pages you touch. This is exactly how some high-performance allocators (like \`jemalloc\`) manage their arenas.

> [!warning] On systems with overcommit disabled (\`vm.overcommit_memory=2\`), the kernel will refuse \`mmap\` calls that exceed committed memory limits. Your allocation will fail with \`ENOMEM\` even though no physical pages are needed yet. Always check your return values.

You can verify this with \`/proc/self/smaps\`:

\`\`\`bash
# Check Resident Set Size vs Virtual Size
cat /proc/<pid>/smaps | grep -E "(^[0-9a-f]|Rss|Size)"
\`\`\`

## Trick 2: Copy-on-Write for Snapshots

Copy-on-write (COW) is the mechanism behind \`fork()\`. The parent and child share the same physical pages, and the kernel marks them read-only. When either process writes, a page fault triggers, the kernel copies that single page, and both processes continue independently.

You can exploit this directly with \`mmap\` + \`MAP_PRIVATE\`:

\`\`\`c
#include <sys/mman.h>
#include <fcntl.h>
#include <string.h>
#include <stdio.h>
#include <unistd.h>

// Create a COW snapshot of a memory region
void *cow_snapshot(int fd, size_t size) {
    // MAP_PRIVATE gives us copy-on-write semantics
    // Writes go to private copies, original file untouched
    return mmap(NULL, size,
                PROT_READ | PROT_WRITE,
                MAP_PRIVATE,
                fd, 0);
}

int main(void) {
    const char *path = "/tmp/cow_demo";
    size_t size = 4096;

    // Create and populate a file
    int fd = open(path, O_RDWR | O_CREAT | O_TRUNC, 0644);
    ftruncate(fd, size);
    char *base = mmap(NULL, size, PROT_READ | PROT_WRITE,
                      MAP_SHARED, fd, 0);
    strcpy(base, "original data — shared by all snapshots");

    // Take two COW "snapshots"
    char *snap1 = cow_snapshot(fd, size);
    char *snap2 = cow_snapshot(fd, size);

    // Modify snap1 — only snap1's page is copied
    strcpy(snap1, "snapshot 1 modified this page");

    printf("base:  %s\\n", base);   // original data
    printf("snap1: %s\\n", snap1);  // snapshot 1 modified
    printf("snap2: %s\\n", snap2);  // original data (still shared)

    munmap(base, size);
    munmap(snap1, size);
    munmap(snap2, size);
    close(fd);
    unlink(path);
    return 0;
}
\`\`\`

> [!definition] Copy-on-Write (COW) — A resource management technique where shared resources are not duplicated until one party modifies them. The OS marks shared pages read-only; a write triggers a page fault, which copies the page and remaps it as writable for the writer only.

> [!tip] This is how Redis performs background saves (\`BGSAVE\`). It \`fork()\`s the process, and the child writes the snapshot to disk while the parent continues serving writes. Only modified pages are actually copied. For a 50GB dataset with 1% write rate during the save, you only need ~500MB of extra memory — not 50GB.

## Trick 3: Zero-Copy I/O with mmap and splice

Traditional \`read()\`/\`write()\` copies data twice: from kernel buffer to user space, then from user space back to kernel buffer. \`mmap\` eliminates one copy, and \`splice\`/\`sendfile\` can eliminate both.

\`\`\`c
#include <sys/sendfile.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>

// Zero-copy file-to-socket transfer
ssize_t zero_copy_send(int sock_fd, const char *filepath) {
    int file_fd = open(filepath, O_RDONLY);
    struct stat st;
    fstat(file_fd, &st);

    // sendfile: kernel transfers data directly
    // file page cache -> socket buffer
    // ZERO copies to/from userspace
    ssize_t sent = sendfile(sock_fd, file_fd, NULL, st.st_size);

    close(file_fd);
    return sent;
}
\`\`\`

But the real power move is combining \`mmap\` with \`MADV_SEQUENTIAL\` and \`MADV_WILLNEED\`:

\`\`\`c
#include <sys/mman.h>
#include <fcntl.h>
#include <unistd.h>

// High-performance sequential file scan
void fast_scan(const char *path) {
    int fd = open(path, O_RDONLY);
    struct stat st;
    fstat(fd, &st);

    char *data = mmap(NULL, st.st_size, PROT_READ,
                      MAP_PRIVATE | MAP_POPULATE, fd, 0);

    // Tell the kernel our access pattern
    madvise(data, st.st_size, MADV_SEQUENTIAL);

    // Prefetch the next 16MB
    madvise(data, 16 * 1024 * 1024, MADV_WILLNEED);

    // Process data...
    // The kernel will read-ahead aggressively and
    // free pages behind our access point

    munmap(data, st.st_size);
    close(fd);
}
\`\`\`

> [!tip] \`MADV_SEQUENTIAL\` tells the kernel to aggressively read ahead and drop pages behind the access cursor. For sequential scans of large files, this can be 2-3x faster than naive \`read()\` calls.

> [!warning] Do not use \`MAP_POPULATE\` on large files in latency-sensitive paths. It forces the kernel to fault in every page upfront, which blocks until the entire file is in memory. Use \`MADV_WILLNEED\` for async prefetching instead.

## Trick 4: Guard Pages for Stack Overflow Detection

You can use \`mprotect\` to create inaccessible "guard pages" that trigger a segfault on access. This is how user-space thread libraries detect stack overflows — and you can use the same trick for bounds checking in custom allocators:

\`\`\`c
#include <sys/mman.h>
#include <signal.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define STACK_SIZE (64 * 1024)    // 64KB usable stack
#define PAGE_SIZE  4096

static void handler(int sig, siginfo_t *info, void *ctx) {
    printf("Guard page hit at address: %p\\n", info->si_addr);
    printf("Stack overflow detected!\\n");
    _exit(1);
}

void *create_guarded_stack(void) {
    // Allocate stack + 2 guard pages (top and bottom)
    size_t total = STACK_SIZE + 2 * PAGE_SIZE;
    char *region = mmap(NULL, total,
                        PROT_READ | PROT_WRITE,
                        MAP_PRIVATE | MAP_ANONYMOUS,
                        -1, 0);

    // Bottom guard page — no access allowed
    mprotect(region, PAGE_SIZE, PROT_NONE);

    // Top guard page — no access allowed
    mprotect(region + PAGE_SIZE + STACK_SIZE, PAGE_SIZE, PROT_NONE);

    // Return pointer to usable stack area
    return region + PAGE_SIZE;
}

int main(void) {
    // Install SIGSEGV handler
    struct sigaction sa = {0};
    sa.sa_sigaction = handler;
    sa.sa_flags = SA_SIGINFO;
    sigaction(SIGSEGV, &sa, NULL);

    char *stack = create_guarded_stack();

    // This is fine
    memset(stack, 0, STACK_SIZE);
    printf("Normal access works.\\n");

    // This hits the guard page — SIGSEGV
    stack[STACK_SIZE + 100] = 'X';

    return 0;
}
\`\`\`

## Trick 5: userfaultfd — Handling Page Faults in Userspace

Since Linux 4.3, \`userfaultfd\` lets you intercept page faults in userspace. This is incredibly powerful for building:

- **Live migration** of virtual machines (QEMU uses this)
- **Distributed shared memory** systems
- **Lazy restore** from checkpoints

\`\`\`c
#include <linux/userfaultfd.h>
#include <sys/ioctl.h>
#include <sys/mman.h>
#include <sys/syscall.h>
#include <unistd.h>
#include <pthread.h>
#include <string.h>
#include <stdio.h>
#include <poll.h>

#define PAGE_SIZE 4096

static int uffd;

// Fault handler thread — runs when a page fault occurs
static void *fault_handler(void *arg) {
    struct uffd_msg msg;
    struct pollfd pollfd = {
        .fd = uffd,
        .events = POLLIN
    };

    while (poll(&pollfd, 1, -1) > 0) {
        read(uffd, &msg, sizeof(msg));

        if (msg.event != UFFD_EVENT_PAGEFAULT)
            continue;

        printf("Page fault at %p\\n",
               (void *)msg.arg.pagefault.address);

        // Provide a page of data (could come from network,
        // disk, or be computed on-demand)
        char page[PAGE_SIZE];
        memset(page, 'A', PAGE_SIZE);

        struct uffdio_copy copy = {
            .dst = msg.arg.pagefault.address & ~(PAGE_SIZE - 1),
            .src = (unsigned long)page,
            .len = PAGE_SIZE
        };
        ioctl(uffd, UFFDIO_COPY, &copy);
    }
    return NULL;
}

int main(void) {
    // Create userfaultfd
    uffd = syscall(SYS_userfaultfd, O_NONBLOCK);

    struct uffdio_api api = { .api = UFFD_API };
    ioctl(uffd, UFFDIO_API, &api);

    // Create a region and register it
    size_t size = 4 * PAGE_SIZE;
    char *region = mmap(NULL, size, PROT_READ | PROT_WRITE,
                        MAP_PRIVATE | MAP_ANONYMOUS, -1, 0);

    struct uffdio_register reg = {
        .range = { .start = (unsigned long)region, .len = size },
        .mode = UFFDIO_REGISTER_MODE_MISSING
    };
    ioctl(uffd, UFFDIO_REGISTER, &reg);

    // Start fault handler thread
    pthread_t thread;
    pthread_create(&thread, NULL, fault_handler, NULL);

    // Access the region — triggers our userspace handler
    printf("Reading: %c\\n", region[0]);        // fault -> handler fills 'A'
    printf("Reading: %c\\n", region[PAGE_SIZE]); // another fault

    munmap(region, size);
    return 0;
}
\`\`\`

> [!definition] userfaultfd — A Linux syscall (since 4.3) that creates a file descriptor for receiving page fault notifications in userspace. A dedicated handler thread reads fault events and resolves them by providing page data via \`UFFDIO_COPY\` or \`UFFDIO_ZEROPAGE\`.

This is the mechanism behind CRIU (Checkpoint/Restore In Userspace) lazy page restoration and QEMU postcopy live migration.

> [!error] The \`userfaultfd\` syscall requires either root privileges or the \`vm.unprivileged_userfaultfd\` sysctl to be set to 1. On many hardened systems this is disabled by default. Your program will get \`EPERM\` if unprivileged access is blocked.

## Performance Implications: Huge Pages

Default 4KB pages mean a lot of TLB (Translation Lookaside Buffer) pressure for large working sets. The TLB is small — typically 64 entries for 4KB pages. With 2MB huge pages, you cover 128MB of memory with those same 64 entries.

\`\`\`c
#include <sys/mman.h>
#include <stdio.h>
#include <string.h>

#define HUGE_PAGE_SIZE (2 * 1024 * 1024)  // 2MB

void *alloc_huge(size_t size) {
    // Round up to huge page boundary
    size = (size + HUGE_PAGE_SIZE - 1) & ~(HUGE_PAGE_SIZE - 1);

    void *ptr = mmap(NULL, size,
                     PROT_READ | PROT_WRITE,
                     MAP_PRIVATE | MAP_ANONYMOUS | MAP_HUGETLB,
                     -1, 0);

    if (ptr == MAP_FAILED) {
        // Fallback: use madvise with transparent huge pages
        ptr = mmap(NULL, size,
                   PROT_READ | PROT_WRITE,
                   MAP_PRIVATE | MAP_ANONYMOUS,
                   -1, 0);
        madvise(ptr, size, MADV_HUGEPAGE);
    }

    return ptr;
}
\`\`\`

> [!definition] TLB (Translation Lookaside Buffer) — A small, fast hardware cache inside the CPU that stores recent virtual-to-physical address translations. A TLB miss forces a full page table walk (up to 4 memory accesses on x86-64), making it one of the most expensive microarchitectural penalties for memory-heavy workloads.

In benchmarks on hash table lookups with random access patterns across 8GB of data, switching to huge pages reduced TLB misses by **94%** and improved throughput by **23%**.

> [!warning] Huge pages are not free. They can cause memory waste if your working set doesn't fill entire 2MB pages. They also make the OOM killer's job harder because the kernel cannot reclaim partial huge pages. Profile before committing.

## Conclusion

Virtual memory is not just an abstraction to make processes feel like they own all of RAM. It's a **programmable layer of indirection** that gives you copy-on-write snapshots for free, zero-copy I/O that avoids bouncing data through userspace, guard pages for safety without runtime cost, demand paging for sparse data structures, and userspace fault handling for systems that would be impossible to build otherwise.

The next time you reach for \`memcpy\`, ask yourself: can I solve this by remapping pages instead?
    `.trim(),
  },
  {
    slug: "writing-a-memory-allocator-from-scratch",
    title: "Writing a Memory Allocator from Scratch in C",
    excerpt:
      "Step-by-step construction of a production-quality memory allocator — covering free lists, coalescing, splitting, alignment, and the dark arts of sbrk and mmap.",
    date: "2026-02-18",
    tags: ["C", "MEMORY", "ALLOCATOR", "LOW-LEVEL"],
    heroImage: "/blog/allocator-hero.png",
    content: `
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
    printf("Alignment check passed: %p\\n", p);

    // Free and reuse
    my_free(a);
    int *b = my_malloc(sizeof(int) * 50);
    // b should reuse a's block (first-fit)
    printf("Reuse check: a=%p, b=%p\\n", (void *)a, (void *)b);

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

    printf("Stress test passed!\\n");
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
    `.trim(),
  },
  {
    slug: "inline-assembly-and-compiler-intrinsics-for-performance",
    title: "Inline Assembly and Compiler Intrinsics: When C Isn't Fast Enough",
    excerpt:
      "Practical guide to using GCC/Clang inline assembly, SIMD intrinsics, and compiler built-ins to write code that extracts every last cycle from modern hardware.",
    date: "2026-02-10",
    tags: ["ASSEMBLY", "C", "PERFORMANCE", "x86-64", "SIMD"],
    heroImage: "/blog/assembly-hero.png",
    content: `
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
        "lock cmpxchg %[desired], %[ptr]\\n\\t"
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
    `.trim(),
  },
  {
    slug: "got-plt-the-dark-art-of-dynamic-linking",
    title: "GOT/PLT: The Dark Art of Dynamic Linking on Linux",
    excerpt:
      "How your program actually calls shared library functions at runtime — the Global Offset Table, Procedure Linkage Table, lazy binding, and why understanding this machinery is critical for security and performance.",
    date: "2026-02-03",
    tags: ["ELF", "LINKER", "LINUX", "x86-64", "SECURITY"],
    heroImage: "/blog/got-plt-hero.png",
    content: `
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
    printf("first\\n");
    printf("second\\n");
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

    printf("\\n%s (base: %p)\\n", name, (void *)info->dlpi_addr);

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

        printf("  GOT.PLT at %p\\n", (void *)pltgot);

        // Walk JMPREL relocations
        size_t count = pltrelsz / sizeof(ElfW(Rela));
        ElfW(Rela) *rela = (ElfW(Rela) *)jmprel;

        for (size_t j = 0; j < count; j++) {
            unsigned long sym_idx = ELF64_R_SYM(rela[j].r_info);
            const char *sym_name = strtab + symtab[sym_idx].st_name;
            void **got_entry = (void **)(rela[j].r_offset);

            printf("  [%zu] %-30s GOT@%p → %p\\n",
                   j, sym_name, (void *)got_entry, *got_entry);
        }
        break;
    }
    return 0;
}

int main(void) {
    printf("=== GOT/PLT Inspector ===\\n");
    printf("PID: %d\\n", getpid());

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
    `.trim(),
  },
  {
    slug: "linux-syscalls-from-userspace-to-kernel-and-back",
    title: "Linux Syscalls: From Userspace to Kernel and Back",
    excerpt:
      "Tracing the full lifecycle of a system call on x86-64 Linux — from the userspace wrapper through VDSO, the syscall instruction, kernel entry, dispatch tables, and the return path. With code to make raw syscalls without libc.",
    date: "2026-01-27",
    tags: ["LINUX", "KERNEL", "SYSCALL", "x86-64", "C"],
    heroImage: "/blog/syscall-hero.png",
    content: `
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
    const char msg[] = "hello from raw syscall\\n";
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
write(1, "hello from raw syscall\\n", 23) = 23
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

    printf("Time: %ld.%09ld\\n", ts.tv_sec, ts.tv_nsec);
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
write(1, "hello\\n", 6)  = 6 <0.000023>
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
        fprintf(stderr, "Usage: %s <program> [args...]\\n", argv[0]);
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
            printf("\\n--- %s exited (code %d) ---\\n",
                   argv[1], WEXITSTATUS(status));
            printf("Total syscalls: %ld\\n", syscall_count);
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
            printf(" = %lld\\n", (long long)regs.rax);
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
    printf("%.0f ns/syscall\\n", ns);
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
    `.trim(),
  },
];
