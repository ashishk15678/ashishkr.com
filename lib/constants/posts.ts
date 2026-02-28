export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
}

export const POSTS: Post[] = [
  {
    id: "1",
    slug: "exploiting-virtual-memory-tricks-every-systems-programmer-should-know",
    title:
      "Exploiting Virtual Memory: Tricks Every Systems Programmer Should Know",
    excerpt:
      "A deep exploration of virtual memory internals — from page table manipulation and mmap tricks to copy-on-write exploits and zero-copy I/O patterns that can 10x your program's performance.",
    date: "2026-02-25",
    readTime: "18 min read",
    tags: ["SYSTEMS PROGRAMMING", "LINUX", "MEMORY", "C"],
  },
  {
    id: "2",
    slug: "writing-a-memory-allocator-from-scratch",
    title: "Writing a Memory Allocator from Scratch in C",
    excerpt:
      "Step-by-step construction of a production-quality memory allocator — covering free lists, coalescing, splitting, alignment, and the dark arts of sbrk and mmap.",
    date: "2026-02-18",
    readTime: "22 min read",
    tags: ["C", "MEMORY", "ALLOCATOR", "LOW-LEVEL"],
  },
  {
    id: "3",
    slug: "inline-assembly-and-compiler-intrinsics-for-performance",
    title: "Inline Assembly and Compiler Intrinsics: When C Isn't Fast Enough",
    excerpt:
      "Practical guide to using GCC/Clang inline assembly, SIMD intrinsics, and compiler built-ins to write code that extracts every last cycle from modern hardware.",
    date: "2026-02-10",
    readTime: "20 min read",
    tags: ["ASSEMBLY", "C", "PERFORMANCE", "x86-64", "SIMD"],
  },
];
