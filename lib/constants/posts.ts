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
    id: "2",
    slug: "next-js-15-deep-dive",
    title: "Next.js 15: A Deep Dive into Server Components",
    excerpt:
      "Exploring the new features in Next.js 15 and how server components change the way we build React applications.",
    date: "2024-10-28",
    readTime: "8 min read",
    tags: ["NEXT.JS", "REACT", "WEB DEVELOPMENT"],
  },
  {
    id: "3",
    slug: "rust-for-web-developers",
    title: "Rust for Web Developers: A Practical Introduction",
    excerpt:
      "Why Rust is becoming essential for web developers and how to get started with systems programming.",
    date: "2024-09-12",
    readTime: "15 min read",
    tags: ["RUST", "SYSTEMS PROGRAMMING", "WEB ASSEMBLY"],
  },
];
