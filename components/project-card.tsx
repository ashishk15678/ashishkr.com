"use client";

import { ArrowUpRight } from "lucide-react";
import { HoverCard } from "./hover-card";
import { MagneticButton } from "./magnetic-button";
import { ProjectCardWrapper } from "./project-dialog";
import type { Project } from "@/lib/constants/projects";
import { useRef, useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

interface ProjectCardProps {
  project: Project;
  index: number;
}

function CursorImagePreview({
  images,
  isHovered,
  mousePos,
}: {
  images: string[];
  isHovered: boolean;
  mousePos: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const [imageIndex, setImageIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  // Cycle images every 2 seconds while hovered
  useEffect(() => {
    if (!isHovered) {
      setImageIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % images.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [isHovered, images.length]);

  // Smoothly follow cursor via rAF for performance
  const updatePosition = useCallback(() => {
    if (containerRef.current) {
      const x = mousePos.current.x + 20;
      const y = mousePos.current.y - 80;
      containerRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    }
    rafRef.current = requestAnimationFrame(updatePosition);
  }, [mousePos]);

  useEffect(() => {
    if (isHovered) {
      rafRef.current = requestAnimationFrame(updatePosition);
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isHovered, updatePosition]);

  if (typeof window === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isHovered && (
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed top-0 left-0 z-[100] pointer-events-none"
          style={{ willChange: "transform" }}
        >
          <div className="relative w-[260px] h-[170px] rounded-xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50 bg-black/80 backdrop-blur-sm">
            <AnimatePresence mode="wait">
              <motion.img
                key={imageIndex}
                src={images[imageIndex]}
                alt="Project preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>
            {/* Progress dots */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor:
                      i === imageIndex
                        ? "rgba(255,255,255,0.9)"
                        : "rgba(255,255,255,0.3)",
                    transform: i === imageIndex ? "scale(1.3)" : "scale(1)",
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const mousePos = useRef({ x: 0, y: 0 });
  const hasImages = project.images && project.images.length > 0;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    },
    []
  );

  return (
    <ProjectCardWrapper project={project} index={index} className="group">
      <HoverCard>
        <div
          className="project-card border-b border-border py-8 md:py-12 lg:py-16 flex flex-col md:grid md:grid-cols-12 gap-4 md:gap-8 group transition-all duration-300 hover:bg-muted/30"
          data-inspectable
          style={{
            animationDelay: `${index * 100}ms`,
          }}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Number and title */}
          <div className="md:col-span-4">
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

          {/* Arrow indicator */}
          <div className="md:col-span-2 flex items-start md:justify-end mt-2 md:mt-0">
            <MagneticButton strength={0.4}>
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-border flex items-center justify-center hover:bg-foreground hover:text-background transition-all duration-300 hover:scale-110 hover:rotate-12">
                <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 group-hover:scale-110" />
              </div>
            </MagneticButton>
          </div>
        </div>
      </HoverCard>

      {/* Cursor-following image preview */}
      {hasImages && (
        <CursorImagePreview
          images={project.images!}
          isHovered={isHovered}
          mousePos={mousePos}
        />
      )}
    </ProjectCardWrapper>
  );
}
