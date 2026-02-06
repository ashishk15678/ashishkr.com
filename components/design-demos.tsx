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
} from "lucide-react";

export function NebulaDashboard() {
  const stats = [
    { label: "Total Revenue", value: "$45,231", change: "+20.1%", up: true, icon: DollarSign },
    { label: "Active Users", value: "2,350", change: "+15.2%", up: true, icon: Users },
    { label: "Conversion", value: "3.24%", change: "-4.1%", up: false, icon: TrendingUp },
    { label: "Sessions", value: "12,789", change: "+8.3%", up: true, icon: Activity },
  ];

  const chartData = [65, 45, 78, 52, 85, 42, 90, 68, 75, 55, 88, 70];

  return (
    <div className="w-full min-h-[500px] bg-zinc-950 rounded-xl overflow-hidden p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Analytics Overview</h2>
          <p className="text-sm text-zinc-500">Track your metrics in real-time</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-xs rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors">
            7D
          </button>
          <button className="px-3 py-1.5 text-xs rounded-lg bg-violet-600 text-white">
            30D
          </button>
          <button className="px-3 py-1.5 text-xs rounded-lg bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-colors">
            90D
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <stat.icon className="w-4 h-4 text-zinc-500" />
              <span className={cn(
                "flex items-center text-xs font-medium",
                stat.up ? "text-emerald-400" : "text-red-400"
              )}>
                {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-xs text-zinc-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Chart Area */}
      <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-4 h-4 text-violet-400" />
          <span className="text-sm font-medium text-white">Revenue Trend</span>
        </div>
        <div className="h-40 flex items-end gap-2">
          {chartData.map((value, i) => (
            <div
              key={i}
              className="flex-1 bg-gradient-to-t from-violet-600 to-violet-400 rounded-t opacity-80 hover:opacity-100 transition-opacity"
              style={{ height: `${value}%` }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2 text-[10px] text-zinc-500">
          <span>Jan</span>
          <span>Feb</span>
          <span>Mar</span>
          <span>Apr</span>
          <span>May</span>
          <span>Jun</span>
          <span>Jul</span>
          <span>Aug</span>
          <span>Sep</span>
          <span>Oct</span>
          <span>Nov</span>
          <span>Dec</span>
        </div>
      </div>
    </div>
  );
}

export function AuroraHero() {
  return (
    <div className="relative w-full min-h-[500px] bg-zinc-950 rounded-xl overflow-hidden flex items-center justify-center">
      {/* Animated Aurora Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-gradient-to-br from-cyan-500/30 via-blue-500/20 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-gradient-to-tl from-violet-500/30 via-purple-500/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/4 right-1/4 w-1/3 h-1/3 bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-zinc-300 mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Now in public beta
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
          Build faster with{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
            Aurora
          </span>
        </h1>
        
        <p className="text-lg text-zinc-400 mb-8 max-w-xl mx-auto">
          The next-generation platform for teams who want to ship beautiful products without the complexity.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button className="px-6 py-3 rounded-lg bg-white text-zinc-900 font-medium hover:bg-zinc-100 transition-colors">
            Get Started Free
          </button>
          <button className="px-6 py-3 rounded-lg border border-zinc-700 text-white font-medium hover:bg-zinc-900 transition-colors">
            Watch Demo →
          </button>
        </div>

        {/* Trusted by */}
        <div className="mt-12 pt-8 border-t border-zinc-800">
          <p className="text-xs text-zinc-500 mb-4">TRUSTED BY LEADING COMPANIES</p>
          <div className="flex items-center justify-center gap-8 opacity-50">
            {["Vercel", "Stripe", "Linear", "Notion"].map((name) => (
              <span key={name} className="text-sm font-medium text-zinc-300">{name}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function MinimalDashboard() {
  const metrics = [
    { label: "Revenue", value: "$12,450", subtext: "vs $10,200 last month" },
    { label: "Orders", value: "1,245", subtext: "+12% from yesterday" },
    { label: "Customers", value: "8,432", subtext: "Active this week" },
  ];

  return (
    <div className="w-full min-h-[500px] bg-white dark:bg-zinc-900 rounded-xl overflow-hidden p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Dashboard</h2>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800" />
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {metrics.map((m) => (
          <div key={m.label} className="space-y-1">
            <p className="text-xs text-zinc-500 uppercase tracking-wider">{m.label}</p>
            <p className="text-2xl font-semibold text-zinc-900 dark:text-white">{m.value}</p>
            <p className="text-xs text-zinc-400">{m.subtext}</p>
          </div>
        ))}
      </div>

      {/* Activity */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-zinc-900 dark:text-white">Recent Activity</h3>
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
            <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700" />
            <div className="flex-1">
              <p className="text-sm text-zinc-900 dark:text-white">New order received</p>
              <p className="text-xs text-zinc-500">{i * 2} hours ago</p>
            </div>
            <span className="text-sm font-medium text-zinc-900 dark:text-white">+$299</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function GradientLanding() {
  return (
    <div className="w-full min-h-[500px] bg-gradient-to-br from-rose-500 via-orange-500 to-amber-500 rounded-xl overflow-hidden p-8 flex flex-col justify-center">
      <div className="max-w-2xl">
        <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-sm font-medium mb-6">
          New Release
        </span>
        
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Design that speaks. Code that delivers.
        </h1>
        
        <p className="text-lg text-white/80 mb-8">
          Create stunning experiences with our next-generation toolkit. No complexity, just results.
        </p>

        <div className="flex flex-wrap gap-4">
          <button className="px-6 py-3 rounded-lg bg-white text-rose-600 font-semibold shadow-lg hover:shadow-xl transition-shadow">
            Start Building
          </button>
          <button className="px-6 py-3 rounded-lg bg-white/10 text-white font-semibold border border-white/20 hover:bg-white/20 transition-colors">
            Learn More
          </button>
        </div>

        {/* Floating Elements */}
        <div className="flex gap-4 mt-12">
          <div className="px-4 py-2 rounded-lg bg-white/10 backdrop-blur text-white text-sm">
            ✨ 50k+ Users
          </div>
          <div className="px-4 py-2 rounded-lg bg-white/10 backdrop-blur text-white text-sm">
            ⚡ 99.9% Uptime
          </div>
        </div>
      </div>
    </div>
  );
}

export function FeatureHero() {
  const features = [
    { icon: "🚀", title: "Fast Deploy", desc: "Ship in seconds" },
    { icon: "🔒", title: "Secure", desc: "Enterprise-grade" },
    { icon: "📊", title: "Analytics", desc: "Real-time insights" },
    { icon: "🔄", title: "Sync", desc: "Always updated" },
  ];

  return (
    <div className="w-full min-h-[500px] bg-zinc-950 rounded-xl overflow-hidden p-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
          Everything you need to scale
        </h1>
        <p className="text-zinc-400 max-w-md mx-auto">
          Built for teams of all sizes. Start free, pay as you grow.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {features.map((f) => (
          <div
            key={f.title}
            className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800 text-center hover:border-zinc-700 transition-colors"
          >
            <span className="text-3xl mb-3 block">{f.icon}</span>
            <h3 className="text-white font-semibold mb-1">{f.title}</h3>
            <p className="text-sm text-zinc-500">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="text-center mt-10">
        <button className="px-8 py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold">
          Get Started Today
        </button>
      </div>
    </div>
  );
}

export function SaasLanding() {
  return (
    <div className="w-full min-h-[500px] bg-zinc-950 rounded-xl overflow-hidden">
      {/* Nav */}
      <nav className="flex items-center justify-between p-4 border-b border-zinc-800">
        <span className="text-lg font-bold text-white">SaaSify</span>
        <div className="flex gap-6 text-sm text-zinc-400">
          <span className="hover:text-white cursor-pointer">Features</span>
          <span className="hover:text-white cursor-pointer">Pricing</span>
          <span className="hover:text-white cursor-pointer">About</span>
        </div>
        <button className="px-4 py-1.5 rounded-lg bg-violet-600 text-white text-sm font-medium">
          Sign Up
        </button>
      </nav>

      {/* Hero */}
      <div className="p-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-3">
          The platform for modern teams
        </h1>
        <p className="text-zinc-400 mb-6 max-w-md mx-auto">
          Streamline your workflow with our all-in-one solution.
        </p>
        <button className="px-6 py-2 rounded-lg bg-white text-zinc-900 font-medium">
          Try Free for 14 Days
        </button>
      </div>

      {/* Pricing Preview */}
      <div className="px-8 pb-8">
        <div className="grid grid-cols-3 gap-4">
          {[
            { name: "Starter", price: "$9" },
            { name: "Pro", price: "$29", popular: true },
            { name: "Enterprise", price: "$99" },
          ].map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "p-4 rounded-lg border text-center",
                plan.popular
                  ? "border-violet-500 bg-violet-500/10"
                  : "border-zinc-800 bg-zinc-900/50"
              )}
            >
              <h3 className="text-white font-medium">{plan.name}</h3>
              <p className="text-2xl font-bold text-white my-2">{plan.price}</p>
              <p className="text-xs text-zinc-500">per month</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
