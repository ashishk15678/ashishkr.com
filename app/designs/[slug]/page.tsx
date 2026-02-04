import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  DESIGNS,
  getDesignBySlug,
  getAllDesignSlugs,
} from "@/lib/constants/designs";
import {
  ArrowLeft,
  ArrowUpRight,
  Sparkles,
  Calendar,
  Layers,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Header } from "@/components/header";

// Static generation
export function generateStaticParams() {
  return getAllDesignSlugs().map((slug) => ({ slug }));
}

// Dynamic metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const design = getDesignBySlug(slug);
  if (!design) {
    return { title: "Design Not Found" };
  }
  return {
    title: `${design.title} | Ashish Kumar Designs`,
    description: design.description,
  };
}

export default async function DesignPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const design = getDesignBySlug(slug);

  if (!design) {
    notFound();
  }

  // Find next/prev designs for navigation
  const currentIndex = DESIGNS.findIndex((d) => d.slug === slug);
  const prevDesign = currentIndex > 0 ? DESIGNS[currentIndex - 1] : null;
  const nextDesign =
    currentIndex < DESIGNS.length - 1 ? DESIGNS[currentIndex + 1] : null;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero Section */}
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
          <div className="max-w-5xl mb-16">
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
                "text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6",
                "bg-gradient-to-r bg-clip-text text-transparent",
                design.accentColor === "violet"
                  ? "from-foreground via-violet-400 to-fuchsia-400"
                  : "from-foreground via-cyan-400 to-blue-400"
              )}
            >
              {design.title}
            </h1>

            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-muted-foreground" />
              <p className="text-lg text-muted-foreground">{design.subtitle}</p>
            </div>

            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
              {design.description}
            </p>
          </div>

          {/* Preview Image */}
          {design.previewImage && (
            <div className="relative mb-20">
              <div
                className={cn(
                  "absolute -inset-4 rounded-3xl blur-2xl opacity-30",
                  design.accentColor === "violet"
                    ? "bg-gradient-to-r from-violet-500 to-fuchsia-500"
                    : "bg-gradient-to-r from-cyan-500 to-blue-500"
                )}
              />
              <div className="relative rounded-2xl overflow-hidden border border-border/50 bg-background/50 backdrop-blur-sm">
                <Image
                  src={design.previewImage}
                  alt={design.title}
                  width={1400}
                  height={800}
                  className="w-full object-cover"
                  priority
                />
              </div>
            </div>
          )}

          {/* Stats & Meta Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {/* Stats */}
            {Object.entries(design.stats).map(([key, value]) => (
              <div
                key={key}
                className="p-6 rounded-2xl border border-border/50 bg-background/50 backdrop-blur-sm"
              >
                <div className="text-3xl font-bold mb-1">{value}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">
                  {key}
                </div>
              </div>
            ))}
            {/* Year */}
            <div className="p-6 rounded-2xl border border-border/50 bg-background/50 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-3xl font-bold mb-1">
                <Calendar className="w-5 h-5" />
                {design.year}
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">
                Year
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
            {/* Long Description */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-6">About this design</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {design.longDescription}
              </p>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Features */}
              <div>
                <h3 className="text-sm text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  Key Features
                </h3>
                <div className="space-y-3">
                  {design.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-3 text-sm"
                    >
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full",
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
                <h3 className="text-sm text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Wrench className="w-4 h-4" />
                  Tools Used
                </h3>
                <div className="flex flex-wrap gap-2">
                  {design.tools.map((tool) => (
                    <span
                      key={tool}
                      className="px-3 py-1.5 text-xs rounded-full border border-border/50 bg-background/50"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <h3 className="text-sm text-muted-foreground uppercase tracking-wider mb-4">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {design.tags.map((tag) => (
                    <span
                      key={tag}
                      className={cn(
                        "px-3 py-1.5 text-[10px] tracking-wider rounded-full",
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
          <div className="flex items-center justify-between pt-12 border-t border-border/50">
            {prevDesign ? (
              <Link
                href={`/designs/${prevDesign.slug}`}
                className="group flex items-center gap-4"
              >
                <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Previous
                  </div>
                  <div className="font-semibold group-hover:text-muted-foreground transition-colors">
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
                className="group flex items-center gap-4 text-right"
              >
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Next
                  </div>
                  <div className="font-semibold group-hover:text-muted-foreground transition-colors">
                    {nextDesign.title}
                  </div>
                </div>
                <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
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
