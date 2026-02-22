export interface Design {
  id: string;
  slug: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  tags: string[];
  theme: "obsidian" | "slate" | "lavender" | "lime" | "mono";
  features: string[];
  tools: string[];
  year: string;
  category: string;
  hasLiveDemo?: boolean;
}

export const DESIGNS: Design[] = [
  {
    id: "1",
    slug: "obsidian-dashboard",
    number: "01",
    title: "Obsidian Dashboard",
    subtitle: "Pure Monochrome Analytics",
    description:
      "A razor-sharp analytics dashboard built entirely in black and white. No color distractions — just data, structure, and clarity.",
    longDescription:
      "Obsidian Dashboard strips away every unnecessary visual element to let data speak for itself. The stark black-and-white palette creates an arresting visual hierarchy where every metric, chart, and data point commands attention. Inspired by brutalist design principles and high-contrast editorial layouts, this dashboard proves that restraint is the ultimate form of sophistication.",
    tags: ["DASHBOARD", "MONOCHROME", "ANALYTICS"],
    theme: "obsidian",
    features: [
      "High-contrast data cards",
      "Pure B&W bar charts",
      "Minimal navigation strip",
      "Real-time metric updates",
    ],
    tools: ["React", "Tailwind CSS", "Recharts"],
    year: "2025",
    category: "Dashboard",
    hasLiveDemo: true,
  },
  {
    id: "2",
    slug: "slate-crm",
    number: "02",
    title: "Slate CRM",
    subtitle: "Enterprise Relationship Manager",
    description:
      "A warm-gray enterprise CRM interface with clean data tables, pipeline views, and subtle zinc tones that feel both professional and approachable.",
    longDescription:
      "Slate CRM embodies the quiet confidence of enterprise software done right. The carefully calibrated gray palette — from zinc-100 backgrounds to zinc-700 text — creates an environment where users can focus for hours without fatigue. Every interaction surface is deliberately understate, letting the data relationships become the visual story.",
    tags: ["CRM", "ENTERPRISE", "NEUTRAL"],
    theme: "slate",
    features: [
      "Contact pipeline view",
      "Sortable data tables",
      "Activity timeline",
      "Quick-action toolbar",
    ],
    tools: ["React", "Tailwind CSS", "Lucide Icons"],
    year: "2025",
    category: "CRM Application",
    hasLiveDemo: true,
  },
  {
    id: "3",
    slug: "iris-auth",
    number: "03",
    title: "Iris Auth",
    subtitle: "Clerk-Inspired Authentication",
    description:
      "A refined authentication portal with soft lavender gradients, frosted glass cards, and elegant form fields — directly inspired by Clerk.com's aesthetic.",
    longDescription:
      "Iris Auth captures the essence of modern authentication design pioneered by platforms like Clerk. The lavender and violet palette creates a sense of trust and calm, while frosted glass effects and precise micro-interactions elevate every touchpoint. Social login buttons, OTP inputs, and form validation states are all designed to feel delightful rather than transactional.",
    tags: ["AUTH", "LAVENDER", "CLERK-STYLE"],
    theme: "lavender",
    features: [
      "Frosted glass sign-in card",
      "Social OAuth buttons",
      "OTP code input",
      "Animated transitions",
    ],
    tools: ["React", "Tailwind CSS", "Framer Motion"],
    year: "2025",
    category: "Authentication",
    hasLiveDemo: true,
  },
  {
    id: "4",
    slug: "volt-landing",
    number: "04",
    title: "Volt Landing",
    subtitle: "Developer-First Product Page",
    description:
      "An electrifying landing page with neon lime accents on dark surfaces. Terminal-inspired code blocks and developer-centric copy that commands attention.",
    longDescription:
      "Volt Landing speaks the language of developers. The electric lime-green accents (#a3e635) against deep black surfaces create an aesthetic reminiscent of terminal windows and IDE themes. Code blocks are first-class citizens, feature grids use monospace typography, and every CTA feels like running a command. Built for tools that developers actually want to use.",
    tags: ["LANDING", "DEVELOPER", "NEON"],
    theme: "lime",
    features: [
      "Terminal code blocks",
      "Monospace typography",
      "Feature grid with icons",
      "CLI-style CTAs",
    ],
    tools: ["React", "Tailwind CSS", "Geist Mono"],
    year: "2025",
    category: "Landing Page",
    hasLiveDemo: true,
  },
  {
    id: "5",
    slug: "mono-saas",
    number: "05",
    title: "Mono SaaS",
    subtitle: "Shadcn-Style Product Suite",
    description:
      "A complete SaaS product page in pure black-on-white. Precise spacing, zero color, maximum clarity — the shadcn/ui philosophy taken to its logical conclusion.",
    longDescription:
      "Mono SaaS is an exercise in radical simplicity. Every pixel of whitespace is intentional, every border serves a purpose, and color is entirely absent. The result is a design that feels both timeless and thoroughly modern — a blank canvas where content becomes the only visual element. Navigation, hero sections, pricing tables, and feature grids all exist in perfect monochrome harmony.",
    tags: ["SAAS", "MINIMAL", "SHADCN-STYLE"],
    theme: "mono",
    features: [
      "Clean navigation bar",
      "Typographic hero section",
      "Pricing comparison table",
      "Feature showcase grid",
    ],
    tools: ["React", "Tailwind CSS", "shadcn/ui"],
    year: "2025",
    category: "SaaS Landing",
    hasLiveDemo: true,
  },
];

export function getDesignBySlug(slug: string): Design | undefined {
  return DESIGNS.find((design) => design.slug === slug);
}

export function getAllDesignSlugs(): string[] {
  return DESIGNS.map((design) => design.slug);
}
