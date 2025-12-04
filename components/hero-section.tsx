"use client";

import { SITE_CONFIG } from "@/lib/constants/site";
import { TextReveal } from "./text-reveal";
import { useEffect, useState } from "react";

export function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth < 768) return;
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  return (
    <section
      className="min-h-[80vh] md:min-h-screen flex flex-col justify-center px-4 sm:px-6 md:px-12 lg:px-20 py-16 md:py-20 relative overflow-hidden"
      data-inspectable
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-gradient-to-r from-primary/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-1/4 w-[400px] h-[400px] bg-gradient-to-l from-muted/20 to-transparent rounded-full blur-3xl" />
      </div>


      <div className="space-y-0 leading-none hero-name relative z-10">
        <h1
          className="text-[18vw] sm:text-[15vw] md:text-[12vw] lg:text-[11vw] font-bold tracking-tighter text-foreground transition-transform duration-100 ease-out"
          style={{
            transform: isMobile
              ? undefined
              : `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
          }}
        >
          <TextReveal delay={100}>{SITE_CONFIG.firstName}</TextReveal>
        </h1>
        <h1
          className="text-[18vw] sm:text-[15vw] md:text-[12vw] lg:text-[11vw] font-bold tracking-tighter text-muted-foreground/40 ml-[2vw] sm:ml-[5vw] transition-transform duration-100 ease-out"
          style={{
            transform: isMobile
              ? undefined
              : `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px)`,
          }}
        >
          <TextReveal delay={300}>{SITE_CONFIG.lastName}</TextReveal>
        </h1>
      </div>

      <div className="mt-8 md:mt-12 max-w-xl relative z-10">
        <div className="flex items-center gap-3 md:gap-4 text-[10px] md:text-xs tracking-widest text-muted-foreground mb-3 md:mb-4 overflow-hidden">
          <span className="w-8 md:w-12 h-px bg-foreground animate-in slide-in-from-left duration-700" />
          <span className="animate-in fade-in slide-in-from-bottom duration-500 delay-500">
            {SITE_CONFIG.credentials}
          </span>
        </div>
        <p className="text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed animate-in fade-in slide-in-from-bottom duration-700 delay-700">
          {SITE_CONFIG.tagline}
        </p>
      </div>

      <div className="absolute right-20 top-1/2 -translate-y-1/2 hidden lg:block">
        <div className="w-px h-32 bg-foreground animate-in slide-in-from-top duration-1000 delay-300" />
      </div>
    </section>
  );
}
