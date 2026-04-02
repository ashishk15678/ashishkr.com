"use client";

import { ArrowUpRight } from "lucide-react";
import { HoverCard } from "./hover-card";
import { MagneticButton } from "./magnetic-button";
import { ProjectCardWrapper } from "./project-dialog";
import type { Project } from "@/lib/constants/projects";
import { useRef, useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { TechIcon } from "@/components/tech-icons";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const mousePos = useRef({ x: 0, y: 0 });
  const hasImages = project.images && project.images.length > 0;
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    if (!hasImages) return;
    let intervalId: ReturnType<typeof setInterval> | null = null;
    const starter = setTimeout(() => {
      intervalId = setInterval(
        () =>
          setFrameIndex((prev) =>
            project.images ? (prev + 1) % project.images.length : 0,
          ),
        3200,
      );
    }, index * 900);
    return () => {
      clearTimeout(starter);
      if (intervalId) clearInterval(intervalId);
    };
  }, [hasImages, project.images?.length, index]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    mousePos.current = { x: e.clientX, y: e.clientY };
  }, []);

  return (
    <ProjectCardWrapper project={project} index={index} className="group">
      <HoverCard>
        <div
          className=" border border-border/60 rounded-3xl overflow-hidden bg-muted/10 shadow-xl backdrop-blur group transition-all duration-500 p-2 "
          data-inspectable
          style={{
            animationDelay: `${index * 100}ms`,
          }}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="flex flex-col gap-4">
            <div className="relative aspect-video w-full bg-linear-to-br from-muted to-background overflow-hidden">
              {hasImages ? (
                <AnimatePresence mode="wait">
                  <motion.img
                    key={`${project.id}-${frameIndex}`}
                    src={project.images![frameIndex]}
                    alt={project.title}
                    initial={{ opacity: 0.4, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </AnimatePresence>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-full h-full">
                    {/* Rich fallback preview */}
                    <div className="absolute inset-0 bg-linear-to-br from-muted/80 via-background to-muted/60" />
                    <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-cyan-500/15 blur-3xl" />
                    <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-violet-500/15 blur-3xl" />

                    {/* subtle grid */}
                    <div
                      className="absolute inset-0 opacity-[0.22]"
                      style={{
                        backgroundImage:
                          "linear-gradient(to right, rgba(255,255,255,0.08) 1px, rgba(0,0,0,0) 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, rgba(0,0,0,0) 1px)",
                        backgroundSize: "42px 42px",
                      }}
                    />

                    <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
                      <div className="mb-3 flex items-center gap-2 text-[10px] tracking-widest uppercase text-muted-foreground">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                        No screenshots yet
                      </div>

                      <div className="text-lg md:text-xl font-semibold">
                        {project.title}
                      </div>
                      <div className="mt-2 text-xs md:text-sm text-muted-foreground max-w-[34ch]">
                        This project doesn’t have a gallery yet — here’s a quick
                        tech snapshot.
                      </div>

                      <div className="mt-4 flex flex-wrap justify-center gap-2">
                        {project.tags.slice(0, 6).map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-1 rounded-full border border-border/70 bg-background/40 backdrop-blur text-[10px] tracking-wider inline-flex items-center gap-2"
                          >
                            <TechIcon tag={tag} className="w-3.5 h-3.5" glow />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-3 flex items-center gap-2">
                <span className="px-2 py-1 rounded-full bg-black/60 text-white text-[10px] font-semibold tracking-wide uppercase">
                  {project.year}
                  {project.endYear ? ` — ${project.endYear}` : ""}
                </span>
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    className="px-2 py-1 rounded-full bg-white/15 text-white text-[10px] font-semibold tracking-wide uppercase hover:bg-white/25 transition"
                  >
                    View
                  </a>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 px-4 pb-5">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
                  {project.title}
                </h3>
                <MagneticButton strength={0.4}>
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-border flex items-center justify-center hover:bg-foreground hover:text-background transition-all duration-300 hover:scale-110 hover:rotate-12">
                    <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 group-hover:scale-110" />
                  </div>
                </MagneticButton>
              </div>

              <div className="flex flex-wrap gap-1.5 md:gap-2">
                {project.tags.map((tag, tagIndex) => (
                  <span
                    key={tag}
                    className="px-2 md:px-3 py-0.5 md:py-1 border border-border rounded-full text-[10px] md:text-xs tracking-wider transition-all duration-300 backdrop-blur-2xl inline-flex items-center gap-2"
                    style={{ transitionDelay: `${tagIndex * 50}ms` }}
                  >
                    <TechIcon tag={tag} className="w-3.5 h-3.5" glow />
                    {tag}
                  </span>
                ))}
              </div>

              <p className="text-sm md:text-base text-muted-foreground leading-relaxed transition-all duration-300 group-hover:text-foreground">
                {project.description}
              </p>
            </div>
          </div>
        </div>
      </HoverCard>
    </ProjectCardWrapper>
  );
}
