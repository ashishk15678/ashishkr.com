"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  Crosshair,
  MapPin,
  Navigation,
  Radar,
  Route,
  Shield,
  Signal,
  Sparkles,
  TrafficCone,
  TriangleAlert,
  Zap,
} from "lucide-react";

/**
 * CYBERPUNK MAP APP LANDING (Cyberpunk 2077-ish vibe)
 * - Neon gradients, glow, scanlines, grid, noisy hologram look
 * - Traffic light totem + street symbols
 * - Futuristic map card with routes, POIs, legend, telemetry
 *
 * Notes:
 * - Pure Tailwind CSS utility styling (no external CSS files).
 * - Uses lightweight inline SVGs for map + icons.
 * - Subtle animations are intentionally low-intensity for readability.
 */

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function useNow(tickMs = 1000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), tickMs);
    return () => clearInterval(t);
  }, [tickMs]);
  return now;
}

function NoiseOverlay() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.16] mix-blend-overlay"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E\")",
      }}
    />
  );
}

function Scanlines() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.18]"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, rgba(0,0,0,0) 1px)",
        backgroundSize: "100% 6px",
      }}
    />
  );
}

function NeonBorder({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "relative rounded-2xl",
        "bg-zinc-950/60",
        "border border-zinc-800/60",
        "shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_20px_80px_rgba(0,0,0,0.8)]",
        className,
      )}
    >
      {/* Glow ring */}
      <div
        className="pointer-events-none absolute -inset-[1px] rounded-2xl opacity-80"
        style={{
          background:
            "linear-gradient(135deg, rgba(34,211,238,0.35), rgba(168,85,247,0.25), rgba(251,113,133,0.20), rgba(250,204,21,0.20))",
          filter: "blur(10px)",
        }}
      />
      <div className="relative rounded-2xl overflow-hidden">{children}</div>
    </div>
  );
}

