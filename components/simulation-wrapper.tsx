"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Header } from "@/components/header";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";

export interface SimulationParameter {
  name: string;
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
}

export interface SimulationWrapperProps {
  title: string;
  description: string;
  category?: string;
  parameters: SimulationParameter[];
  accentColor?: "green" | "cyan" | "violet";
  renderSimulation: (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    params: Record<string, number>,
    deltaTime: number
  ) => void;
  onInit?: (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    params: Record<string, number>
  ) => void;
}

export function SimulationWrapper({
  title,
  description,
  category = "Physics",
  parameters,
  accentColor = "green",
  renderSimulation,
  onInit,
}: SimulationWrapperProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastTimeRef = useRef<number>(0);
  const animationRef = useRef<number>(0);
  const [controlsOpen, setControlsOpen] = useState(false);

  // Initialize parameter values from defaults
  const [paramValues, setParamValues] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    parameters.forEach((p) => {
      initial[p.name] = p.defaultValue;
    });
    return initial;
  });

  const updateParam = useCallback((name: string, value: number) => {
    setParamValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Responsive canvas size
    const updateSize = () => {
      const container = canvas.parentElement;
      if (container) {
        const size = Math.min(container.clientWidth - 20, 600);
        canvas.width = size;
        canvas.height = size;
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);

    // Call init if provided
    if (onInit) {
      onInit(ctx, canvas, paramValues);
    }

    const animate = (time: number) => {
      const deltaTime = lastTimeRef.current ? (time - lastTimeRef.current) / 1000 : 0.016;
      lastTimeRef.current = time;

      renderSimulation(ctx, canvas, paramValues, deltaTime);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", updateSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [paramValues, renderSimulation, onInit]);

  const colorClasses = {
    green: {
      text: "text-primary",
      border: "border-border",
      bg: "bg-primary/10",
      slider: "[&_[data-slot=slider-range]]:bg-primary [&_[data-slot=slider-thumb]]:border-primary",
      glow: "shadow-primary/10",
    },
    cyan: {
      text: "text-primary",
      border: "border-border",
      bg: "bg-primary/10",
      slider: "[&_[data-slot=slider-range]]:bg-primary [&_[data-slot=slider-thumb]]:border-primary",
      glow: "shadow-primary/10",
    },
    violet: {
      text: "text-primary",
      border: "border-border",
      bg: "bg-primary/10",
      slider: "[&_[data-slot=slider-range]]:bg-primary [&_[data-slot=slider-thumb]]:border-primary",
      glow: "shadow-primary/10",
    },
  };

  const colors = colorClasses[accentColor];

  return (
    <div className="flex flex-col min-h-screen bg-background font-mono">
      <Header />

      {/* Mobile: Stack layout, Desktop: Side-by-side */}
      <div className="flex flex-col lg:flex-row flex-1 pt-16">
        {/* SIMULATION CANVAS */}
        <div className={cn(
          "w-full lg:w-1/2 flex flex-col items-center justify-center",
          "lg:border-r border-border bg-background p-4",
          "min-h-[50vh] lg:min-h-0"
        )}>
          {/* Retro title badge */}
          <div className="flex items-center gap-3 mb-4">
            <span className={cn(
              "text-[10px] tracking-[0.3em] uppercase opacity-60",
              colors.text
            )}>
              {category}
            </span>
            <span className="text-muted-foreground text-xs">•</span>
            <span className={cn("text-[10px] opacity-60", colors.text)}>
              INTERACTIVE
            </span>
          </div>

          {/* Canvas with retro border */}
          <div className={cn(
            "relative border-2 border-dashed w-full max-w-[600px]",
            colors.border,
            "shadow-2xl",
            colors.glow
          )}>
            {/* Corner decorations */}
            <div className={cn("absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2", colors.border)} />
            <div className={cn("absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2", colors.border)} />
            <div className={cn("absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2", colors.border)} />
            <div className={cn("absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2", colors.border)} />
            
            <canvas
              ref={canvasRef}
              className="w-full aspect-square"
            />
          </div>
        </div>

        {/* CONTROLS PANEL */}
        <div className={cn(
          "w-full lg:w-1/2 bg-background",
          colors.text
        )}>
          {/* Mobile: Collapsible header */}
          <button
            onClick={() => setControlsOpen(!controlsOpen)}
            className={cn(
              "lg:hidden w-full flex items-center justify-between px-4 py-3",
              "border-y border-border bg-muted/20"
            )}
          >
            <span className="text-sm font-bold text-foreground">Controls & Info</span>
            {controlsOpen ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </button>

          {/* Content - always visible on desktop, collapsible on mobile */}
          <div className={cn(
            "overflow-y-auto p-4 lg:p-8",
            "lg:block",
            controlsOpen ? "block" : "hidden"
          )}>
            {/* Back link */}
            <Link
              href="/simulations"
              className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4 opacity-60 hover:opacity-100"
            >
              ← Back to simulations
            </Link>

            {/* Title section */}
            <div className="mb-6 pb-4 border-b border-border">
              <h1 className={cn("text-xl lg:text-2xl font-bold mb-2", colors.text)}>
                {title}
              </h1>
              <p className="text-muted-foreground text-xs lg:text-sm leading-relaxed">
                {description}
              </p>
            </div>

            {/* Controls panel */}
            <div className={cn(
              "border-2 border-dashed rounded-none p-4 lg:p-6",
              colors.border,
              "bg-background"
            )}>
              <h2 className={cn(
                "text-xs font-bold uppercase tracking-wider mb-4 pb-2 border-b",
                colors.text,
                colors.border
              )}>
                Tweak Parameters
              </h2>

              <div className="space-y-5">
                {parameters.map((param) => (
                  <div key={param.name} className="space-y-2">
                    <div className="flex items-center justify-between text-xs lg:text-sm">
                      <label className="text-foreground/80 font-medium">
                        {param.label}
                      </label>
                      <span className={cn(
                        "px-2 py-0.5 text-[10px] lg:text-xs font-mono",
                        colors.bg,
                        colors.text,
                        "border border-dashed",
                        colors.border
                      )}>
                        {paramValues[param.name]?.toFixed(
                          param.step < 1 ? Math.abs(Math.log10(param.step)) : 0
                        )}
                      </span>
                    </div>
                    
                    <Slider
                      value={[paramValues[param.name]]}
                      min={param.min}
                      max={param.max}
                      step={param.step}
                      onValueChange={(values) => updateParam(param.name, values[0])}
                      className={cn(
                        colors.slider,
                        "[&_[data-slot=slider-track]]:bg-muted/50"
                      )}
                    />
                    
                    <div className="flex justify-between text-[9px] lg:text-[10px] text-muted-foreground font-mono">
                      <span>{param.min}</span>
                      <span>{param.max}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reset Button */}
              <button
                onClick={() => {
                  const initial: Record<string, number> = {};
                  parameters.forEach((p) => {
                    initial[p.name] = p.defaultValue;
                  });
                  setParamValues(initial);
                }}
                className={cn(
                  "mt-6 w-full py-2 text-xs font-bold uppercase tracking-wider",
                  "border-2 border-dashed transition-all",
                  colors.border,
                  "hover:bg-muted/30 active:bg-muted/50",
                  "text-muted-foreground hover:text-foreground"
                )}
              >
                ↻ Reset Defaults
              </button>
            </div>

            {/* Decorative footer */}
            <div className="mt-6 pt-3 border-t border-border/30">
              <p className="text-[9px] lg:text-[10px] text-muted-foreground/50 font-mono">
                // Adjust sliders to modify parameters in real-time
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
