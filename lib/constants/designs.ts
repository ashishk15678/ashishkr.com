export interface Design {
  id: string;
  slug: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  tags: string[];
  gradient: string;
  accentColor: "violet" | "cyan";
  features: string[];
  stats: { views: string; likes: string; saves: string };
  tools: string[];
  year: string;
  category: string;
  previewImage?: string;
}

export const DESIGNS: Design[] = [
  {
    id: "1",
    slug: "nebula-dashboard",
    number: "01",
    title: "Nebula Dashboard",
    subtitle: "Data Visualization Reimagined",
    description:
      "A dark-mode analytics dashboard featuring real-time data visualizations, glassmorphism panels, and fluid gradient animations. Built for enterprises that demand beauty and performance.",
    longDescription:
      "Nebula Dashboard represents the pinnacle of data visualization design. Every pixel has been carefully crafted to create an immersive analytics experience. The interface combines cutting-edge glassmorphism effects with fluid gradients that respond to user interactions. Real-time data flows through beautifully animated charts, while the dark mode theme reduces eye strain during extended use. Built with performance in mind, the dashboard handles thousands of data points without sacrificing frame rates.",
    tags: ["DASHBOARD", "DARK MODE", "ANALYTICS"],
    gradient: "from-violet-600/20 via-fuchsia-500/20 to-pink-500/20",
    accentColor: "violet",
    features: [
      "Real-time data sync",
      "Custom chart library",
      "Keyboard shortcuts",
      "Export to PDF/CSV",
    ],
    stats: { views: "24.5K", likes: "1.2K", saves: "340" },
    tools: ["Figma", "Framer", "After Effects"],
    year: "2024",
    category: "Dashboard Design",
    previewImage: "/template/dashboard.png",
  },
  {
    id: "2",
    slug: "aurora-landing",
    number: "02",
    title: "Aurora Landing",
    subtitle: "Where Light Meets Interface",
    description:
      "A premium SaaS landing page with animated aurora gradients, smooth scroll interactions, and micro-animations that captivate visitors. Designed to convert at first sight.",
    longDescription:
      "Aurora Landing pushes the boundaries of what a landing page can be. Inspired by the Northern Lights, the design features mesmerizing gradient animations that dance across the viewport. Every scroll triggers carefully choreographed animations that guide visitors through the narrative. The result is a landing page that doesn't just inform—it enchants. With mobile-first responsive design and A/B tested layouts, Aurora achieves conversion rates that exceed industry standards.",
    tags: ["LANDING PAGE", "SAAS", "ANIMATIONS"],
    gradient: "from-cyan-500/20 via-blue-500/20 to-indigo-500/20",
    accentColor: "cyan",
    features: [
      "60fps animations",
      "Mobile-first design",
      "A/B tested layouts",
      "SEO optimized",
    ],
    stats: { views: "18.2K", likes: "890", saves: "215" },
    tools: ["Figma", "Principle", "Webflow"],
    year: "2024",
    category: "Landing Page",
    previewImage: "/skull-image.png",
  },
];

export function getDesignBySlug(slug: string): Design | undefined {
  return DESIGNS.find((design) => design.slug === slug);
}

export function getAllDesignSlugs(): string[] {
  return DESIGNS.map((design) => design.slug);
}
