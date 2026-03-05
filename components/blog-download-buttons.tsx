"use client";

import { FileText, Code } from "lucide-react";

interface BlogDownloadButtonsProps {
  slug: string;
  title: string;
}

export function BlogDownloadButtons({ slug, title }: BlogDownloadButtonsProps) {
  const handleDownload = async (format: "html" | "md") => {
    const response = await fetch(
      `/api/blog/download?slug=${slug}&format=${format}`,
    );
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slug}.${format}`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={() => handleDownload("html")}
        className="inline-flex items-center gap-2 px-3.5 py-2 bg-muted border border-border rounded-md text-xs font-mono text-muted-foreground hover:text-foreground hover:border-foreground/30 hover:bg-accent transition-all duration-200 group"
      >
        <FileText
          className="w-3.5 h-3.5 transition-colors"
          style={{ color: "var(--blog-accent)" }}
        />
        <span>Download HTML</span>
      </button>
      <button
        onClick={() => handleDownload("md")}
        className="inline-flex items-center gap-2 px-3.5 py-2 bg-muted border border-border rounded-md text-xs font-mono text-muted-foreground hover:text-foreground hover:border-foreground/30 hover:bg-accent transition-all duration-200 group"
      >
        <Code
          className="w-3.5 h-3.5 transition-colors"
          style={{ color: "var(--blog-accent)" }}
        />
        <span>Download Markdown</span>
      </button>
    </div>
  );
}
