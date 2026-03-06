"use client";

import { cn } from "@/lib/utils";
import {
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Cpu,
  Database,
  Globe,
  HardDrive,
  Layers,
  MemoryStick,
  Monitor,
  Network,
  Radio,
  Server,
  Shield,
  Terminal,
  Wifi,
  Zap,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ChevronRight,
  Minus,
} from "lucide-react";
import { useState, useEffect } from "react";

// ─────────────────────────────────────────────────
// BLOOMBERG TERMINAL-STYLE DATA DASHBOARD
//
// Design DNA:
//   • Pure dark — #0C0C0E base, near-black cards
//   • Extreme information density — no wasted pixels
//   • Monospace everywhere, uppercase labels
//   • Neon accent colors: green (up), red (down),
//     amber (warn), cyan (info), white (neutral)
//   • Tickers, sparklines, heatmaps, status grids
//   • Thin 1px borders in zinc-800
//   • Data-first — every element conveys information
//   • Real-time feel with timestamps, blinking dots
// ─────────────────────────────────────────────────

const TICKER_DATA = [
  { symbol: "AAPL", price: "198.11", change: "+2.34", pct: "+1.19%", up: true },
  { symbol: "MSFT", price: "417.88", change: "+5.21", pct: "+1.26%", up: true },
  { symbol: "GOOGL", price: "174.52", change: "-1.08", pct: "-0.62%", up: false },
  { symbol: "NVDA", price: "878.36", change: "+18.44", pct: "+2.14%", up: true },
  { symbol: "AMZN", price: "185.07", change: "-0.93", pct: "-0.50%", up: false },
  { symbol: "META", price: "521.33", change: "+7.89", pct: "+1.54%", up: true },
  { symbol: "TSLA", price: "248.42", change: "-4.18", pct: "-1.65%", up: false },
  { symbol: "BRK.B", price: "414.20", change: "+1.05", pct: "+0.25%", up: true },
];

const SYSTEM_METRICS = [
  { label: "CPU LOAD", value: "34.2%", max: 100, current: 34.2, unit: "%", status: "ok" },
  { label: "MEMORY", value: "68.1%", max: 100, current: 68.1, unit: "%", status: "warn" },
  { label: "DISK I/O", value: "12.4MB/s", max: 100, current: 12.4, unit: "MB/s", status: "ok" },
  { label: "NETWORK", value: "847Mbps", max: 1000, current: 847, unit: "Mbps", status: "ok" },
  { label: "LATENCY", value: "2.4ms", max: 50, current: 2.4, unit: "ms", status: "ok" },
  { label: "ERRORS", value: "0.02%", max: 5, current: 0.02, unit: "%", status: "ok" },
];

const CLUSTER_NODES = [
  { id: "us-east-1a", status: "healthy", cpu: 28, mem: 52, pods: 142, uptime: "42d 8h" },
  { id: "us-east-1b", status: "healthy", cpu: 45, mem: 61, pods: 138, uptime: "42d 8h" },
  { id: "us-west-2a", status: "healthy", cpu: 31, mem: 48, pods: 96, uptime: "38d 2h" },
  { id: "us-west-2b", status: "warn", cpu: 78, mem: 84, pods: 184, uptime: "38d 2h" },
  { id: "eu-west-1a", status: "healthy", cpu: 22, mem: 39, pods: 87, uptime: "35d 14h" },
  { id: "eu-west-1b", status: "healthy", cpu: 35, mem: 55, pods: 91, uptime: "35d 14h" },
  { id: "ap-south-1a", status: "degraded", cpu: 92, mem: 91, pods: 201, uptime: "28d 6h" },
  { id: "ap-south-1b", status: "healthy", cpu: 41, mem: 57, pods: 104, uptime: "28d 6h" },
];

