"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { Header } from "@/components/header";
import {
  ArrowLeft,
  ArrowUpRight,
  Code2,
  Eye,
  Copy,
  Check,
  Layers,
  Sparkles,
  ExternalLink,
  Search,
  X,
  ChevronRight,
  Star,
  Download,
  BookOpen,
  Zap,
  CreditCard,
  Palette,
  FolderOpen,
  Bell,
  Settings,
  BarChart3,
  Users,
  Calendar,
  FileText,
  Activity,
  Terminal,
  Globe,
  Command,
  DollarSign,
  Layout,
  Table2,
  Plug,
  Keyboard as KeyboardIcon,
  Bot,
  LayoutGrid,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// ── Lazy component imports ──
import { WalletCard } from "@/components/showcase/wallet-card";
import { GradientInspirationCard } from "@/components/showcase/gradient-inspiration-card";
import { DesktopFolders } from "@/components/showcase/desktop-folders";
import { SignUpFormCard } from "@/components/showcase/signup-form-card";
import { TrackProgressCard } from "@/components/showcase/track-progress-card";
import { NotificationsCard } from "@/components/showcase/notifications-card";
import { PricingCard } from "@/components/showcase/pricing-card";
import { AnalyticsCard } from "@/components/showcase/analytics-card";
import { CommandPaletteCard } from "@/components/showcase/command-palette-card";
import { SettingsCard } from "@/components/showcase/settings-card";
import { ActivityFeedCard } from "@/components/showcase/activity-feed-card";
import { UserTableCard } from "@/components/showcase/user-table-card";
import { CalendarCard } from "@/components/showcase/calendar-card";
import { IntegrationCard } from "@/components/showcase/integration-card";
import { MetricsCard } from "@/components/showcase/metrics-card";
import { BlogCard } from "@/components/showcase/blog-card";
import { Keyboard, MacKeyboard } from "@/components/showcase/keyboard";
import { AIToolsCard } from "@/components/showcase/ai-tools-card";
import { DevBentoCard } from "@/components/showcase/dev-bento-card";
import ShaderMenu from "@/components/showcase/shader-menu";

// ═══════════════════════════════════════════════════════
// COMPONENT REGISTRY
// ═══════════════════════════════════════════════════════

type CategoryKey =
  | "featured"
  | "cards"
  | "forms"
  | "data-display"
  | "navigation"
  | "feedback"
  | "marketing"
  | "creative"
  | "interactive";

interface ComponentEntry {
  id: string;
  name: string;
  description: string;
  category: CategoryKey;
  tags: string[];
  icon: React.ElementType;
  credit?: {
    name: string;
    url: string;
  };
  previewBg?: string;
  component: React.ReactNode;
  code: string;
  usage: string;
  deps?: string[];
}

const CATEGORIES: {
  key: CategoryKey;
  label: string;
  icon: React.ElementType;
  count?: number;
}[] = [
  { key: "featured", label: "Featured", icon: Star },
  { key: "cards", label: "Cards", icon: Layout },
  { key: "forms", label: "Forms", icon: FileText },
  { key: "data-display", label: "Data Display", icon: BarChart3 },
  { key: "navigation", label: "Navigation", icon: Command },
  { key: "feedback", label: "Feedback", icon: Bell },
  { key: "marketing", label: "Marketing", icon: DollarSign },
  { key: "creative", label: "Creative", icon: Palette },
  { key: "interactive", label: "Interactive", icon: Zap },
];

const REGISTRY: ComponentEntry[] = [
  // ── Featured / Creative (from images) ──
  {
    id: "wallet-card",
    name: "Wallet Card",
    description:
      "3D wallet with animated credit cards and balance display. Perfect for fintech dashboards.",
    category: "creative",
    tags: ["finance", "3d", "animated", "wallet"],
    icon: CreditCard,
    credit: {
      name: "@zzzzshawn",
      url: "https://x.com/zzzzshawn/status/2030256382910591386?s=20",
    },
    previewBg: "bg-[#4a5548]",
    component: <WalletCard balance="$250,000" label="TOTAL BALANCE" />,
    deps: ["framer-motion"],
    code: `"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface WalletCardProps {
  balance?: string;
  label?: string;
  className?: string;
}

export function WalletCard({
  balance = "$250,000",
  label = "TOTAL BALANCE",
  className,
}: WalletCardProps) {
  return (
    <div className={cn("relative flex items-center justify-center p-10", className)}>
      <div className="absolute inset-0 bg-[#4a5548] rounded-2xl" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center"
      >
        <div className="relative w-[260px] h-[180px]">
          <div className="absolute inset-0 bg-gradient-to-b from-[#3a3d3a] to-[#2a2d2a] rounded-2xl shadow-2xl border border-white/5" />
          <div className="absolute -top-1 left-2 right-2 h-[90px] bg-gradient-to-b from-[#3e413e] to-[#353835] rounded-t-2xl border border-white/5 border-b-0 z-0" />
          <motion.div
            initial={{ y: 10, rotate: -5 }}
            animate={{ y: -18, rotate: -8 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="absolute left-3 top-0 z-10"
          >
            <div className="w-[110px] h-[70px] rounded-lg bg-gradient-to-br from-[#c9a84c] via-[#b8943f] to-[#a07830] shadow-lg border border-yellow-400/20 overflow-hidden">
              <div className="absolute top-3 left-3 w-6 h-[18px] rounded-sm bg-gradient-to-br from-yellow-200/80 to-yellow-500/60 border border-yellow-600/30" />
            </div>
          </motion.div>
          <motion.div
            initial={{ y: 10, rotate: 3 }}
            animate={{ y: -12, rotate: 3 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="absolute right-2 top-0 z-20"
          >
            <div className="w-[140px] h-[85px] rounded-lg bg-gradient-to-br from-[#2a8a9a] via-[#1e7a8a] to-[#15606e] shadow-lg border border-cyan-400/10 overflow-hidden">
              <div className="absolute top-3 right-3 text-[7px] font-bold text-white/70 tracking-[0.15em]">AMERICAN</div>
              <div className="absolute top-8 right-2 bg-white/10 backdrop-blur-sm rounded px-2 py-0.5 border border-white/10">
                <span className="text-[6px] font-black text-white/90 tracking-wider">AMERICAN</span><br/>
                <span className="text-[5px] font-bold text-white/70 tracking-[0.2em]">EXPRESS</span>
              </div>
            </div>
          </motion.div>
          <div className="absolute bottom-0 left-0 right-0 h-[95px] z-30 px-5 pt-3">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
              <div className="text-[28px] font-bold text-white tracking-tight leading-none">{balance}</div>
              <div className="text-[9px] text-white/40 tracking-[0.2em] font-medium mt-1.5">{label}</div>
            </motion.div>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-5 w-3 h-3 rounded-full bg-white/80 shadow-[0_0_12px_rgba(255,255,255,0.4)]"
        />
      </motion.div>
    </div>
  );
}`,
    usage: `import { WalletCard } from "@/components/showcase/wallet-card";

export default function Page() {
  return <WalletCard balance="$250,000" label="TOTAL BALANCE" />;
}`,
  },
  {
    id: "wallet-card-alt",
    name: "Wallet Card (Savings)",
    description:
      "Alternative wallet configuration showing savings balance. Demonstrates flexible prop customization.",
    category: "creative",
    tags: ["finance", "3d", "animated", "wallet"],
    icon: CreditCard,
    credit: {
      name: "@Shorya_codes",
      url: "https://x.com/Shorya_codes/status/2030272621053706551?s=20",
    },
    previewBg: "bg-[#4a5548]",
    component: <WalletCard balance="$1,200,000" label="SAVINGS" />,
    deps: ["framer-motion"],
    code: `// Uses the same WalletCard component with different props
import { WalletCard } from "@/components/showcase/wallet-card";

<WalletCard balance="$1,200,000" label="SAVINGS" />`,
    usage: `import { WalletCard } from "@/components/showcase/wallet-card";

export default function Page() {
  return <WalletCard balance="$1,200,000" label="SAVINGS" />;
}`,
  },
  {
    id: "gradient-inspiration-card",
    name: "Gradient Inspiration Card",
    description:
      "Dark card with warm mesh gradient. Great for creative portfolios and social previews.",
    category: "creative",
    tags: ["gradient", "mesh", "dark", "social"],
    icon: Palette,
    credit: {
      name: "@UiSavior",
      url: "https://x.com/UiSavior/status/2029952713228685362?s=20",
    },
    previewBg: "bg-[#111]",
    component: (
      <GradientInspirationCard
        title="New Inspirations"
        subtitle="for Designers"
        author="suraj.dsgn"
      />
    ),
    deps: ["framer-motion"],
    code: `"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GradientInspirationCardProps {
  title?: string;
  subtitle?: string;
  author?: string;
  className?: string;
}

export function GradientInspirationCard({
  title = "New Inspirations",
  subtitle = "for Designers",
  author = "suraj.dsgn",
  className,
}: GradientInspirationCardProps) {
  return (
    <div className={cn("relative flex items-center justify-center p-6", className)}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative w-[300px] h-[420px] rounded-2xl overflow-hidden shadow-2xl border border-white/5"
      >
        <div className="absolute inset-0 bg-[#0a0a0a]" />
        <div className="absolute -bottom-20 -left-20 w-[350px] h-[350px]">
          <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/80 via-orange-400/50 to-transparent rounded-full blur-[60px]" />
        </div>
        <div className="absolute -bottom-10 -right-16 w-[280px] h-[280px]">
          <div className="absolute inset-0 bg-gradient-to-tl from-pink-500/70 via-fuchsia-400/40 to-transparent rounded-full blur-[50px]" />
        </div>
        <div className="absolute bottom-20 left-1/4 w-[200px] h-[200px]">
          <div className="absolute inset-0 bg-gradient-to-t from-amber-400/40 via-orange-300/20 to-transparent rounded-full blur-[40px]" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute top-5 left-5 z-10 flex items-center gap-1.5"
        >
          <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 text-white/70">
            <path d="M8 1L6.5 6.5L1 8L6.5 9.5L8 15L9.5 9.5L15 8L9.5 6.5L8 1Z" fill="currentColor" />
          </svg>
          <span className="text-[11px] text-white/70 font-medium tracking-wide">{author}</span>
        </motion.div>
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <motion.h2 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-[28px] font-semibold text-white tracking-tight text-center">{title}</motion.h2>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="text-[15px] text-white/60 mt-1 tracking-wide">{subtitle}</motion.p>
        </div>
      </motion.div>
    </div>
  );
}`,
    usage: `import { GradientInspirationCard } from "@/components/showcase/gradient-inspiration-card";

export default function Page() {
  return (
    <GradientInspirationCard
      title="New Inspirations"
      subtitle="for Designers"
      author="suraj.dsgn"
    />
  );
}`,
  },
  {
    id: "desktop-folders",
    name: "Desktop Folders",
    description:
      "Skeuomorphic 3D folder icons in orange, dark, and white variants with animated documents.",
    category: "creative",
    tags: ["3d", "folders", "icons", "skeuomorphic"],
    icon: FolderOpen,
    credit: {
      name: "@UiSavior",
      url: "https://x.com/UiSavior/status/2029952713228685362?s=20",
    },
    previewBg:
      "bg-gradient-to-b from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900",
    component: <DesktopFolders />,
    deps: ["framer-motion"],
    code: `"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FolderProps {
  variant: "orange" | "dark" | "white";
  label?: string;
  sublabel?: string;
  hasDocuments?: boolean;
}

function Folder({ variant, label = "Design Folder", sublabel = "16 items", hasDocuments = true }: FolderProps) {
  const styles = {
    orange: {
      body: "from-[#f5a623] via-[#f0961e] to-[#e8871a]",
      tab: "from-[#f5a623] to-[#e89620]",
      front: "from-[#fbbd4e] via-[#f7a82d] to-[#f09820]",
      shadow: "shadow-[0_8px_32px_rgba(245,166,35,0.25)]",
      textColor: "text-white/90", subColor: "text-white/50",
      docBg: "bg-[#ffecc8]", docLines: "bg-[#e8c98a]", border: "border-[#e8930f]/20",
    },
    dark: {
      body: "from-[#2a2a2e] via-[#232327] to-[#1e1e22]",
      tab: "from-[#2e2e32] to-[#262629]",
      front: "from-[#333338] via-[#2c2c31] to-[#26262b]",
      shadow: "shadow-[0_8px_32px_rgba(0,0,0,0.35)]",
      textColor: "text-white/80", subColor: "text-white/35",
      docBg: "bg-[#3a3a3f]", docLines: "bg-[#4a4a50]", border: "border-white/5",
    },
    white: {
      body: "from-[#f0f0f2] via-[#eaeaec] to-[#e4e4e7]",
      tab: "from-[#f2f2f4] to-[#eaeaed]",
      front: "from-[#fafafa] via-[#f5f5f7] to-[#eeeeef]",
      shadow: "shadow-[0_8px_32px_rgba(0,0,0,0.08)]",
      textColor: "text-zinc-700", subColor: "text-zinc-400",
      docBg: "bg-white", docLines: "bg-zinc-200", border: "border-zinc-200/80",
    },
  };
  const s = styles[variant];

  return (
    <motion.div whileHover={{ y: -4 }} className="relative flex flex-col items-center cursor-pointer">
      <div className={cn("relative w-[140px] h-[100px]", s.shadow)}>
        <div className={cn("absolute -top-3.5 left-0 w-[52px] h-5 rounded-t-lg bg-gradient-to-b border border-b-0", s.tab, s.border)} />
        <div className={cn("absolute inset-0 rounded-lg bg-gradient-to-b border", s.body, s.border)} />
        {hasDocuments && (
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10 flex gap-1">
            {[0, 1, 2].map((i) => (
              <div key={i} className={cn("rounded-[3px] border", s.docBg, s.border)}
                style={{ width: i === 1 ? 30 : 26, height: i === 1 ? 36 : 32, transform: \`rotate(\${i === 0 ? -5 : i === 2 ? 5 : 0}deg)\` }}>
                <div className="p-1.5 space-y-[3px]">
                  {Array.from({length: 6}).map((_, j) => (
                    <div key={j} className={cn("h-0.5 rounded-full", s.docLines)} style={{ width: j % 2 === 0 ? '100%' : '70%' }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        <div className={cn("absolute bottom-0 left-0 right-0 h-[72px] rounded-lg bg-gradient-to-b border z-20", s.front, s.border)}>
          <div className="absolute bottom-3 left-3">
            <div className={cn("text-[10px] font-semibold leading-none", s.textColor)}>{label}</div>
            <div className={cn("text-[8px] mt-0.5", s.subColor)}>{sublabel}</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function DesktopFolders({ className }: { className?: string }) {
  return (
    <div className={cn("relative flex items-center justify-center p-10", className)}>
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 rounded-2xl" />
      <div className="relative z-10 flex items-end gap-6 sm:gap-8">
        <Folder variant="orange" label="Design Folder" sublabel="24 items" />
        <Folder variant="dark" label="Design Folder" sublabel="16 items" />
        <Folder variant="white" label="Design Folder" sublabel="8 items" />
      </div>
    </div>
  );
}`,
    usage: `import { DesktopFolders } from "@/components/showcase/desktop-folders";

export default function Page() {
  return <DesktopFolders />;
}`,
  },

  // ── AI / Developer Cards ──
  {
    id: "ai-tools-card",
    name: "AI Tools Hub",
    description:
      "Floating AI tool logos on a dot-grid background with gentle hover animations. Showcases multi-model AI platform concept.",
    category: "creative",
    tags: ["ai", "tools", "logos", "grid", "animated", "saas"],
    icon: Bot,
    credit: {
      name: "@AdityaSur11",
      url: "https://x.com/AdityaSur11/status/2030214373872967811?s=20",
    },
    previewBg: "bg-white dark:bg-zinc-950",
    component: <AIToolsCard />,
    deps: ["framer-motion"],
    code: `"use client";

import { AIToolsCard } from "@/components/showcase/ai-tools-card";

// AI Tools Hub card with floating logos on a grid background
// - SVG logos for ChatGPT, Google, Gemini, Claude, Perplexity, Mistral, Meta AI, Copilot
// - Dot-grid + line-grid layered background with radial fade
// - Gentle floating animation per logo
// - Mouse cursor decoration
// - Customizable title and description

export default function Page() {
  return (
    <AIToolsCard
      title="All Your AI Tools in One Place"
      description="Connect and use leading AI models from a single interface. Faster, simpler, and seamless."
    />
  );
}`,
    usage: `import { AIToolsCard } from "@/components/showcase/ai-tools-card";

// Default
<AIToolsCard />

// Custom text
<AIToolsCard
  title="AI Model Hub"
  description="All your favorite models, one API."
/>`,
  },
  {
    id: "dev-bento-card",
    name: "Developer Bento Grid",
    description:
      "Bento-style developer profile card with tech stack, chat-style bio, social links, daily tools, projects gallery, and gradient image placeholders.",
    category: "creative",
    tags: ["bento", "profile", "developer", "portfolio", "grid", "social"],
    icon: LayoutGrid,
    credit: {
      name: "@zzzzshawn",
      url: "https://x.com/zzzzshawn/status/2030256382910591386?s=20",
    },
    previewBg: "bg-zinc-100 dark:bg-zinc-950",
    component: <DevBentoCard />,
    deps: ["framer-motion"],
    code: `"use client";

import { DevBentoCard } from "@/components/showcase/dev-bento-card";

// Bento-grid developer profile card with:
// - Tech stack section (Frontend / Backend / Tools)
// - Profile cell with avatar, bio, and chat-bubble style messages
// - Social links grid (X, GitHub, Gmail, LinkedIn, etc.)
// - Daily tool stack pills
// - Projects list with gradient icons
// - Gallery grid with gradient placeholders

export default function Page() {
  return (
    <DevBentoCard
      name="Shawn."
      handle="zzzzShawn"
      bio="I build WebApps. Full-stack developer crafting modern interfaces."
      location="Goa, India"
      age={22}
    />
  );
}`,
    usage: `import { DevBentoCard } from "@/components/showcase/dev-bento-card";

// Default
<DevBentoCard />

// Custom profile
<DevBentoCard
  name="Jane Doe"
  handle="janedoe"
  bio="Frontend engineer & design enthusiast."
  location="San Francisco, CA"
  age={28}
/>`,
  },

  // ── Cards ──
  {
    id: "analytics-card",
    name: "Analytics Card",
    description:
      "Revenue analytics card with animated bar chart and change indicator.",
    category: "cards",
    tags: ["analytics", "chart", "revenue", "dashboard"],
    icon: BarChart3,
    component: <AnalyticsCard />,
    deps: ["framer-motion"],
    code: `import { AnalyticsCard } from "@/components/showcase/analytics-card";`,
    usage: `<AnalyticsCard title="Revenue" value="$48,295" change="+12.5%" />`,
  },
  {
    id: "pricing-card",
    name: "Pricing Card",
    description:
      "Highlighted pricing card with gradient top bar, feature list, and CTA.",
    category: "marketing",
    tags: ["pricing", "plan", "subscription", "saas"],
    icon: DollarSign,
    component: <PricingCard />,
    deps: ["framer-motion"],
    code: `import { PricingCard } from "@/components/showcase/pricing-card";`,
    usage: `<PricingCard planName="Pro Plan" price="$29" period="/mo" badge="Popular" />`,
  },
  {
    id: "notifications-card",
    name: "Notifications Card",
    description:
      "Real-time notification feed with color-coded indicators and timestamps.",
    category: "feedback",
    tags: ["notifications", "alerts", "feed", "realtime"],
    icon: Bell,
    component: <NotificationsCard />,
    deps: ["framer-motion"],
    code: `import { NotificationsCard } from "@/components/showcase/notifications-card";`,
    usage: `<NotificationsCard />`,
  },
  {
    id: "track-progress-card",
    name: "Track Progress Card",
    description:
      "Multi-stage progress tracker with animated progress bars and step indicators.",
    category: "data-display",
    tags: ["progress", "tracker", "pipeline", "hiring"],
    icon: Activity,
    component: <TrackProgressCard />,
    deps: ["framer-motion"],
    code: `import { TrackProgressCard } from "@/components/showcase/track-progress-card";`,
    usage: `<TrackProgressCard title="Track progress" />`,
  },
  {
    id: "blog-card",
    name: "Blog Card",
    description:
      "Compact blog post list with tags, dates, and hover interactions.",
    category: "cards",
    tags: ["blog", "posts", "list", "content"],
    icon: BookOpen,
    component: <BlogCard />,
    deps: ["framer-motion"],
    code: `import { BlogCard } from "@/components/showcase/blog-card";`,
    usage: `<BlogCard heading="Blog" />`,
  },
  {
    id: "command-palette-card",
    name: "Command Palette",
    description:
      "macOS-style command palette with keyboard shortcuts and search.",
    category: "navigation",
    tags: ["command", "palette", "search", "keyboard"],
    icon: Command,
    component: <CommandPaletteCard />,
    deps: ["framer-motion"],
    code: `import { CommandPaletteCard } from "@/components/showcase/command-palette-card";`,
    usage: `<CommandPaletteCard placeholder="Type a command or search..." />`,
  },
  {
    id: "settings-card",
    name: "Settings Card",
    description:
      "Preference toggles card with switch controls for notification and security settings.",
    category: "forms",
    tags: ["settings", "preferences", "toggle", "switch"],
    icon: Settings,
    component: <SettingsCard />,
    deps: ["framer-motion"],
    code: `import { SettingsCard } from "@/components/showcase/settings-card";`,
    usage: `<SettingsCard title="Preferences" />`,
  },
  {
    id: "signup-form-card",
    name: "Sign Up Form",
    description:
      "Clean authentication form with branded header, input fields, and CTA.",
    category: "forms",
    tags: ["auth", "signup", "form", "login"],
    icon: Users,
    component: <SignUpFormCard />,
    deps: ["framer-motion"],
    code: `import { SignUpFormCard } from "@/components/showcase/signup-form-card";`,
    usage: `<SignUpFormCard brandName="DevStudio" />`,
  },
  {
    id: "activity-feed-card",
    name: "Activity Feed",
    description: "Team activity stream with avatars, actions, and timestamps.",
    category: "feedback",
    tags: ["activity", "feed", "team", "git"],
    icon: Activity,
    component: <ActivityFeedCard />,
    deps: ["framer-motion"],
    code: `import { ActivityFeedCard } from "@/components/showcase/activity-feed-card";`,
    usage: `<ActivityFeedCard title="Activity" />`,
  },
  {
    id: "user-table-card",
    name: "User Table Card",
    description: "Compact user list with avatar, email, and status indicators.",
    category: "data-display",
    tags: ["table", "users", "list", "admin"],
    icon: Table2,
    component: <UserTableCard />,
    deps: ["framer-motion"],
    code: `import { UserTableCard } from "@/components/showcase/user-table-card";`,
    usage: `<UserTableCard title="Recent Users" />`,
  },
  {
    id: "calendar-card",
    name: "Calendar Card",
    description:
      "Monthly calendar with today highlight, event indicators, and navigation.",
    category: "data-display",
    tags: ["calendar", "date", "schedule", "events"],
    icon: Calendar,
    component: <CalendarCard />,
    deps: ["framer-motion"],
    code: `import { CalendarCard } from "@/components/showcase/calendar-card";`,
    usage: `<CalendarCard month="January" year={2025} todayDate={15} />`,
  },
  {
    id: "integration-card",
    name: "Integration Card",
    description:
      "Grid of connected/available integrations with connection status.",
    category: "cards",
    tags: ["integrations", "apps", "connect", "tools"],
    icon: Plug,
    component: <IntegrationCard />,
    deps: ["framer-motion"],
    code: `import { IntegrationCard } from "@/components/showcase/integration-card";`,
    usage: `<IntegrationCard title="Integrations" />`,
  },
  {
    id: "metrics-card",
    name: "System Metrics",
    description:
      "System resource monitor with animated progress bars and sparkline chart.",
    category: "data-display",
    tags: ["metrics", "system", "monitor", "cpu"],
    icon: Terminal,
    component: <MetricsCard />,
    deps: ["framer-motion"],
    code: `import { MetricsCard } from "@/components/showcase/metrics-card";`,
    usage: `<MetricsCard title="System Metrics" />`,
  },

  // ── Interactive / Keyboards ──
  {
    id: "mechanical-keyboard",
    name: "Mechanical Keyboard",
    description:
      "Fully interactive mechanical keyboard with Web Audio API sound synthesis, spring-physics key animations, caps lock LED, shift state, and live typing display.",
    category: "interactive",
    tags: ["keyboard", "sound", "mechanical", "interactive", "typing"],
    icon: KeyboardIcon,
    previewBg: "bg-zinc-950",
    component: <Keyboard variant="mechanical" />,
    deps: ["framer-motion"],
    code: `"use client";

import { Keyboard } from "@/components/showcase/keyboard";

// Full mechanical keyboard with sound
// - Web Audio API synthesized click sounds (no audio files needed)
// - Spring-physics key press animations
// - Caps Lock LED indicator
// - Shift state for symbols
// - Live typing text display with blinking cursor
// - Physical keyboard input support
// - Virtual click support

export default function Page() {
  return (
    <Keyboard
      variant="mechanical"
      soundEnabled={true}
      onKeyPress={(code) => console.log("Key:", code)}
    />
  );
}`,
    usage: `import { Keyboard } from "@/components/showcase/keyboard";

// Mechanical variant (dark, clicky)
<Keyboard variant="mechanical" soundEnabled={true} />

// With key press callback
<Keyboard
  variant="mechanical"
  onKeyPress={(code) => console.log(code)}
/>`,
  },
  {
    id: "mac-keyboard",
    name: "Mac Keyboard",
    description:
      "Apple-style keyboard with soft thock sounds, low-profile key animations, SF symbol modifiers (⌘ ⌥ ⌃), globe key, and light/dark mode support.",
    category: "interactive",
    tags: ["keyboard", "mac", "apple", "sound", "interactive", "typing"],
    icon: KeyboardIcon,
    previewBg: "bg-zinc-100 dark:bg-zinc-900",
    component: <MacKeyboard />,
    deps: ["framer-motion"],
    code: `"use client";

import { MacKeyboard } from "@/components/showcase/keyboard";

// Apple-style keyboard with:
// - Soft "thock" sounds via Web Audio API
// - Low-profile spring animations
// - SF-style modifier symbols: ⌘ ⌥ ⌃ ⇧ ⌫ ⏎ ⇥
// - Globe/fn key with SVG icon
// - Light & dark mode adaptive colors
// - Caps lock dot indicator
// - Live typing display

export default function Page() {
  return <MacKeyboard soundEnabled={true} />;
}`,
    usage: `import { MacKeyboard } from "@/components/showcase/keyboard";

// Mac variant (light, thocky)
<MacKeyboard soundEnabled={true} />

// Or use the base component with variant prop
import { Keyboard } from "@/components/showcase/keyboard";
<Keyboard variant="mac" soundEnabled={true} />`,
  },
  {
    id: "shader menu",
    name: "Shader Menu",
    description: "Shader menu with ",
    category: "creative",
    tags: ["finance", "3d", "animated", "wallet"],
    icon: CreditCard,
    previewBg: "bg-[#4a5548]",
    component: <ShaderMenu />,
    deps: ["framer-motion"],
    code: `"use client"`,
    usage: "use client",
  },
];

// Compute category counts
const categoryCounts: Record<string, number> = {};
REGISTRY.forEach((c) => {
  categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
});

// ═══════════════════════════════════════════════════════
// UTILITY: Copy to Clipboard
// ═══════════════════════════════════════════════════════

function CopyButton({
  text,
  size = "sm",
}: {
  text: string;
  size?: "sm" | "xs";
}) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };
  return (
    <button
      onClick={handleCopy}
      className={cn(
        "inline-flex items-center gap-1 rounded-md font-medium transition-all border border-border/50",
        size === "sm" ? "px-2.5 py-1 text-[11px]" : "px-2 py-0.5 text-[10px]",
        copied
          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
          : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted",
      )}
    >
      {copied ? (
        <>
          <Check className="w-3 h-3" /> Copied
        </>
      ) : (
        <>
          <Copy className="w-3 h-3" /> Copy
        </>
      )}
    </button>
  );
}

