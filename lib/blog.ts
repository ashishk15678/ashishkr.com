import fs from "fs";
import path from "path";
import matter from "gray-matter";

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

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

function calculateReadTime(content: string): string {
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const minutes = Math.ceil(wordCount / 200);
  return `${minutes} min read`;
}

function generateRawMarkdown(
  frontmatter: Record<string, unknown>,
  content: string,
): string {
  const fm = [
    "---",
    `title: "${frontmatter.title}"`,
    `excerpt: "${frontmatter.excerpt}"`,
    `date: "${frontmatter.date}"`,
    `tags: [${(frontmatter.tags as string[]).map((t) => `"${t}"`).join(", ")}]`,
  ];
  if (frontmatter.heroImage) {
    fm.push(`heroImage: "${frontmatter.heroImage}"`);
  }
  fm.push("---", "");
  return fm.join("\n") + content;
}

function getPostFiles(): string[] {
  if (!fs.existsSync(POSTS_DIR)) {
    return [];
  }
  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(".md"))
    .sort();
}

function parsePost(filename: string): BlogPost | null {
  const filePath = path.join(POSTS_DIR, filename);
  const fileContents = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContents);

  const slug = filename.replace(/\.md$/, "");

  if (!data.title || !data.date) {
    return null;
  }

  const trimmedContent = content.trim();

  return {
    slug,
    title: data.title,
    excerpt: data.excerpt || "",
    date: data.date,
    readTime: calculateReadTime(trimmedContent),
    tags: data.tags || [],
    content: trimmedContent,
    rawContent: generateRawMarkdown(data, trimmedContent),
    heroImage: data.heroImage,
    type: "here",
  };
}

export function getAllBlogSlugs(): string[] {
  return getPostFiles().map((file) => file.replace(/\.md$/, ""));
}

export function getBlogBySlug(slug: string): BlogPost | null {
  const filename = `${slug}.md`;
  const filePath = path.join(POSTS_DIR, filename);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  return parsePost(filename);
}

export const peerlistBlogs: BlogPost[] = [];

export function getAllBlogs(): BlogPost[] {
  const files = getPostFiles();
  const filePosts = files
    .map((file) => parsePost(file))
    .filter((post): post is BlogPost => post !== null);

  const allPosts = [...filePosts, ...peerlistBlogs];

  return allPosts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}
