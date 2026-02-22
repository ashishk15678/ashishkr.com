import Link from "next/link";
import { DESIGNS } from "@/lib/constants/designs";
import { Header } from "@/components/header";
import { ArrowUpRight, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Designs | Ashish Kumar",
  description:
    "Explore my curated collection of premium UI/UX designs — dashboards, auth flows, landing pages, and SaaS interfaces.",
};

const themeAccents: Record<string, { bar: string; bg: string; text: string; border: string }> = {
  obsidian: { bar: "bg-white", bg: "bg-zinc-950", text: "text-white", border: "border-zinc-800" },
  slate: { bar: "bg-zinc-400", bg: "bg-zinc-100", text: "text-zinc-700", border: "border-zinc-200" },
  lavender: { bar: "bg-violet-400", bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200" },
  lime: { bar: "bg-lime-400", bg: "bg-zinc-950", text: "text-lime-400", border: "border-zinc-800" },
  mono: { bar: "bg-zinc-900", bg: "bg-white", text: "text-zinc-900", border: "border-zinc-200" },
};

export default function DesignsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)`,
              backgroundSize: "64px 64px",
            }}
          />
        </div>

        <div className="relative z-10 px-4 sm:px-6 md:px-12 lg:px-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border text-xs text-muted-foreground tracking-wide mb-8">
            <Layers className="w-3.5 h-3.5" />
            <span>{DESIGNS.length} Designs</span>
          </div>

          {/* Title */}
          <div className="max-w-3xl mb-6">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tighter mb-4">
              Design<br />
              <span className="text-muted-foreground/30">Collection.</span>
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed max-w-lg">
              Meticulously crafted interfaces —&nbsp;each with a distinct visual identity, built with modern tools and clean code.
            </p>
          </div>
        </div>
      </section>

      {/* Designs Grid */}
      <section className="relative px-4 sm:px-6 md:px-12 lg:px-20 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DESIGNS.map((design) => {
            const accent = themeAccents[design.theme];
            return (
              <Link
                key={design.id}
                href={`/designs/${design.slug}`}
                className="group relative block"
              >
                <div
                  className={cn(
                    "relative rounded-xl overflow-hidden",
                    "border border-border/60",
                    "bg-card",
                    "transition-all duration-300 ease-out",
                    "hover:border-border hover:shadow-lg hover:-translate-y-1"
                  )}
                >
                  {/* Theme accent bar */}
                  <div className={cn("h-1", accent.bar)} />

                  {/* Preview Swatch */}
                  <div className={cn("h-32 relative overflow-hidden", accent.bg)}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={cn("text-xs font-mono tracking-wider opacity-40", accent.text)}>
                        {design.number} — {design.category.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h2 className="text-lg font-bold tracking-tight mb-0.5">
                          {design.title}
                        </h2>
                        <p className="text-xs text-muted-foreground">{design.subtitle}</p>
                      </div>
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center",
                          "border border-border/60",
                          "transition-all duration-200",
                          "group-hover:bg-foreground group-hover:text-background group-hover:border-foreground"
                        )}
                      >
                        <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-45" />
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">
                      {design.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {design.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-[9px] tracking-wider font-medium border border-border/50 rounded-full text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom */}
        <div className="mt-16 flex items-center justify-center">
          <div className="flex items-center gap-3 text-xs text-muted-foreground tracking-widest">
            <div className="w-8 h-px bg-border" />
            <span>MORE COMING SOON</span>
            <div className="w-8 h-px bg-border" />
          </div>
        </div>
      </section>
    </main>
  );
}
