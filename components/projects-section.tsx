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
      <div className="mb-10 md:mb-16 text-center">
        <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter section-title">
          <TextReveal>Projects.</TextReveal>
        </h2>
      </div>

      {/* Projects list */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {PROJECTS.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </section>
  );
}
