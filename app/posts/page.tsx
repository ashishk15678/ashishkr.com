import { Header } from "@/components/header";
import { BlogCard } from "@/components/blog-card";
import { TextReveal } from "@/components/text-reveal";
import { getAllBlogs } from "@/lib/blog";
import { Plus, FileText } from "lucide-react";

export default function PostsPage() {
  const blogs = getAllBlogs();
  const additionalBlogs = [
    { id: 1, blogLink: "", title: "", source: "Peerlist" },
  ];
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="px-4 sm:px-6 md:px-12 lg:px-20 pt-24 md:pt-32 pb-16 md:pb-20">
        {/* Page header */}
        <div className="mb-10 md:mb-16" data-inspectable>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-3 md:mb-4 section-title">
            <TextReveal>Posts</TextReveal>
          </h1>
          <p className="text-sm md:text-lg text-muted-foreground max-w-xl animate-in fade-in slide-in-from-bottom duration-700 delay-300">
            Thoughts on software engineering, machine learning, and building
            products that matter.
          </p>
        </div>

        {/* Posts list */}
        <div className="border-t border-border">
          {blogs.length === 0 ? (
            <div className="py-16 text-center">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">
                No blog posts yet. Add posts to lib/blog-data.ts to get started.
              </p>
            </div>
          ) : (
            blogs.map((blog) => <BlogCard key={blog.slug} blog={blog} />)
          )}
        </div>
      </div>
    </main>
  );
}
