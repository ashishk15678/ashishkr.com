"use client"

import { FileText, Code } from "lucide-react"
import { Button } from "./ui/button"

interface BlogDownloadButtonsProps {
  slug: string
  title: string
}

export function BlogDownloadButtons({ slug, title }: BlogDownloadButtonsProps) {
  const handleDownload = async (format: "html" | "md") => {
    const response = await fetch(`/api/blog/download?slug=${slug}&format=${format}`)
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${slug}.${format}`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="outline" size="sm" onClick={() => handleDownload("html")} className="gap-2">
        <FileText className="w-4 h-4" />
        Download HTML
      </Button>
      <Button variant="outline" size="sm" onClick={() => handleDownload("md")} className="gap-2">
        <Code className="w-4 h-4" />
        Download Markdown
      </Button>
    </div>
  )
}