function Pill({
  children,
  tone = "cyan",
}: {
  children: React.ReactNode;
  tone?: "cyan" | "pink" | "amber" | "lime" | "violet";
}) {
  const tones: Record<string, string> = {
    cyan: "border-cyan-400/40 text-cyan-200 bg-cyan-500/10",
    pink: "border-pink-400/40 text-pink-200 bg-pink-500/10",
    amber: "border-amber-400/40 text-amber-200 bg-amber-500/10",
    lime: "border-lime-400/40 text-lime-200 bg-lime-500/10",
    violet: "border-violet-400/40 text-violet-200 bg-violet-500/10",
  };
  return (
    <span
      className={cx(
        "inline-flex items-center gap-2",
        "px-3 py-1 rounded-full text-[11px] tracking-wider uppercase font-mono",
        "border",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}

function TrafficLightTotem() {
  return (
    <div className="relative w-full max-w-[340px]">
      <div className="absolute inset-0 rounded-3xl opacity-80 blur-2xl bg-gradient-to-b from-emerald-400/25 via-amber-400/20 to-rose-500/25" />
      <div className="relative rounded-3xl border border-zinc-800/60 bg-zinc-950/50 overflow-hidden">
        <div className="absolute inset-0">
          <NoiseOverlay />
          <Scanlines />
          <div
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                "radial-gradient(circle at 15% 20%, rgba(34,211,238,0.22), transparent 55%), radial-gradient(circle at 85% 30%, rgba(168,85,247,0.18), transparent 55%), radial-gradient(circle at 45% 85%, rgba(250,204,21,0.16), transparent 55%)",
            }}
          />
        </div>

        <div className="relative p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.8)]" />
              <span className="text-xs font-mono tracking-widest text-zinc-300">
                TRAFFIC-NODE // A-17
              </span>
            </div>
            <span className="text-[10px] font-mono tracking-widest text-zinc-500">
              SYNCHRONIZED
            </span>
          </div>

          <div className="grid grid-cols-[1fr_auto] gap-6 items-center">
            <div>
              <div className="text-sm text-zinc-300 leading-relaxed">
                Street signals rendered as a{" "}
                <span className="text-cyan-200">neon HUD</span>. Monitor
                congestion, incident heat, and route priority in a single glance.
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <Pill tone="lime">
                  <Signal className="w-3.5 h-3.5" />
                  98.2% UPTIME
                </Pill>
                <Pill tone="amber">
                  <TriangleAlert className="w-3.5 h-3.5" />
                  GRID ALERT
                </Pill>
                <Pill tone="violet">
                  <Shield className="w-3.5 h-3.5" />
                  ENCRYPTED
                </Pill>
              </div>
            </div>

            {/* The actual "traffic lights" */}
            <div className="relative">
              <div className="absolute -inset-6 rounded-3xl bg-gradient-to-b from-emerald-400/20 via-amber-400/20 to-rose-500/20 blur-xl" />
              <div className="relative w-[92px] rounded-2xl border border-zinc-800/70 bg-zinc-950/70 p-3">
                <div className="flex flex-col gap-3">
                  <div className="relative h-14 rounded-xl border border-zinc-800/70 bg-zinc-900/40 overflow-hidden">
                    <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_50%_40%,rgba(248,113,113,0.35),transparent_60%)]" />
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-rose-500 shadow-[0_0_35px_rgba(244,63,94,0.95)]" />
                  </div>

                  <div className="relative h-14 rounded-xl border border-zinc-800/70 bg-zinc-900/40 overflow-hidden">
                    <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_50%_40%,rgba(250,204,21,0.30),transparent_60%)]" />
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-amber-400 shadow-[0_0_35px_rgba(250,204,21,0.9)] animate-pulse" />
                  </div>

                  <div className="relative h-14 rounded-xl border border-zinc-800/70 bg-zinc-900/40 overflow-hidden">
                    <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_50%_40%,rgba(74,222,128,0.25),transparent_60%)]" />
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-emerald-400 shadow-[0_0_35px_rgba(74,222,128,0.9)]" />
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-zinc-800/60">
                  <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-zinc-400">
                    <span>MODE</span>
                    <span className="text-cyan-200">ADAPT</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Symbols row */}
          <div className="mt-6 grid grid-cols-4 gap-3">
            {[
              { icon: <TrafficCone className="w-4 h-4" />, label: "WORKS", c: "text-amber-200" },
              { icon: <Radar className="w-4 h-4" />, label: "SCAN", c: "text-cyan-200" },
              { icon: <Zap className="w-4 h-4" />, label: "BOOST", c: "text-lime-200" },
              { icon: <Crosshair className="w-4 h-4" />, label: "LOCK", c: "text-pink-200" },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-zinc-800/60 bg-zinc-950/40 p-3"
              >
                <div className={cx("flex items-center gap-2", s.c)}>
                  {s.icon}
                  <span className="text-[10px] font-mono tracking-widest">
                    {s.label}
                  </span>
                </div>
                <div className="mt-2 h-1 rounded-full bg-zinc-900 overflow-hidden">
                  <div
                    className="h-full w-[72%]"
                    style={{
                      background:
                        "linear-gradient(90deg, rgba(34,211,238,0.0), rgba(34,211,238,0.9), rgba(168,85,247,0.8))",
                      boxShadow: "0 0 18px rgba(34,211,238,0.55)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniMapHUD() {
  const now = useNow(1000);

  const [cursor, setCursor] = useState({ x: 58, y: 42 });
  useEffect(() => {
    const t = setInterval(() => {
      setCursor((p) => ({
        x: clamp(p.x + (Math.random() * 6 - 3), 10, 92),
        y: clamp(p.y + (Math.random() * 6 - 3), 12, 88),
      }));
    }, 700);
    return () => clearInterval(t);
  }, []);

  const dayCode = useMemo(() => {
    const d = now.getUTCDate();
    const h = now.getUTCHours();
    return `NC-${String(d).padStart(2, "0")}${String(h).padStart(2, "0")}`;
  }, [now]);

  return (
    <NeonBorder className="w-full">
      <div className="relative">
        <div className="absolute inset-0">
          <NoiseOverlay />
          <Scanlines />
          {/* neon backdrop */}
          <div className="absolute -inset-[40px] opacity-70 blur-3xl bg-[radial-gradient(circle_at_20%_30%,rgba(34,211,238,0.25),transparent_55%),radial-gradient(circle_at_75%_35%,rgba(168,85,247,0.22),transparent_55%),radial-gradient(circle_at_45%_80%,rgba(251,113,133,0.18),transparent_55%),radial-gradient(circle_at_85%_85%,rgba(250,204,21,0.15),transparent_55%)]" />
          {/* grid */}
          <div
            className="absolute inset-0 opacity-[0.28]"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(34,211,238,0.10) 1px, rgba(0,0,0,0) 1px), linear-gradient(to bottom, rgba(168,85,247,0.10) 1px, rgba(0,0,0,0) 1px)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>

        <div className="relative p-6 sm:p-7 md:p-8">
          {/* top bar */}
          <div className="flex items-start justify-between gap-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-[0.3em] text-zinc-400">
                  MAP-APP / CYBER ROUTING
                </span>
                <span className="h-1 w-1 rounded-full bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.9)]" />
                <span className="text-[10px] font-mono tracking-[0.3em] text-cyan-200">
                  LIVE
                </span>
              </div>
              <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight text-zinc-50">
                Neon navigation for the city that never sleeps.
              </h2>
              <p className="mt-3 max-w-xl text-sm md:text-[15px] leading-relaxed text-zinc-300">
                Plot routes through{" "}
                <span className="text-cyan-200">traffic light phases</span>,
                hazard zones, and ad-drenched backstreets. Your map becomes a HUD:
                loud, crisp, and dangerously beautiful.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <Pill tone="cyan">
                  <Navigation className="w-3.5 h-3.5" />
                  SMART ROUTES
                </Pill>
                <Pill tone="pink">
                  <Sparkles className="w-3.5 h-3.5" />
                  NEON THEMES
                </Pill>
                <Pill tone="amber">
                  <Route className="w-3.5 h-3.5" />
                  MULTI-STOP
                </Pill>
              </div>
            </div>

            {/* mini telemetry */}
            <div className="hidden md:block shrink-0">
              <div className="rounded-xl border border-zinc-800/60 bg-zinc-950/45 p-4 w-[240px]">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-mono tracking-widest text-zinc-400">
                    SESSION
                  </div>
                  <div className="text-[10px] font-mono tracking-widest text-zinc-500">
                    {dayCode}
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  {[
                    { k: "SIGNALS", v: "1,284", tone: "text-lime-200" },
                    { k: "INCIDENTS", v: "07", tone: "text-amber-200" },
                    { k: "ROUTES", v: "12", tone: "text-cyan-200" },
                    { k: "SECURE", v: "ON", tone: "text-violet-200" },
                  ].map((m) => (
                    <div
                      key={m.k}
                      className="rounded-lg border border-zinc-800/60 bg-zinc-950/30 p-3"
                    >
                      <div className="text-[10px] font-mono tracking-widest text-zinc-500">
                        {m.k}
                      </div>
                      <div className={cx("mt-1 text-lg font-mono", m.tone)}>
                        {m.v}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex items-center justify-between rounded-lg border border-zinc-800/60 bg-zinc-950/25 px-3 py-2">
                  <div className="text-[10px] font-mono tracking-widest text-zinc-500">
                    UTC
                  </div>
                  <div className="text-[11px] font-mono tracking-widest text-zinc-300">
                    {now.toUTCString().slice(17, 25)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA row */}
          <div className="mt-7 flex flex-col sm:flex-row gap-3 sm:items-center">
            <button
              className={cx(
                "inline-flex items-center justify-center gap-2",
                "rounded-xl px-5 py-3",
                "text-sm font-semibold tracking-wide",
                "bg-gradient-to-r from-cyan-400/20 via-violet-500/20 to-pink-500/20",
                "border border-cyan-400/40",
                "text-zinc-50",
                "shadow-[0_0_28px_rgba(34,211,238,0.25)]",
                "hover:shadow-[0_0_40px_rgba(168,85,247,0.28)] hover:border-violet-400/50",
                "transition",
              )}
              type="button"
            >
              Launch map HUD <ArrowUpRight className="w-4 h-4" />
            </button>

            <button
              className={cx(
                "inline-flex items-center justify-center gap-2",
                "rounded-xl px-5 py-3",
                "text-sm font-semibold tracking-wide",
                "bg-zinc-950/40",
                "border border-zinc-800/70",
                "text-zinc-200",
                "hover:border-zinc-700 hover:bg-zinc-950/55",
                "transition",
              )}
              type="button"
            >
              Watch route demo <Zap className="w-4 h-4 text-amber-200" />
            </button>

            <div className="sm:ml-auto flex items-center gap-2 text-[10px] font-mono tracking-widest text-zinc-500">
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_20px_rgba(74,222,128,0.85)]" />
                SIGNAL LOCKED
              </span>
              <span className="mx-2 h-3 w-px bg-zinc-800" />
              <span>EDGE CACHE // ON</span>
            </div>
          </div>

          {/* Map card */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1.4fr_0.9fr] gap-6">
            <div className="rounded-2xl border border-zinc-800/60 bg-zinc-950/35 overflow-hidden relative">
              {/* hologram sweep */}
              <div
                className="pointer-events-none absolute -inset-x-24 -top-16 h-36 rotate-[-8deg] opacity-25"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(34,211,238,0.55), rgba(168,85,247,0.55), transparent)",
                  filter: "blur(10px)",
                }}
              />
              <div className="absolute inset-0">
                <NoiseOverlay />
              </div>

              <div className="relative p-5 sm:p-6">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-cyan-200" />
                    <div className="text-xs font-mono tracking-widest text-zinc-300">
                      NIGHT CITY // SECTOR 12
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-zinc-500">
                    <span className="text-cyan-200">CURSOR</span>
                    <span className="text-zinc-400">
                      {Math.round(cursor.x)}.{Math.round(cursor.y)}
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-zinc-800/60 bg-zinc-950/45 overflow-hidden">
                  <CyberMapSVG cursor={cursor} />
                </div>

                {/* legend */}
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                  <LegendSwatch label="Primary Route" color="from-cyan-300 to-violet-400" />
                  <LegendSwatch label="Alt Route" color="from-amber-300 to-pink-400" />
                  <LegendDot label="POI Node" dot="bg-emerald-400" />
                  <LegendDot label="Hazard" dot="bg-rose-500" />
                </div>
              </div>
            </div>

            {/* Right side cards */}
            <div className="space-y-4">
              <div className="rounded-2xl border border-zinc-800/60 bg-zinc-950/35 p-5 relative overflow-hidden">
                <div className="absolute inset-0">
                  <Scanlines />
                </div>
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] font-mono tracking-widest text-zinc-500">
                      ROUTE PRIORITY
                    </div>
                    <div className="text-[10px] font-mono tracking-widest text-cyan-200">
                      ADAPTIVE
                    </div>
                  </div>

                  <div className="mt-3 space-y-3">
                    <RouteRow name="Green-wave signals" pct={82} tone="cyan" />
                    <RouteRow name="Incident avoidance" pct={64} tone="amber" />
                    <RouteRow name="Stealth lanes" pct={43} tone="violet" />
                    <RouteRow name="Scenic neon" pct={71} tone="pink" />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-800/60 bg-zinc-950/35 p-5 relative overflow-hidden">
                <div className="absolute -inset-10 opacity-60 blur-2xl bg-[radial-gradient(circle_at_30%_20%,rgba(74,222,128,0.18),transparent_60%),radial-gradient(circle_at_80%_70%,rgba(34,211,238,0.18),transparent_60%),radial-gradient(circle_at_25%_85%,rgba(250,204,21,0.14),transparent_60%)]" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Radar className="w-4 h-4 text-emerald-200" />
                      <div className="text-xs font-mono tracking-widest text-zinc-300">
                        LIVE FEED
                      </div>
                    </div>
                    <span className="text-[10px] font-mono tracking-widest text-zinc-500">
                      STREAMING
                    </span>
                  </div>

                  <div className="space-y-2">
                    <FeedItem
                      tone="cyan"
                      title="Signal sync updated"
                      desc="Green wave recalculated for 3.2 km"
                      meta="T+00:12"
                    />
                    <FeedItem
                      tone="amber"
                      title="Slowdown detected"
                      desc="Downtown junction // 14% congestion"
                      meta="T+00:27"
                    />
                    <FeedItem
                      tone="pink"
                      title="New POI ping"
                      desc="Noodle bar // 2 min detour"
                      meta="T+00:41"
                    />
                    <FeedItem
                      tone="rose"
                      title="Hazard zone"
                      desc="Roadworks // reroute recommended"
                      meta="T+00:58"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-800/60 bg-zinc-950/35 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[10px] font-mono tracking-widest text-zinc-500">
                      READY TO JACK IN?
                    </div>
                    <div className="mt-2 text-sm text-zinc-300 leading-relaxed">
                      Build a map app landing that screams{" "}
                      <span className="text-pink-200">neon</span> and{" "}
                      <span className="text-cyan-200">chrome</span>.
                    </div>
                  </div>
                  <div className="h-10 w-10 rounded-xl border border-zinc-800/60 bg-zinc-950/40 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-violet-200" />
                  </div>
                </div>

                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  <button
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold tracking-wide border border-pink-400/40 bg-pink-500/10 text-zinc-50 hover:bg-pink-500/15 transition"
                    type="button"
                  >
                    Get early access <ArrowUpRight className="w-4 h-4" />
                  </button>
                  <button
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold tracking-wide border border-zinc-800/70 bg-zinc-950/35 text-zinc-200 hover:border-zinc-700 hover:bg-zinc-950/50 transition"
                    type="button"
                  >
                    Docs <Shield className="w-4 h-4 text-cyan-200" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* bottom strip */}
          <div className="mt-7 flex flex-col md:flex-row md:items-center gap-3 md:justify-between text-[10px] font-mono tracking-widest text-zinc-500">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.9)]" />
                VECTOR MAPS
              </span>
              <span className="h-3 w-px bg-zinc-800 hidden sm:block" />
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_20px_rgba(250,204,21,0.75)]" />
                TRAFFIC SIGNALS
              </span>
              <span className="h-3 w-px bg-zinc-800 hidden sm:block" />
              <span className="inline-flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_20px_rgba(74,222,128,0.75)]" />
                INCIDENT RADAR
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-zinc-400">BUILD</span>
              <span className="text-cyan-200">CY-77</span>
              <span className="text-zinc-600">/</span>
              <span>HARDENED UI STACK</span>
            </div>
          </div>
        </div>
      </div>
    </NeonBorder>
  );
}

