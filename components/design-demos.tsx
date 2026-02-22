"use client";

import { cn } from "@/lib/utils";
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Mail,
  Phone,
  Building2,
  Clock,
  CheckCircle2,
  Circle,
  Github,
  Chrome,
  Apple,
  Terminal,
  Zap,
  Shield,
  Cpu,
  Globe,
  ChevronRight,
  Check,
  Minus,
} from "lucide-react";

// ─────────────────────────────────────────────
// 1. OBSIDIAN DASHBOARD — Pure Black & White
// ─────────────────────────────────────────────

export function ObsidianDashboard() {
  const stats = [
    { label: "Revenue", value: "$84,230", change: "+12.5%", up: true, icon: DollarSign },
    { label: "Users", value: "12,461", change: "+8.1%", up: true, icon: Users },
    { label: "Conversion", value: "3.24%", change: "-2.4%", up: false, icon: TrendingUp },
    { label: "Sessions", value: "48,290", change: "+18.7%", up: true, icon: Activity },
  ];

  const chartData = [40, 65, 45, 78, 56, 85, 42, 90, 68, 75, 55, 88];

  const recentActivity = [
    { action: "New signup", detail: "user@example.com", time: "2m ago" },
    { action: "Payment received", detail: "$1,200.00", time: "5m ago" },
    { action: "Feature deployed", detail: "v2.4.1", time: "12m ago" },
    { action: "Report generated", detail: "Q4 Analytics", time: "1h ago" },
  ];

  return (
    <div className="w-full min-h-[520px] bg-black rounded-xl overflow-hidden font-sans">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-white rounded" />
          <span className="text-sm font-semibold text-white tracking-tight">Obsidian</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-white/40">Last synced 2m ago</span>
          <div className="w-7 h-7 rounded-full border border-white/20 flex items-center justify-center">
            <span className="text-xs text-white/60">AK</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="p-4 rounded-lg border border-white/10 bg-white/[0.02]"
            >
              <div className="flex items-center justify-between mb-3">
                <stat.icon className="w-4 h-4 text-white/30" />
                <span className={cn(
                  "flex items-center gap-0.5 text-[11px] font-mono",
                  stat.up ? "text-white" : "text-white/40"
                )}>
                  {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.change}
                </span>
              </div>
              <div className="text-xl font-bold text-white tracking-tight">{stat.value}</div>
              <div className="text-[11px] text-white/30 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="p-4 rounded-lg border border-white/10 bg-white/[0.02] mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-white/40" />
              <span className="text-sm font-medium text-white">Revenue Overview</span>
            </div>
            <div className="flex gap-1">
              {["7D", "30D", "90D"].map((label, i) => (
                <button
                  key={label}
                  className={cn(
                    "px-2.5 py-1 text-[10px] font-mono rounded",
                    i === 1 ? "bg-white text-black" : "text-white/40 hover:text-white/60"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="h-32 flex items-end gap-1.5">
            {chartData.map((value, i) => (
              <div
                key={i}
                className="flex-1 bg-white rounded-sm hover:bg-white/80 transition-colors"
                style={{ height: `${value}%`, opacity: 0.15 + (value / 100) * 0.85 }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-[9px] text-white/20 font-mono">
            {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(m => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="rounded-lg border border-white/10 bg-white/[0.02] overflow-hidden">
          <div className="px-4 py-3 border-b border-white/10">
            <span className="text-xs font-medium text-white/60 uppercase tracking-wider">Recent Activity</span>
          </div>
          {recentActivity.map((item, i) => (
            <div
              key={i}
              className={cn(
                "flex items-center justify-between px-4 py-3",
                i < recentActivity.length - 1 && "border-b border-white/5"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                <div>
                  <span className="text-sm text-white">{item.action}</span>
                  <span className="text-sm text-white/30 ml-2">{item.detail}</span>
                </div>
              </div>
              <span className="text-[11px] text-white/20 font-mono">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 2. SLATE CRM — Warm Gray Enterprise
// ─────────────────────────────────────────────

export function SlateCRM() {
  const contacts = [
    { name: "Sarah Chen", email: "sarah@acme.co", company: "Acme Corp", status: "Active", value: "$24,500" },
    { name: "James Wilson", email: "james@globex.io", company: "Globex Inc", status: "Pending", value: "$18,200" },
    { name: "Maria Gonzalez", email: "maria@stark.dev", company: "Stark Labs", status: "Active", value: "$32,100" },
    { name: "David Kim", email: "david@wayne.co", company: "Wayne Enterprises", status: "Closed", value: "$45,800" },
  ];

  const pipeline = [
    { stage: "Lead", count: 24, color: "bg-zinc-400" },
    { stage: "Qualified", count: 18, color: "bg-zinc-500" },
    { stage: "Proposal", count: 8, color: "bg-zinc-600" },
    { stage: "Closed", count: 12, color: "bg-zinc-700" },
  ];

  return (
    <div className="w-full min-h-[520px] bg-zinc-50 rounded-xl overflow-hidden font-sans">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-zinc-200">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-zinc-800 rounded flex items-center justify-center">
            <Building2 className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-semibold text-zinc-900 tracking-tight">Slate CRM</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-xs rounded-md bg-zinc-900 text-white font-medium">
            + New Contact
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Pipeline Overview */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {pipeline.map((p) => (
            <div key={p.stage} className="bg-white rounded-lg p-4 border border-zinc-200/80">
              <div className="flex items-center gap-2 mb-2">
                <div className={cn("w-2 h-2 rounded-full", p.color)} />
                <span className="text-xs text-zinc-500 font-medium">{p.stage}</span>
              </div>
              <div className="text-2xl font-bold text-zinc-900">{p.count}</div>
            </div>
          ))}
        </div>

        {/* Contacts Table */}
        <div className="bg-white rounded-lg border border-zinc-200/80 overflow-hidden">
          <div className="px-4 py-3 border-b border-zinc-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">Contacts</span>
              <span className="text-xs text-zinc-400">{contacts.length} total</span>
            </div>
          </div>
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-2 px-4 py-2 text-[10px] text-zinc-400 uppercase tracking-wider border-b border-zinc-100 font-medium">
            <div className="col-span-3">Name</div>
            <div className="col-span-3">Email</div>
            <div className="col-span-2">Company</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2 text-right">Value</div>
          </div>
          {/* Rows */}
          {contacts.map((contact, i) => (
            <div
              key={contact.name}
              className={cn(
                "grid grid-cols-12 gap-2 px-4 py-3 items-center hover:bg-zinc-50 transition-colors",
                i < contacts.length - 1 && "border-b border-zinc-50"
              )}
            >
              <div className="col-span-3 flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-zinc-200 flex items-center justify-center text-[10px] font-bold text-zinc-600">
                  {contact.name.split(" ").map(n => n[0]).join("")}
                </div>
                <span className="text-sm font-medium text-zinc-900 truncate">{contact.name}</span>
              </div>
              <div className="col-span-3 flex items-center gap-1.5">
                <Mail className="w-3 h-3 text-zinc-300" />
                <span className="text-xs text-zinc-500 truncate">{contact.email}</span>
              </div>
              <div className="col-span-2 text-xs text-zinc-500">{contact.company}</div>
              <div className="col-span-2">
                <span className={cn(
                  "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium",
                  contact.status === "Active" && "bg-zinc-100 text-zinc-700",
                  contact.status === "Pending" && "bg-zinc-100 text-zinc-500",
                  contact.status === "Closed" && "bg-zinc-200 text-zinc-400"
                )}>
                  {contact.status === "Active" ? <CheckCircle2 className="w-2.5 h-2.5" /> : <Circle className="w-2.5 h-2.5" />}
                  {contact.status}
                </span>
              </div>
              <div className="col-span-2 text-sm font-semibold text-zinc-900 text-right">{contact.value}</div>
            </div>
          ))}
        </div>

        {/* Activity Timeline */}
        <div className="mt-6 bg-white rounded-lg border border-zinc-200/80 p-4">
          <span className="text-xs font-semibold text-zinc-900 uppercase tracking-wider">Recent Activity</span>
          <div className="mt-3 space-y-3">
            {[
              { text: "Deal closed with Wayne Enterprises", time: "2 hours ago" },
              { text: "New lead assigned to pipeline", time: "4 hours ago" },
              { text: "Follow-up scheduled with Acme Corp", time: "Yesterday" },
            ].map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-1.5">
                  <Clock className="w-3 h-3 text-zinc-300" />
                </div>
                <div>
                  <p className="text-sm text-zinc-700">{a.text}</p>
                  <p className="text-[11px] text-zinc-400">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 3. IRIS AUTH — Clerk-Style Lavender
// ─────────────────────────────────────────────

export function IrisAuth() {
  return (
    <div className="relative w-full min-h-[520px] bg-gradient-to-br from-violet-50 via-purple-50/80 to-fuchsia-50/60 rounded-xl overflow-hidden flex items-center justify-center p-8">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-violet-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-purple-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-fuchsia-100/20 rounded-full blur-3xl" />
      </div>

      {/* Auth Card */}
      <div className="relative w-full max-w-[380px] bg-white/70 backdrop-blur-xl rounded-2xl border border-violet-200/50 shadow-xl shadow-violet-500/5 p-8">
        {/* Logo */}
        <div className="flex items-center justify-center mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <Shield className="w-5 h-5 text-white" />
          </div>
        </div>

        <h2 className="text-xl font-bold text-zinc-900 text-center mb-1">Sign in to Iris</h2>
        <p className="text-sm text-zinc-500 text-center mb-6">Welcome back! Please sign in to continue</p>

        {/* Social Buttons */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {[
            { icon: Github, label: "GitHub" },
            { icon: Chrome, label: "Google" },
            { icon: Apple, label: "Apple" },
          ].map((provider) => (
            <button
              key={provider.label}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg border border-violet-200/60 bg-white/60 hover:bg-violet-50 transition-colors text-zinc-700"
            >
              <provider.icon className="w-4 h-4" />
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-violet-200/60" />
          <span className="text-[11px] text-zinc-400 uppercase tracking-wider">or continue with</span>
          <div className="flex-1 h-px bg-violet-200/60" />
        </div>

        {/* Form Fields */}
        <div className="space-y-3 mb-6">
          <div>
            <label className="text-xs font-medium text-zinc-700 mb-1.5 block">Email address</label>
            <input
              type="email"
              placeholder="you@example.com"
              readOnly
              className="w-full px-3.5 py-2.5 rounded-lg border border-violet-200/60 bg-white/80 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-zinc-700 mb-1.5 block">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              readOnly
              className="w-full px-3.5 py-2.5 rounded-lg border border-violet-200/60 bg-white/80 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all"
            />
          </div>
        </div>

        {/* Sign In Button */}
        <button className="w-full py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-semibold shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 transition-shadow">
          Sign in
        </button>

        {/* OTP Section */}
        <div className="mt-6 pt-5 border-t border-violet-200/40">
          <p className="text-[11px] text-zinc-500 text-center mb-3 uppercase tracking-wider">Or enter verification code</p>
          <div className="flex gap-2 justify-center">
            {["3", "8", "4", "7", "", ""].map((digit, i) => (
              <div
                key={i}
                className={cn(
                  "w-10 h-11 rounded-lg border text-center leading-[44px] text-lg font-mono font-bold transition-all",
                  digit
                    ? "border-violet-300 bg-violet-50/50 text-violet-700"
                    : "border-violet-200/60 bg-white/60 text-zinc-300"
                )}
              >
                {digit || "·"}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-[11px] text-zinc-400 text-center mt-6">
          Don&apos;t have an account?{" "}
          <span className="text-violet-600 font-medium cursor-pointer hover:underline">Sign up</span>
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 4. VOLT LANDING — Neon Lime Developer Page
// ─────────────────────────────────────────────

export function VoltLanding() {
  const features = [
    { icon: Terminal, title: "CLI-First", desc: "Built for the terminal" },
    { icon: Zap, title: "Blazing Fast", desc: "Sub-millisecond deploys" },
    { icon: Shield, title: "Secure", desc: "Zero-trust by default" },
    { icon: Cpu, title: "Edge Ready", desc: "Global edge network" },
  ];

  return (
    <div className="w-full min-h-[520px] bg-zinc-950 rounded-xl overflow-hidden font-sans">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-lime-400" />
          <span className="text-sm font-bold text-white tracking-tight">volt</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex gap-5 text-xs text-zinc-500">
            {["Docs", "Pricing", "Blog", "Changelog"].map(item => (
              <span key={item} className="hover:text-white transition-colors cursor-pointer">{item}</span>
            ))}
          </div>
          <button className="px-3 py-1.5 text-xs rounded-md bg-lime-400 text-zinc-950 font-bold hover:bg-lime-300 transition-colors">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="px-6 pt-12 pb-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-lime-400/20 bg-lime-400/5 text-xs text-lime-400 mb-6 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />
          v2.0 just shipped
        </div>

        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
          Deploy at the speed<br />
          of <span className="text-lime-400">thought</span>
        </h1>

        <p className="text-zinc-500 max-w-lg mx-auto mb-8 text-sm leading-relaxed">
          The infrastructure platform built for developers who ship fast.
          Zero config. Global edge. Instant rollbacks.
        </p>

        {/* Terminal Block */}
        <div className="max-w-md mx-auto mb-10 rounded-lg border border-zinc-800 bg-zinc-900/80 overflow-hidden text-left">
          <div className="flex items-center gap-1.5 px-3 py-2 border-b border-zinc-800">
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
            <span className="text-[10px] text-zinc-600 ml-2 font-mono">terminal</span>
          </div>
          <div className="p-4 font-mono text-sm">
            <div className="text-zinc-500">
              <span className="text-lime-400">$</span> npx volt deploy
            </div>
            <div className="text-zinc-600 mt-1">
              <span className="text-zinc-500">▸</span> Building... <span className="text-lime-400">done</span> (0.8s)
            </div>
            <div className="text-zinc-600">
              <span className="text-zinc-500">▸</span> Deploying to 42 regions... <span className="text-lime-400">done</span>
            </div>
            <div className="text-zinc-600 mt-1">
              <span className="text-lime-400">✓</span> <span className="text-white">https://my-app.volt.sh</span>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="px-6 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="p-4 rounded-lg border border-zinc-800 bg-zinc-900/30 hover:border-lime-400/20 hover:bg-lime-400/[0.02] transition-all group"
            >
              <f.icon className="w-5 h-5 text-lime-400/60 mb-3 group-hover:text-lime-400 transition-colors" />
              <h3 className="text-white text-sm font-semibold mb-1">{f.title}</h3>
              <p className="text-[11px] text-zinc-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 5. MONO SAAS — Shadcn-Style Black on White
// ─────────────────────────────────────────────

export function MonoSaas() {
  const plans = [
    { name: "Free", price: "$0", period: "/forever", features: [true, true, false, false, false] },
    { name: "Pro", price: "$29", period: "/month", features: [true, true, true, true, false], popular: true },
    { name: "Enterprise", price: "$99", period: "/month", features: [true, true, true, true, true] },
  ];

  const featureNames = [
    "Up to 3 projects",
    "Community support",
    "Custom domains",
    "Advanced analytics",
    "Dedicated account manager",
  ];

  return (
    <div className="w-full min-h-[520px] bg-white rounded-xl overflow-hidden font-sans">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
        <div className="flex items-center gap-6">
          <span className="text-sm font-bold text-zinc-900 tracking-tight">mono</span>
          <div className="hidden md:flex gap-5 text-xs text-zinc-400">
            {["Product", "Solutions", "Pricing", "Docs"].map(item => (
              <span key={item} className="hover:text-zinc-900 transition-colors cursor-pointer">{item}</span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-xs text-zinc-600 hover:text-zinc-900 transition-colors">
            Sign in
          </button>
          <button className="px-3 py-1.5 text-xs rounded-md bg-zinc-900 text-white font-medium">
            Start Free
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="px-6 pt-14 pb-10 text-center border-b border-zinc-100">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-zinc-200 text-[11px] text-zinc-500 mb-5">
          <Globe className="w-3 h-3" />
          Trusted by 10,000+ teams
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 tracking-tight mb-3">
          The platform for
          <br />
          modern teams
        </h1>

        <p className="text-zinc-500 max-w-md mx-auto mb-7 text-sm">
          Everything you need to build, ship, and scale. No complexity, just clarity.
        </p>

        <div className="flex items-center justify-center gap-3">
          <button className="px-5 py-2.5 rounded-lg bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 transition-colors">
            Get started
            <ChevronRight className="w-3.5 h-3.5 inline ml-1" />
          </button>
          <button className="px-5 py-2.5 rounded-lg border border-zinc-200 text-zinc-700 text-sm font-medium hover:bg-zinc-50 transition-colors">
            View demo
          </button>
        </div>
      </div>

      {/* Pricing */}
      <div className="px-6 py-8">
        <p className="text-xs text-zinc-400 uppercase tracking-wider text-center mb-6 font-medium">Pricing</p>
        <div className="grid grid-cols-3 gap-3 mb-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "p-5 rounded-xl border text-center",
                plan.popular ? "border-zinc-900 ring-1 ring-zinc-900" : "border-zinc-200"
              )}
            >
              {plan.popular && (
                <span className="inline-block px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-full bg-zinc-900 text-white mb-3">
                  Popular
                </span>
              )}
              <h3 className="text-sm font-semibold text-zinc-900">{plan.name}</h3>
              <div className="mt-2 mb-4">
                <span className="text-2xl font-bold text-zinc-900">{plan.price}</span>
                <span className="text-xs text-zinc-400">{plan.period}</span>
              </div>
              <div className="space-y-2">
                {plan.features.map((has, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    {has ? (
                      <Check className="w-3 h-3 text-zinc-900" />
                    ) : (
                      <Minus className="w-3 h-3 text-zinc-300" />
                    )}
                    <span className={has ? "text-zinc-700" : "text-zinc-300"}>{featureNames[i]}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
