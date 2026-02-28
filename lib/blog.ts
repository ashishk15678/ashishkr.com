import { blogPosts, type BlogPostData } from "./blog-data";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
  content: string;
  rawContent: string;
  heroImage?: string;
  type: "peerlist" | "here";
}

function calculateReadTime(content: string): string {
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / 200);
  return `${minutes} min read`;
}

function generateRawMarkdown(post: BlogPostData): string {
  return `---
title: "${post.title}"
excerpt: "${post.excerpt}"
date: "${post.date}"
tags: [${post.tags.map((t) => `"${t}"`).join(", ")}]
---

${post.content}`;
}

export function getAllBlogSlugs(): string[] {
  return blogPosts.map((post) => post.slug);
}

export function getBlogBySlug(slug: string): BlogPost | null {
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return null;
  }

  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    date: post.date,
    readTime: calculateReadTime(post.content),
    tags: post.tags,
    content: post.content,
    rawContent: generateRawMarkdown(post),
    heroImage: post.heroImage,
    type: "here",
  };
}

export const peerlistBlogs: BlogPost[] = [];

export function getAllBlogs(): BlogPost[] {
  const allblogs = [...blogPosts, ...peerlistBlogs];
  return allblogs
    .map((post) => getBlogBySlug(post.slug))
    .filter((blog): blog is BlogPost => blog !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
