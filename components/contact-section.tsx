import { SITE_CONFIG, SOCIAL_LINKS } from "@/lib/constants/site";
import { ArrowUpRight, Mail, Settings } from "lucide-react";
import { MagneticButton } from "./magnetic-button";
import { TextReveal } from "./text-reveal";

export function ContactSection() {
  const time = new Date().toLocaleTimeString("en-US", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return (
    <section
      className="px-4 sm:px-6 md:px-12 lg:px-20 py-16 md:py-32 relative"
      data-inspectable
    >
      {/* Large typography */}
      <div className="mb-10 md:mb-16">
        <h2 className="text-[12vw] sm:text-[10vw] md:text-[8vw] font-bold tracking-tighter leading-none section-title">
          <TextReveal>{"LET'S BUILD"}</TextReveal>
        </h2>
        <h2 className="text-[12vw] sm:text-[10vw] md:text-[8vw] font-bold tracking-tighter leading-none text-muted-foreground/20">
          <TextReveal delay={200}>THE FUTURE.</TextReveal>
        </h2>
      </div>

      {/* Contact info */}
      <div className="max-w-xl mb-8">
        <p className="text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed mb-6 md:mb-8">
          Currently open for new opportunities. Whether you have a question or
          just want to say hi, I'll try my best to get back to you!
        </p>

        <div className="flex flex-col sm:flex-row flex-wrap gap-3">
          <MagneticButton as="a" href={SOCIAL_LINKS.email} strength={0.2}>
            <div className="inline-flex items-center justify-center gap-2 md:gap-3 bg-foreground text-background px-4 md:px-6 py-3 md:py-4 rounded-full font-medium text-xs md:text-sm tracking-wide hover:scale-105 transition-transform duration-300 w-full sm:w-auto">
              <Mail className="w-4 h-4" />
              <span className="truncate">
                {SITE_CONFIG.email.toUpperCase()}
              </span>
            </div>
          </MagneticButton>
          <div className="flex gap-3">
            <MagneticButton
              as="a"
              href={SOCIAL_LINKS.linkedin}
              external
              strength={0.4}
            >
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-border flex items-center justify-center hover:bg-foreground hover:text-background hover:scale-110 hover:rotate-12 transition-all duration-300">
                <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5" />
              </div>
            </MagneticButton>
            <MagneticButton as="button" strength={0.4}>
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-border flex items-center justify-center hover:bg-foreground hover:text-background hover:scale-110 hover:-rotate-12 transition-all duration-300">
                <Settings className="w-4 h-4 md:w-5 md:h-5" />
              </div>
            </MagneticButton>
          </div>
        </div>
      </div>

      {/* Background text - hidden on small mobile */}
      <div className="absolute inset-0 flex items-end justify-center overflow-hidden pointer-events-none -z-10">
        <span className="text-[25vw] md:text-[20vw] font-bold tracking-tighter text-muted-foreground/5 whitespace-nowrap animate-pulse hidden sm:block">
          CREATING
        </span>
      </div>

      <div className="mt-12 md:mt-0 md:absolute md:right-6 lg:right-12 xl:right-20 md:bottom-20 text-left md:text-right">
        <div className="text-[10px] md:text-xs text-muted-foreground tracking-widest mb-1">
          LOCATION
        </div>
        <div className="font-semibold text-sm md:text-base mb-4">
          {SITE_CONFIG.location}
        </div>
        <div className="flex items-center gap-2 md:justify-end">
          <div className="w-px h-6 md:h-8 bg-foreground" />
          <div>
            <div className="text-[10px] md:text-xs text-muted-foreground tracking-widest mb-1">
              LOCAL TIME
            </div>
            <div className="font-semibold font-mono tabular-nums text-sm md:text-base">
              {time}
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-8 md:mt-0 md:absolute md:right-6 lg:right-12 xl:right-20 md:bottom-8 text-[10px] md:text-xs text-muted-foreground">
        {SITE_CONFIG.copyright}
      </div>
    </section>
  );
}
