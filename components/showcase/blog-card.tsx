"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BlogPost {
  title: string;
  tag: string;
  date: string;
}

interface BlogCardProps {
  className?: string;
  heading?: string;
  description?: string;
  posts?: BlogPost[];
}

const defaultPosts: BlogPost[] = [
  {
    title: "Building Scalable Design Systems",
    tag: "Design",
    date: "Jan 2025",
  },
  {
    title: "The Future of Web Interfaces",
    tag: "Engineering",
    date: "Dec 2024",
  },
  {
    title: "Accessibility in Modern UI",
    tag: "Product",
    date: "Nov 2024",
  },
];

export function BlogCard({
  className,
  heading = "Blog",
  description = "Discover insightful resources and expert advice from our seasoned team of professionals.",
  posts = defaultPosts,
}: BlogCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn("w-full max-w-[340px]", className)}
    >
      <Card className="h-full">
        <CardContent className="p-5 space-y-3">
          <h3 className="text-lg font-bold tracking-tight">{heading}</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {description}
          </p>
          <div className="space-y-2">
            {posts.map((post, i) => (
              <motion.div
                key={post.title}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.3,
                  delay: i * 0.08,
                  ease: "easeOut",
                }}
                className="p-2.5 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors group/post cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-medium truncate group-hover/post:text-muted-foreground transition-colors">
                      {post.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant="secondary"
                        className="text-[8px] h-4 px-1.5"
                      >
                        {post.tag}
                      </Badge>
                      <span className="text-[9px] text-muted-foreground">
                        {post.date}
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-3 h-3 text-muted-foreground shrink-0 mt-0.5 group-hover/post:rotate-45 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