function LegendSwatch({ label, color }: { label: string; color: string }) {
  return (
    <div className="rounded-xl border border-zinc-800/60 bg-zinc-950/35 px-3 py-2">
      <div className="text-[10px] font-mono tracking-widest text-zinc-500">
        {label}
      </div>
      <div className="mt-2 h-1.5 rounded-full bg-zinc-900 overflow-hidden">
        <div
          className={cx("h-full w-full bg-gradient-to-r", color)}
          style={{ boxShadow: "0 0 18px rgba(34,211,238,0.35)" }}
        />
      </div>
    </div>
  );
}

function LegendDot({ label, dot }: { label: string; dot: string }) {
  return (
    <div className="rounded-xl border border-zinc-800/60 bg-zinc-950/35 px-3 py-2 flex items-center justify-between">
      <div className="text-[10px] font-mono tracking-widest text-zinc-500">
        {label}
      </div>
      <span
        className={cx(
          "h-2.5 w-2.5 rounded-full",
          dot,
          "shadow-[0_0_18px_rgba(255,255,255,0.25)]",
        )}
      />
    </div>
  );
}

function RouteRow({
  name,
  pct,
  tone,
}: {
  name: string;
  pct: number;
  tone: "cyan" | "amber" | "violet" | "pink";
}) {
  const toneMap: Record<string, { bar: string; glow: string; text: string }> = {
    cyan: {
      bar: "from-cyan-300 to-violet-400",
      glow: "rgba(34,211,238,0.35)",
      text: "text-cyan-200",
    },
    amber: {
      bar: "from-amber-300 to-pink-400",
      glow: "rgba(250,204,21,0.30)",
      text: "text-amber-200",
    },
    violet: {
      bar: "from-violet-400 to-pink-400",
      glow: "rgba(168,85,247,0.30)",
      text: "text-violet-200",
    },
    pink: {
      bar: "from-pink-400 to-cyan-300",
      glow: "rgba(244,114,182,0.30)",
      text: "text-pink-200",
    },
  };

  const t = toneMap[tone];

  return (
    <div className="rounded-xl border border-zinc-800/60 bg-zinc-950/30 p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="text-[11px] font-mono tracking-wider text-zinc-300">
          {name}
        </div>
        <div className={cx("text-[11px] font-mono tracking-widest", t.text)}>
          {pct}%
        </div>
      </div>
      <div className="mt-2 h-1.5 rounded-full bg-zinc-900 overflow-hidden">
        <div
          className={cx(
            "h-full bg-gradient-to-r",
            t.bar,
            "transition-all duration-700",
          )}
          style={{
            width: `${pct}%`,
            boxShadow: `0 0 20px ${t.glow}`,
          }}
        />
      </div>
    </div>
  );
}