const RECENT_EVENTS = [
  { time: "14:23:08", level: "INFO", source: "api-gateway", msg: "Rate limit threshold adjusted to 10K/min" },
  { time: "14:22:54", level: "WARN", source: "ap-south-1a", msg: "Memory pressure detected — eviction started" },
  { time: "14:22:31", level: "INFO", source: "deploy-bot", msg: "Canary v2.18.4 promoted to 100% traffic" },
  { time: "14:22:12", level: "ERR", source: "payment-svc", msg: "Timeout connecting to Stripe — retry 2/3" },
  { time: "14:21:58", level: "INFO", source: "autoscaler", msg: "Scaled us-west-2 from 4→6 replicas" },
  { time: "14:21:44", level: "INFO", source: "cert-mgr", msg: "TLS certificate renewed for *.acme.io" },
  { time: "14:21:30", level: "WARN", source: "us-west-2b", msg: "CPU utilization above 75% threshold" },
  { time: "14:21:15", level: "INFO", source: "cdn-edge", msg: "Cache purge completed — 2.4M objects" },
];

const THROUGHPUT_DATA = [
  24, 28, 32, 30, 38, 42, 36, 45, 48, 42, 50, 55, 52, 58, 62, 56, 64, 68, 60, 72,
  75, 70, 78, 82, 76, 84, 80, 88, 85, 92, 88, 95, 90, 98, 94, 100, 96, 92, 88, 94,
];

const LATENCY_PERCENTILES = [
  { label: "p50", value: "1.2ms", bar: 12 },
  { label: "p75", value: "2.8ms", bar: 28 },
  { label: "p90", value: "5.4ms", bar: 54 },
  { label: "p95", value: "12.1ms", bar: 82 },
  { label: "p99", value: "48.2ms", bar: 96 },
];

const SERVICE_STATUS = [
  { name: "api-gateway", status: "ok", rps: "12.4K", latency: "1.8ms", errors: "0.01%" },
  { name: "auth-service", status: "ok", rps: "8.2K", latency: "2.1ms", errors: "0.00%" },
  { name: "payment-svc", status: "degraded", rps: "3.1K", latency: "48ms", errors: "2.14%" },
  { name: "user-service", status: "ok", rps: "6.7K", latency: "3.4ms", errors: "0.02%" },
  { name: "search-api", status: "ok", rps: "9.8K", latency: "8.2ms", errors: "0.05%" },
  { name: "notification", status: "ok", rps: "2.4K", latency: "1.2ms", errors: "0.00%" },
  { name: "analytics", status: "warn", rps: "15.2K", latency: "22ms", errors: "0.48%" },
  { name: "cdn-origin", status: "ok", rps: "28.4K", latency: "0.8ms", errors: "0.00%" },
];

const DEPLOY_HISTORY = [
  { version: "v2.18.4", env: "prod", time: "14:22", status: "live", author: "ci/cd" },
  { version: "v2.18.3", env: "prod", time: "12:05", status: "rolled-back", author: "ashish" },
  { version: "v2.18.4", env: "staging", time: "11:48", status: "passed", author: "ci/cd" },
  { version: "v2.18.3", env: "staging", time: "09:30", status: "passed", author: "priya" },
  { version: "v2.18.2", env: "prod", time: "yesterday", status: "live", author: "ci/cd" },
];

