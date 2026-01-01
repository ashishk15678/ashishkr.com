import { Header } from "@/components/header";
import { RESEARCH_PAPERS } from "@/lib/constants/research";
import { TextReveal } from "@/components/text-reveal";
import { FileText, ExternalLink, BookOpen } from "lucide-react";
import Link from "next/link";

export default function ShelfPage() {
  return (
    <main className="min-h-screen bg-background text-foreground w-full flex items-center justify-center">
      <Header />
      <div className="px-4 sm:px-6 md:px-12 lg:px-20 pt-24 md:pt-32 pb-16 md:pb-20 max-w-7xl">
        {/* Page header */}
        <div className="mb-10 md:mb-16" data-inspectable>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-3 md:mb-4 section-title">
            <TextReveal>Shelf</TextReveal>
          </h1>
          <p className="text-sm md:text-lg text-muted-foreground max-w-xl animate-in fade-in slide-in-from-bottom duration-700 delay-300">
            I donot have much exposure , since i am only in 2nd year but i did
            write some project report , please donot judge me based off my
            papers.
          </p>
        </div>

        {/* Tabled Research List */}
        <div className="border border-border rounded-lg overflow-hidden bg-card/30 backdrop-blur-sm">
          {/* Table Header */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 bg-muted/50 border-b border-border px-6 py-4 text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground">
            <div>Publication / Title</div>
            <div className="hidden md:block">Venue / Publisher</div>
            <div className="hidden lg:block">Field</div>
            <div className="text-right lg:text-left">Year</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-border overflow-y-auto">
            {RESEARCH_PAPERS.length === 0 ? (
              <div className="py-24 text-center">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground/20 mb-4" />
                <p className="text-muted-foreground">
                  The shelf is currently empty.
                </p>
              </div>
            ) : (
              RESEARCH_PAPERS.map((paper) => (
                <div
                  key={paper.id}
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-center px-6 py-8 hover:bg-muted/30 transition-all group relative"
                >
                  {/* Title & Mobile Metadata */}
                  <div className="flex flex-col pr-4">
                    <Link
                      href={paper.link || "#"}
                      target="_blank"
                      className="font-semibold text-base md:text-lg leading-snug group-hover:text-primary transition-colors inline-flex items-center gap-2"
                    >
                      {paper.title}
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                    <div className="flex flex-wrap gap-2 mt-2 md:hidden"></div>
                  </div>

                  {/* Venue/Publisher (Tablet/Desktop) */}
                  <div className="hidden md:flex flex-col"></div>

                  {/* Year Column */}
                  <div className="text-right lg:text-left font-mono text-sm text-muted-foreground">
                    {paper.year}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
