"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, ArrowUpRight, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/lib/constants/projects";

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
        className
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
          className
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

// Main Project Dialog Component
interface ProjectDialogProps {
  project: Project;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProjectDialog({
  project,
  open,
  onOpenChange,
}: ProjectDialogProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AppleDialogContent>
        {/* Scrollable Content Container */}
        <div className="overflow-y-auto max-h-[85vh] p-6 sm:p-8">
          {/* Close Button */}
          <DialogPrimitive.Close
            className={cn(
              "absolute top-4 right-4 z-10",
              "w-8 h-8 rounded-full flex items-center justify-center",
              "bg-muted/80 backdrop-blur-sm",
              "text-muted-foreground hover:text-foreground",
              "transition-all duration-200 hover:scale-105 hover:bg-muted",
              "focus:outline-none focus:ring-2 focus:ring-ring"
            )}
          >
            <X className="w-4 h-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>

          {/* Header Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-xs text-muted-foreground tracking-widest mb-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>
                {project.number} — {project.year}
                {project.endYear && ` — ${project.endYear}`}
              </span>
            </div>
            <DialogPrimitive.Title className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              {project.title}
            </DialogPrimitive.Title>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className={cn(
                    "px-3 py-1 text-xs tracking-wider",
                    "border border-border/70 rounded-full",
                    "bg-muted/30 backdrop-blur-sm",
                    "transition-all duration-200 hover:bg-muted/50"
                  )}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <DialogPrimitive.Description className="text-muted-foreground leading-relaxed mb-6">
            {project.longDescription || project.description}
          </DialogPrimitive.Description>

          {/* Architecture Section */}
          {project.architecture && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Architecture
              </h3>
              <div className="p-4 bg-muted/30 rounded-xl border border-border/50 backdrop-blur-sm">
                <code className="text-sm text-foreground/90 font-mono break-words">
                  {project.architecture}
                </code>
              </div>
            </div>
          )}

          {/* Graphs/Stats Section */}
          {project.graphs && project.graphs.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Statistics
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {project.graphs.map((stat) => (
                  <StatsPill
                    key={stat.label}
                    label={stat.label}
                    value={stat.value}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Images Section */}
          {project.images && project.images.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Gallery
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {project.images.map((image, index) => (
                  <div
                    key={index}
                    className="aspect-video rounded-xl overflow-hidden border border-border/50 bg-muted/30"
                  >
                    <img
                      src={image}
                      alt={`${project.title} screenshot ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
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
                className={cn(
                  "flex items-center justify-center gap-2 w-full",
                  "py-4 px-6 rounded-xl",
                  "bg-foreground text-background",
                  "font-medium text-sm tracking-wide",
                  "transition-all duration-300",
                  "hover:scale-[1.02] hover:shadow-lg",
                  "active:scale-[0.98]"
                )}
              >
                <span>Visit Project</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>
      </AppleDialogContent>
    </DialogPrimitive.Root>
  );
}

// Project Card Wrapper (Client Component that handles clicks)
interface ProjectCardWrapperProps {
  project: Project;
  index: number;
  children: React.ReactNode;
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