// Mini Sparkline (inline SVG, no deps)
function Sparkline({
  data,
  width = 80,
  height = 20,
  color = "#22c55e",
}: {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
}) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * (height - 2) - 1;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Horizontal bar that fills to a percentage, with color thresholds
function MetricBar({ pct, className }: { pct: number; className?: string }) {
  const color =
    pct > 80 ? "bg-red-500" : pct > 60 ? "bg-amber-500" : "bg-emerald-500";
  return (
    <div className={cn("h-[3px] bg-zinc-800 rounded-full overflow-hidden", className)}>
      <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${Math.min(pct, 100)}%` }} />
    </div>
  );
}

// Status indicator
function StatusIcon({ status }: { status: string }) {
  if (status === "ok" || status === "healthy" || status === "live" || status === "passed") {
    return <CheckCircle className="w-3 h-3 text-emerald-500 shrink-0" />;
  }
  if (status === "warn" || status === "degraded") {
    return <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0" />;
  }
  if (status === "err" || status === "rolled-back") {
    return <XCircle className="w-3 h-3 text-red-500 shrink-0" />;
  }
  return <Minus className="w-3 h-3 text-zinc-600 shrink-0" />;
}

// Blinking live dot
function LiveDot() {
  return (
    <span className="relative flex h-1.5 w-1.5">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
    </span>
  );
}

// Heatmap cell
function HeatCell({ value }: { value: number }) {
  const intensity =
    value > 85
      ? "bg-red-500/80"
      : value > 65
        ? "bg-amber-500/60"
        : value > 40
          ? "bg-emerald-500/40"
          : "bg-emerald-500/20";
  return (
    <div className={cn("w-3 h-3 rounded-[2px]", intensity)} title={`${value}%`} />
  );
}

export function TerminalDashboard() {
  const [currentTime, setCurrentTime] = useState("14:23:14");

  // Simulate a ticking clock for realism
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full min-h-[720px] bg-[#0C0C0E] rounded-xl overflow-hidden font-mono antialiased select-none text-[11px]">
      {/* ── TOP BAR — ticker + status ── */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-zinc-800 bg-[#0F0F12]">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-emerald-500" />
          <span className="text-emerald-500 font-bold text-[12px] tracking-tight">ACME OPS</span>
          <span className="text-zinc-600">|</span>
          <span className="text-zinc-500 text-[10px]">INFRASTRUCTURE DASHBOARD</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <LiveDot />
            <span className="text-emerald-500 text-[10px]">LIVE</span>
          </div>
          <span className="text-zinc-600">|</span>
          <span className="text-zinc-400 text-[10px] tabular-nums">{currentTime} UTC</span>
        </div>
      </div>

      {/* ── TICKER STRIP ── */}
      <div className="flex items-center gap-0 border-b border-zinc-800 overflow-hidden bg-[#0A0A0C]">
        <div className="flex items-center gap-0 overflow-x-auto scrollbar-none">
          {TICKER_DATA.map((t, i) => (
            <div
              key={t.symbol}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 shrink-0 border-r border-zinc-800/60",
                "hover:bg-zinc-800/30 transition-colors"
              )}
            >
              <span className="text-white font-bold text-[10px]">{t.symbol}</span>
              <span className="text-zinc-300 text-[10px] tabular-nums">{t.price}</span>
              <span
                className={cn(
                  "flex items-center gap-0.5 text-[9px] font-semibold tabular-nums",
                  t.up ? "text-emerald-400" : "text-red-400"
                )}
              >
                {t.up ? "▲" : "▼"}
                {t.pct}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── MAIN GRID ── */}
      <div className="p-2 space-y-2">
        {/* Row 1: System Metrics + Throughput + Latency */}
        <div className="grid grid-cols-12 gap-2">
          {/* System Metrics — 4 cols */}
          <div className="col-span-12 lg:col-span-4 border border-zinc-800 rounded-lg bg-[#0F0F12] overflow-hidden">
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-zinc-800 bg-zinc-900/30">
              <div className="flex items-center gap-1.5">
                <Cpu className="w-3 h-3 text-cyan-400" />
                <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">System Health</span>
              </div>
              <span className="text-[9px] text-zinc-600 tabular-nums">auto-refresh 5s</span>
            </div>
            <div className="p-2 space-y-2">
              {SYSTEM_METRICS.map((m) => (
                <div key={m.label} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-zinc-500 uppercase tracking-wider">{m.label}</span>
                    <span
                      className={cn(
                        "text-[10px] font-bold tabular-nums",
                        m.status === "warn" ? "text-amber-400" : "text-zinc-200"
                      )}
                    >
                      {m.value}
                    </span>
                  </div>
                  <MetricBar pct={(m.current / m.max) * 100} />
                </div>
              ))}
            </div>
          </div>

          {/* Throughput Chart — 5 cols */}
          <div className="col-span-12 lg:col-span-5 border border-zinc-800 rounded-lg bg-[#0F0F12] overflow-hidden">
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-zinc-800 bg-zinc-900/30">
              <div className="flex items-center gap-1.5">
                <Activity className="w-3 h-3 text-emerald-400" />
                <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">Throughput (req/s)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 text-[10px] font-bold tabular-nums">94.2K</span>
                <span className="text-[9px] text-emerald-500 flex items-center gap-0.5">
                  <ArrowUpRight className="w-2.5 h-2.5" />
                  +8.4%
                </span>
              </div>
            </div>
            <div className="p-3">
              {/* Mini bar chart */}
              <div className="flex items-end gap-[2px] h-[80px]">
                {THROUGHPUT_DATA.map((v, i) => {
                  const pct = (v / Math.max(...THROUGHPUT_DATA)) * 100;
                  const isRecent = i >= THROUGHPUT_DATA.length - 5;
                  return (
                    <div
                      key={i}
                      className={cn(
                        "flex-1 rounded-t-[1px] transition-all",
                        isRecent ? "bg-emerald-500" : "bg-emerald-500/30",
                        "hover:bg-emerald-400 cursor-crosshair"
                      )}
                      style={{ height: `${pct}%` }}
                    />
                  );
                })}
              </div>
              <div className="flex items-center justify-between mt-2 text-[8px] text-zinc-600 tabular-nums">
                <span>-20min</span>
                <span>-15min</span>
                <span>-10min</span>
                <span>-5min</span>
                <span className="text-emerald-500">now</span>
              </div>
            </div>
          </div>

          {/* Latency Percentiles — 3 cols */}
          <div className="col-span-12 lg:col-span-3 border border-zinc-800 rounded-lg bg-[#0F0F12] overflow-hidden">
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-zinc-800 bg-zinc-900/30">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-amber-400" />
                <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">Latency</span>
              </div>
            </div>
            <div className="p-3 space-y-2.5">
              {LATENCY_PERCENTILES.map((p) => (
                <div key={p.label} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-cyan-400 uppercase font-bold">{p.label}</span>
                    <span className="text-[10px] text-zinc-200 font-bold tabular-nums">{p.value}</span>
                  </div>
                  <div className="h-[3px] bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        p.bar > 80 ? "bg-red-500" : p.bar > 50 ? "bg-amber-500" : "bg-cyan-500"
                      )}
                      style={{ width: `${p.bar}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: Cluster Nodes + Service Status */}
        <div className="grid grid-cols-12 gap-2">
          {/* Cluster Nodes — 7 cols */}
          <div className="col-span-12 lg:col-span-7 border border-zinc-800 rounded-lg bg-[#0F0F12] overflow-hidden">
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-zinc-800 bg-zinc-900/30">
              <div className="flex items-center gap-1.5">
                <Server className="w-3 h-3 text-violet-400" />
                <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">Cluster Nodes</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-emerald-400">● 6 healthy</span>
                <span className="text-[9px] text-amber-400">● 1 warn</span>
                <span className="text-[9px] text-red-400">● 1 degraded</span>
              </div>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-12 gap-1 px-3 py-1 text-[8px] text-zinc-600 uppercase tracking-wider border-b border-zinc-800/60 font-bold">
              <div className="col-span-1">STS</div>
              <div className="col-span-3">NODE</div>
              <div className="col-span-2">CPU</div>
              <div className="col-span-2">MEM</div>
              <div className="col-span-2">PODS</div>
              <div className="col-span-2">UPTIME</div>
            </div>

            {/* Rows */}
            {CLUSTER_NODES.map((node) => (
              <div
                key={node.id}
                className="grid grid-cols-12 gap-1 px-3 py-1.5 items-center hover:bg-zinc-800/20 transition-colors border-b border-zinc-900/60"
              >
                <div className="col-span-1">
                  <StatusIcon status={node.status} />
                </div>
                <div className="col-span-3 text-[10px] text-zinc-300 font-medium">{node.id}</div>
                <div className="col-span-2">
                  <div className="flex items-center gap-1.5">
                    <MetricBar pct={node.cpu} className="flex-1" />
                    <span
                      className={cn(
                        "text-[9px] tabular-nums w-7 text-right font-bold",
                        node.cpu > 80 ? "text-red-400" : node.cpu > 60 ? "text-amber-400" : "text-zinc-400"
                      )}
                    >
                      {node.cpu}%
                    </span>
                  </div>
                </div>
                <div className="col-span-2">
                  <div className="flex items-center gap-1.5">
                    <MetricBar pct={node.mem} className="flex-1" />
                    <span
                      className={cn(
                        "text-[9px] tabular-nums w-7 text-right font-bold",
                        node.mem > 80 ? "text-red-400" : node.mem > 60 ? "text-amber-400" : "text-zinc-400"
                      )}
                    >
                      {node.mem}%
                    </span>
                  </div>
                </div>
                <div className="col-span-2 text-[10px] text-zinc-400 tabular-nums">{node.pods}</div>
                <div className="col-span-2 text-[10px] text-zinc-600 tabular-nums">{node.uptime}</div>
              </div>
            ))}
          </div>

          {/* Service Status — 5 cols */}
          <div className="col-span-12 lg:col-span-5 border border-zinc-800 rounded-lg bg-[#0F0F12] overflow-hidden">
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-zinc-800 bg-zinc-900/30">
              <div className="flex items-center gap-1.5">
                <Layers className="w-3 h-3 text-blue-400" />
                <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">Services</span>
              </div>
              <span className="text-[9px] text-zinc-600">8 running</span>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-12 gap-1 px-3 py-1 text-[8px] text-zinc-600 uppercase tracking-wider border-b border-zinc-800/60 font-bold">
              <div className="col-span-1">●</div>
              <div className="col-span-4">SERVICE</div>
              <div className="col-span-2">RPS</div>
              <div className="col-span-2">LAT</div>
              <div className="col-span-3">ERR%</div>
            </div>

            {SERVICE_STATUS.map((svc) => (
              <div
                key={svc.name}
                className="grid grid-cols-12 gap-1 px-3 py-1.5 items-center hover:bg-zinc-800/20 transition-colors border-b border-zinc-900/60"
              >
                <div className="col-span-1">
                  <StatusIcon status={svc.status} />
                </div>
                <div className="col-span-4 text-[10px] text-zinc-300 font-medium truncate">{svc.name}</div>
                <div className="col-span-2 text-[10px] text-zinc-400 tabular-nums">{svc.rps}</div>
                <div className="col-span-2">
                  <span
                    className={cn(
                      "text-[10px] tabular-nums font-bold",
                      parseFloat(svc.latency) > 20 ? "text-amber-400" : "text-zinc-400"
                    )}
                  >
                    {svc.latency}
                  </span>
                </div>
                <div className="col-span-3">
                  <span
                    className={cn(
                      "text-[10px] tabular-nums font-bold",
                      parseFloat(svc.errors) > 1
                        ? "text-red-400"
                        : parseFloat(svc.errors) > 0.1
                          ? "text-amber-400"
                          : "text-emerald-400"
                    )}
                  >
                    {svc.errors}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 3: Event Log + Deploys + Heatmap */}
        <div className="grid grid-cols-12 gap-2">
          {/* Event Log — 6 cols */}
          <div className="col-span-12 lg:col-span-6 border border-zinc-800 rounded-lg bg-[#0F0F12] overflow-hidden">
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-zinc-800 bg-zinc-900/30">
              <div className="flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-emerald-400" />
                <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">Event Stream</span>
              </div>
              <div className="flex items-center gap-1.5">
                <LiveDot />
                <span className="text-[9px] text-zinc-600">streaming</span>
              </div>
            </div>
            <div className="max-h-[200px] overflow-y-auto">
              {RECENT_EVENTS.map((evt, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 px-3 py-1.5 border-b border-zinc-900/60 hover:bg-zinc-800/20 transition-colors"
                >
                  <span className="text-[9px] text-zinc-600 tabular-nums shrink-0 mt-px w-14">{evt.time}</span>
                  <span
                    className={cn(
                      "text-[9px] font-bold shrink-0 w-8 mt-px",
                      evt.level === "INFO" && "text-cyan-400",
                      evt.level === "WARN" && "text-amber-400",
                      evt.level === "ERR" && "text-red-400"
                    )}
                  >
                    {evt.level}
                  </span>
                  <span className="text-[9px] text-violet-400 shrink-0 mt-px w-20 truncate">{evt.source}</span>
                  <span className="text-[10px] text-zinc-400 leading-tight">{evt.msg}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Deploy History — 3 cols */}
          <div className="col-span-12 lg:col-span-3 border border-zinc-800 rounded-lg bg-[#0F0F12] overflow-hidden">
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-zinc-800 bg-zinc-900/30">
              <div className="flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-amber-400" />
                <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">Deploys</span>
              </div>
            </div>
            <div>
              {DEPLOY_HISTORY.map((d, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-3 py-1.5 border-b border-zinc-900/60 hover:bg-zinc-800/20 transition-colors"
                >
                  <StatusIcon status={d.status} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-zinc-200 font-bold">{d.version}</span>
                      <span
                        className={cn(
                          "text-[8px] px-1 py-px rounded font-bold uppercase",
                          d.env === "prod"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-amber-500/20 text-amber-400"
                        )}
                      >
                        {d.env}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[9px] text-zinc-600">{d.author}</span>
                      <span className="text-[9px] text-zinc-700">·</span>
                      <span className="text-[9px] text-zinc-600 tabular-nums">{d.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CPU Heatmap + Quick Stats — 3 cols */}
          <div className="col-span-12 lg:col-span-3 space-y-2">
            {/* CPU Heatmap */}
            <div className="border border-zinc-800 rounded-lg bg-[#0F0F12] overflow-hidden">
              <div className="flex items-center justify-between px-3 py-1.5 border-b border-zinc-800 bg-zinc-900/30">
                <div className="flex items-center gap-1.5">
                  <BarChart3 className="w-3 h-3 text-emerald-400" />
                  <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">CPU Heatmap</span>
                </div>
              </div>
              <div className="p-3">
                <div className="grid grid-cols-8 gap-1">
                  {[28, 45, 31, 78, 22, 35, 92, 41, 52, 38, 66, 84, 29, 47, 88, 33,
                    44, 55, 72, 61, 38, 50, 95, 42, 25, 40, 58, 70, 34, 48, 82, 36].map((v, i) => (
                    <HeatCell key={i} value={v} />
                  ))}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[8px] text-zinc-600">low</span>
                  <div className="flex gap-0.5">
                    <div className="w-2 h-2 rounded-[1px] bg-emerald-500/20" />
                    <div className="w-2 h-2 rounded-[1px] bg-emerald-500/40" />
                    <div className="w-2 h-2 rounded-[1px] bg-amber-500/60" />
                    <div className="w-2 h-2 rounded-[1px] bg-red-500/80" />
                  </div>
                  <span className="text-[8px] text-zinc-600">high</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="border border-zinc-800 rounded-lg bg-[#0F0F12] overflow-hidden">
              <div className="p-2 space-y-1.5">
                {[
                  { label: "UPTIME", value: "99.97%", color: "text-emerald-400" },
                  { label: "TOTAL PODS", value: "1,043", color: "text-zinc-200" },
                  { label: "OPEN ALERTS", value: "3", color: "text-amber-400" },
                  { label: "DEPLOYMENTS", value: "47 /wk", color: "text-cyan-400" },
                ].map((s) => (
                  <div key={s.label} className="flex items-center justify-between px-1">
                    <span className="text-[8px] text-zinc-600 uppercase tracking-wider font-bold">{s.label}</span>
                    <span className={cn("text-[10px] font-bold tabular-nums", s.color)}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM STATUS BAR ── */}
      <div className="flex items-center justify-between px-3 py-1 border-t border-zinc-800 bg-[#0A0A0C] text-[9px]">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-emerald-400">
            <Shield className="w-2.5 h-2.5" />
            TLS OK
          </span>
          <span className="text-zinc-600">|</span>
          <span className="flex items-center gap-1 text-zinc-500">
            <Database className="w-2.5 h-2.5" />
            PG: 2.1ms
          </span>
          <span className="text-zinc-600">|</span>
          <span className="flex items-center gap-1 text-zinc-500">
            <HardDrive className="w-2.5 h-2.5" />
            Redis: 0.4ms
          </span>
          <span className="text-zinc-600">|</span>
          <span className="flex items-center gap-1 text-zinc-500">
            <Network className="w-2.5 h-2.5" />
            CDN: 42 PoPs
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-zinc-500">
            <Globe className="w-2.5 h-2.5" />
            3 regions
          </span>
          <span className="text-zinc-600">|</span>
          <span className="flex items-center gap-1 text-zinc-500">
            <Wifi className="w-2.5 h-2.5" />
            ws: connected
          </span>
          <span className="text-zinc-600">|</span>
          <span className="text-zinc-600 tabular-nums">v2.18.4</span>
        </div>
      </div>
    </div>
  );
}
