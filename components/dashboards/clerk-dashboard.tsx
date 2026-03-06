"use client";

import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Settings,
  Bell,
  Search,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Plus,
  FileText,
  Shield,
  Key,
  LogOut,
  ChevronRight,
  Activity,
  Globe,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

// ─────────────────────────────────────────────────
// CLERK-STYLE MINIMAL DASHBOARD
//
// Design DNA:
//   • Soft neutral background (#FAFAF9-ish)
//   • Frosted glass sidebar with subtle blur
//   • Rounded-2xl cards with 1px borders
//   • Warm muted palette — violet accents
//   • Inter-like proportions, generous whitespace
//   • Status pills, avatar stacks, micro-charts
// ─────────────────────────────────────────────────

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Overview", active: true },
  { icon: Users, label: "Users", badge: "1.2k" },
  { icon: Key, label: "API Keys" },
  { icon: Shield, label: "Sessions" },
  { icon: Globe, label: "Domains" },
  { icon: CreditCard, label: "Billing" },
  { icon: Settings, label: "Settings" },
];

const RECENT_USERS = [
  {
    name: "Elena Vasquez",
    email: "elena@company.co",
    method: "Google",
    time: "2m ago",
    status: "active",
  },
  {
    name: "Tomás Nguyen",
    email: "tomas@startup.io",
    method: "Email",
    time: "8m ago",
    status: "active",
  },
  {
    name: "Priya Sharma",
    email: "priya@dev.com",
    method: "GitHub",
    time: "14m ago",
    status: "active",
  },
  {
    name: "Liam O'Brien",
    email: "liam@agency.co",
    method: "SSO",
    time: "31m ago",
    status: "idle",
  },
  {
    name: "Yuki Tanaka",
    email: "yuki@design.jp",
    method: "Apple",
    time: "1h ago",
    status: "idle",
  },
];

const STATS = [
  {
    label: "Total Users",
    value: "12,847",
    change: "+14.2%",
    up: true,
    sparkline: [30, 45, 38, 52, 48, 60, 55, 72, 65, 78, 70, 85],
  },
  {
    label: "Active Sessions",
    value: "3,291",
    change: "+8.7%",
    up: true,
    sparkline: [20, 35, 28, 42, 55, 40, 58, 50, 62, 48, 65, 70],
  },
  {
    label: "Sign-ups Today",
    value: "184",
    change: "-3.1%",
    up: false,
    sparkline: [60, 55, 48, 52, 45, 50, 42, 38, 44, 35, 40, 36],
  },
  {
    label: "API Requests",
    value: "948K",
    change: "+22.5%",
    up: true,
    sparkline: [15, 25, 30, 28, 40, 45, 42, 55, 60, 58, 72, 80],
  },
];

const AUTH_METHODS = [
  { method: "Google OAuth", pct: 42, color: "bg-violet-500" },
  { method: "Email / Password", pct: 28, color: "bg-violet-400" },
  { method: "GitHub", pct: 18, color: "bg-violet-300" },
  { method: "SSO / SAML", pct: 8, color: "bg-violet-200" },
  { method: "Apple", pct: 4, color: "bg-violet-100" },
];

const EVENTS = [
  { text: "User elena@company.co signed in via Google", time: "2m", type: "signin" },
  { text: "API key pk_live_*** was created", time: "5m", type: "key" },
  { text: "Domain app.example.com verified", time: "12m", type: "domain" },
  { text: "User tomas@startup.io updated profile", time: "18m", type: "update" },
  { text: "Rate limit triggered on /api/auth", time: "24m", type: "warn" },
  { text: "New organization 'Acme Inc' created", time: "31m", type: "org" },
];

function MiniSparkline({
  data,
  color = "stroke-violet-500",
  height = 28,
  width = 80,
}: {
  data: number[];
  color?: string;
  height?: number;
  width?: number;
}) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible"
    >
      <polyline
        points={points}
        fill="none"
        className={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StatusDot({ status }: { status: string }) {
  return (
    <span className="relative flex h-2 w-2">
      {status === "active" && (
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50" />
      )}
      <span
        className={cn(
          "relative inline-flex rounded-full h-2 w-2",
          status === "active" ? "bg-emerald-500" : "bg-zinc-300"
        )}
      />
    </span>
  );
}

function Avatar({
  name,
  size = "md",
}: {
  name: string;
  size?: "sm" | "md" | "lg";
}) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const colors = [
    "from-violet-400 to-purple-500",
    "from-blue-400 to-indigo-500",
    "from-emerald-400 to-teal-500",
    "from-amber-400 to-orange-500",
    "from-pink-400 to-rose-500",
  ];

  const hash = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const colorClass = colors[hash % colors.length];

  const sizeClass = {
    sm: "w-6 h-6 text-[9px]",
    md: "w-8 h-8 text-[11px]",
    lg: "w-10 h-10 text-xs",
  }[size];

  return (
    <div
      className={cn(
        "rounded-full bg-gradient-to-br flex items-center justify-center font-semibold text-white shrink-0 ring-2 ring-white",
        colorClass,
        sizeClass
      )}
    >
      {initials}
    </div>
  );
}