// ═══════════════════════════════════════════════════════
// CODE BLOCK
// ═══════════════════════════════════════════════════════

function CodeBlock({ code, label }: { code: string; label?: string }) {
  return (
    <div className="relative rounded-xl border border-border/50 bg-[#09090b] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.04] bg-white/[0.01]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-white/[0.06]" />
            <div className="w-2 h-2 rounded-full bg-white/[0.06]" />
            <div className="w-2 h-2 rounded-full bg-white/[0.06]" />
          </div>
          {label && (
            <span className="text-[10px] text-white/25 font-mono ml-2 tracking-wider">
              {label}
            </span>
          )}
        </div>
        <CopyButton text={code} size="xs" />
      </div>
      <div className="overflow-x-auto p-4 scrollbar-hide">
        <pre className="text-[12px] leading-[1.7] font-mono text-white/60 whitespace-pre">
          {code}
        </pre>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// COMPONENT DETAIL MODAL / PANEL
// ═══════════════════════════════════════════════════════

function ComponentDetail({
  item,
  onClose,
}: {
  item: ComponentEntry;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start justify-center overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.97 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl my-8 mx-4 sm:mx-6 rounded-2xl border border-border/50 bg-background shadow-2xl overflow-hidden"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-muted/80 hover:bg-muted flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge
              variant="outline"
              className="text-[9px] tracking-wider font-normal"
            >
              {CATEGORIES.find((c) => c.key === item.category)?.label}
            </Badge>
            {item.credit && (
              <Link
                href={item.credit.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#1DA1F2]/8 text-[10px] text-[#1DA1F2] hover:bg-[#1DA1F2]/15 transition-colors"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-2.5 h-2.5"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                {item.credit.name}
                <ExternalLink className="w-2.5 h-2.5 opacity-50" />
              </Link>
            )}
          </div>
          <h2 className="text-2xl font-bold tracking-tight">{item.name}</h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-xl">
            {item.description}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {item.tags.map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 text-[9px] tracking-wider rounded-full border border-border/40 text-muted-foreground"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <Separator />

        {/* Preview / Code tabs */}
        <Tabs defaultValue="preview" className="w-full">
          <div className="px-6 pt-3">
            <TabsList className="h-8">
              <TabsTrigger value="preview" className="gap-1.5 text-xs">
                <Eye className="w-3 h-3" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="code" className="gap-1.5 text-xs">
                <Code2 className="w-3 h-3" />
                Code
              </TabsTrigger>
              <TabsTrigger value="usage" className="gap-1.5 text-xs">
                <Layers className="w-3 h-3" />
                Usage
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="preview" className="p-4">
            <div
              className={cn(
                "rounded-xl border border-border/30 min-h-[360px] flex items-center justify-center overflow-hidden relative",
                item.previewBg || "bg-muted/20",
              )}
            >
              <div
                className="absolute inset-0 opacity-[0.015] pointer-events-none"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, currentColor 0.5px, transparent 0)",
                  backgroundSize: "20px 20px",
                }}
              />
              <div className="relative z-10">{item.component}</div>
            </div>
          </TabsContent>

          <TabsContent value="code" className="px-4 pb-6">
            <div className="space-y-3">
              {item.deps && item.deps.length > 0 && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/30 border border-border/30">
                  <span className="text-[10px] font-mono text-muted-foreground tracking-wider">
                    DEPS:
                  </span>
                  {item.deps.map((d) => (
                    <Badge
                      key={d}
                      variant="secondary"
                      className="text-[10px] font-mono"
                    >
                      {d}
                    </Badge>
                  ))}
                  <div className="flex-1" />
                  <CopyButton
                    text={`npm install ${item.deps.join(" ")}`}
                    size="xs"
                  />
                </div>
              )}
              <CodeBlock code={item.code} label={`${item.id}.tsx`} />
            </div>
          </TabsContent>

          <TabsContent value="usage" className="px-4 pb-6">
            <CodeBlock code={item.usage} label="page.tsx" />
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════
// GRID PREVIEW CARD (21st.dev style)
// ═══════════════════════════════════════════════════════

function PreviewCard({
  item,
  onClick,
}: {
  item: ComponentEntry;
  onClick: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      className="group cursor-pointer rounded-xl border border-border/40 bg-card overflow-hidden hover:border-border hover:shadow-lg transition-all duration-300"
    >
      {/* Preview area */}
      <div
        className={cn(
          "relative h-[220px] flex items-center justify-center overflow-hidden border-b border-border/30",
          item.previewBg || "bg-muted/20",
        )}
      >
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, currentColor 0.5px, transparent 0)",
            backgroundSize: "16px 16px",
          }}
        />
        {/* Component (scaled down for preview) */}
        <div className="relative z-10 transform scale-[0.72] origin-center pointer-events-none">
          {item.component}
        </div>
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/[0.03] dark:group-hover:bg-white/[0.02] transition-colors duration-300" />
        {/* View button on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="px-3 py-1.5 rounded-full bg-background/90 border border-border shadow-lg text-xs font-medium flex items-center gap-1.5 backdrop-blur-sm">
            <Eye className="w-3 h-3" />
            Preview
          </div>
        </div>
      </div>

      {/* Info area */}
      <div className="px-3.5 py-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold tracking-tight truncate group-hover:text-muted-foreground transition-colors">
              {item.name}
            </h3>
          </div>
          {item.credit && (
            <Link
              href={item.credit.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="shrink-0 flex items-center gap-1 text-[10px] text-muted-foreground/60 hover:text-[#1DA1F2] transition-colors"
              title={`Credit: ${item.credit.name}`}
            >
              <svg viewBox="0 0 24 24" className="w-3 h-3" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              {item.credit.name}
            </Link>
          )}
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5 line-clamp-1">
          {item.description}
        </p>
        {/* Copies count indicator (decorative) */}
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground/50">
            <Copy className="w-2.5 h-2.5" />
            <span>{Math.floor(Math.random() * 40 + 10)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════
// SIDEBAR
// ═══════════════════════════════════════════════════════

function Sidebar({
  activeCategory,
  setActiveCategory,
  searchQuery,
  setSearchQuery,
}: {
  activeCategory: CategoryKey | "all";
  setActiveCategory: (c: CategoryKey | "all") => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}) {
  return (
    <aside className="hidden lg:flex flex-col w-[220px] shrink-0 sticky top-[76px] h-[calc(100vh-76px)] border-r border-border/40 bg-background overflow-y-auto scrollbar-hide">
      <div className="p-4 pb-2">
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/50" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-8 py-1.5 text-xs rounded-lg border border-border/50 bg-muted/30 focus:bg-background focus:border-border focus:outline-none focus:ring-1 focus:ring-ring/30 transition-all placeholder:text-muted-foreground/40"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2"
            >
              <X className="w-3 h-3 text-muted-foreground/50 hover:text-foreground transition-colors" />
            </button>
          )}
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] text-muted-foreground/30 font-mono hidden">
            ⌘ K
          </div>
        </div>

        <h4 className="text-[10px] font-semibold text-muted-foreground tracking-widest mb-2 flex items-center gap-1.5">
          <Layers className="w-3 h-3" />
          Categories
        </h4>
      </div>

      <nav className="px-2 pb-4 space-y-0.5 flex-1">
        {/* All */}
        <button
          onClick={() => setActiveCategory("all")}
          className={cn(
            "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
            activeCategory === "all"
              ? "bg-muted text-foreground font-medium"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
          )}
        >
          <div className="flex items-center gap-2.5">
            <Globe className="w-3.5 h-3.5" />
            <span>All Components</span>
          </div>
          <span className="text-[10px] text-muted-foreground/60 tabular-nums">
            {REGISTRY.length}
          </span>
        </button>

        <div className="h-px bg-border/30 my-2" />

        {CATEGORIES.map((cat) => {
          const count = categoryCounts[cat.key] || 0;
          if (count === 0) return null;
          const Icon = cat.icon;
          return (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
                activeCategory === cat.key
                  ? "bg-muted text-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
              )}
            >
              <div className="flex items-center gap-2.5">
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </div>
              <span className="text-[10px] text-muted-foreground/60 tabular-nums">
                {count}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Bottom info card */}
      <div className="p-4 border-t border-border/30">
        <div className="rounded-xl border border-border/40 bg-muted/20 p-3 space-y-2">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span className="text-[11px] font-medium">Open Source</span>
          </div>
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            All components are free. Credit goes to the original designers
            linked on each card.
          </p>
          <Link
            href="/designs"
            className="inline-flex items-center gap-1 text-[10px] text-foreground font-medium hover:underline"
          >
            View Dashboards
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </aside>
  );
}

// ═══════════════════════════════════════════════════════
// MOBILE CATEGORY PILLS
// ═══════════════════════════════════════════════════════

function MobileCategoryBar({
  activeCategory,
  setActiveCategory,
}: {
  activeCategory: CategoryKey | "all";
  setActiveCategory: (c: CategoryKey | "all") => void;
}) {
  return (
    <div className="lg:hidden sticky top-[64px] z-30 bg-background/90 backdrop-blur-md border-b border-border/40">
      <div className="flex gap-1.5 px-4 py-2.5 overflow-x-auto scrollbar-hide">
        <button
          onClick={() => setActiveCategory("all")}
          className={cn(
            "shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
            activeCategory === "all"
              ? "bg-foreground text-background border-foreground"
              : "bg-muted/50 text-muted-foreground border-border/50 hover:bg-muted",
          )}
        >
          All ({REGISTRY.length})
        </button>
        {CATEGORIES.filter((c) => (categoryCounts[c.key] || 0) > 0).map(
          (cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={cn(
                "shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
                activeCategory === cat.key
                  ? "bg-foreground text-background border-foreground"
                  : "bg-muted/50 text-muted-foreground border-border/50 hover:bg-muted",
              )}
            >
              {cat.label} ({categoryCounts[cat.key] || 0})
            </button>
          ),
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// SECTION HEADER (Newest, Popular, etc.)
// ═══════════════════════════════════════════════════════

function SectionHeader({
  title,
  count,
  onViewAll,
}: {
  title: string;
  count?: number;
  onViewAll?: () => void;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-bold tracking-tight">{title}</h2>
      {onViewAll && (
        <button
          onClick={onViewAll}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          View all
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════

export default function ShowcasePage() {
  const [activeCategory, setActiveCategory] = useState<CategoryKey | "all">(
    "all",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedComponent, setSelectedComponent] =
    useState<ComponentEntry | null>(null);

  // Filter components
  const filtered = REGISTRY.filter((item) => {
    const matchesCategory =
      activeCategory === "all" || item.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) =>
        t.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    return matchesCategory && matchesSearch;
  });

  // Group featured items (creative category items are "featured")
  const featured = REGISTRY.filter(
    (r) => r.category === "creative" || r.credit,
  ).slice(0, 5);
  const isShowingAll = activeCategory === "all" && !searchQuery;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background text-foreground">
        {/* Layout */}
        <div className="flex">
          {/* Sidebar */}
          <Sidebar
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Mobile search */}
            <div className="lg:hidden sticky top-[64px] z-30 bg-background/90 backdrop-blur-md border-b border-border/40">
              <div className="px-4 pt-3 pb-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                  <input
                    type="text"
                    placeholder="Search components..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-border/50 bg-muted/30 focus:bg-background focus:border-border focus:outline-none focus:ring-1 focus:ring-ring/30 transition-all placeholder:text-muted-foreground/40"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      <X className="w-4 h-4 text-muted-foreground/50" />
                    </button>
                  )}
                </div>
              </div>
              {/* Mobile category pills */}
              <div className="flex gap-1.5 px-4 py-2.5 overflow-x-auto scrollbar-hide">
                <button
                  onClick={() => setActiveCategory("all")}
                  className={cn(
                    "shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all border",
                    activeCategory === "all"
                      ? "bg-foreground text-background border-foreground"
                      : "bg-muted/50 text-muted-foreground border-border/50 hover:bg-muted",
                  )}
                >
                  All
                </button>
                {CATEGORIES.filter((c) => (categoryCounts[c.key] || 0) > 0).map(
                  (cat) => (
                    <button
                      key={cat.key}
                      onClick={() => setActiveCategory(cat.key)}
                      className={cn(
                        "shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all border",
                        activeCategory === cat.key
                          ? "bg-foreground text-background border-foreground"
                          : "bg-muted/50 text-muted-foreground border-border/50 hover:bg-muted",
                      )}
                    >
                      {cat.label}
                    </button>
                  ),
                )}
              </div>
            </div>

            {/* Page header */}
            <div className="pt-24 lg:pt-[88px] px-4 sm:px-6 lg:px-8 pb-2">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-sm text-muted-foreground max-w-lg"
              >
                Copy-paste UI components built with React, Tailwind CSS, and
                Framer Motion. Inspired by the best designs on X.
              </motion.p>
            </div>

            {/* Content area */}
            <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-10">
              {/* ── Featured section (only when showing all) ── */}
              {isShowingAll && (
                <section>
                  <SectionHeader title="Featured" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                    {featured.map((item) => (
                      <PreviewCard
                        key={item.id}
                        item={item}
                        onClick={() => setSelectedComponent(item)}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* ── Filtered / Category grid ── */}
              {isShowingAll ? (
                // Show by category sections
                <>
                  {CATEGORIES.filter(
                    (c) => (categoryCounts[c.key] || 0) > 0,
                  ).map((cat) => {
                    const catItems = REGISTRY.filter(
                      (r) => r.category === cat.key,
                    );
                    if (catItems.length === 0) return null;
                    return (
                      <section key={cat.key}>
                        <SectionHeader
                          title={cat.label}
                          count={catItems.length}
                          onViewAll={() => setActiveCategory(cat.key)}
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                          {catItems.map((item) => (
                            <PreviewCard
                              key={item.id}
                              item={item}
                              onClick={() => setSelectedComponent(item)}
                            />
                          ))}
                        </div>
                      </section>
                    );
                  })}
                </>
              ) : (
                // Show filtered results
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold tracking-tight">
                        {activeCategory !== "all"
                          ? CATEGORIES.find((c) => c.key === activeCategory)
                              ?.label
                          : "Search Results"}
                      </h2>
                      <Badge
                        variant="secondary"
                        className="text-[10px] font-mono"
                      >
                        {filtered.length}
                      </Badge>
                    </div>
                    {activeCategory !== "all" && (
                      <button
                        onClick={() => setActiveCategory("all")}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                      >
                        <ArrowLeft className="w-3 h-3" />
                        All categories
                      </button>
                    )}
                  </div>

                  {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                        <Search className="w-5 h-5 text-muted-foreground/50" />
                      </div>
                      <h3 className="text-sm font-medium mb-1">
                        No components found
                      </h3>
                      <p className="text-xs text-muted-foreground max-w-xs">
                        Try adjusting your search or browse a different
                        category.
                      </p>
                      <Button
                        variant="outline"
                        className="mt-4 text-xs rounded-full"
                        onClick={() => {
                          setSearchQuery("");
                          setActiveCategory("all");
                        }}
                      >
                        Clear filters
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                      {filtered.map((item) => (
                        <PreviewCard
                          key={item.id}
                          item={item}
                          onClick={() => setSelectedComponent(item)}
                        />
                      ))}
                    </div>
                  )}
                </section>
              )}
            </div>

            {/* ── Credits Footer ── */}
            <div className="px-4 sm:px-6 lg:px-8 py-12 border-t border-border/30">
              <div className="max-w-xl">
                <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-4 h-4"
                    fill="currentColor"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  Credits & Inspiration
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  Components are inspired by original designs shared on X.
                  Credits are linked on each card.
                </p>
                <div className="flex flex-wrap gap-2">
                  {Array.from(
                    new Map(
                      REGISTRY.filter((c) => c.credit).map((c) => [
                        c.credit!.name,
                        c.credit!,
                      ]),
                    ).values(),
                  ).map((credit) => (
                    <Link
                      key={credit.name}
                      href={credit.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/50 bg-muted/30 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="w-3 h-3"
                        fill="currentColor"
                      >
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                      {credit.name}
                      <ExternalLink className="w-2.5 h-2.5 opacity-40" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Bottom ── */}
            <div className="py-6 flex items-center justify-center border-t border-border/30">
              <div className="flex items-center gap-3 text-[10px] text-muted-foreground tracking-widest">
                <div className="w-6 h-px bg-border" />
                <span>DESIGNED & BUILT BY ASHISH KUMAR</span>
                <div className="w-6 h-px bg-border" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Component Detail Modal ── */}
        <AnimatePresence>
          {selectedComponent && (
            <ComponentDetail
              item={selectedComponent}
              onClose={() => setSelectedComponent(null)}
            />
          )}
        </AnimatePresence>
      </main>
    </>
  );
}
