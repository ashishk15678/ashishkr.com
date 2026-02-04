"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { TextReveal } from "./text-reveal";
import { ArrowUpRight, Sparkles, Layers, Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import { DESIGNS, type Design } from "@/lib/constants/designs";

// Animated Gradient Orb
function GradientOrb({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "absolute w-96 h-96 rounded-full blur-3xl opacity-30 animate-pulse",
        className
      )}
    />
  );
}

// Floating particles effect
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-foreground/20"
          style={{
            left: `${15 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`,
            animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
            animationDelay: `${i * 0.3}s`,
          }}
        />
      ))}
    </div>
  );
}

// Design card component
interface DesignCardProps {
  design: Design;
  index: number;
}

function DesignCard({ design, index }: DesignCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <Link
      href={`/designs/${design.slug}`}
      className={cn(
        "group relative block",
        index === 0 ? "lg:col-span-7" : "lg:col-span-5"
      )}
    >
      <div
        ref={cardRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Card */}
        <div
          className={cn(
            "relative h-full min-h-[500px] rounded-3xl overflow-hidden",
            "border border-border/50",
            "bg-gradient-to-br from-background via-background to-muted/30",
            "transition-all duration-500 ease-out",
            "hover:border-border hover:shadow-2xl hover:shadow-black/10",
            "dark:hover:shadow-white/5"
          )}
        >
          {/* Gradient Background */}
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-700",
              design.gradient,
              isHovered && "opacity-100"
            )}
          />

          {/* Animated Gradient Orbs */}
          <GradientOrb
            className={cn(
              "bg-gradient-to-r",
              design.accentColor === "violet"
                ? "from-violet-500 to-fuchsia-500"
                : "from-cyan-500 to-blue-500",
              "-top-48 -right-48 transition-all duration-700",
              isHovered && "scale-150 opacity-40"
            )}
          />
          <GradientOrb
            className={cn(
              "bg-gradient-to-r",
              design.accentColor === "violet"
                ? "from-pink-500 to-rose-500"
                : "from-indigo-500 to-violet-500",
              "-bottom-48 -left-48 transition-all duration-700",
              isHovered && "scale-150 opacity-40"
            )}
          />

          <FloatingParticles />

          {/* Content */}
          <div className="relative z-10 h-full p-6 sm:p-8 lg:p-10 flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground tracking-widest font-mono">
                  {design.number}
                </span>
                <div className="w-8 h-px bg-border" />
              </div>
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  "border border-border/50 bg-background/50 backdrop-blur-sm",
                  "transition-all duration-300 group-hover:scale-110",
                  "group-hover:border-foreground/20"
                )}
              >
                <ArrowUpRight
                  className={cn(
                    "w-4 h-4 transition-all duration-300",
                    "group-hover:rotate-45"
                  )}
                />
              </div>
            </div>

            {/* Title Section */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground uppercase tracking-widest">
                  {design.subtitle}
                </span>
              </div>
              <h3
                className={cn(
                  "text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight",
                  "bg-gradient-to-r bg-clip-text",
                  design.accentColor === "violet"
                    ? "from-foreground via-foreground to-violet-500"
                    : "from-foreground via-foreground to-cyan-500",
                  "transition-all duration-500",
                  isHovered && "text-transparent"
                )}
              >
                {design.title}
              </h3>
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

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {design.features.map((feature, i) => (
                <div
                  key={feature}
                  className={cn(
                    "flex items-center gap-2 text-xs text-muted-foreground",
                    "transition-all duration-300",
                    "opacity-70 group-hover:opacity-100"
                  )}
                  style={{ transitionDelay: `${i * 50}ms` }}
                >
                  <div
                    className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      design.accentColor === "violet"
                        ? "bg-violet-500"
                        : "bg-cyan-500"
                    )}
                  />
                  {feature}
                </div>
              ))}
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Stats Footer */}
            <div className="flex items-center gap-6 pt-6 border-t border-border/30">
              {Object.entries(design.stats).map(([key, value]) => (
                <div key={key} className="text-center">
                  <div className="text-lg font-semibold">{value}</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    {key}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hover Shine Effect */}
          <div
            className={cn(
              "absolute inset-0 opacity-0 transition-opacity duration-500",
              "bg-gradient-to-r from-transparent via-white/5 to-transparent",
              "-translate-x-full",
              isHovered && "opacity-100 translate-x-full"
            )}
            style={{ transition: "transform 0.8s ease-out, opacity 0.3s" }}
          />
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
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-r from-violet-500/5 to-fuchsia-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative z-10 mb-16 md:mb-24">
        <div className="flex items-center gap-3 text-xs text-muted-foreground tracking-widest mb-4">
          <Palette className="w-4 h-4" />
          <span>CURATED COLLECTION</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter">
              <TextReveal>Premium</TextReveal>
            </h2>
            <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-muted-foreground/40">
              <TextReveal delay={200}>Designs.</TextReveal>
            </h2>
          </div>

          <div className="flex flex-col gap-4 lg:items-end">
            <p className="text-muted-foreground max-w-sm leading-relaxed lg:text-right">
              Meticulously crafted interfaces that blend aesthetics with
              functionality. Each design tells a story.
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
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {DESIGNS.map((design, index) => (
          <DesignCard key={design.id} design={design} index={index} />
        ))}
      </div>

      {/* Bottom decoration */}
      <div className="relative z-10 mt-16 flex items-center justify-center">
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
  );
}
