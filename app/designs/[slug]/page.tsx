"use client";

import Link from "next/link";
import {
  DESIGNS,
  getDesignBySlug,
} from "@/lib/constants/designs";
import {
  ArrowLeft,
  ArrowUpRight,
  Sparkles,
  Calendar,
  Layers,
  Wrench,
  Play,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Header } from "@/components/header";
import {
  NebulaDashboard,
  AuroraHero,
  MinimalDashboard,
  GradientLanding,
  FeatureHero,
  SaasLanding,
} from "@/components/design-demos";
import { use } from "react";

// Map slugs to demo components
const demoComponents: Record<string, React.ComponentType> = {
  "nebula-dashboard": NebulaDashboard,
  "aurora-hero": AuroraHero,
  "minimal-dashboard": MinimalDashboard,
  "gradient-landing": GradientLanding,
  "feature-hero": FeatureHero,
  "saas-landing": SaasLanding,
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

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />

      <section className="relative min-h-screen pt-24 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className={cn(
              "absolute top-0 right-0 w-[800px] h-[800px] rounded-full blur-3xl opacity-30",
              design.accentColor === "violet"
                ? "bg-gradient-to-br from-violet-500/40 to-fuchsia-500/40"
                : "bg-gradient-to-br from-cyan-500/40 to-blue-500/40"
            )}
          />
          <div
            className={cn(
              "absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-3xl opacity-20",
              design.accentColor === "violet"
                ? "bg-gradient-to-tr from-pink-500/40 to-rose-500/40"
                : "bg-gradient-to-tr from-indigo-500/40 to-violet-500/40"
            )}
          />
        </div>

        <div className="relative z-10 px-4 sm:px-6 md:px-12 lg:px-20 py-12">
          {/* Back Button */}
          <Link
            href="/designs"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Designs
          </Link>

          {/* Header */}
          <div className="max-w-5xl mb-12">
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs text-muted-foreground tracking-widest font-mono">
                {design.number}
              </span>
              <div className="w-12 h-px bg-border" />
              <span className="text-xs text-muted-foreground tracking-widest uppercase">
                {design.category}
              </span>
            </div>

            <h1
              className={cn(
                "text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter mb-4",
                "bg-gradient-to-r bg-clip-text text-transparent",
                design.accentColor === "violet"
                  ? "from-foreground via-violet-400 to-fuchsia-400"
                  : "from-foreground via-cyan-400 to-blue-400"
              )}
            >
              {design.title}
            </h1>

            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-muted-foreground" />
              <p className="text-muted-foreground">{design.subtitle}</p>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
              {design.description}
            </p>
          </div>

          {/* Live Demo Section */}
          {DemoComponent && (
            <div className="mb-16">
              <div className="flex items-center gap-2 mb-4">
                <Play className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary uppercase tracking-wider">
                  Live Demo
                </span>
              </div>
              <div
                className={cn(
                  "relative rounded-2xl overflow-hidden border border-border/50",
                  "shadow-2xl"
                )}
              >
                <DemoComponent />
              </div>
            </div>
          )}

          {/* Stats & Meta Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {Object.entries(design.stats).map(([key, value]) => (
              <div
                key={key}
                className="p-4 rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm"
              >
                <div className="text-2xl font-bold mb-1">{value}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">
                  {key}
                </div>
              </div>
            ))}
            <div className="p-4 rounded-xl border border-border/50 bg-background/50 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-2xl font-bold mb-1">
                <Calendar className="w-4 h-4" />
                {design.year}
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">
                Year
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Long Description */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold mb-4">About this design</h2>
              <p className="text-muted-foreground leading-relaxed">
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
                      className="px-2 py-1 text-xs rounded border border-border/50 bg-background/50"
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
                      className={cn(
                        "px-2 py-1 text-[10px] tracking-wider rounded",
                        design.accentColor === "violet"
                          ? "bg-violet-500/10 text-violet-400"
                          : "bg-cyan-500/10 text-cyan-400"
                      )}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
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
