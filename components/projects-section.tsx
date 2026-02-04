import { PROJECTS } from "@/lib/constants/projects";
import { TextReveal } from "./text-reveal";
import { ProjectCard } from "./project-card";

// Server Component - Static rendering for better performance
export function ProjectsSection() {
  return (
    <section
      className="px-4 sm:px-6 md:px-12 lg:px-20 py-12 md:py-20"
      data-inspectable
    >
      {/* Section header */}
      <div className="mb-10 md:mb-16">
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
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </section>
  );
}
