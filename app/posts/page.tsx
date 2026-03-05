import type { Metadata } from "next";
import { Header } from "@/components/header";
import { getAllBlogs } from "@/lib/blog";
import {
  FileText,
  ArrowRight,
  Calendar,
  Clock,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Posts | Ashish Kumar — Low-Level Programming & Systems Engineering",
  description:
    "Deep dives into systems programming, memory internals, inline assembly, SIMD intrinsics, and the low-level tricks that make software fast.",
  keywords: [
    "systems programming",
    "low-level programming",
    "C programming",
    "inline assembly",
    "SIMD",
    "memory allocator",
    "virtual memory",
    "Linux internals",
  ],
  alternates: {
    canonical: "https://ashishkr.com/posts",
  },
  openGraph: {
    type: "website",
    title: "Posts — Ashish Kumar",
    description:
      "Deep dives into systems programming, memory internals, inline assembly, and low-level performance tricks.",
    url: "https://ashishkr.com/posts",
    siteName: "Ashish Kumar",
  },
  twitter: {
    card: "summary",
    title: "Posts — Ashish Kumar",
    description:
      "Deep dives into systems programming, memory internals, inline assembly, and low-level performance tricks.",
  },
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
  },
};

export default function PostsPage() {
  const blogs = getAllBlogs();

  return (
    <main className="blog-page min-h-screen bg-background text-foreground">
      <Header />

      <div className="relative z-10 max-w-[780px] mx-auto px-5 sm:px-8 pt-28 md:pt-36 pb-20">
        {/* Page header */}
        <div className="mb-12">
          <nav className="flex items-center gap-1.5 text-[13px] text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-40" />
            <span className="text-foreground">Posts</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-[-0.035em] text-foreground mb-3">
            Posts
          </h1>
          <p className="text-[15px] sm:text-base text-muted-foreground max-w-lg leading-relaxed">
            Deep dives into systems programming, low-level tricks, and the
            internals of the software we take for granted.
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-border mb-8" />

        {/* Blog list */}
        <div className="space-y-0 divide-y divide-border">
          {blogs.length === 0 ? (
            <div className="py-20 text-center">
              <FileText className="w-8 h-8 mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground text-sm">
                No posts yet. Check back soon.
              </p>
            </div>
          ) : (
            blogs.map((blog) => (
              <Link
                key={blog.slug}
                href={`/posts/${blog.slug}`}
                className="group block"
              >
                <article className="py-5 sm:py-6 transition-colors">
                  {/* Top row: date + read time */}
                  <div className="flex items-center gap-3 text-[12px] sm:text-[13px] text-muted-foreground mb-2">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 opacity-50" />
                      {new Date(blog.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span className="opacity-25">·</span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 opacity-50" />
                      {blog.readTime}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-[17px] sm:text-lg font-semibold tracking-[-0.015em] text-foreground group-hover:text-foreground/75 transition-colors leading-snug mb-1.5">
                    {blog.title}
                  </h2>

                  {/* Excerpt — single line on desktop, two lines on mobile */}
                  <p className="text-[13.5px] sm:text-sm text-muted-foreground leading-relaxed line-clamp-2 sm:line-clamp-1 mb-2.5 max-w-[640px]">
                    {blog.excerpt}
                  </p>

                  {/* Tags + Read link */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-1.5">
                      {blog.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-1.5 py-px bg-muted/50 border border-border/50 rounded text-[10px] font-medium tracking-wide text-muted-foreground/80 uppercase"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <span
                      className="hidden sm:flex items-center gap-1 text-[12px] font-medium shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: "var(--blog-accent)" }}
                    >
                      Read
                      <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </article>
              </Link>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-10 pt-6 border-t border-border flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground/50 tracking-wide">
            {blogs.length} {blogs.length === 1 ? "post" : "posts"}
          </span>
        </div>
      </div>
    </main>
  );
}
