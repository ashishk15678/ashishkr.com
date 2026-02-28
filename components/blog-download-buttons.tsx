"use client";

import { FileText, Code, Download } from "lucide-react";

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
        className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#161b22] border border-[#2d333b] rounded-md text-xs font-mono text-[#7d8590] hover:text-[#e6edf3] hover:border-[#6e40c9] hover:bg-[#1c1e26] transition-all duration-200 group"
      >
        <FileText className="w-3.5 h-3.5 text-[#6e40c9] group-hover:text-[#8957e5] transition-colors" />
        <span>Download HTML</span>
      </button>
      <button
        onClick={() => handleDownload("md")}
        className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#161b22] border border-[#2d333b] rounded-md text-xs font-mono text-[#7d8590] hover:text-[#e6edf3] hover:border-[#6e40c9] hover:bg-[#1c1e26] transition-all duration-200 group"
      >
        <Code className="w-3.5 h-3.5 text-[#6e40c9] group-hover:text-[#8957e5] transition-colors" />
        <span>Download Markdown</span>
      </button>
    </div>
  );
}
