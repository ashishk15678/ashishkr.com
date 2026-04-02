import {
  AppleDashboard,
  ClerkDashboard,
  CyberpunkMapLanding,
  TerminalDashboard,
} from "@/components/dashboards";
import type { ComponentType } from "react";

export interface Design {
  id: string;
  slug: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  tags: string[];
  theme: "clerk" | "apple" | "terminal";
  features: string[];
  tools: string[];
  year: string;
  category: string;
  component: ComponentType;
}

export const DESIGNS: Design[] = [
  {
    id: "1",
    slug: "clerk-dashboard",
    number: "01",
    title: "Clerk Dashboard",
    subtitle: "Minimal Auth Management Console",
    description:
      "A clean, soft-toned dashboard inspired by Clerk's design language — frosted glass sidebar, violet accents, generous whitespace, and warm neutrals that make data feel approachable.",
    longDescription:
      "This dashboard takes direct inspiration from Clerk's exceptional product design. The soft neutral background (#F9F9F8) creates a warm canvas, while the frosted-glass sidebar with backdrop-blur adds depth without heaviness. Violet accent colors tie into the authentication theme — sign-in activity, API key management, session monitoring — all presented through rounded-2xl cards with subtle 1px borders. Sparkline micro-charts, status pills with animated ping indicators, stacked avatars, and a real-time event log give the interface a living, breathing quality. Every pixel of whitespace is intentional, creating a dashboard you could stare at for hours without fatigue.",
    tags: ["DASHBOARD", "MINIMAL", "AUTH", "CLERK-STYLE"],
    theme: "clerk",
    features: [
      "Frosted glass sidebar with org switcher",
      "Sparkline micro-charts on stat cards",
      "Real-time sign-in feed with avatar stack",
      "Auth method breakdown with progress bars",
      "Animated live-status indicators",
      "Event log with color-coded severity",
    ],
    tools: ["React", "Tailwind CSS", "Lucide Icons", "CSS Backdrop Blur"],
    year: "2025",
    category: "Dashboard",
    component: ClerkDashboard,
  },
  {
    id: "2",
    slug: "apple-dashboard",
    number: "02",
    title: "Apple Dashboard",
    subtitle: "Cupertino-Inspired Commerce Analytics",
    description:
      "An analytics dashboard channeling Apple's design philosophy — translucent layers, SF-inspired typography, smooth gradient cards, ring progress charts, and the unmistakable Cupertino attention to detail.",
    longDescription:
      "Every element in this dashboard pays homage to Apple's design system. The #F5F5F7 background is the exact shade Apple uses across their web properties. Cards float with rounded-2xl corners and subtle zinc-200/60 borders that almost disappear. Stat cards feature gradient accent bars and icon badges with colored shadows — blue for revenue, emerald for orders, pink for customers, amber for ratings. The revenue area chart uses smooth cubic bezier curves with a gradient fill that fades to transparent. Device breakdown shows ring progress indicators for iPhone, Mac, iPad, and Vision Pro. A weather widget in the sidebar adds that quintessential Apple touch. The orders table uses status pills (shipped/processing/delivered) with appropriately tinted backgrounds. Typography uses -0.02em tracking throughout, giving text that compressed, premium SF Pro feel.",
    tags: ["DASHBOARD", "APPLE", "ANALYTICS", "COMMERCE"],
    theme: "apple",
    features: [
      "Translucent sidebar with weather widget",
      "Smooth cubic bezier area chart",
      "Ring progress indicators per device",
      "Gradient stat cards with colored shadows",
      "Orders table with status pills",
      "Insight cards with gradient icon badges",
    ],
    tools: ["React", "Tailwind CSS", "SVG Charts", "CSS Gradients"],
    year: "2025",
    category: "Dashboard",
    component: AppleDashboard,
  },
  {
    id: "3",
    slug: "terminal-dashboard",
    number: "03",
    title: "Terminal Ops",
    subtitle: "Bloomberg-Grade Infrastructure Monitor",
    description:
      "A dense, data-saturated infrastructure dashboard built for ops engineers — stock ticker strip, CPU heatmaps, cluster node tables, live event streams, and latency percentile breakdowns on a pure dark canvas.",
    longDescription:
      "Inspired by Bloomberg terminals and mission-critical ops consoles, this dashboard maximizes information density without sacrificing readability. The #0C0C0E base with 1px zinc-800 borders creates a grid of data panels that feel like looking into a spacecraft cockpit. A live ticker strip scrolls market data across the top. System health metrics show CPU, memory, disk I/O, network, latency, and error rates with color-coded threshold bars (green → amber → red). The throughput chart renders 40 data points as a mini bar chart with the last 5 highlighted in bright emerald. Cluster nodes display in a dense table with inline metric bars for CPU and memory utilization. An event stream panel shows real-time logs with color-coded severity levels (INFO/WARN/ERR). A CPU heatmap grid uses 32 cells with intensity-mapped colors. The bottom status bar shows TLS status, database latency, Redis response time, CDN PoP count, and WebSocket connection state. A real ticking clock in the top bar completes the live-monitoring feel.",
    tags: ["DASHBOARD", "TERMINAL", "OPS", "INFRASTRUCTURE"],
    theme: "terminal",
    features: [
      "Live stock ticker strip with price changes",
      "CPU heatmap grid with intensity mapping",
      "Cluster node table with inline metric bars",
      "Real-time event stream with severity levels",
      "Latency percentile breakdown (p50–p99)",
      "Deploy history with environment badges",
      "Bottom status bar with system vitals",
      "Ticking UTC clock for live feel",
    ],
    tools: ["React", "Tailwind CSS", "SVG Sparklines", "Monospace Typography"],
    year: "2025",
    category: "Dashboard",
    component: TerminalDashboard,
  },
  {
    id: "4",
    slug: "cyberpunk-map-landing",
    number: "04",
    title: "CyberMap Landing",
    subtitle: "Neon Map App HUD (Cyberpunk)",
    description:
      "A cyberpunk-themed landing page for a map app — neon HUD, vector routes, POI beacons, hazard overlays, and a traffic-light totem with loud, saturated color.",
    longDescription:
      'This design embraces a Cyberpunk 2077-inspired aesthetic: scanlines, noise, glowing gradients, holographic sweeps, and hard-edged monospace microcopy. The hero is a map-as-HUD panel with vector routes, POI beacons, hazard zones, and live telemetry. A secondary "traffic node" totem showcases traffic lights and street symbols to reinforce the navigation theme. The result is a high-contrast, color-rich landing module that feels like a chrome-and-neon interface for routing through a sleepless city.',
    tags: ["LANDING", "CYBERPUNK", "MAP", "NEON", "HUD"],
    theme: "terminal",
    features: [
      "Neon HUD hero with scanlines + noise overlay",
      "Vector map routes with gradient glow styling",
      "Traffic light totem + street symbol widgets",
      "POI beacons and hazard overlay markers",
      "Live feed panel with status pings",
      "Vibrant multi-color cyberpunk palette",
    ],
    tools: ["React", "Tailwind CSS", "Lucide Icons", "Inline SVG"],
    year: "2025",
    category: "Landing Page",
    component: CyberpunkMapLanding,
  },
];

export function getDesignBySlug(slug: string): Design | undefined {
  return DESIGNS.find((design) => design.slug === slug);
}

export function getAllDesignSlugs(): string[] {
  return DESIGNS.map((design) => design.slug);
}
