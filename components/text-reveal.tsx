"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface TextRevealProps {
  children: string;
  className?: string;
  delay?: number;
  stagger?: number;
}

export function TextReveal({
  children,
  className,
  delay = 0,
  stagger = 0.03,
}: TextRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  const letters = children.split("");

  return (
    <span ref={ref} className={cn(" flex gap-x-2", className)}>
      {letters.map((letter, i) => (
        <span
          key={i}
          className={cn(
            "inline-block transition-all duration-500 ease-out",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
          style={{
            transitionDelay: isVisible ? `${i * stagger}s` : "0s",
          }}
        >
          {letter === "" || letter}
        </span>
      ))}
    </span>
  );
}