function FeedItem({
  tone,
  title,
  desc,
  meta,
}: {
  tone: "cyan" | "amber" | "pink" | "rose";
  title: string;
  desc: string;
  meta: string;
}) {
  const palette: Record<string, string> = {
    cyan: "bg-cyan-400",
    amber: "bg-amber-400",
    pink: "bg-pink-400",
    rose: "bg-rose-500",
  };
  return (
    <div className="rounded-xl border border-zinc-800/60 bg-zinc-950/25 px-3 py-2">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          <span
            className={cx(
              "mt-1 h-2 w-2 rounded-full",
              palette[tone],
              "shadow-[0_0_18px_rgba(255,255,255,0.25)]",
            )}
          />
          <div>
            <div className="text-[11px] font-mono tracking-wider text-zinc-200">
              {title}
            </div>
            <div className="mt-0.5 text-[11px] text-zinc-400">{desc}</div>
          </div>
        </div>
        <div className="text-[10px] font-mono tracking-widest text-zinc-500">
          {meta}
        </div>
      </div>
    </div>
  );
}

function CyberMapSVG({ cursor }: { cursor: { x: number; y: number } }) {
  // cursor x/y in 0-100 UI space
  const cxp = cursor.x;
  const cyp = cursor.y;

  return (
    <svg
      viewBox="0 0 1000 520"
      className="w-full h-[260px] sm:h-[320px] md:h-[360px]"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(11, 12, 16, 1)" />
          <stop offset="50%" stopColor="rgba(10, 10, 20, 1)" />
          <stop offset="100%" stopColor="rgba(6, 6, 10, 1)" />
        </linearGradient>

        <linearGradient id="route1" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.15" />
          <stop offset="40%" stopColor="#22d3ee" stopOpacity="1" />
          <stop offset="70%" stopColor="#a855f7" stopOpacity="1" />
          <stop offset="100%" stopColor="#fb7185" stopOpacity="0.30" />
        </linearGradient>

        <linearGradient id="route2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.15" />
          <stop offset="50%" stopColor="#fbbf24" stopOpacity="1" />
          <stop offset="90%" stopColor="#fb7185" stopOpacity="1" />
        </linearGradient>

        <filter id="glowCyan" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feColorMatrix
            in="b"
            type="matrix"
            values="1 0 0 0 0
                    0 1 0 0 0.8
                    0 0 1 0 1
                    0 0 0 1 0"
            result="c"
          />
          <feMerge>
            <feMergeNode in="c" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="glowAmber" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feColorMatrix
            in="b"
            type="matrix"
            values="1 0 0 0 1
                    0 1 0 0 0.7
                    0 0 1 0 0
                    0 0 0 1 0"
            result="c"
          />
          <feMerge>
            <feMergeNode in="c" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <radialGradient id="poi" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#34d399" stopOpacity="1" />
          <stop offset="60%" stopColor="#34d399" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="hazard" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#fb7185" stopOpacity="1" />
          <stop offset="65%" stopColor="#fb7185" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#fb7185" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* background */}
      <rect x="0" y="0" width="1000" height="520" fill="url(#bg)" />

      {/* subtle city blocks */}
      <g opacity="0.65">
        {Array.from({ length: 24 }).map((_, i) => {
          const x = (i % 8) * 128 + 24;
          const y = Math.floor(i / 8) * 150 + 28;
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width="105"
              height="120"
              rx="10"
              fill="rgba(12, 14, 20, 0.9)"
              stroke="rgba(63, 63, 70, 0.55)"
              strokeWidth="1"
            />
          );
        })}
      </g>

      {/* street lines */}
      <g opacity="0.55">
        {Array.from({ length: 18 }).map((_, i) => (
          <path
            key={i}
            d={`M ${30 + i * 55} 0 L ${30 + i * 35} 520`}
            stroke="rgba(34,211,238,0.10)"
            strokeWidth="1"
          />
        ))}
        {Array.from({ length: 10 }).map((_, i) => (
          <path
            key={i}
            d={`M 0 ${20 + i * 52} L 1000 ${35 + i * 50}`}
            stroke="rgba(168,85,247,0.10)"
            strokeWidth="1"
          />
        ))}
      </g>

      {/* primary route */}
      <path
        d="M 80 420 C 170 330, 260 360, 330 280 C 410 185, 520 210, 600 160 C 710 92, 830 170, 930 95"
        fill="none"
        stroke="url(#route1)"
        strokeWidth="6"
        filter="url(#glowCyan)"
        strokeLinecap="round"
      />
      {/* secondary route */}
      <path
        d="M 120 120 C 210 205, 310 170, 410 250 C 520 340, 640 310, 720 385 C 800 450, 880 440, 960 470"
        fill="none"
        stroke="url(#route2)"
        strokeWidth="4"
        filter="url(#glowAmber)"
        strokeDasharray="10 8"
        strokeLinecap="round"
        opacity="0.95"
      />

      {/* POIs */}
      <g>
        {[
          { x: 330, y: 280, kind: "poi" as const },
          { x: 600, y: 160, kind: "poi" as const },
          { x: 930, y: 95, kind: "poi" as const },
          { x: 410, y: 250, kind: "haz" as const },
          { x: 720, y: 385, kind: "haz" as const },
        ].map((p, i) => (
          <g key={i}>
            <circle
              cx={p.x}
              cy={p.y}
              r={p.kind === "poi" ? 38 : 44}
              fill={p.kind === "poi" ? "url(#poi)" : "url(#hazard)"}
              opacity={0.95}
            />
            <circle
              cx={p.x}
              cy={p.y}
              r={p.kind === "poi" ? 7 : 8}
              fill={p.kind === "poi" ? "#34d399" : "#fb7185"}
              opacity={0.95}
              filter={p.kind === "poi" ? "url(#glowCyan)" : "url(#glowAmber)"}
            />
          </g>
        ))}
      </g>

      {/* cursor crosshair */}
      <g transform={`translate(${(cxp / 100) * 1000}, ${(cyp / 100) * 520})`}>
        <circle
          cx="0"
          cy="0"
          r="26"
          fill="none"
          stroke="rgba(34,211,238,0.65)"
          strokeWidth="1.5"
        />
        <circle
          cx="0"
          cy="0"
          r="3.5"
          fill="#22d3ee"
          filter="url(#glowCyan)"
        />
        <path
          d="M -42 0 L -12 0 M 12 0 L 42 0 M 0 -42 L 0 -12 M 0 12 L 0 42"
          stroke="rgba(168,85,247,0.65)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>

      {/* labels */}
      <g opacity="0.9">
        <text
          x="40"
          y="40"
          fill="rgba(226,232,240,0.62)"
          fontSize="12"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
          letterSpacing="3"
        >
          STREET-GRID / VECTOR
        </text>
        <text
          x="40"
          y="62"
          fill="rgba(34,211,238,0.7)"
          fontSize="10"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
          letterSpacing="2.2"
        >
          SIGNAL PHASE OVERLAY: ACTIVE
        </text>
      </g>
    </svg>
  );
}

