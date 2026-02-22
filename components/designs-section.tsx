"use client";

import Link from "next/link";
import { TextReveal } from "./text-reveal";
import { ArrowUpRight, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { DESIGNS, type Design } from "@/lib/constants/designs";

const themeAccents: Record<string, { bar: string; bg: string; text: string }> = {
  obsidian: { bar: "bg-white", bg: "bg-zinc-950", text: "text-white/40" },
  slate: { bar: "bg-zinc-400", bg: "bg-zinc-100", text: "text-zinc-400" },
  lavender: { bar: "bg-violet-400", bg: "bg-violet-50", text: "text-violet-400" },
  lime: { bar: "bg-lime-400", bg: "bg-zinc-950", text: "text-lime-400/40" },
  mono: { bar: "bg-zinc-900", bg: "bg-white", text: "text-zinc-400" },
};

function DesignCard({ design, index }: { design: Design; index: number }) {
  const accent = themeAccents[design.theme];
  const isWide = index === 0 || index === 3;

  return (
    <Link
      href={`/designs/${design.slug}`}
      className={cn(
        "group relative block",
        isWide ? "lg:col-span-7" : "lg:col-span-5"
      )}
    >
      <div
        className={cn(
          "relative h-full rounded-xl overflow-hidden",
          "border border-border/50",
          "bg-card",
          "transition-all duration-300 ease-out",
          "hover:border-border hover:shadow-lg hover:-translate-y-1"
        )}
      >
        {/* Theme accent bar */}
        <div className={cn("h-0.5", accent.bar)} />

        {/* Preview swatch */}
        <div className={cn("h-28 relative overflow-hidden", accent.bg)}>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={cn("text-[10px] font-mono tracking-widest", accent.text)}>
              {design.number} — {design.category.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-base font-bold tracking-tight mb-0.5">
                {design.title}
              </h3>
              <p className="text-[11px] text-muted-foreground">{design.subtitle}</p>
            </div>
            <div
              className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center",
                "border border-border/60",
                "transition-all duration-200",
                "group-hover:bg-foreground group-hover:text-background group-hover:border-foreground"
              )}
            >
              <ArrowUpRight className="w-3 h-3 transition-transform duration-200 group-hover:rotate-45" />
            </div>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {design.description}
          </p>
        </div>
      </div>
    </Link>
  );
}

export function DesignsSection() {
  return (
    <section
      className="relative px-4 sm:px-6 md:px-12 lg:px-20 py-20 md:py-32 overflow-hidden"
      data-inspectable
    >
      {/* Header */}
      <div className="relative z-10 mb-14 md:mb-20">
        <div className="flex items-center gap-3 text-xs text-muted-foreground tracking-widest mb-4">
          <Layers className="w-4 h-4" />
          <span>DESIGN COLLECTION</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter">
              <TextReveal>Design</TextReveal>
            </h2>
            <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-muted-foreground/30">
              <TextReveal delay={200}>Collection.</TextReveal>
            </h2>
          </div>

          <div className="flex flex-col gap-4 lg:items-end">
            <p className="text-muted-foreground max-w-sm leading-relaxed lg:text-right text-sm">
              Meticulously crafted interfaces — each with a distinct visual
              identity, built with modern tools.
            </p>
            <Link
              href="/designs"
              className="inline-flex items-center gap-2 text-sm font-medium hover:text-muted-foreground transition-colors group"
            >
              View all designs
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Designs Grid */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {DESIGNS.map((design, index) => (
          <DesignCard key={design.id} design={design} index={index} />
        ))}
      </div>

      {/* Bottom decoration */}
      <div className="relative z-10 mt-14 flex items-center justify-center">
        <div className="flex items-center gap-3 text-xs text-muted-foreground tracking-widest">
          <div className="w-8 h-px bg-border" />
          <span>MORE COMING SOON</span>
          <div className="w-8 h-px bg-border" />
        </div>
      </div>
    </section>
  );
}
