"use client";

import Link from "next/link";
import { DESIGNS, getDesignBySlug } from "@/lib/constants/designs";
import {
  ArrowLeft,
  ArrowUpRight,
  Layers,
  Wrench,
  Play,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Header } from "@/components/header";
import {
  ObsidianDashboard,
  SlateCRM,
  IrisAuth,
  VoltLanding,
  MonoSaas,
} from "@/components/design-demos";
import { use } from "react";

const demoComponents: Record<string, React.ComponentType> = {
  "obsidian-dashboard": ObsidianDashboard,
  "slate-crm": SlateCRM,
  "iris-auth": IrisAuth,
  "volt-landing": VoltLanding,
  "mono-saas": MonoSaas,
};

const themeDots: Record<string, string> = {
  obsidian: "bg-white",
  slate: "bg-zinc-500",
  lavender: "bg-violet-500",
  lime: "bg-lime-400",
  mono: "bg-zinc-900",
};

export default function DesignPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const design = getDesignBySlug(slug);

  if (!design) {
    return (
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Design Not Found</h1>
          <Link href="/designs" className="text-primary hover:underline">
            Back to Designs
          </Link>
        </div>
      </main>
    );
  }

  const currentIndex = DESIGNS.findIndex((d) => d.slug === slug);
  const prevDesign = currentIndex > 0 ? DESIGNS[currentIndex - 1] : null;
  const nextDesign = currentIndex < DESIGNS.length - 1 ? DESIGNS[currentIndex + 1] : null;
  const DemoComponent = demoComponents[slug];
  const dot = themeDots[design.theme] || "bg-zinc-500";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />

      <section className="relative min-h-screen pt-24">
        <div className="relative z-10 px-4 sm:px-6 md:px-12 lg:px-20 py-12">
          {/* Back Button */}
          <Link
            href="/designs"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Designs
          </Link>

          {/* Header */}
          <div className="max-w-3xl mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xs text-muted-foreground tracking-widest font-mono">
                {design.number}
              </span>
              <div className="w-8 h-px bg-border" />
              <span className="text-xs text-muted-foreground tracking-widest uppercase">
                {design.category}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter mb-3">
              {design.title}
            </h1>

            <p className="text-muted-foreground mb-1">{design.subtitle}</p>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
              {design.description}
            </p>
          </div>

          {/* Live Demo */}
          {DemoComponent && (
            <div className="mb-16">
              <div className="flex items-center gap-2 mb-4">
                <Play className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Live Preview
                </span>
              </div>
              <div className="relative rounded-xl overflow-hidden border border-border/50 shadow-lg">
                <DemoComponent />
              </div>
            </div>
          )}

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Long Description */}
            <div className="lg:col-span-2">
              <h2 className="text-lg font-bold mb-3">About this design</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {design.longDescription}
              </p>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Features */}
              <div>
                <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Layers className="w-3 h-3" />
                  Key Features
                </h3>
                <div className="space-y-2">
                  {design.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-2 text-sm"
                    >
                      <div className={cn("w-1.5 h-1.5 rounded-full", dot)} />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tools */}
              <div>
                <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Wrench className="w-3 h-3" />
                  Built With
                </h3>
                <div className="flex flex-wrap gap-2">
                  {design.tools.map((tool) => (
                    <span
                      key={tool}
                      className="px-2 py-1 text-xs rounded border border-border/60 bg-background"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-3">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {design.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-[10px] tracking-wider rounded-full border border-border/50 text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Year */}
              <div>
                <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                  Year
                </h3>
                <span className="text-sm font-medium">{design.year}</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-8 border-t border-border/50">
            {prevDesign ? (
              <Link
                href={`/designs/${prevDesign.slug}`}
                className="group flex items-center gap-3"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">
                    Previous
                  </div>
                  <div className="font-medium group-hover:text-muted-foreground transition-colors">
                    {prevDesign.title}
                  </div>
                </div>
              </Link>
            ) : (
              <div />
            )}

            {nextDesign ? (
              <Link
                href={`/designs/${nextDesign.slug}`}
                className="group flex items-center gap-3 text-right"
              >
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">
                    Next
                  </div>
                  <div className="font-medium group-hover:text-muted-foreground transition-colors">
                    {nextDesign.title}
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
