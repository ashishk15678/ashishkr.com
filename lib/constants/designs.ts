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
  hasLiveDemo?: boolean;
}

export const DESIGNS: Design[] = [
  {
    id: "1",
    slug: "nebula-dashboard",
    number: "01",
    title: "Nebula Dashboard",
    subtitle: "Data Visualization Reimagined",
    description:
      "A dark-mode analytics dashboard featuring real-time data visualizations, glassmorphism panels, and fluid gradient animations.",
    longDescription:
      "Nebula Dashboard represents the pinnacle of data visualization design. Every pixel has been carefully crafted to create an immersive analytics experience. The interface combines cutting-edge glassmorphism effects with fluid gradients that respond to user interactions.",
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
    tools: ["React", "Tailwind", "Recharts"],
    year: "2024",
    category: "Dashboard",
    hasLiveDemo: true,
  },
  {
    id: "2",
    slug: "aurora-hero",
    number: "02",
    title: "Aurora Hero",
    subtitle: "Where Light Meets Interface",
    description:
      "A premium hero section with animated aurora gradients, smooth transitions, and call-to-action buttons that captivate visitors.",
    longDescription:
      "Aurora Hero pushes the boundaries of what a hero section can be. Inspired by the Northern Lights, the design features mesmerizing gradient animations that dance across the viewport.",
    tags: ["HERO", "SAAS", "ANIMATIONS"],
    gradient: "from-cyan-500/20 via-blue-500/20 to-indigo-500/20",
    accentColor: "cyan",
    features: [
      "60fps animations",
      "Mobile-first design",
      "A/B tested layouts",
      "SEO optimized",
    ],
    stats: { views: "18.2K", likes: "890", saves: "215" },
    tools: ["React", "Tailwind", "Framer Motion"],
    year: "2024",
    category: "Hero Section",
    hasLiveDemo: true,
  },
  {
    id: "3",
    slug: "minimal-dashboard",
    number: "03",
    title: "Minimal Dashboard",
    subtitle: "Clean & Functional",
    description:
      "A minimalist dashboard design with clear hierarchy, subtle shadows, and focus on data readability.",
    longDescription:
      "Minimal Dashboard proves that less is more. Every element serves a purpose, with carefully calibrated whitespace and typography that guides the eye to important metrics.",
    tags: ["DASHBOARD", "MINIMAL", "CLEAN"],
    gradient: "from-slate-500/20 via-zinc-500/20 to-neutral-500/20",
    accentColor: "violet",
    features: [
      "Responsive grid layout",
      "Dark/Light modes",
      "Quick actions bar",
      "Widget customization",
    ],
    stats: { views: "15.8K", likes: "720", saves: "180" },
    tools: ["React", "Tailwind", "Chart.js"],
    year: "2024",
    category: "Dashboard",
    hasLiveDemo: true,
  },
  {
    id: "4",
    slug: "gradient-landing",
    number: "04",
    title: "Gradient Landing",
    subtitle: "Bold & Vibrant",
    description:
      "A striking landing page with layered gradients, floating elements, and smooth scroll animations.",
    longDescription:
      "Gradient Landing makes an unforgettable first impression. The bold color palette and dynamic animations create an experience that converts visitors into customers.",
    tags: ["LANDING PAGE", "GRADIENTS", "CONVERSION"],
    gradient: "from-rose-500/20 via-orange-500/20 to-amber-500/20",
    accentColor: "cyan",
    features: [
      "Scroll-triggered animations",
      "Parallax effects",
      "Mobile optimization",
      "Fast loading",
    ],
    stats: { views: "21.3K", likes: "1.5K", saves: "290" },
    tools: ["React", "Tailwind", "GSAP"],
    year: "2024",
    category: "Landing Page",
    hasLiveDemo: true,
  },
  {
    id: "5",
    slug: "feature-hero",
    number: "05",
    title: "Feature Hero",
    subtitle: "Product Showcase",
    description:
      "A feature-rich hero section designed to showcase product features with icons, descriptions, and visual hierarchy.",
    longDescription:
      "Feature Hero is perfect for SaaS products that need to communicate value quickly. The structured layout guides visitors through key features while maintaining visual appeal.",
    tags: ["HERO", "FEATURES", "SAAS"],
    gradient: "from-emerald-500/20 via-teal-500/20 to-cyan-500/20",
    accentColor: "cyan",
    features: [
      "Feature grid layout",
      "Icon integration",
      "Responsive design",
      "CTA optimization",
    ],
    stats: { views: "12.4K", likes: "680", saves: "160" },
    tools: ["React", "Tailwind", "Lucide Icons"],
    year: "2024",
    category: "Hero Section",
    hasLiveDemo: true,
  },
  {
    id: "6",
    slug: "saas-landing",
    number: "06",
    title: "SaaS Landing",
    subtitle: "Complete Page Template",
    description:
      "A comprehensive SaaS landing page with header, hero, features, pricing, testimonials, and footer sections.",
    longDescription:
      "SaaS Landing is a complete page solution for startups and established companies alike. Every section is optimized for conversion while maintaining brand consistency.",
    tags: ["LANDING PAGE", "SAAS", "COMPLETE"],
    gradient: "from-purple-500/20 via-violet-500/20 to-indigo-500/20",
    accentColor: "violet",
    features: [
      "Complete page layout",
      "Pricing tables",
      "Testimonial carousel",
      "Newsletter signup",
    ],
    stats: { views: "28.7K", likes: "1.8K", saves: "420" },
    tools: ["React", "Tailwind", "Framer Motion"],
    year: "2024",
    category: "Landing Page",
    hasLiveDemo: true,
  },
];

export function getDesignBySlug(slug: string): Design | undefined {
  return DESIGNS.find((design) => design.slug === slug);
}

export function getAllDesignSlugs(): string[] {
  return DESIGNS.map((design) => design.slug);
}
