import { HeroSection } from "@/components/hero-section";
import { SkillsMarquee } from "@/components/skills-marquee";
import { ProjectsSection } from "@/components/projects-section";
import { RecognitionSection } from "@/components/recognition-section";
import { ContactSection } from "@/components/contact-section";
import { Header } from "@/components/header";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />
      <HeroSection />
      <SkillsMarquee />
      <ProjectsSection />
      <RecognitionSection />
      <ContactSection />
    </main>
  );
}
