"use client";

import { PROJECTS, Project } from "@/lib/constants/projects";
import { TextReveal } from "./text-reveal";
import { TechIcon } from "@/components/tech-icons";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  GithubIcon,
  ExternalLink,
  Laptop,
  Terminal,
  Globe,
  Cpu,
  Server,
  Database,
  Layers,
  Brain,
  Settings,
} from "lucide-react";
import { ProjectDialog } from "./project-dialog";

// Helper function to map architecture steps to actual icons
export function getArchStepDetails(step: string) {
  const clean = step.toLowerCase().trim();

  if (
    clean.includes("repl") ||
    clean.includes("cli") ||
    clean.includes("terminal") ||
    clean.includes("bash") ||
    clean.includes("command line")
  ) {
    return { Icon: Terminal, label: "CLI / REPL", tone: "indigo" as const };
  }
  if (
    clean.includes("frontend") ||
    clean.includes("web app") ||
    clean.includes("client app") ||
    clean.includes("browser") ||
    clean.includes("web ui")
  ) {
    return { Icon: Globe, label: "Web UI", tone: "blue" as const };
  }
  if (
    clean.includes("sdk") ||
    clean.includes("adaptor") ||
    clean.includes("adapter") ||
    clean.includes("middleware")
  ) {
    return { Icon: Layers, label: "SDK / Adapter", tone: "violet" as const };
  }
  if (
    clean.includes("api server") ||
    clean.includes("backend") ||
    clean.includes("trpc api") ||
    clean.includes("server")
  ) {
    return { Icon: Server, label: "API Backend", tone: "emerald" as const };
  }
  if (
    clean.includes("database") ||
    clean.includes("postgres") ||
    clean.includes("sqlite") ||
    clean.includes("db") ||
    clean.includes("prisma")
  ) {
    return { Icon: Database, label: "Database", tone: "cyan" as const };
  }
  if (
    clean.includes("llm") ||
    clean.includes("provider api") ||
    clean.includes("ai") ||
    clean.includes("groq") ||
    clean.includes("anthropic") ||
    clean.includes("gemini") ||
    clean.includes("openai")
  ) {
    return { Icon: Brain, label: "AI / LLM API", tone: "rose" as const };
  }
  if (clean.includes("github")) {
    return { Icon: GithubIcon, label: "GitHub API", tone: "zinc" as const };
  }
  if (
    clean.includes("kernel") ||
    clean.includes("runtime") ||
    clean.includes("linux") ||
    clean.includes("os")
  ) {
    return { Icon: Settings, label: "OS / Runtime", tone: "amber" as const };
  }

  // Fallback default step info
  return { Icon: Cpu, label: step, tone: "zinc" as const };
}

