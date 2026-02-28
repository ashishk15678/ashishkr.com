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
  Tag,
  Terminal,
  Copy,
  ChevronRight,
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

  return (
    <main className="min-h-screen bg-[#0a0a0c] text-[#c9d1d9]">
      {/* JSON-LD structured data for search engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header />

      {/* Subtle grid background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      <article className="relative z-10 max-w-[900px] mx-auto px-5 sm:px-8 xl:ml-[calc(50%-450px+116px)] xl:mr-auto pt-28 md:pt-36 pb-20 overflow-visible">
        {/* Breadcrumb / Back */}
        <Link
          href="/posts"
          className="inline-flex items-center gap-2 text-sm font-mono text-[#7d8590] hover:text-[#e6edf3] transition-colors mb-10 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          <span>cd ../posts</span>
        </Link>

        {/* Meta bar */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-mono text-[#7d8590] mb-6 pb-4 border-b border-[#1c1e26]">
          <span className="flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-[#6e40c9]" />
            <span className="text-[#c9d1d9]">Tutorial</span>
            <span className="mx-1 text-[#2d333b]">on</span>
            {blog.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="text-[#c9d1d9]">
                {tag}
              </span>
            ))}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            Published:{" "}
            {new Date(blog.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {blog.readTime}
          </span>
        </div>

        {/* Title */}
        <header className="mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-[2.75rem] leading-[1.15] font-bold tracking-tight text-[#e6edf3] font-mono mb-6">
            {blog.title}
          </h1>

          <p className="text-base sm:text-lg text-[#7d8590] leading-relaxed font-mono max-w-[720px] mb-6">
            {blog.excerpt}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 bg-[#1c1e26] border border-[#2d333b] rounded text-[10px] font-mono tracking-widest text-[#7d8590] uppercase"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Download buttons */}
          <BlogDownloadButtons slug={slug} title={blog.title} />
        </header>

        {/* Separator */}
        <div className="flex items-center gap-3 mb-12 text-[#2d333b]">
          <div className="h-px flex-1 bg-[#1c1e26]" />
          <Terminal className="w-4 h-4" />
          <div className="h-px flex-1 bg-[#1c1e26]" />
        </div>

        {/* Blog content — overflow-visible allows margin notes to extend left */}
        <div
          className="blog-content font-mono overflow-visible"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        {/* Footer separator */}
        <div className="mt-16 pt-8 border-t border-[#1c1e26]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <Link
              href="/posts"
              className="inline-flex items-center gap-2 text-sm font-mono text-[#7d8590] hover:text-[#e6edf3] transition-colors group"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
              Back to all posts
            </Link>
            <span className="text-xs font-mono text-[#2d333b]">EOF</span>
          </div>
        </div>
      </article>
    </main>
  );
}
