"use client"

import type { Post } from "@/lib/constants/posts"
import { ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { HoverCard } from "./hover-card"
import { MagneticButton } from "./magnetic-button"

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  return (
    <HoverCard>
      <article
        className="border-b border-border py-6 md:py-8 lg:py-12 group transition-all duration-300 hover:bg-muted/30"
        data-inspectable
      >
        <div className="flex flex-col md:grid md:grid-cols-12 gap-4 md:gap-6">
          <div className="md:col-span-3">
            <div className="text-[10px] md:text-xs text-muted-foreground tracking-widest mb-1 md:mb-2 transition-transform duration-300 group-hover:translate-x-2">
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <div className="text-[10px] md:text-xs text-muted-foreground transition-transform duration-300 group-hover:translate-x-2">
              {post.readTime}
            </div>
          </div>
          <div className="md:col-span-7">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight mb-2 md:mb-3 transition-all duration-300 group-hover:translate-x-2">
              <Link
                href={`/posts/${post.slug}`}
                className="relative inline-block after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-foreground after:transition-all after:duration-300 group-hover:after:w-full"
              >
                {post.title}
              </Link>
            </h3>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-3 md:mb-4 transition-all duration-300 group-hover:text-foreground group-hover:translate-x-2">
              {post.excerpt}
            </p>
            <div className="flex flex-wrap gap-1.5 md:gap-2 transition-transform duration-300 group-hover:translate-x-2">
              {post.tags.map((tag, index) => (
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
          <div className="md:col-span-2 flex items-start justify-start md:justify-end mt-2 md:mt-0">
            <MagneticButton as="div" strength={0.4}>
              <Link
                href={`/posts/${post.slug}`}
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
