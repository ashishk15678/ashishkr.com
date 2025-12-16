import { Header } from "@/components/header";
import { ResearchCard } from "@/components/research-card";
import { RESEARCH_PAPERS } from "@/lib/constants/research";
import { TextReveal } from "@/components/text-reveal";

export default function ShelfPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="px-4 sm:px-6 md:px-12 lg:px-20 pt-24 md:pt-32 pb-16 md:pb-20">
        {/* Page header */}
        <div className="mb-10 md:mb-16" data-inspectable>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-3 md:mb-4 section-title">
            <TextReveal>Shelf</TextReveal>
          </h1>
          <p className="text-sm md:text-lg text-muted-foreground max-w-xl animate-in fade-in slide-in-from-bottom duration-700 delay-300">
            Academic research papers and publications in machine learning,
            distributed systems, and AI ethics.
          </p>
        </div>

        {/* Research papers */}
        <div className="border-t border-border">
          {RESEARCH_PAPERS.map((paper) => (
            <ResearchCard key={paper.id} paper={paper} />
          ))}
        </div>
      </div>
    </main>
  );
}