export function CyberpunkMapLanding() {
  return (
    <div className="w-full min-h-[720px] bg-black">
      <div className="relative w-full min-h-[720px] overflow-hidden">
        {/* Page background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(34,211,238,0.18),transparent_55%),radial-gradient(circle_at_80%_25%,rgba(168,85,247,0.18),transparent_55%),radial-gradient(circle_at_40%_85%,rgba(251,113,133,0.15),transparent_55%),radial-gradient(circle_at_85%_85%,rgba(250,204,21,0.12),transparent_55%)]" />
          <div
            className="absolute inset-0 opacity-[0.25]"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.06) 1px, rgba(0,0,0,0) 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, rgba(0,0,0,0) 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          <NoiseOverlay />
        </div>

        <div className="relative px-4 sm:px-6 md:px-10 lg:px-12 py-10">
          <div className="max-w-6xl mx-auto">
            {/* top badge row */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-7">
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-2xl border border-zinc-800/60 bg-zinc-950/45 flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.18)]">
                  <Radar className="w-5 h-5 text-cyan-200" />
                </div>
                <div>
                  <div className="text-xs font-mono tracking-[0.35em] text-zinc-400">
                    CYBERMAP
                  </div>
                  <div className="text-[11px] text-zinc-500">
                    neon routing / signals / incidents
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Pill tone="cyan">
                  <Zap className="w-3.5 h-3.5" />
                  CYBERPUNK UI
                </Pill>
                <Pill tone="amber">
                  <TrafficCone className="w-3.5 h-3.5" />
                  HAZARD OVERLAY
                </Pill>
                <Pill tone="pink">
                  <Signal className="w-3.5 h-3.5" />
                  SIGNAL PHASES
                </Pill>
              </div>
            </div>

            {/* main grid */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 items-start">
              <MiniMapHUD />

              <div className="flex flex-col gap-6">
                <TrafficLightTotem />
                <div className="rounded-2xl border border-zinc-800/60 bg-zinc-950/40 p-6 relative overflow-hidden">
                  <div className="absolute inset-0">
                    <Scanlines />
                  </div>
                  <div className="relative">
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] font-mono tracking-widest text-zinc-500">
                        SYMBOLS
                      </div>
                      <div className="text-[10px] font-mono tracking-widest text-zinc-400">
                        HUD PACK
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <SymbolCard
                        icon={<MapPin className="w-4 h-4" />}
                        title="POI Beacons"
                        desc="Neon pins + scan pulses"
                        tone="cyan"
                      />
                      <SymbolCard
                        icon={<Route className="w-4 h-4" />}
                        title="Vector Routes"
                        desc="Gradient paths + dashes"
                        tone="violet"
                      />
                      <SymbolCard
                        icon={<TriangleAlert className="w-4 h-4" />}
                        title="Hazards"
                        desc="Roadworks + incidents"
                        tone="rose"
                      />
                      <SymbolCard
                        icon={<Shield className="w-4 h-4" />}
                        title="Secure Mode"
                        desc="Encrypted telemetry"
                        tone="amber"
                      />
                    </div>

                    <div className="mt-4 rounded-xl border border-zinc-800/60 bg-zinc-950/25 p-4 flex items-start justify-between gap-4">
                      <div>
                        <div className="text-[10px] font-mono tracking-widest text-zinc-500">
                          NOTE
                        </div>
                        <div className="mt-1 text-sm text-zinc-300 leading-relaxed">
                          If you want this as a selectable design page under{" "}
                          <span className="text-cyan-200">/designs</span>, add it
                          to the designs constants and wire the preview mapping.
                        </div>
                      </div>
                      <div className="h-10 w-10 rounded-xl border border-zinc-800/60 bg-zinc-950/35 flex items-center justify-center">
                        <TriangleAlert className="w-5 h-5 text-amber-200" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* footer microcopy */}
            <div className="mt-10 text-center text-[10px] font-mono tracking-[0.35em] text-zinc-600">
              NEON / NOISE / GRID / GLOW — CYBER CITY LANDING MODULE
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SymbolCard({
  icon,
  title,
  desc,
  tone,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  tone: "cyan" | "violet" | "rose" | "amber";
}) {
  const toneMap: Record<
    string,
    { ring: string; text: string; glow: string; border: string; bg: string }
  > = {
    cyan: {
      ring: "bg-cyan-500/10",
      text: "text-cyan-200",
      glow: "shadow-[0_0_25px_rgba(34,211,238,0.22)]",
      border: "border-cyan-400/30",
      bg: "bg-zinc-950/25",
    },
    violet: {
      ring: "bg-violet-500/10",
      text: "text-violet-200",
      glow: "shadow-[0_0_25px_rgba(168,85,247,0.22)]",
      border: "border-violet-400/30",
      bg: "bg-zinc-950/25",
    },
    rose: {
      ring: "bg-rose-500/10",
      text: "text-rose-200",
      glow: "shadow-[0_0_25px_rgba(244,63,94,0.20)]",
      border: "border-rose-400/30",
      bg: "bg-zinc-950/25",
    },
    amber: {
      ring: "bg-amber-500/10",
      text: "text-amber-200",
      glow: "shadow-[0_0_25px_rgba(250,204,21,0.18)]",
      border: "border-amber-400/30",
      bg: "bg-zinc-950/25",
    },
  };

  const t = toneMap[tone];

  return (
    <div
      className={cx(
        "rounded-2xl border bg-zinc-950/25 p-4",
        "border-zinc-800/60",
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cx(
            "h-10 w-10 rounded-xl border flex items-center justify-center",
            t.ring,
            t.border,
            t.glow,
          )}
        >
          <div className={t.text}>{icon}</div>
        </div>
        <div>
          <div className="text-[11px] font-mono tracking-widest text-zinc-200">
            {title}
          </div>
          <div className="mt-1 text-[11px] text-zinc-500 leading-relaxed">
            {desc}
          </div>
        </div>
      </div>
    </div>
  );
}
