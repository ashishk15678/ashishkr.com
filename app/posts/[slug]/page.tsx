import type { Metadata } from "next";
import { Header } from "@/components/header";
import { getBlogBySlug, getAllBlogSlugs } from "@/lib/blog";
import { markdownToHtml } from "@/lib/markdown-to-html";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock,
  ChevronRight,
  ChevronLeftCircleIcon,
  ChevronLeft,
  ChevronLeftIcon,
} from "lucide-react";
import { BlogDownloadButtons } from "@/components/blog-download-buttons";

const BASE_URL = "https://ashishkr.com";

export async function generateStaticParams() {
  const slugs = getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

/** Per-page SEO metadata — Open Graph, Twitter Card, canonical URL */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);

  if (!blog) {
    return {
      title: "Post Not Found | Ashish Kumar",
    };
  }

  const canonicalUrl = `${BASE_URL}/posts/${slug}`;
  const publishDate = new Date(blog.date).toISOString();

  return {
    title: `${blog.title} | Ashish Kumar`,
    description: blog.excerpt,
    keywords: blog.tags.map((t) => t.toLowerCase()),
    authors: [{ name: "Ashish Kumar", url: BASE_URL }],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "article",
      title: blog.title,
      description: blog.excerpt,
      url: canonicalUrl,
      siteName: "Ashish Kumar",
      locale: "en_US",
      publishedTime: publishDate,
      authors: ["Ashish Kumar"],
      tags: blog.tags,
      ...(blog.heroImage
        ? {
            images: [
              {
                url: `${BASE_URL}${blog.heroImage}`,
                width: 1200,
                height: 630,
                alt: blog.title,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.excerpt,
      ...(blog.heroImage ? { images: [`${BASE_URL}${blog.heroImage}`] } : {}),
    },
    robots: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  const htmlContent = await markdownToHtml(blog.content);

  // JSON-LD structured data for rich search results
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: blog.title,
    description: blog.excerpt,
    datePublished: new Date(blog.date).toISOString(),
    dateModified: new Date(blog.date).toISOString(),
    author: {
      "@type": "Person",
      name: "Ashish Kumar",
      url: BASE_URL,
    },
    publisher: {
      "@type": "Person",
      name: "Ashish Kumar",
      url: BASE_URL,
    },
    url: `${BASE_URL}/posts/${slug}`,
    keywords: blog.tags.join(", "),
    ...(blog.heroImage ? { image: `${BASE_URL}${blog.heroImage}` } : {}),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/posts/${slug}`,
    },
    articleSection: "Technology",
    wordCount: blog.content.split(/\s+/).length,
  };

  const formattedDate = new Date(blog.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="blog-page min-h-screen bg-background text-foreground">
      {/* JSON-LD structured data for search engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header />

      <article className="blog-article relative z-10 max-w-[720px] mx-auto px-5 sm:px-8 pt-28 md:pt-36 pb-20 overflow-visible">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-[13px] text-muted-foreground mb-8">
          <Link
            href="/posts"
            className="hover:text-foreground transition-colors"
          >
            Posts
          </Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-40" />
          <span className="text-foreground/70 truncate max-w-[280px] sm:max-w-none">
            {blog.title}
          </span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <Link href={"/posts"} className="absolute left-0">
            <ChevronLeftIcon />
          </Link>

          <h1 className="flex gap-x-2 text-2xl  leading-[1.12] font-bold tracking-[-0.035em] text-foreground mb-5">
            {blog.title}
          </h1>

          <p className="text-base sm:text-[1.0625rem] text-muted-foreground leading-relaxed max-w-[640px] mb-6">
            {blog.excerpt}
          </p>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-muted-foreground mb-5">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 opacity-50" />
              {formattedDate}
            </span>
            <span className="opacity-20">·</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 opacity-50" />
              {blog.readTime}
            </span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-muted/60 border border-border/60 rounded-md text-[11px] font-medium tracking-wide text-muted-foreground uppercase"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Download buttons */}
          <BlogDownloadButtons slug={slug} title={blog.title} />
        </header>

        {/* Divider */}
        <div className="h-px bg-border mb-10" />

        {/* Blog content — overflow-visible allows floating callouts on wide screens */}
        <div
          className="blog-content overflow-visible"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <Link
              href="/posts"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
              All posts
            </Link>
            <span className="text-xs text-muted-foreground/30 font-mono">
              EOF
            </span>
          </div>
        </div>
      </article>
    </main>
  );
}
