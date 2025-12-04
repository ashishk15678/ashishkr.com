"use client"

import type { Research } from "@/lib/constants/research"
import { ArrowUpRight, GraduationCap } from "lucide-react"
import { HoverCard } from "./hover-card"
import { MagneticButton } from "./magnetic-button"

interface ResearchCardProps {
  paper: Research
}

export function ResearchCard({ paper }: ResearchCardProps) {
  return (
    <HoverCard>
      <article
        className="border-b border-border py-8 md:py-12 lg:py-16 transition-all duration-300 hover:bg-muted/30 group"
        data-inspectable
      >
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 md:gap-8">
          {/* Metadata */}
          <div className="lg:col-span-4">
            <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 border border-border rounded-full text-[10px] md:text-xs tracking-wider mb-3 md:mb-4 transition-all duration-300 group-hover:bg-foreground group-hover:text-background group-hover:border-foreground">
              <GraduationCap className="w-3 h-3 md:w-4 md:h-4" />
              ACADEMIC RESEARCH
            </div>
            <div className="text-xs md:text-sm text-muted-foreground mb-4 md:mb-6 transition-transform duration-300 group-hover:translate-x-2 font-mono">
              {paper.paperId}
            </div>
            <div className="border-t border-border pt-4 flex flex-wrap gap-4 lg:block lg:space-y-4">
              <div className="transition-transform duration-300 group-hover:translate-x-2">
                <div className="text-[10px] md:text-xs text-muted-foreground tracking-widest mb-0.5 md:mb-1">ROLE</div>
                <div className="font-medium text-sm md:text-base">{paper.role}</div>
              </div>
              <div
                className="transition-transform duration-300 group-hover:translate-x-2"
                style={{ transitionDelay: "50ms" }}
              >
                <div className="text-[10px] md:text-xs text-muted-foreground tracking-widest mb-0.5 md:mb-1">
                  CONTEXT
                </div>
                <div className="font-medium text-sm md:text-base">{paper.context}</div>
              </div>
              <div
                className="transition-transform duration-300 group-hover:translate-x-2"
                style={{ transitionDelay: "100ms" }}
              >
                <div className="text-[10px] md:text-xs text-muted-foreground tracking-widest mb-0.5 md:mb-1">YEAR</div>
                <div className="font-medium text-sm md:text-base">{paper.year}</div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-8">
            <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4 md:mb-6 text-balance transition-transform duration-300 group-hover:translate-x-2">
              {paper.title}
            </h3>
            <p className="text-sm md:text-base lg:text-lg text-muted-foreground leading-relaxed mb-6 md:mb-8 transition-all duration-300 group-hover:text-foreground group-hover:translate-x-2">
              {paper.abstract}
            </p>
            {paper.link && (
              <MagneticButton as="a" href={paper.link} external strength={0.3}>
                <span className="inline-flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3 border border-border rounded-full font-medium text-xs md:text-sm tracking-wide hover:bg-foreground hover:text-background hover:scale-105 transition-all duration-300">
                  VIEW PAPER
                  <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4 transition-transform duration-300 group-hover:rotate-45" />
                </span>
              </MagneticButton>
            )}
          </div>
        </div>
      </article>
    </HoverCard>
  )
}
