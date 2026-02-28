import type { Metadata } from "next";
import { Header } from "@/components/header";
import { getAllBlogs } from "@/lib/blog";
import {
  FileText,
  ArrowUpRight,
  Terminal,
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
    <main className="min-h-screen bg-[#0a0a0c] text-[#c9d1d9]">
      <Header />

      {/* Subtle grid background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 max-w-[1100px] mx-auto px-5 sm:px-8 pt-28 md:pt-36 pb-20">
        {/* Page header */}
        <div className="mb-14" data-inspectable>
          <div className="flex items-center gap-2 text-xs font-mono text-[#7d8590] mb-4">
            <Terminal className="w-3.5 h-3.5 text-[#6e40c9]" />
            <span>~/posts</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#c9d1d9]">ls -la</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight font-mono text-[#e6edf3] mb-4">
            Posts
          </h1>
          <p className="text-sm sm:text-base font-mono text-[#7d8590] max-w-xl leading-relaxed">
            Deep dives into systems programming, low-level tricks, and the
            internals of the software we take for granted.
          </p>

          <div className="mt-4 flex items-center gap-4">
            <span className="text-[10px] font-mono text-[#2d333b] uppercase tracking-[0.2em]">
              {blogs.length} articles found
            </span>
            <div className="h-px flex-1 bg-[#1c1e26]" />
          </div>
        </div>

        {/* Blog cards */}
        <div className="space-y-6">
          {blogs.length === 0 ? (
            <div className="py-24 text-center border border-[#1c1e26] rounded-lg bg-[#0d0d10]">
              <FileText className="w-10 h-10 mx-auto text-[#2d333b] mb-4" />
              <p className="text-[#7d8590] text-sm font-mono">
                No posts yet. Check back soon.
              </p>
            </div>
          ) : (
            blogs.map((blog, index) => (
              <Link
                key={blog.slug}
                href={`/posts/${blog.slug}`}
                className="group block"
              >
                <article className="relative border border-[#1c1e26] rounded-lg bg-[#0d0d10] hover:bg-[#111118] hover:border-[#2d333b] transition-all duration-300 overflow-hidden">
                  {/* Top bar — mimics a window/tab bar */}
                  <div className="flex items-center justify-between px-5 py-3 border-b border-[#1c1e26] bg-[#0a0a0c]">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#f85149]/60" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#d29922]/60" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#3fb950]/60" />
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-[#7d8590]">
                        <Terminal className="w-3 h-3 text-[#6e40c9]" />
                        <span>Tutorial on </span>
                        {blog.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="text-[#c9d1d9]">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] font-mono text-[#7d8590]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(blog.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <span className="hidden sm:inline text-[#2d333b]">·</span>
                      <span className="hidden sm:flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {blog.readTime}
                      </span>
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="flex flex-col lg:flex-row">
                    {/* Text content */}
                    <div className="flex-1 px-6 py-6 lg:py-8">
                      <h2 className="text-xl sm:text-2xl lg:text-[1.65rem] font-bold font-mono text-[#e6edf3] tracking-tight leading-tight mb-3 group-hover:text-white transition-colors">
                        {blog.title}
                      </h2>

                      <p className="text-sm font-mono text-[#7d8590] leading-relaxed mb-5 max-w-[560px] group-hover:text-[#8b949e] transition-colors">
                        {blog.excerpt}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {blog.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 bg-[#161b22] border border-[#2d333b] rounded text-[10px] font-mono tracking-wider text-[#7d8590] uppercase"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Read link */}
                      <div className="flex items-center gap-2 text-xs font-mono text-[#6e40c9] group-hover:text-[#8957e5] transition-colors">
                        <span>Read article</span>
                        <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    </div>

                    {/* Code preview panel — right side */}
                    <div className="hidden lg:block w-[340px] border-l border-[#1c1e26] bg-[#0a0a0c]">
                      {/* Terminal tab bar */}
                      <div className="flex items-center gap-2 px-4 py-2 border-b border-[#1c1e26]">
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-[#0d0d10] border border-[#1c1e26] rounded-t text-[10px] font-mono text-[#7d8590]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#3fb950]/60" />
                          terminal
                        </div>
                      </div>
                      {/* Terminal content */}
                      <div className="p-4 text-[11px] font-mono text-[#7d8590] leading-relaxed overflow-hidden h-[160px]">
                        <div className="text-[#6e40c9]">
                          <span className="text-[#3fb950]">$</span> cat{" "}
                          {blog.slug.slice(0, 28)}...
                        </div>
                        <div className="mt-2 text-[#4d5566]">---</div>
                        <div className="text-[#4d5566]">
                          title: &quot;
                          <span className="text-[#7d8590]">
                            {blog.title.slice(0, 36)}...
                          </span>
                          &quot;
                        </div>
                        <div className="text-[#4d5566]">
                          date: &quot;
                          <span className="text-[#d29922]">{blog.date}</span>
                          &quot;
                        </div>
                        <div className="text-[#4d5566]">
                          tags: [
                          <span className="text-[#3fb950]">
                            {blog.tags
                              .slice(0, 3)
                              .map((t) => `"${t}"`)
                              .join(", ")}
                          </span>
                          ]
                        </div>
                        <div className="text-[#4d5566]">---</div>
                        <div className="mt-2 text-[#6e40c9]">
                          <span className="text-[#3fb950]">$</span> wc -w
                        </div>
                        <div className="text-[#c9d1d9]">{blog.readTime}</div>
                        <div className="mt-1 animate-pulse text-[#6e40c9]">
                          ▌
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-14 pt-6 border-t border-[#1c1e26] flex items-center justify-between">
          <span className="text-[10px] font-mono text-[#2d333b] tracking-wider uppercase">
            {blogs.length} total entries
          </span>
          <span className="text-[10px] font-mono text-[#2d333b]">EOF</span>
        </div>
      </div>
    </main>
  );
}