export function ClerkDashboard() {
  const [activeNav, setActiveNav] = useState("Overview");

  return (
    <div className="w-full min-h-[640px] bg-[#F9F9F8] rounded-2xl overflow-hidden flex font-sans antialiased select-none">
      {/* ── SIDEBAR ── */}
      <aside className="hidden md:flex w-[220px] shrink-0 flex-col border-r border-zinc-200/70 bg-white/60 backdrop-blur-xl">
        {/* Org Switcher */}
        <div className="px-4 pt-5 pb-3">
          <button className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-zinc-100/80 transition-colors group">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-[13px] font-semibold text-zinc-900 truncate leading-tight">
                Acme Inc
              </p>
              <p className="text-[10px] text-zinc-400 truncate leading-tight">
                Production
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-600 transition-colors shrink-0" />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-1 space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive = item.label === activeNav;
            return (
              <button
                key={item.label}
                onClick={() => setActiveNav(item.label)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg text-[13px] font-medium transition-all",
                  isActive
                    ? "bg-violet-50 text-violet-700"
                    : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50"
                )}
              >
                <item.icon
                  className={cn(
                    "w-[15px] h-[15px] shrink-0",
                    isActive ? "text-violet-600" : "text-zinc-400"
                  )}
                />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span
                    className={cn(
                      "text-[10px] font-semibold px-1.5 py-0.5 rounded-md",
                      isActive
                        ? "bg-violet-100 text-violet-600"
                        : "bg-zinc-100 text-zinc-400"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 pb-4 pt-2 border-t border-zinc-100 mt-2">
          <button className="w-full flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg text-[13px] text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 transition-colors font-medium">
            <LogOut className="w-[15px] h-[15px]" />
            <span>Sign out</span>
          </button>
          <div className="flex items-center gap-2.5 px-2.5 mt-2">
            <Avatar name="Ashish Kumar" size="sm" />
            <div className="min-w-0">
              <p className="text-[12px] font-medium text-zinc-700 truncate leading-tight">
                Ashish Kumar
              </p>
              <p className="text-[10px] text-zinc-400 truncate leading-tight">
                ashish@acme.co
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="flex items-center justify-between px-6 py-3.5 border-b border-zinc-200/70 bg-white/50 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            {/* Breadcrumb */}
            <span className="text-[13px] text-zinc-400">Dashboard</span>
            <ChevronRight className="w-3 h-3 text-zinc-300" />
            <span className="text-[13px] font-medium text-zinc-800">
              Overview
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* Search */}
            <button className="flex items-center gap-2 px-3 py-[6px] rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 transition-colors text-zinc-400 text-[12px]">
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Search...</span>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-zinc-100 text-[10px] text-zinc-400 font-mono ml-3">
                ⌘K
              </kbd>
            </button>
            {/* Notification */}
            <button className="relative p-2 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 transition-colors">
              <Bell className="w-3.5 h-3.5 text-zinc-500" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-violet-500 rounded-full" />
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 space-y-5">
          {/* Welcome Banner */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
                Good morning, Ashish
              </h1>
              <p className="text-[13px] text-zinc-400 mt-0.5">
                Here&apos;s what&apos;s happening with your app today.
              </p>
            </div>
            <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 transition-colors text-white text-[13px] font-medium shadow-sm shadow-violet-600/20">
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Invite users</span>
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-xl border border-zinc-200/80 p-4 hover:shadow-sm hover:shadow-zinc-200/50 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-[11px] text-zinc-400 font-medium uppercase tracking-wide">
                    {stat.label}
                  </span>
                  <span
                    className={cn(
                      "inline-flex items-center gap-0.5 text-[11px] font-semibold",
                      stat.up ? "text-emerald-600" : "text-red-500"
                    )}
                  >
                    {stat.up ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    {stat.change}
                  </span>
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-2xl font-bold text-zinc-900 tracking-tight">
                    {stat.value}
                  </span>
                  <div className="opacity-60 group-hover:opacity-100 transition-opacity">
                    <MiniSparkline
                      data={stat.sparkline}
                      color={
                        stat.up ? "stroke-violet-500" : "stroke-red-400"
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Two Column: Recent Users + Auth Methods */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
            {/* Recent Users — 3 cols */}
            <div className="lg:col-span-3 bg-white rounded-xl border border-zinc-200/80 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100">
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="text-[13px] font-semibold text-zinc-800">
                    Recent Sign-ins
                  </span>
                </div>
                <button className="text-[11px] text-violet-600 font-medium hover:text-violet-700 transition-colors flex items-center gap-1">
                  View all
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              <div>
                {RECENT_USERS.map((user, i) => (
                  <div
                    key={user.email}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 hover:bg-zinc-50/60 transition-colors",
                      i < RECENT_USERS.length - 1 &&
                        "border-b border-zinc-50"
                    )}
                  >
                    <Avatar name={user.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-medium text-zinc-800 truncate">
                          {user.name}
                        </span>
                        <StatusDot status={user.status} />
                      </div>
                      <span className="text-[11px] text-zinc-400 truncate block">
                        {user.email}
                      </span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-500 font-medium shrink-0">
                      {user.method}
                    </span>
                    <span className="text-[11px] text-zinc-300 font-mono shrink-0 w-12 text-right">
                      {user.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Auth Methods — 2 cols */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-zinc-200/80 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100">
                <div className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="text-[13px] font-semibold text-zinc-800">
                    Auth Methods
                  </span>
                </div>
                <MoreHorizontal className="w-4 h-4 text-zinc-300" />
              </div>
              <div className="p-4 space-y-3">
                {AUTH_METHODS.map((m) => (
                  <div key={m.method}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[12px] text-zinc-600">
                        {m.method}
                      </span>
                      <span className="text-[11px] font-semibold text-zinc-800">
                        {m.pct}%
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-zinc-100 overflow-hidden">
                      <div
                        className={cn("h-full rounded-full transition-all", m.color)}
                        style={{ width: `${m.pct}%` }}
                      />
                    </div>
                  </div>
                ))}

                {/* Stacked Avatars */}
                <div className="pt-3 border-t border-zinc-100 mt-3">
                  <p className="text-[11px] text-zinc-400 mb-2">
                    Most active users today
                  </p>
                  <div className="flex items-center">
                    <div className="flex -space-x-2">
                      {RECENT_USERS.slice(0, 4).map((u) => (
                        <Avatar key={u.email} name={u.name} size="sm" />
                      ))}
                    </div>
                    <span className="text-[11px] text-zinc-400 ml-3">
                      +{RECENT_USERS.length - 4} more
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Log */}
          <div className="bg-white rounded-xl border border-zinc-200/80 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-zinc-400" />
                <span className="text-[13px] font-semibold text-zinc-800">
                  Event Log
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button className="text-[10px] px-2 py-1 rounded-md bg-violet-50 text-violet-600 font-medium">
                  All
                </button>
                <button className="text-[10px] px-2 py-1 rounded-md text-zinc-400 hover:bg-zinc-50 transition-colors font-medium">
                  Auth
                </button>
                <button className="text-[10px] px-2 py-1 rounded-md text-zinc-400 hover:bg-zinc-50 transition-colors font-medium">
                  API
                </button>
              </div>
            </div>
            <div className="divide-y divide-zinc-50">
              {EVENTS.map((evt, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-zinc-50/60 transition-colors"
                >
                  <div
                    className={cn(
                      "w-1.5 h-1.5 rounded-full shrink-0",
                      evt.type === "signin" && "bg-emerald-400",
                      evt.type === "key" && "bg-violet-400",
                      evt.type === "domain" && "bg-blue-400",
                      evt.type === "update" && "bg-amber-400",
                      evt.type === "warn" && "bg-red-400",
                      evt.type === "org" && "bg-purple-400"
                    )}
                  />
                  <span className="text-[12px] text-zinc-600 flex-1 truncate">
                    {evt.text}
                  </span>
                  <span className="text-[10px] text-zinc-300 font-mono shrink-0">
                    {evt.time} ago
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                icon: Key,
                label: "Create API Key",
                desc: "Generate a new key for your app",
                color: "text-violet-600 bg-violet-50",
              },
              {
                icon: FileText,
                label: "View Docs",
                desc: "Read the integration guide",
                color: "text-blue-600 bg-blue-50",
              },
              {
                icon: Globe,
                label: "Add Domain",
                desc: "Configure a custom domain",
                color: "text-emerald-600 bg-emerald-50",
              },
            ].map((action) => (
              <button
                key={action.label}
                className="flex items-start gap-3 p-4 bg-white rounded-xl border border-zinc-200/80 hover:shadow-sm hover:border-zinc-200 transition-all text-left group"
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                    action.color
                  )}
                >
                  <action.icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-zinc-800 group-hover:text-zinc-900 transition-colors">
                    {action.label}
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    {action.desc}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
