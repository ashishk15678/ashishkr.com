import { SITE_CONFIG } from "@/lib/constants/site";
import { TextReveal } from "./text-reveal";
import Image from "next/image";
import { Bitcount } from "next/font/google";
import Link from "next/link";

const bitcount = Bitcount({
  subsets: ["latin"],
  weight: ["100", "400", "900"],
  variable: "--font-bitcount",
});

export function HeroSection() {
  return (
    <section className="flex flex-col lg:flex-row justify-between min-h-screen items-center px-4 sm:px-6 md:px-12 lg:px-20 py-20 group">
      {/* Text Content Container */}
      <div
        className="flex-1 flex flex-col justify-center w-full"
        data-inspectable
      >
        <div className="space-y-0 leading-none hero-name " id="header-name">
          <div className="md:text-4xl text-primary/50 text-md font-bold flex items-center mb-10">
            <Link
              href={"https://github.com/ashishk15678"}
              target="_blank"
              prefetch
            >
              <div className="cursor-pointer translate-y-1 group-hover:-translate-y-1 transition-all flex flex-col items-center">
                {/* The Arched Text */}
                <div className="-mb-6 z-10">
                  {" "}
                  {/* Negative margin pulls it closer to the image */}
                  <svg
                    width="60"
                    height="25"
                    viewBox="0 0 100 40"
                    className="overflow-visible"
                  >
                    <path
                      id="curve"
                      fill="transparent"
                      d="M 10,40 A 40,40 0 0,1 90,40"
                    />
                    <text className="text-sm text-black fill-primary font-bold tracking-[0.2em]  uppercase">
                      <textPath
                        xlinkHref="#curve"
                        startOffset="50%"
                        textAnchor="middle"
                      >
                        GITHUB
                      </textPath>
                    </text>
                  </svg>
                </div>

                {/* The Profile Picture */}
                <div className="relative w-[35px] h-[35px] shadow-sm shadow-black dark:shadow-white rounded-full overflow-hidden border-2 border-border">
                  <Image
                    src="https://avatars.githubusercontent.com/u/147980956?v=4"
                    fill
                    alt="Github pfp"
                    className="object-cover"
                  />
                </div>
              </div>
            </Link>
            Hello, I am
          </div>

          <h1 className="text-[18vw] sm:text-[15vw] md:text-[12vw] lg:text-[8vw] tracking-tighter text-foreground transition-transform duration-100 ease-out mt-12">
            <TextReveal className={bitcount.className} delay={100}>
              {SITE_CONFIG.firstName}
            </TextReveal>
          </h1>

          <h1 className="text-[18vw] sm:text-[15vw] md:text-[12vw] lg:text-[8vw] tracking-wider text-primary/50 ml-[2vw] sm:ml-[5vw] transition-transform duration-100 ease-out">
            <TextReveal delay={300} className={bitcount.className}>
              {SITE_CONFIG.lastName}
            </TextReveal>
          </h1>
        </div>

        <div className="mt-8 md:mt-12">
          <div className="flex items-center gap-3 md:gap-4 text-[10px] md:text-xs tracking-widest text-muted-foreground mb-3 md:mb-4">
            <span>Greetings from a {SITE_CONFIG.credentials}</span>
          </div>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-md">
            {SITE_CONFIG.tagline}
          </p>
        </div>
      </div>

      {/* Large Hero Image Container */}
      <div className="flex-1 w-full mt-12 lg:mt-0 flex justify-center lg:justify-end">
        <div className="relative w-full aspect-square max-w-[500px] sm:max-w-[400px] lg:max-w-[900px] ">
          <Image
            alt="Profile Portrait"
            src={"/aizen-image.png"}
            fill
            priority
            className="
            rounded-bl-[14rem] bg-secondary rounded-tr-[14rem] border border-border
           object-cover grayscale group-hover:grayscale-0 transition-all duration-500 "
          />
        </div>
      </div>
    </section>
  );
}
