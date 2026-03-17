"use client";

import Link from "next/link";
import { DESIGNS } from "@/lib/constants/designs";
import { Header } from "@/components/header";
import {
  ArrowUpRight,
  Zap,
  CheckCircle2,
  Star,
  BarChart3,
  Users,
  Globe,
  Bell,
  Search,
  ChevronRight,
  TrendingUp,
  Shield,
  Activity,
  Play,
  Quote,
  Mail,
  Lock,
  User,
  CreditCard,
  Clock,
  FileText,
  Settings,
  Home,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";

// ─── Avatar stack ───
const AVATAR_STACK = [
  { initials: "AK", color: "bg-violet-600" },
  { initials: "RJ", color: "bg-blue-600" },
  { initials: "SM", color: "bg-emerald-600" },
  { initials: "PL", color: "bg-amber-600" },
  { initials: "NK", color: "bg-pink-600" },
];

// ─── Brands ───
const BRANDS = [
  { name: "Aceternity UI", icon: "◆" },
  { name: "Gamity", icon: "●" },
  { name: "Host IT", icon: "◆" },
  { name: "Asteroid Kit", icon: "▲" },
  { name: "DevStudio", icon: "■" },
  { name: "CraftCode", icon: "⬡" },
];

// ─── Dashboard accents ───
const themeAccents: Record<string, { bar: string; bg: string; text: string }> =
  {
    clerk: {
      bar: "bg-violet-500",
      bg: "bg-[#F9F9F8] dark:bg-[#1a1a1f]",
      text: "text-violet-500",
    },
    apple: {
      bar: "bg-blue-500",
      bg: "bg-[#F5F5F7] dark:bg-[#1a1a2e]",
      text: "text-blue-500",
    },
    terminal: {
      bar: "bg-emerald-500",
      bg: "bg-[#0C0C0E]",
      text: "text-emerald-400",
    },
  };

// ═══════════════════════════════════════
// MARQUEE ROW — alternating auto-scroll
// ═══════════════════════════════════════
function MarqueeRow({
  children,
  direction = "left",
  speed = 30,
  className,
}: {
  children: React.ReactNode;
  direction?: "left" | "right";
  speed?: number;
  className?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Left fade */}
      <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      {/* Right fade */}
      <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      <div
        className="flex gap-4 w-max hover:[animation-play-state:paused]"
        style={{
          animation: `${direction === "left" ? "marquee-left" : "marquee-right"} ${speed}s linear infinite`,
        }}
      >
        {children}
        {children}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// INDIVIDUAL SHOWCASE CARDS
// ═══════════════════════════════════════

function SignUpFormCard() {
  return (
    <div className="w-[300px] sm:w-[340px] shrink-0 snap-start">
      <Card className="h-full">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded bg-foreground flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-background" />
            </div>
            <span className="text-sm font-semibold tracking-tight">
              DevStudio
            </span>
          </div>
          <CardTitle className="text-lg">Sign up for an account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Full name
            </label>
            <Input
              placeholder="Manu Arora"
              readOnly
              className="pointer-events-none h-8 text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Email address
            </label>
            <Input
              placeholder="hello@johndoe.com"
              readOnly
              className="pointer-events-none h-8 text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Password
            </label>
            <Input
              type="password"
              value="••••••••••"
              readOnly
              className="pointer-events-none h-8 text-xs"
            />
          </div>
          <Button className="w-full h-8 text-xs">Sign Up</Button>
          <p className="text-[10px] text-center text-muted-foreground">
            Already have an account?{" "}
            <span className="text-foreground font-medium">Sign in</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function HostingFeatureCard() {
  return (
    <div className="w-[300px] sm:w-[340px] shrink-0 snap-start">
      <Card className="h-full overflow-hidden bg-card">
        <CardContent className="p-5 space-y-3">
          <h3 className="text-sm font-semibold">Hosting over the edge</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            With our edge network, we host your website by going into each city
            by ourselves.
          </p>
          {/* Globe representation */}
          <div className="relative h-40 rounded-lg bg-[#0a0a12] overflow-hidden flex items-center justify-center">
            <div className="relative w-32 h-32">
              {/* Globe wireframe circles */}
              <div className="absolute inset-0 rounded-full border border-blue-500/20" />
              <div className="absolute inset-2 rounded-full border border-blue-500/15" />
              <div className="absolute inset-4 rounded-full border border-blue-500/10" />
              {/* Vertical ellipses */}
              <div
                className="absolute inset-0 rounded-full border border-blue-500/20"
                style={{ transform: "rotateY(60deg)" }}
              />
              <div
                className="absolute inset-0 rounded-full border border-blue-500/20"
                style={{ transform: "rotateY(-60deg)" }}
              />
              {/* Horizontal lines */}
              <div className="absolute left-0 right-0 top-1/4 h-px bg-blue-500/15" />
              <div className="absolute left-0 right-0 top-1/2 h-px bg-blue-500/20" />
              <div className="absolute left-0 right-0 top-3/4 h-px bg-blue-500/15" />
              {/* Glowing dots */}
              <div className="absolute top-1/3 left-1/2 w-2 h-2 rounded-full bg-blue-400 shadow-lg shadow-blue-400/50 animate-pulse" />
              <div
                className="absolute top-1/2 left-1/4 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50 animate-pulse"
                style={{ animationDelay: "0.5s" }}
              />
              <div
                className="absolute top-2/3 left-2/3 w-1.5 h-1.5 rounded-full bg-blue-300 shadow-lg shadow-blue-300/50 animate-pulse"
                style={{ animationDelay: "1s" }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TestimonialCard({ quote, author }: { quote: string; author: string }) {
  return (
    <div className="w-[300px] sm:w-[340px] shrink-0 snap-start">
      <Card className="h-full">
        <CardContent className="p-5">
          <Quote className="w-6 h-6 text-muted-foreground/20 mb-3" />
          <p className="text-sm leading-relaxed mb-4">{quote}</p>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
              <User className="w-3 h-3 text-muted-foreground" />
            </div>
            <span className="text-xs text-muted-foreground">{author}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TrackProgressCard() {
  return (
    <div className="w-[300px] sm:w-[340px] shrink-0 snap-start">
      <Card className="h-full">
        <CardContent className="p-5 space-y-3">
          <h3 className="text-sm font-semibold">Track progress</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Track every step of the candidate&apos;s journey, from initial
            application to rejected appraisal.
          </p>
          <div className="space-y-3 pt-1">
            {[
              {
                stage: "Applied",
                count: 42,
                pct: 100,
                color: "bg-blue-500",
              },
              {
                stage: "Screening",
                count: 28,
                pct: 67,
                color: "bg-violet-500",
              },
              {
                stage: "Interview",
                count: 14,
                pct: 33,
                color: "bg-emerald-500",
              },
              { stage: "Offer", count: 5, pct: 12, color: "bg-amber-500" },
            ].map((item) => (
              <div key={item.stage} className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-muted-foreground">{item.stage}</span>
                  <span className="font-medium">{item.count}</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted">
                  <div
                    className={cn("h-full rounded-full", item.color)}
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          {/* Step indicators */}
          <div className="flex items-center gap-1 pt-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1.5 flex-1 rounded-full",
                  i < 4 ? "bg-foreground/20" : "bg-muted",
                )}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function BlogCard() {
  return (
    <div className="w-[300px] sm:w-[340px] shrink-0 snap-start">
      <Card className="h-full">
        <CardContent className="p-5 space-y-3">
          <h3 className="text-lg font-bold tracking-tight">Blog</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Discover insightful resources and expert advice from our seasoned
            team of professionals.
          </p>
          <div className="space-y-2">
            {[
              {
                title: "Building Scalable Design Systems",
                tag: "Design",
                date: "Jan 2025",
              },
              {
                title: "The Future of Web Interfaces",
                tag: "Engineering",
                date: "Dec 2024",
              },
              {
                title: "Accessibility in Modern UI",
                tag: "Product",
                date: "Nov 2024",
              },
            ].map((post) => (
              <div
                key={post.title}
                className="p-2.5 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors group/post cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-medium truncate group-hover/post:text-muted-foreground transition-colors">
                      {post.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant="secondary"
                        className="text-[8px] h-4 px-1.5"
                      >
                        {post.tag}
                      </Badge>
                      <span className="text-[9px] text-muted-foreground">
                        {post.date}
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight className="w-3 h-3 text-muted-foreground shrink-0 mt-0.5" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AnalyticsSmallCard() {
  return (
    <div className="w-[300px] sm:w-[340px] shrink-0 snap-start">
      <Card className="h-full">
        <CardContent className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Revenue</h3>
            <Badge variant="outline" className="text-[9px] h-5">
              +12.5%
            </Badge>
          </div>
          <p className="text-2xl font-bold tracking-tight">$48,295</p>
          {/* Mini bar chart */}
          <div className="flex items-end gap-1 h-16">
            {[35, 52, 41, 68, 45, 82, 58, 91, 72, 95, 65, 88, 78, 96].map(
              (h, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex-1 rounded-sm transition-colors",
                    i >= 12 ? "bg-emerald-500" : "bg-foreground/15",
                  )}
                  style={{ height: `${h}%` }}
                />
              ),
            )}
          </div>
          <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-foreground/15" />
              Previous
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              Current
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function NotificationsCard() {
  return (
    <div className="w-[300px] sm:w-[340px] shrink-0 snap-start">
      <Card className="h-full">
        <CardContent className="p-5 space-y-2">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-semibold">Notifications</h3>
            <Badge variant="secondary" className="text-[9px] h-5">
              3 new
            </Badge>
          </div>
          {[
            {
              title: "New sign-up",
              desc: "sarah@example.com",
              time: "2m",
              dot: "bg-emerald-500",
            },
            {
              title: "Payment received",
              desc: "$49 from Pro plan",
              time: "15m",
              dot: "bg-blue-500",
            },
            {
              title: "Server alert",
              desc: "CPU usage at 92%",
              time: "1h",
              dot: "bg-amber-500",
            },
            {
              title: "Deploy success",
              desc: "v2.4.1 is live",
              time: "3h",
              dot: "bg-violet-500",
            },
          ].map((n, i) => (
            <div
              key={i}
              className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div
                className={cn(
                  "w-1.5 h-1.5 rounded-full mt-1.5 shrink-0",
                  n.dot,
                )}
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{n.title}</p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {n.desc}
                </p>
              </div>
              <span className="text-[9px] text-muted-foreground shrink-0">
                {n.time}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function SettingsCard() {
  return (
    <div className="w-[300px] sm:w-[340px] shrink-0 snap-start">
      <Card className="h-full">
        <CardContent className="p-5 space-y-3">
          <h3 className="text-sm font-semibold">Preferences</h3>
          {[
            { label: "Email notifications", on: true },
            { label: "Push notifications", on: true },
            { label: "Marketing emails", on: false },
            { label: "Two-factor auth", on: true },
          ].map((s, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-xs">{s.label}</span>
              <Switch defaultChecked={s.on} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function PricingCard() {
  return (
    <div className="w-[300px] sm:w-[340px] shrink-0 snap-start">
      <Card className="h-full relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 via-blue-500 to-emerald-500" />
        <CardContent className="p-5 space-y-3">
          <Badge variant="secondary" className="text-[9px] h-5">
            Popular
          </Badge>
          <div>
            <h3 className="text-sm font-semibold">Pro Plan</h3>
            <p className="text-[10px] text-muted-foreground">
              For growing teams
            </p>
          </div>
          <div className="flex items-baseline gap-0.5">
            <span className="text-3xl font-bold">$29</span>
            <span className="text-xs text-muted-foreground">/mo</span>
          </div>
          <Separator />
          <div className="space-y-2">
            {[
              "Unlimited projects",
              "Advanced analytics",
              "Priority support",
              "Custom domains",
              "API access",
            ].map((f) => (
              <div key={f} className="flex items-center gap-2 text-xs">
                <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                {f}
              </div>
            ))}
          </div>
          <Button className="w-full h-8 text-xs">Get Started</Button>
        </CardContent>
      </Card>
    </div>
  );
}

function ActivityFeedCard() {
  return (
    <div className="w-[300px] sm:w-[340px] shrink-0 snap-start">
      <Card className="h-full">
        <CardContent className="p-5 space-y-2">
          <h3 className="text-sm font-semibold mb-2">Activity</h3>
          {[
            {
              user: "AK",
              action: "pushed to main",
              time: "now",
              c: "bg-violet-500",
            },
            {
              user: "RJ",
              action: "opened PR #142",
              time: "5m",
              c: "bg-blue-500",
            },
            {
              user: "SM",
              action: "merged #138",
              time: "12m",
              c: "bg-emerald-500",
            },
            {
              user: "PL",
              action: "commented #136",
              time: "1h",
              c: "bg-amber-500",
            },
            {
              user: "NK",
              action: "deployed v2.4",
              time: "2h",
              c: "bg-pink-500",
            },
          ].map((a, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <div
                className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center text-[7px] font-bold text-white shrink-0",
                  a.c,
                )}
              >
                {a.user}
              </div>
              <span className="text-xs flex-1 truncate">{a.action}</span>
              <span className="text-[9px] text-muted-foreground shrink-0">
                {a.time}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function DashboardPreviewCard({ design }: { design: (typeof DESIGNS)[0] }) {
  const accent = themeAccents[design.theme];
  return (
    <Link
      href={`/designs/${design.slug}`}
      className="group block w-[300px] sm:w-[340px] shrink-0 snap-start"
    >
      <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border-border/50">
        <div className={cn("h-1", accent.bar)} />
        <div
          className={cn(
            "h-36 relative overflow-hidden flex items-center justify-center",
            accent.bg,
          )}
        >
          {/* Fake browser window */}
          <div className="w-4/5 rounded-md border border-border/30 overflow-hidden bg-background/50 backdrop-blur-sm shadow-sm">
            <div className="flex items-center gap-1 px-2 py-1.5 border-b border-border/30">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-400/60" />
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400/60" />
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400/60" />
              <div className="flex-1 mx-1.5 h-3 rounded bg-muted/50" />
            </div>
            <div className="p-1.5 space-y-1">
              <div className="flex gap-1">
                <div className="w-8 h-12 rounded-sm bg-muted/40" />
                <div className="flex-1 space-y-0.5">
                  <div className="h-1.5 rounded bg-muted/40 w-3/4" />
                  <div className="h-1.5 rounded bg-muted/40 w-1/2" />
                  <div className="h-4 rounded bg-muted/40 w-full mt-0.5" />
                </div>
              </div>
            </div>
          </div>
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-background/90 border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100 shadow-lg">
              <Play className="w-4 h-4 ml-0.5" />
            </div>
          </div>
        </div>
        <CardContent className="p-4 space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-bold tracking-tight">
                {design.title}
              </h3>
              <p className="text-[10px] text-muted-foreground">
                {design.subtitle}
              </p>
            </div>
            <div className="w-6 h-6 rounded-full flex items-center justify-center border border-border/60 group-hover:bg-foreground group-hover:text-background group-hover:border-foreground transition-all">
              <ArrowUpRight className="w-3 h-3 group-hover:rotate-45 transition-transform" />
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-2">
            {design.description}
          </p>
          <div className="flex flex-wrap gap-1">
            {design.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-1.5 py-0.5 text-[8px] tracking-wider rounded-full border border-border/50 text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function DevStudioLandingCard() {
  return (
    <div className="w-[420px] sm:w-[480px] shrink-0 snap-start">
      <Card className="h-full overflow-hidden">
        <div className="bg-[#0a0a0a] text-white p-0">
          {/* Fake nav */}
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-white/80" />
              <span className="text-[10px] font-semibold">DevStudio</span>
            </div>
            <div className="flex items-center gap-3">
              {["Work", "Services", "Pricing", "Contact"].map((item) => (
                <span
                  key={item}
                  className="text-[8px] text-white/50 hidden sm:block"
                >
                  {item}
                </span>
              ))}
              <div className="px-2 py-0.5 rounded-full border border-white/20 text-[8px]">
                Book a call
              </div>
            </div>
          </div>
          {/* Hero area */}
          <div className="px-6 py-8 text-center space-y-3">
            {/* Mini avatar stack */}
            <div className="flex justify-center -space-x-1.5">
              {[
                "bg-violet-500",
                "bg-blue-500",
                "bg-emerald-500",
                "bg-amber-500",
              ].map((c, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-5 h-5 rounded-full border border-[#0a0a0a]",
                    c,
                  )}
                />
              ))}
            </div>
            <div>
              <p className="text-sm sm:text-base font-bold tracking-tight">
                Your best in class{" "}
                <span className="font-extrabold">design and</span>
              </p>
              <p className="text-sm sm:text-base font-extrabold tracking-tight">
                development studio
              </p>
            </div>
            <p className="text-[9px] text-white/50 max-w-[240px] mx-auto">
              We provide the best in class design and development services for
              teams that ship with the speed of light.
            </p>
            <div className="inline-block px-3 py-1 rounded-full bg-white text-black text-[9px] font-medium">
              Book a call
            </div>
          </div>
          {/* Project screenshots row */}
          <div className="flex gap-2 px-3 pb-3 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-28 h-20 rounded-md bg-white/5 border border-white/10 shrink-0 flex items-center justify-center"
              >
                <div className="space-y-1 w-4/5">
                  <div className="h-1 rounded bg-white/10 w-3/4" />
                  <div className="h-1 rounded bg-white/10 w-1/2" />
                  <div className="h-6 rounded bg-white/5 w-full" />
                  <div className="h-1 rounded bg-white/10 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

function MetricsCard() {
  return (
    <div className="w-[300px] sm:w-[340px] shrink-0 snap-start">
      <Card className="h-full">
        <CardContent className="p-5 space-y-3">
          <h3 className="text-sm font-semibold">System Metrics</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "CPU", value: "67%", color: "bg-blue-500" },
              { label: "Memory", value: "82%", color: "bg-violet-500" },
              { label: "Disk", value: "45%", color: "bg-emerald-500" },
              { label: "Network", value: "23%", color: "bg-amber-500" },
            ].map((m) => (
              <div
                key={m.label}
                className="p-2 rounded-lg bg-muted/50 space-y-1.5"
              >
                <div className="flex justify-between text-[10px]">
                  <span className="text-muted-foreground">{m.label}</span>
                  <span className="font-medium">{m.value}</span>
                </div>
                <div className="h-1 rounded-full bg-muted">
                  <div
                    className={cn("h-full rounded-full", m.color)}
                    style={{ width: m.value }}
                  />
                </div>
              </div>
            ))}
          </div>
          {/* Mini sparklines */}
          <div className="flex items-end gap-0.5 h-10 pt-1">
            {[
              20, 45, 30, 60, 40, 70, 55, 80, 65, 90, 50, 75, 85, 60, 95, 70,
            ].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm bg-foreground/10"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function UserTableCard() {
  return (
    <div className="w-[300px] sm:w-[340px] shrink-0 snap-start">
      <Card className="h-full">
        <CardContent className="p-5 space-y-2">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-semibold">Recent Users</h3>
            <span className="text-[9px] text-muted-foreground">Last 24h</span>
          </div>
          {[
            {
              name: "Sarah Chen",
              email: "sarah@acme.co",
              status: "Active",
              dot: "bg-emerald-500",
            },
            {
              name: "James Wilson",
              email: "james@inc.co",
              status: "Invited",
              dot: "bg-amber-500",
            },
            {
              name: "Maria Garcia",
              email: "maria@lab.io",
              status: "Active",
              dot: "bg-emerald-500",
            },
            {
              name: "Alex Kim",
              email: "alex@dev.co",
              status: "Pending",
              dot: "bg-blue-500",
            },
          ].map((u, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 py-1.5 border-b border-border/50 last:border-0"
            >
              <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[8px] font-bold shrink-0">
                {u.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{u.name}</p>
                <p className="text-[9px] text-muted-foreground truncate">
                  {u.email}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <div className={cn("w-1.5 h-1.5 rounded-full", u.dot)} />
                <span className="text-[9px] text-muted-foreground">
                  {u.status}
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function CommandPaletteCard() {
  return (
    <div className="w-[300px] sm:w-[340px] shrink-0 snap-start">
      <Card className="h-full overflow-hidden">
        <CardContent className="p-0">
          <div className="px-4 py-3 border-b border-border flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              Type a command or search...
            </span>
            <Badge variant="outline" className="ml-auto text-[8px] h-4 px-1.5">
              ⌘K
            </Badge>
          </div>
          <div className="p-1.5">
            <p className="text-[9px] text-muted-foreground px-2 py-1 tracking-wider uppercase">
              Suggestions
            </p>
            {[
              { icon: Home, label: "Home", shortcut: "⌘H" },
              { icon: Settings, label: "Settings", shortcut: "⌘," },
              { icon: Users, label: "Team Members", shortcut: "⌘T" },
              { icon: FileText, label: "Documentation", shortcut: "⌘D" },
              { icon: BarChart3, label: "Analytics", shortcut: "⌘A" },
            ].map((item, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-center gap-2.5 px-2 py-1.5 rounded-md text-xs",
                  i === 0 && "bg-muted/50",
                )}
              >
                <item.icon className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="flex-1">{item.label}</span>
                <span className="text-[9px] text-muted-foreground font-mono">
                  {item.shortcut}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CalendarCard() {
  const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  const dates = [
    [27, 28, 29, 30, 31, 1, 2],
    [3, 4, 5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14, 15, 16],
    [17, 18, 19, 20, 21, 22, 23],
    [24, 25, 26, 27, 28, 29, 30],
  ];
  return (
    <div className="w-[300px] sm:w-[340px] shrink-0 snap-start">
      <Card className="h-full">
        <CardContent className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">January 2025</h3>
            <div className="flex gap-1">
              <div className="w-5 h-5 rounded flex items-center justify-center border border-border text-[10px]">
                ‹
              </div>
              <div className="w-5 h-5 rounded flex items-center justify-center border border-border text-[10px]">
                ›
              </div>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-0.5 text-center">
            {days.map((d) => (
              <div
                key={d}
                className="text-[9px] text-muted-foreground py-1 font-medium"
              >
                {d}
              </div>
            ))}
            {dates.flat().map((d, i) => {
              const isCurrentMonth =
                (i < 4 && d > 20) || (i >= 4 && i < 31 + 4);
              const isToday = d === 15 && i >= 4 && i < 11 + 4;
              const hasEvent = [5, 12, 19, 23].includes(d) && isCurrentMonth;
              return (
                <div
                  key={i}
                  className={cn(
                    "text-[10px] py-1 rounded relative",
                    !isCurrentMonth && i < 4 && "text-muted-foreground/40",
                    isToday && "bg-foreground text-background font-bold",
                    hasEvent && !isToday && "font-medium",
                  )}
                >
                  {d}
                  {hasEvent && !isToday && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-0.5 rounded-full bg-blue-500" />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function IntegrationCard() {
  return (
    <div className="w-[300px] sm:w-[340px] shrink-0 snap-start">
      <Card className="h-full">
        <CardContent className="p-5 space-y-3">
          <h3 className="text-sm font-semibold">Integrations</h3>
          <p className="text-[10px] text-muted-foreground">
            Connect your favorite tools and automate workflows.
          </p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { name: "GitHub", emoji: "🐙", connected: true },
              { name: "Slack", emoji: "💬", connected: true },
              { name: "Figma", emoji: "🎨", connected: false },
              { name: "Linear", emoji: "🔷", connected: true },
              { name: "Notion", emoji: "📝", connected: false },
              { name: "Vercel", emoji: "▲", connected: true },
            ].map((app) => (
              <div
                key={app.name}
                className={cn(
                  "p-2 rounded-lg border text-center space-y-1 transition-colors",
                  app.connected
                    ? "border-border bg-muted/30"
                    : "border-dashed border-border/50",
                )}
              >
                <div className="text-base">{app.emoji}</div>
                <p className="text-[9px] font-medium">{app.name}</p>
                <p
                  className={cn(
                    "text-[7px]",
                    app.connected
                      ? "text-emerald-500"
                      : "text-muted-foreground",
                  )}
                >
                  {app.connected ? "Connected" : "Available"}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Animated section wrapper ───
function AnimatedSection({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ═══════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════
export default function DesignsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
        {/* ─── HERO ─── */}
        <section className="relative pt-32 sm:pt-40 pb-16 sm:pb-20 flex flex-col items-center text-center px-4">
          {/* Subtle background grid */}
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />

          {/* Avatar stack */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative z-10 flex -space-x-2 mb-6"
          >
            {AVATAR_STACK.map((a, i) => (
              <div
                key={i}
                className={cn(
                  "w-9 h-9 rounded-full border-2 border-background flex items-center justify-center text-[10px] font-bold text-white shadow-sm",
                  a.color,
                )}
              >
                {a.initials}
              </div>
            ))}
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative z-10 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter max-w-3xl"
          >
            Your <span> best</span> in class{" "}
            <span className="font-extrabold">design and</span>
            <br />
            <span className="font-extrabold">development studio</span>{" "}
            <Zap className="inline w-6 h-6 sm:w-8 sm:h-8 text-amber-400" />
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="relative z-10 text-sm text-muted-foreground max-w-md mt-4 leading-relaxed"
          >
            I provide the best in class design and development services for
            teams that ship with the speed of light.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="relative z-10 mt-6"
          >
            <Button className="rounded-full px-6 gap-2" asChild>
              <Link href="https://cal.com/ashish15678">
                Book a call
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>
        </section>

        {/* ─── MARQUEE ROW 1 — Left scroll ─── */}
        <AnimatedSection className="py-4">
          <MarqueeRow direction="left" speed={45}>
            <DashboardPreviewCard design={DESIGNS[0]} />
            <SignUpFormCard />
            <AnalyticsSmallCard />
            <DevStudioLandingCard />
            <TrackProgressCard />
            <NotificationsCard />
            <DashboardPreviewCard design={DESIGNS[1]} />
          </MarqueeRow>
        </AnimatedSection>

        {/* ─── MARQUEE ROW 2 — Right scroll ─── */}
        <AnimatedSection className="py-4" delay={0.1}>
          <MarqueeRow direction="right" speed={45}>
            <HostingFeatureCard />
            <DashboardPreviewCard design={DESIGNS[2]} />
            <PricingCard />
            <CommandPaletteCard />
            <BlogCard />
            <ActivityFeedCard />
            <MetricsCard />
          </MarqueeRow>
        </AnimatedSection>

        {/* ─── MARQUEE ROW 3 — Left scroll ─── */}
        <AnimatedSection className="py-4" delay={0.2}>
          <MarqueeRow direction="left" speed={45}>
            <TestimonialCard
              quote="A robust solution that fits perfectly into our workflow. It has enhanced our team's capabilities and allowed us to tackle more complex projects."
              author="Engineering Lead"
            />
            <SettingsCard />
            <UserTableCard />
            <CalendarCard />
            <IntegrationCard />
            <TestimonialCard
              quote="The attention to detail is insane. Every pixel feels intentional and the code quality is production-grade."
              author="Design Lead"
            />
            {DESIGNS[0] && <DashboardPreviewCard design={DESIGNS[0]} />}
          </MarqueeRow>
        </AnimatedSection>
        <div className="gap-4 p-2 grid grid-cols-2">
          <Link href={"/designs/butterfly"} prefetch>
            <div
              className="
            p-4 border border-border rounded-2xl
            "
            ></div>
          </Link>
          <div className=""></div>
        </div>

        {/* ─── CTA ─── */}
        <section className="px-4 sm:px-6 md:px-12 lg:px-20 py-16 md:py-20">
          <AnimatedSection>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter mb-3">
                Want something like this?
              </h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6 leading-relaxed">
                Whether you need a full dashboard, a component library, or just
                someone who obsesses over the details — let&apos;s talk.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button className="rounded-full px-6 gap-2" asChild>
                  <Link href="cal.com/">
                    Get in touch
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="rounded-full px-6 gap-2"
                  asChild
                >
                  <Link href="/">Back to portfolio</Link>
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </section>

        {/* ─── Footer line ─── */}
        <div className="py-6 flex items-center justify-center border-t border-border/50">
          <div className="flex items-center gap-3 text-[10px] text-muted-foreground tracking-widest">
            <div className="w-6 h-px bg-border" />
            <span>DESIGNED & BUILT BY ASHISH KUMAR</span>
            <div className="w-6 h-px bg-border" />
          </div>
        </div>
      </main>
    </>
  );
}