// Visual Architecture pipeline rendering component
export function ArchitectureFlow({ flow }: { flow?: string }) {
  if (!flow) return null;

  // Split steps using regex covering typical arrow chars
  const steps = flow
    .split(/\s*(?:->|→|=>|→|➔)\s*/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (steps.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 p-3.5 rounded-2xl bg-muted/20 border border-border/20 shadow-xs">
      <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground block mb-0.5">
        System Architecture
      </span>
      <div className="flex flex-wrap items-center gap-y-2 gap-x-1.5">
        {steps.map((step, index) => {
          const { Icon, label, tone } = getArchStepDetails(step);

          const toneColors = {
            indigo: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
            blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
            violet: "bg-violet-500/10 text-violet-400 border-violet-500/20",
            emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
            cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
            rose: "bg-rose-500/10 text-rose-400 border-rose-500/20",
            zinc: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
            amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
          };
          const badgeClass = toneColors[tone] || toneColors.zinc;

          return (
            <div key={index} className="flex items-center gap-1.5">
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[11px] font-medium transition-all duration-300 hover:scale-102 ${badgeClass}`}
                title={step}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{label}</span>
              </div>
              {index < steps.length - 1 && (
                <span className="text-muted-foreground/30 font-bold text-xs select-none">
                  →
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ProjectsSection() {
  const [activeProject, setActiveProject] = useState<Project>(PROJECTS[0]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  // Auto-play preview gallery for the active project
  useEffect(() => {
    setImageIndex(0);
    const images = activeProject.images;
    if (!images || images.length <= 1) return;

    const interval = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % images.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [activeProject.id, activeProject.images]);

  const handleProjectHover = (project: Project) => {
    setActiveProject(project);
  };

  const handleProjectClick = (project: Project) => {
    setActiveProject(project);
    setIsDialogOpen(true);
  };

  return (
    <section
      ref={sectionRef}
      className="px-4 sm:px-6 md:px-12 lg:px-20 py-12 md:py-24 relative bg-secondary/30 border-y border-border/40"
      id="projects"
    >
      {/* Section Header */}
      <div className="mb-12 md:mb-20 text-center">
        <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter section-title">
          <TextReveal>Projects.</TextReveal>
        </h2>
        <p className="text-muted-foreground text-sm md:text-base mt-3 max-w-md mx-auto">
          Hover/click on desktop, scroll and tap on mobile to view details and
          case studies.
        </p>
      </div>

      {/* ========================================================
          DESKTOP LAYOUT (Split Screen Side-by-Side)
          ======================================================== */}
      <div className="hidden md:grid grid-cols-12 gap-10 items-start relative min-h-[600px]  ">
        {/* Sticky Showcase Panel (Left Column) */}
        <div className="col-span-5 sticky top-24 self-start w-full">
          <motion.div
            layoutId="active-showcase"
            className="border border-border/50 rounded-3xl overflow-hidden bg-secondary shadow-2xl backdrop-blur-md p-6 flex flex-col gap-6"
          >
            {/* Visual Header / Image Gallery */}
            <div className="relative aspect-video w-full bg-muted/20 overflow-hidden rounded-2xl border border-border/20">
              <AnimatePresence mode="wait">
                {activeProject.images && activeProject.images.length > 0 ? (
                  <motion.img
                    key={`${activeProject.id}-${imageIndex}`}
                    src={activeProject.images[imageIndex]}
                    alt={activeProject.title}
                    initial={{ opacity: 0.2, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="absolute inset-0 w-full h-full object-cover "
                  />
                ) : (
                  <motion.div
                    key="gradient-placeholder"
                    className="absolute inset-0 w-full h-full border border-dashed border-zinc-200 rounded-2xl flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    No preview available
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Content Details */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-3xl font-bold tracking-tight">
                  {activeProject.title}
                </h3>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {activeProject.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 border border-border/40 rounded-full text-[10px] tracking-wider inline-flex items-center gap-1.5 bg-background/30 backdrop-blur-sm"
                  >
                    <TechIcon tag={tag} className="w-3.5 h-3.5" glow />
                    {tag}
                  </span>
                ))}
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed mt-1">
                {activeProject.description}
              </p>

              {/* Actions Footer */}
              <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-border/40">
                <button
                  onClick={() => setIsDialogOpen(true)}
                  className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-border bg-background/50 hover:bg-muted font-medium text-xs transition-all cursor-pointer"
                >
                  <span>Case Study</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>

                {activeProject.github && (
                  <a
                    href={activeProject.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-foreground text-background hover:opacity-90 font-medium text-xs transition-all"
                  >
                    <GithubIcon className="w-3.5 h-3.5" />
                    <span>Source Code</span>
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scrollable Feed List (Right Column) */}
        <div className="col-span-7 flex flex-col gap-4">
          {PROJECTS.map((project) => {
            const isActive = activeProject.id === project.id;
            return (
              <div
                key={project.id}
                onMouseEnter={() => handleProjectHover(project)}
                onClick={() => handleProjectClick(project)}
                className={`group cursor-pointer rounded-2xl border p-5 transition-all duration-300 flex items-start justify-between relative overflow-hidden ${
                  isActive
                    ? "border-green-500/50 text-green-500/5 shadow-[0_0_20px_rgba(99,102,241,0.08)]"
                    : "border-border/60 hover:border-border-foreground bg-muted/5"
                }`}
              >
                <div className="flex flex-col gap-3 max-w-[85%]">
                  <div className="flex items-center gap-3">
                    <h3
                      className={`text-xl font-bold tracking-tight transition-colors ${
                        isActive
                          ? "text-foreground"
                          : "text-muted-foreground group-hover:text-foreground"
                      }`}
                    >
                      {project.title}
                    </h3>
                    <span className="text-[10px] text-muted-foreground/60">
                      {project.year}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground/80 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {project.tags.slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 border border-border/30 rounded-full text-[9px] tracking-wider inline-flex items-center gap-1 bg-background/20"
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 4 && (
                      <span className="text-[9px] text-muted-foreground/50 self-center">
                        +{project.tags.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border/60 bg-background transition-all group-hover:scale-105 group-hover:border-foreground/50">
                  <ArrowUpRight
                    className={`h-4 w-4 transition-transform duration-300 ${
                      isActive
                        ? "rotate-45 text-green-400"
                        : "group-hover:rotate-45"
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================
          MOBILE LAYOUT (Sticky Showcase + Scrollable List)
          ======================================================== */}
      <div className="block md:hidden flex flex-col relative w-full">
        {/* Sticky Showcase Panel - STUCK AT TOP */}
        <div className="sticky top-[58px] z-30 w-full bg-background/95 backdrop-blur-md border-b border-border/40 pb-3 pt-2 -mx-4 px-4 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
          <motion.div
            layoutId="active-showcase-mobile"
            className="p-3.5 rounded-2xl bg-muted/20 border border-border/30 flex flex-col gap-3"
          >
            {/* Top row: Image (wider and taller) + Title and tags stacked side-by-side or stacked vertically */}
            <div className="flex gap-4 items-start w-full">
              {/* Image Container: increased size from w-28 h-20 to w-36 h-24 */}
              <div className="relative w-36 h-24 shrink-0 rounded-xl overflow-hidden border border-border/20 bg-muted/40 shadow-xs">
                {activeProject.images && activeProject.images.length > 0 ? (
                  <img
                    src={activeProject.images[0]}
                    alt={activeProject.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent flex items-center justify-center">
                    <Laptop className="w-8 h-8 opacity-30 text-indigo-400" />
                  </div>
                )}
              </div>

              {/* Metadata content */}
              <div className="flex flex-col flex-1 min-w-0 justify-between h-24">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] font-mono text-indigo-400 font-bold bg-indigo-500/10 px-1.5 py-0.5 rounded">
                      #{activeProject.number}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-semibold ml-auto">
                      {activeProject.year}
                    </span>
                  </div>
                  <h3 className="text-base font-bold tracking-tight leading-tight text-foreground line-clamp-2">
                    {activeProject.title}
                  </h3>
                </div>

                {/* Tags row */}
                <div className="flex flex-wrap gap-1 mt-1">
                  {activeProject.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-1.5 py-0.5 border border-border/30 rounded-full text-[8px] tracking-wider bg-background/50 text-muted-foreground uppercase font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                  {activeProject.tags.length > 3 && (
                    <span className="text-[8px] text-muted-foreground/60 self-center pl-0.5">
                      +{activeProject.tags.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom row: Brief Description + Quick Actions */}
            <div className="flex flex-col gap-2 pt-2 border-t border-border/10">
              <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                {activeProject.description}
              </p>

              <div className="flex gap-2 mt-1">
                <button
                  onClick={() => setIsDialogOpen(true)}
                  className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-foreground text-background font-semibold text-xs transition-all flex-1 cursor-pointer"
                >
                  <span>Details</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>

                {activeProject.github && (
                  <a
                    href={activeProject.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-background/50 text-foreground font-medium text-xs transition-all"
                  >
                    <GithubIcon className="w-3.5 h-3.5" />
                    <span>Code</span>
                  </a>
                )}

                {activeProject.link && (
                  <a
                    href={activeProject.link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-background/50 text-foreground font-medium text-xs transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Live</span>
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scrollable list below */}
        <div className="flex flex-col gap-2 mt-4">
          {PROJECTS.map((project) => {
            const isActive = activeProject.id === project.id;
            return (
              <div
                key={project.id}
                onClick={() => handleProjectClick(project)}
                className={`cursor-pointer rounded-xl border p-3.5 transition-all flex items-center justify-between ${
                  isActive
                    ? "border-green-500 text-green-500 shadow-[0_0_15px_rgba(99,102,241,0.05)]"
                    : "border-border/50 bg-muted/5 active:bg-muted/10"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="min-w-0">
                    <h4
                      className={`text-sm font-bold truncate ${
                        isActive ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {project.title}
                    </h4>
                    <p className="text-[10px] text-muted-foreground/60 truncate mt-0.5">
                      {project.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 ml-3"></div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Case Study Dialog Modal Component */}
      <ProjectDialog
        project={activeProject}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </section>
  );
}
