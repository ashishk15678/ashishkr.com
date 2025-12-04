"use client"

import type { BlogPost } from "@/lib/blog"
import { ArrowUpRight, Download } from "lucide-react"
import Link from "next/link"
import { HoverCard } from "./hover-card"
import { MagneticButton } from "./magnetic-button"
import { Button } from "./ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"

interface BlogCardProps {
  blog: BlogPost
}

export function BlogCard({ blog }: BlogCardProps) {
  const handleDownload = async (format: "html" | "md") => {
    const response = await fetch(`/api/blog/download?slug=${blog.slug}&format=${format}`)
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${blog.slug}.${format}`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  return (
    <HoverCard>
      <article
        className="border-b border-border py-6 md:py-8 lg:py-12 group transition-all duration-300 hover:bg-muted/30"
        data-inspectable
      >
        <div className="flex flex-col md:grid md:grid-cols-12 gap-4 md:gap-6">
          <div className="md:col-span-3">
            <div className="text-[10px] md:text-xs text-muted-foreground tracking-widest mb-1 md:mb-2 transition-transform duration-300 group-hover:translate-x-2">
              {new Date(blog.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <div className="text-[10px] md:text-xs text-muted-foreground transition-transform duration-300 group-hover:translate-x-2">
              {blog.readTime}
            </div>
          </div>
          <div className="md:col-span-6">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight mb-2 md:mb-3 transition-all duration-300 group-hover:translate-x-2">
              <Link
                href={`/posts/${blog.slug}`}
                className="relative inline-block after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-foreground after:transition-all after:duration-300 group-hover:after:w-full"
              >
                {blog.title}
              </Link>
            </h3>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-3 md:mb-4 transition-all duration-300 group-hover:text-foreground group-hover:translate-x-2">
              {blog.excerpt}
            </p>
            <div className="flex flex-wrap gap-1.5 md:gap-2 transition-transform duration-300 group-hover:translate-x-2">
              {blog.tags.map((tag, index) => (
                <span
                  key={tag}
                  className="px-2 md:px-3 py-0.5 md:py-1 border border-border rounded-full text-[10px] md:text-xs tracking-wider transition-all duration-300 hover:bg-foreground hover:text-background hover:scale-105"
                  style={{ transitionDelay: `${index * 30}ms` }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="md:col-span-3 flex items-start justify-start md:justify-end gap-2 mt-2 md:mt-0">
            {/* Download dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full border-border hover:bg-foreground hover:text-background transition-all duration-300 bg-transparent"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleDownload("html")}>Download as HTML</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDownload("md")}>Download as Markdown</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Read link */}
            <MagneticButton as="div" strength={0.4}>
              <Link
                href={`/posts/${blog.slug}`}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-border flex items-center justify-center hover:bg-foreground hover:text-background hover:scale-110 hover:rotate-12 transition-all duration-300"
              >
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </MagneticButton>
          </div>
        </div>
      </article>
    </HoverCard>
  )
}
