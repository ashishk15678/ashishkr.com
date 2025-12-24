"use client";
import React, { useState, useRef, useEffect } from "react";
import { MapIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BackgroundHidden() {
  return (
    <div className="absolute top-40 w-full flex justify-end">
      <div className="max-w-7xl w-full px-8">
        <div className="flex flex-col gap-4 group">
          {Array.from({ length: 6 }, (_, i) => (
            <div className="flex flex-row gap-4 ">
              {Array.from({ length: 8 }, (_, i) => (
                <GlowCard
                  key={i}
                  className="opacity-20 group-hover:opacity-40  transition-opacity duration-500"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const GlowCard = ({ className }: { className?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [intensity, setIntensity] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distance = Math.sqrt(
        Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2),
      );

      const maxDistance = 100;
      const minDistance = 20;

      if (distance < maxDistance) {
        // Map distance to a value between 0 and 1
        const newIntensity = Math.max(
          0,
          1 - (distance - minDistance) / (maxDistance - minDistance),
        );
        setIntensity(Math.min(newIntensity, 1));
      } else {
        setIntensity(0);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-20 h-20 bg-zinc-950 flex items-center justify-center transition-colors duration-300",
        className,
      )}
      style={{
        outline: `1px solid rgba(161, 161, 170, ${0.2 + intensity * 0.8})`,
        boxShadow:
          intensity > 0
            ? `0 0 ${intensity * 20}px rgba(255, 255, 255, ${intensity * 0.3})`
            : "none",
      }}
    >
      <MapIcon
        className="transition-colors duration-300"
        style={{ color: intensity > 0.5 ? "white" : "#52525b" }}
      />

      {/* Optional: Inner radial gradient for a "soft" glow look */}
      {/*<div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, rgba(255,255,255,${intensity * 0.15}) 0%, transparent 70%)`,
        }}
      />*/}
    </div>
  );
};

export { GlowCard };
