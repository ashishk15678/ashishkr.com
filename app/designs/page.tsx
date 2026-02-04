import Link from "next/link";
import Image from "next/image";
import { DESIGNS } from "@/lib/constants/designs";
import { Header } from "@/components/header";
import {
  ArrowUpRight,
  Sparkles,
  Palette,
  Layers,
  Eye,
  Heart,
  Bookmark,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Designs | Ashish Kumar",
  description:
    "Explore my curated collection of premium UI/UX designs, dashboards, and landing pages.",
};

export default function DesignsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl" />

          {/* Grid Pattern */}
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: "64px 64px",
            }}
          />
        </div>

        <div className="relative z-10 px-4 sm:px-6 md:px-12 lg:px-20">
          {/* Header Badge */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground tracking-widest mb-8">
            <Palette className="w-4 h-4" />
            <span>CURATED COLLECTION</span>
            <div className="w-8 h-px bg-border" />
            <span className="text-foreground">{DESIGNS.length} DESIGNS</span>
          </div>

          {/* Main Title */}
          <div className="max-w-4xl mb-12">
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tighter mb-6">
              <span className="block bg-gradient-to-r from-foreground via-foreground to-violet-500 bg-clip-text text-transparent">
                Premium
              </span>
              <span className="block text-muted-foreground/30">Designs.</span>
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
              Meticulously crafted interfaces that blend aesthetics with
              functionality. Each design tells a story of innovation and
              attention to detail.
            </p>
          </div>

          {/* Stats Row */}
          <div className="flex flex-wrap gap-8 mb-20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-violet-500/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">42.7K+</div>
                <div className="text-xs text-muted-foreground">Total Views</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center">
                <Heart className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">2.1K+</div>
                <div className="text-xs text-muted-foreground">Total Likes</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-fuchsia-500/10 flex items-center justify-center">
                <Layers className="w-5 h-5 text-fuchsia-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">555+</div>
                <div className="text-xs text-muted-foreground">Saves</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Designs Grid */}
      <section className="relative px-4 sm:px-6 md:px-12 lg:px-20 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {DESIGNS.map((design, index) => (
            <Link
              key={design.id}
              href={`/designs/${design.slug}`}
              className="group relative"
            >
              {/* Card */}
              <div
                className={cn(
                  "relative min-h-[600px] rounded-3xl overflow-hidden",
                  "border border-border/50",
                  "bg-gradient-to-br from-background via-background to-muted/30",
                  "transition-all duration-500 ease-out",
                  "hover:border-border hover:shadow-2xl hover:shadow-black/10",
                  "dark:hover:shadow-white/5"
                )}
              >
                {/* Gradient Background on Hover */}
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-700 group-hover:opacity-100",
                    design.gradient
                  )}
                />

                {/* Background Orbs */}
                <div
                  className={cn(
                    "absolute -top-32 -right-32 w-64 h-64 rounded-full blur-3xl opacity-20 transition-all duration-700 group-hover:opacity-40 group-hover:scale-150",
                    design.accentColor === "violet"
                      ? "bg-violet-500"
                      : "bg-cyan-500"
                  )}
                />
                <div
                  className={cn(
                    "absolute -bottom-32 -left-32 w-64 h-64 rounded-full blur-3xl opacity-20 transition-all duration-700 group-hover:opacity-40 group-hover:scale-150",
                    design.accentColor === "violet"
                      ? "bg-fuchsia-500"
                      : "bg-blue-500"
                  )}
                />

                {/* Content */}
                <div className="relative z-10 h-full p-8 lg:p-10 flex flex-col">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground tracking-widest font-mono">
                        {design.number}
                      </span>
                      <div className="w-8 h-px bg-border" />
                      <span className="text-xs text-muted-foreground tracking-wide uppercase">
                        {design.category}
                      </span>
                    </div>
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        "border border-border/50 bg-background/50 backdrop-blur-sm",
                        "transition-all duration-300",
                        "group-hover:scale-110 group-hover:border-foreground/20"
                      )}
                    >
                      <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45" />
                    </div>
                  </div>

                  {/* Title */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground uppercase tracking-widest">
                        {design.subtitle}
                      </span>
                    </div>
                    <h2
                      className={cn(
                        "text-4xl lg:text-5xl font-bold tracking-tight",
                        "bg-gradient-to-r bg-clip-text transition-all duration-500",
                        design.accentColor === "violet"
                          ? "from-foreground via-foreground to-violet-500"
                          : "from-foreground via-foreground to-cyan-500",
                        "group-hover:text-transparent"
                      )}
                    >
                      {design.title}
                    </h2>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {design.tags.map((tag) => (
                      <span
                        key={tag}
                        className={cn(
                          "px-3 py-1 text-[10px] tracking-wider",
                          "border border-border/50 rounded-full",
                          "bg-background/30 backdrop-blur-sm",
                          "transition-all duration-300",
                          "group-hover:border-border group-hover:bg-background/50"
                        )}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed mb-8 max-w-md">
                    {design.description}
                  </p>

                  {/* Preview Image */}
                  {design.previewImage && (
                    <div className="flex-1 relative mb-8 min-h-[200px] rounded-xl overflow-hidden border border-border/30">
                      <Image
                        src={design.previewImage}
                        alt={design.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                    </div>
                  )}

                  {/* Footer Stats */}
                  <div className="flex items-center gap-6 pt-6 border-t border-border/30">
                    <div className="flex items-center gap-2 text-sm">
                      <Eye className="w-4 h-4 text-muted-foreground" />
                      <span>{design.stats.views}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Heart className="w-4 h-4 text-muted-foreground" />
                      <span>{design.stats.likes}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Bookmark className="w-4 h-4 text-muted-foreground" />
                      <span>{design.stats.saves}</span>
                    </div>
                    <div className="flex-1" />
                    <span className="text-xs text-muted-foreground">
                      {design.year}
                    </span>
                  </div>
                </div>

                {/* Hover Shine Effect */}
                <div
                  className={cn(
                    "absolute inset-0 opacity-0 transition-opacity duration-500",
                    "bg-gradient-to-r from-transparent via-white/5 to-transparent",
                    "-translate-x-full group-hover:opacity-100 group-hover:translate-x-full"
                  )}
                  style={{ transition: "transform 0.8s ease-out, opacity 0.3s" }}
                />
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom Decoration */}
        <div className="mt-20 flex items-center justify-center">
          <div className="flex items-center gap-4 text-xs text-muted-foreground tracking-widest">
            <Layers className="w-4 h-4" />
            <span>MORE DESIGNS COMING SOON</span>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-pulse" />
              <div
                className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-pulse"
                style={{ animationDelay: "0.2s" }}
              />
              <div
                className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-pulse"
                style={{ animationDelay: "0.4s" }}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
