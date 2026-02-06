"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/constants/projects";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Apple-style Dialog Components

function AppleDialogOverlay({
  className,

  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        "fixed inset-0 z-50 bg-black/40 backdrop-blur-md",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "transition-all duration-300",
        className,
      )}
      {...props}
    />
  );
}

function AppleDialogContent({
  className,

  children,

  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <AppleDialogOverlay />

      <DialogPrimitive.Content
        className={cn(
          // Base positioning and sizing

          "fixed top-[50%] left-[50%] z-50 w-full max-w-2xl max-h-[85vh]",

          "translate-x-[-50%] translate-y-[-50%] overflow-hidden",

          // Apple-style glassmorphism

          "bg-background/80 backdrop-blur-2xl",

          "border border-border/50 rounded-2xl shadow-2xl",

          // Apple-style animations

          "data-[state=open]:animate-in data-[state=closed]:animate-out",

          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",

          "data-[state=closed]:zoom-out-[0.96] data-[state=open]:zoom-in-[0.96]",

          "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",

          "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",

          "duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",

          className,
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

// Stats Pill Component

function StatsPill({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-muted/50 rounded-xl backdrop-blur-sm">
      <span className="text-2xl font-bold text-foreground">{value}</span>

      <span className="text-xs text-muted-foreground uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}
export function ProjectDialog({
  project,
  open,
  onOpenChange,
}: ProjectDialogProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setActiveIndex(index);
  const closeLightbox = () => {
    setActiveIndex(null);
  };

  const showNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault(); // Prevent Radix from stealing focus
    if (project.images && project.images.length > 0) {
      setActiveIndex((prev) =>
        prev !== null ? (prev + 1) % project.images.length : null,
      );
    }
  };

  const showPrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    if (project.images && project.images.length > 0) {
      setActiveIndex((prev) =>
        prev !== null
          ? (prev - 1 + project.images.length) % project.images.length
          : null,
      );
    }
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AppleDialogContent
        // Prevents the main dialog from closing when we click the slideshow
        onPointerDownOutside={(e) => {
          if (activeIndex !== null) e.preventDefault();
        }}
      >
        <div className="overflow-y-auto max-h-[85vh] p-6 sm:p-8 relative">
          {/* Close Button */}
          <DialogPrimitive.Close
            className={cn(
              "absolute top-4 right-4 z-10",
              "w-8 h-8 rounded-full flex items-center justify-center",
              "bg-muted/80 backdrop-blur-sm transition-all duration-200 hover:scale-105",
            )}
          >
            <X className="w-4 h-4" />
          </DialogPrimitive.Close>

          {/* Header Section (Restored your original code) */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-xs text-muted-foreground tracking-widest mb-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>
                {project.number} — {project.year}
              </span>
            </div>
            <DialogPrimitive.Title className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              {project.title}
            </DialogPrimitive.Title>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs border border-border/70 rounded-full bg-muted/30"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <DialogPrimitive.Description className="text-muted-foreground leading-relaxed mb-6">
            {project.longDescription || project.description}
          </DialogPrimitive.Description>

          {/* Gallery Grid */}
          {project.images && project.images.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Gallery
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {project.images.map((image, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 0.98 }}
                    onClick={() => openLightbox(index)}
                    className="aspect-video rounded-xl overflow-hidden border border-border/50 bg-muted/30 cursor-pointer"
                  >
                    <img
                      src={image}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Visit Button */}
          {project.link && (
            <div className="pt-4 border-t border-border/50">
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-4 px-6 rounded-xl bg-foreground text-background font-medium transition-all hover:scale-[1.02]"
              >
                <span>Visit Project</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>
      </AppleDialogContent>

      {/* FULL SCREEN SLIDESHOW OVERLAY */}
      <AnimatePresence>
        {activeIndex !== null && (
          <DialogPrimitive.Portal>
            {/* Using a separate motion.div for the overlay to handle z-index properly */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              // pointer-events-auto ensures buttons are clickable
              className="fixed inset-0 z-[150] flex items-center justify-center bg-black/95 backdrop-blur-xl pointer-events-auto"
              // Only close if clicking the backdrop, not the UI
              onClick={closeLightbox}
            >
              {/* UI Layer: Buttons stay clickable */}
              <div className="absolute inset-0 z-[160] pointer-events-none">
                <button
                  className="absolute top-6 right-6 p-3 text-white/50 hover:text-white pointer-events-auto transition-transform active:scale-90"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeLightbox();
                  }}
                >
                  <X size={40} />
                </button>

                <button
                  className="absolute left-6 top-1/2 -translate-y-1/2 p-4 text-white/50 hover:text-white hover:bg-white/10 rounded-full pointer-events-auto transition-all"
                  onClick={showPrev}
                >
                  <ChevronLeft size={48} />
                </button>

                <button
                  className="absolute right-6 top-1/2 -translate-y-1/2 p-4 text-white/50 hover:text-white hover:bg-white/10 rounded-full pointer-events-auto transition-all"
                  onClick={showNext}
                >
                  <ChevronRight size={48} />
                </button>
              </div>

              {/* Image Layer */}
              <div className="relative z-[155] w-full h-full flex items-center justify-center p-4">
                <motion.img
                  loading="lazy"
                  key={activeIndex}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  src={project.images[activeIndex]}
                  className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl pointer-events-auto"
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/40 font-mono text-sm">
                  {activeIndex + 1} / {project.images.length}
                </div>
              </div>
            </motion.div>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
}
export function ProjectCardWrapper({
  project,

  index,

  children,
}: ProjectCardWrapperProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="cursor-pointer"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();

            setOpen(true);
          }
        }}
      >
        {children}
      </div>

      <ProjectDialog project={project} open={open} onOpenChange={setOpen} />
    </>
  );
}
