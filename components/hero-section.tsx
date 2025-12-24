import { SITE_CONFIG } from "@/lib/constants/site";
import { TextReveal } from "./text-reveal";

export function HeroSection() {
  return (
    <section
      className="min-h-[80vh] md:min-h-screen flex flex-col justify-center px-4 sm:px-6 md:px-12 lg:px-20 py-16 md:py-20 relative overflow-hidden"
      data-inspectable
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-gradient-to-r from-primary/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-1/4 w-[400px] h-[400px] bg-gradient-to-l from-muted/20 to-transparent rounded-full blur-3xl" />
      </div>

      <div
        className="space-y-0 leading-none hero-name relative z-10"
        id="header-name"
      >
        <h1 className="text-[18vw] sm:text-[15vw] md:text-[12vw] lg:text-[11vw] font-bold tracking-tighter text-foreground transition-transform duration-100 ease-out">
          <TextReveal delay={100}>{SITE_CONFIG.firstName}</TextReveal>
        </h1>
        <h1 className="text-[18vw] sm:text-[15vw] md:text-[12vw] lg:text-[11vw] font-bold tracking-tighter text-primary  ml-[2vw] sm:ml-[5vw] transition-transform duration-100 ease-out">
          <TextReveal delay={300}>{SITE_CONFIG.lastName}</TextReveal>
        </h1>
      </div>

      <div className="mt-8 md:mt-12 relative z-10">
        <div className="flex items-center gap-3 md:gap-4 text-[10px] md:text-xs tracking-widest text-muted-foreground mb-3 md:mb-4 overflow-hidden  ">
          <span className="">{SITE_CONFIG.credentials}</span>
        </div>
        <p className="text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed ">
          {SITE_CONFIG.tagline}
        </p>
      </div>
    </section>
  );
}
