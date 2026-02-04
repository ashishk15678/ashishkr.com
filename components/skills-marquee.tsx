"use client";

import { SKILLS } from "@/lib/constants/skills";
import { useState } from "react";

export function SkillsMarquee() {
  const duplicatedSkills = [...SKILLS, ...SKILLS];
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div
      className="border-y border-border py-3 md:py-4 overflow-hidden bg-background"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className={`flex whitespace-nowrap animate-marquee`}
        style={{ animationPlayState: isPaused ? "paused" : "running" }}
      >
        {duplicatedSkills.map((skill, index) => (
          <span
            key={index}
            className="mx-4 md:mx-8 text-[10px] md:text-sm tracking-widest text-secondary-foreground font-mono flex items-center gap-2 md:gap-4 transition-all duration-300 hover:text-foreground  cursor-default"
          >
            {skill}
            <span className="text-muted-foreground/50 transition-transform duration-300 hover:rotate-180">
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
