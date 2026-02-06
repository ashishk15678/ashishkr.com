import { Header } from "@/components/header";
import { getAllBlogs } from "@/lib/blog";
import { FileText, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function PostsPage() {
  const blogs = getAllBlogs();

  return (
    <main className="min-h-screen bg-background text-foreground w-full flex items-center justify-center">
      <Header />
      <div className="px-4 sm:px-6 md:px-12 lg:px-20 pt-24 md:pt-32 pb-16 md:pb-20 max-w-7xl">
        {/* Page header */}
        <div className="mb-10 md:mb-16" data-inspectable>
          <h1 className="text-4xl font-bold tracking-tighter mb-3 md:mb-4 section-title">
            Posts
          </h1>
          <p className="text-sm md:text-lg text-muted-foreground max-w-xl">
            Thoughts on software engineering, design, and building products that
            matter.
          </p>
          <Link
            href={"https://peerlist.io/ashishk/articles"}
            prefetch
            target="_blank"
            className="font-bold text-md my-4"
          >
            I write most of articles on Peerlist . Click here please .
          </Link>
          <p className="text-xs text-muted-foreground/60 mt-4 uppercase tracking-widest">
            {blogs.length} Articles Found
          </p>
        </div>

        {/* Tabled Posts List */}
        <div className="border border-border rounded-lg overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 bg-muted/30 border-b border-border px-6 py-4 text-[10px] md:text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            <div>Article Title</div>
            <div className="hidden md:block">Category</div>
            <div className="hidden lg:block">Reading Time</div>
            <div className="text-right lg:text-left">Published Date</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-border">
            {blogs.length === 0 ? (
              <div className="py-24 text-center bg-muted/5">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground text-sm">
                  No blog posts yet. Check back soon.
                </p>
              </div>
            ) : (
              blogs.map((blog) => (
                <Link
                  key={blog.slug}
                  href={`/posts/${blog.slug}`}
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-center px-6 py-8 hover:bg-muted/50 transition-all group relative"
                >
                  {/* Title Column */}
                  <div className="flex flex-col pr-4">
                    <span className="font-semibold text-base md:text-lg leading-tight group-hover:text-primary transition-colors flex items-center gap-2">
                      {blog.title}
                      <ArrowUpRight className="w-8 h-8 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all text-primary" />
                    </span>
                    <span className="text-xs text-muted-foreground md:hidden mt-2 font-medium">
                      {blog.tags || "Engineering"}
                    </span>
                  </div>

                  {/* Category Column (Tablet/Desktop) */}
                  <div className="hidden md:flex text-sm text-muted-foreground font-medium">
                    {blog.tags.map((val) => (
                      <span className="px-1 py-0.5 bg-muted rounded text-[10px] border border-border">
                        {val}
                      </span>
                    ))}
                  </div>

                  {/* Read Time Column (Desktop Only) */}
                  <div className="hidden lg:flex text-sm text-muted-foreground italic">
                    {blog.readTime || "5 min read"}
                  </div>

                  {/* Date Column */}
                  <div className="text-right lg:text-left text-xs md:text-sm text-muted-foreground font-mono">
                    {blog.date}
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
