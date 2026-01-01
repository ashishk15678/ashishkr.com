import { SITE_CONFIG } from "@/lib/constants/site";
import { TextReveal } from "./text-reveal";
import Image from "next/image";
import { Bitcount } from "next/font/google";
import Link from "next/link";

const bitcount = Bitcount({
  subsets: ["latin"],
  weight: ["100", "400", "900"], // Choose specific weights or a range
  variable: "--font-bitcount", // Define a CSS variable name
});

export function HeroSection() {
  return (
    <section
      className="min-h-[80vh] md:min-h-screen flex flex-col justify-center px-4 sm:px-6 md:px-12 lg:px-20 py-16 md:py-20 relative overflow-hidden"
      data-inspectable
    >
      <div
        className="space-y-0 leading-none hero-name relative z-10 group"
        id="header-name"
      >
        <div className="md:text-4xl text-primary/50 text-md font-bold">
          <Link
            href={"https://github.com/ashishk15678"}
            target="_blank"
            prefetch
          >
            <button>
              <Image
                src="https://avatars.githubusercontent.com/u/147980956?v=4"
                className="rounded-full border-border border-2 mr-4 cursor-pointer translate-y-1 group-hover:-translate-y-1 transition-all"
                width={35}
                height={35}
                alt="Github pfp"
              />
            </button>
          </Link>
          Hello , I am
        </div>
        <h1
          className={
            "text-[18vw] sm:text-[15vw] md:text-[12vw] lg:text-[11vw] tracking-tighter text-foreground transition-transform duration-100 ease-out"
          }
        >
          <TextReveal className={bitcount.className} delay={100}>
            {SITE_CONFIG.firstName}
          </TextReveal>
        </h1>
        <h1 className="text-[18vw] sm:text-[15vw] md:text-[12vw] lg:text-[11vw]  tracking-wider text-primary/50  ml-[2vw] sm:ml-[5vw] transition-transform duration-100 ease-out">
          <TextReveal delay={300} className={bitcount.className}>
            {SITE_CONFIG.lastName}
          </TextReveal>
        </h1>
      </div>

      <div className="mt-8 md:mt-12 relative z-10">
        <div className="flex items-center gap-3 md:gap-4 text-[10px] md:text-xs tracking-widest text-muted-foreground mb-3 md:mb-4 overflow-hidden  ">
          <span className="">Greetings from a {SITE_CONFIG.credentials}</span>
        </div>
        <p className="text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-md">
          {SITE_CONFIG.tagline}
        </p>
      </div>
      {/*<Image
        alt=""
        src={"https://avatars.githubusercontent.com/u/147980956?v=4"}
        className="aspect-square flex-1 max-w-sm shrink-0"
        height={50}
        width={50}
      />*/}
    </section>
  );
}
