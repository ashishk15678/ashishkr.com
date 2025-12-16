import { Header } from "@/components/header";
import { getBlogBySlug, getAllBlogSlugs } from "@/lib/blog";
import { markdownToHtml } from "@/lib/markdown-to-html";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { BlogDownloadButtons } from "@/components/blog-download-buttons";

export async function generateStaticParams() {
  const slugs = getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  const htmlContent = await markdownToHtml(blog.content);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />

      <article className="px-4 sm:px-6 md:px-12 lg:px-20 pt-24 md:pt-32 pb-16 md:pb-20">
        {/* Back link */}
        <Link
          href="/posts"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Posts
        </Link>

        {/* Header */}
        <header className="mb-12 max-w-3xl">
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {new Date(blog.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {blog.readTime}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-6">
            {blog.title}
          </h1>

          <div className="flex flex-wrap gap-2 mb-6">
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 border border-border rounded-full text-xs tracking-wider"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Download buttons */}
          <BlogDownloadButtons slug={slug} title={blog.title} />
        </header>

        {/* Content */}
        <div
          className="prose prose-neutral dark:prose-invert max-w-3xl
            prose-headings:font-bold prose-headings:tracking-tight
            prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:border-b prose-h2:border-border prose-h2:pb-2
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:leading-relaxed prose-p:text-muted-foreground
            prose-a:text-foreground prose-a:underline prose-a:underline-offset-4 hover:prose-a:no-underline
            prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
            prose-pre:bg-[#1a1a1a] prose-pre:text-[#f0f0f0]
            prose-blockquote:border-l-foreground/20 prose-blockquote:text-muted-foreground prose-blockquote:italic
            prose-img:rounded-lg
            prose-li:text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </article>
    </main>
  );
}
