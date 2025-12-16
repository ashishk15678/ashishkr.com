"use client";

import { PROJECTS } from "@/lib/constants/projects";
import { ArrowUpRight } from "lucide-react";
import { HoverCard } from "./hover-card";
import { MagneticButton } from "./magnetic-button";
import { TextReveal } from "./text-reveal";

export function ProjectsSection() {
  return (
    <section
      className="px-4 sm:px-6 md:px-12 lg:px-20 py-12 md:py-20"
      data-inspectable
    >
      {/* Section header */}
      <div className="mb-10 md:mb-16">
        {/*<div className="flex items-center gap-2 md:gap-3 text-[10px] md:text-xs tracking-widest text-muted-foreground mb-3 md:mb-4">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span>{`{SELECTED_WORK}`}</span>
        </div>*/}
        <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter section-title">
          <TextReveal>Selected</TextReveal>
        </h2>
        <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-muted-foreground/40">
          <TextReveal delay={200}>Projects.</TextReveal>
        </h2>
      </div>

      {/* Year range */}
      <div className="flex justify-end mb-6 md:mb-8 text-xs md:text-sm text-muted-foreground tracking-widest">
        2022 — 2025
      </div>

      {/* Projects list */}
      <div className="border-t border-border">
        {PROJECTS.map((project, index) => (
          <HoverCard key={project.id}>
            <div
              className="project-card border-b border-border py-8 md:py-12 lg:py-16 flex flex-col md:grid md:grid-cols-12 gap-4 md:gap-8 group transition-all duration-300 hover:bg-muted/30"
              data-inspectable
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {/* Number and title */}
              <div className="md:col-span-4">
                <div className="text-[10px] md:text-xs text-muted-foreground tracking-widest mb-1 md:mb-2 transition-transform duration-300 group-hover:translate-x-2">
                  {project.number} — {project.year}
                  {project.endYear && ` — ${project.endYear}`}
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight transition-transform duration-300 group-hover:translate-x-2">
                  {project.title}
                </h3>
              </div>

              {/* Tags and description */}
              <div className="md:col-span-6">
                <div className="flex flex-wrap gap-1.5 md:gap-2 mb-3 md:mb-4">
                  {project.tags.map((tag, tagIndex) => (
                    <span
                      key={tag}
                      className="px-2 md:px-3 py-0.5 md:py-1 border border-border rounded-full text-[10px] md:text-xs tracking-wider transition-all duration-300 backdrop-blur-2xl"
                      style={{ transitionDelay: `${tagIndex * 50}ms` }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed transition-all duration-300 group-hover:text-foreground">
                  {project.description}
                </p>
              </div>

              {/* Arrow link */}
              <div className="md:col-span-2 flex items-start md:justify-end mt-2 md:mt-0">
                {project.link && (
                  <MagneticButton
                    as="a"
                    href={project.link}
                    external
                    strength={0.4}
                  >
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-border flex items-center justify-center hover:bg-foreground hover:text-background transition-all duration-300 hover:scale-110 hover:rotate-12">
                      <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 group-hover:scale-110" />
                    </div>
                  </MagneticButton>
                )}
              </div>
            </div>
          </HoverCard>
        ))}
      </div>
    </section>
  );
}
