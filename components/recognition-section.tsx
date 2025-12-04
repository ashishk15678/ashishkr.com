"use client";

import { RECOGNITIONS } from "@/lib/constants/recognition";
import { HoverCard } from "./hover-card";
import { TextReveal } from "./text-reveal";

export function RecognitionSection() {
  return (
    <section
      className="px-4 sm:px-6 md:px-12 lg:px-20 py-12 md:py-20 bg-foreground text-background"
      data-inspectable
    >
      <div className="relative z-10 flex flex-col lg:grid lg:grid-cols-12 gap-8 md:gap-12">
        {/* Section header */}
        <div className="lg:col-span-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-3 md:mb-4 section-title">
            <TextReveal>Recognition</TextReveal>
          </h2>
          <p className="text-sm md:text-base text-background/60 leading-relaxed">
            Honors and awards received for technical excellence, innovation, and
            academic performance.
          </p>
        </div>

        {/* Awards list */}
        <div className="lg:col-span-8">
          {RECOGNITIONS.map((recognition) => (
            <HoverCard key={recognition.id} glowColor="rgba(255,255,255,0.1)">
              <div
                className="recognition-card border-b border-background/20 py-4 md:py-6 transition-all duration-300 hover:pl-4 hover:bg-background/5 group"
                data-inspectable
              >
                <div className="text-[10px] md:text-xs text-background/50 mb-1 md:mb-2 transition-transform duration-300 group-hover:translate-x-2">
                  {recognition.year}
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-1 transition-transform duration-300 group-hover:translate-x-2">
                  {recognition.title}
                </h3>
                <p className="text-sm md:text-base text-background/60 transition-all duration-300 group-hover:translate-x-2 group-hover:text-background/80">
                  {recognition.organization}
                </p>
              </div>
            </HoverCard>
          ))}
        </div>
      </div>
    </section>
  );
}
