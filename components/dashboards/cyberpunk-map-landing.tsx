"use client";

import * as React from "react";
import {
  ArrowRight,
  BadgeCheck,
  Car,
  Crosshair,
  MapPin,
  Navigation,
  Radar,
  Route,
  Shield,
  Signal,
  Siren,
  Zap,
} from "lucide-react";

/**
 * CyberpunkMapLanding (no-gradients edition)
 * -----------------------------------------
 * Intent:
 * - No gradients (CSS/SVG). Solids + borders + glow only.
 * - Dark-cyan base, neon pink highlights, neon yellow/white edges.
 * - A real landing page layout (hero → proof → preview → features).
 *
 * This update:
 * - Reduce “AI-ish” vibe: simpler, calmer copy and fewer gimmicks.
 * - Subtle SVG micro-animations: blinking cursor, moving route dashes, pulsing POIs.
 * - Keep the road motion, but make it feel more designed and less “template-y”.
 */

function cx(...c: Array<string | null | undefined | false>) {
  return c.filter(Boolean).join(" ");
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function useIntervalTick(ms: number) {
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), ms);
    return () => clearInterval(id);
  }, [ms]);
  return tick;
}

function Noise() {
  // Not a gradient; turbulence noise texture.
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-overlay"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='240' height='240' filter='url(%23n)' opacity='.65'/%3E%3C/svg%3E\")",
      }}
    />
  );
}

function Scanlines() {
  // Not a gradient; repeating 1px lines.
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.10]"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, rgba(255,255,255,0.09) 1px, rgba(0,0,0,0) 1px)",
        backgroundSize: "100% 7px",
      }}
    />
  );
}

function NeonFrame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "relative rounded-3xl overflow-hidden",
        "bg-[#021418]",
        "border border-white/12",
        "shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_30px_120px_rgba(0,0,0,0.70)]",
        className,
      )}
    >
      {/* neon yellow inner edge */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl border border-[#facc15]/25" />
      {/* subtle cyan outer glow via shadow */}
      <div className="pointer-events-none absolute -inset-[2px] rounded-3xl shadow-[0_0_60px_rgba(34,211,238,0.12)]" />
      {children}
    </div>
  );
}

function Pill({
  tone,
  children,
}: {
  tone: "cyan" | "pink" | "yellow" | "white";
  children: React.ReactNode;
}) {
  const toneClass =
    tone === "cyan"
      ? "border-cyan-300/35 bg-cyan-400/10 text-cyan-50"
      : tone === "pink"
        ? "border-pink-300/35 bg-pink-500/10 text-pink-50"
        : tone === "yellow"
          ? "border-yellow-300/35 bg-yellow-400/10 text-yellow-50"
          : "border-white/20 bg-white/5 text-white/80";

  const glow =
    tone === "cyan"
      ? "shadow-[0_0_24px_rgba(34,211,238,0.10)]"
      : tone === "pink"
        ? "shadow-[0_0_24px_rgba(236,72,153,0.10)]"
        : tone === "yellow"
          ? "shadow-[0_0_24px_rgba(250,204,21,0.08)]"
          : "shadow-[0_0_24px_rgba(255,255,255,0.06)]";

  return (
    <span
      className={cx(
        "inline-flex items-center gap-2",
        "px-3 py-1 rounded-full border",
        "text-[11px] font-mono tracking-widest uppercase",
        toneClass,
        glow,
      )}
    >
      {children}
    </span>
  );
}

function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "cyan" | "pink" | "yellow" | "white";
}) {
  const toneText =
    tone === "cyan"
      ? "text-cyan-100"
      : tone === "pink"
        ? "text-pink-100"
        : tone === "yellow"
          ? "text-yellow-50"
          : "text-white/85";

  const toneBorder =
    tone === "cyan"
      ? "border-cyan-300/20"
      : tone === "pink"
        ? "border-pink-300/20"
        : tone === "yellow"
          ? "border-yellow-300/20"
          : "border-white/12";

  return (
    <div
      className={cx(
        "rounded-2xl border bg-white/5 p-4",
        "shadow-[0_0_40px_rgba(0,0,0,0.25)]",
        toneBorder,
      )}
    >
      <div className="text-[10px] font-mono tracking-[0.35em] text-white/45">
        {label}
      </div>
      <div className={cx("mt-2 text-2xl font-mono tracking-widest", toneText)}>
        {value}
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
  tone,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  tone: "cyan" | "pink" | "yellow" | "white";
}) {
  const ring =
    tone === "cyan"
      ? "border-cyan-300/30 bg-cyan-400/10 text-cyan-50 shadow-[0_0_25px_rgba(34,211,238,0.12)]"
      : tone === "pink"
        ? "border-pink-300/30 bg-pink-500/10 text-pink-50 shadow-[0_0_25px_rgba(236,72,153,0.12)]"
        : tone === "yellow"
          ? "border-yellow-300/30 bg-yellow-400/10 text-yellow-50 shadow-[0_0_25px_rgba(250,204,21,0.10)]"
          : "border-white/20 bg-white/5 text-white/85 shadow-[0_0_25px_rgba(255,255,255,0.06)]";

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-start gap-4">
        <div
          className={cx(
            "h-11 w-11 rounded-2xl border flex items-center justify-center",
            ring,
          )}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <div className="text-[12px] font-mono tracking-widest text-white/85 uppercase">
            {title}
          </div>
          <div className="mt-2 text-sm leading-relaxed text-white/60">
            {desc}
          </div>
        </div>
      </div>
    </div>
  );
}

function RoadwayAnimation() {
  // No gradients: solids + strokes + animated dash offset.
  // Tweaked: less “noisy”, more “designed”: fewer shapes, clearer hierarchy.
  return (
    <div className="pointer-events-none absolute inset-0">
      <svg
        viewBox="0 0 1400 820"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full opacity-95"
      >
        {/* Road body */}
        <path
          d="M -120 730 C 160 560, 360 610, 560 500 C 760 395, 980 430, 1520 220 L 1520 900 L -120 900 Z"
          fill="#031e24"
          opacity="0.92"
        />

        {/* Road edges */}
        <path
          d="M -120 730 C 160 560, 360 610, 560 500 C 760 395, 980 430, 1520 220"
          fill="none"
          stroke="rgba(34,211,238,0.80)"
          strokeWidth="7"
          opacity="0.55"
        />
        <path
          d="M -120 748 C 160 578, 360 628, 560 518 C 760 413, 980 448, 1520 238"
          fill="none"
          stroke="rgba(250,204,21,0.80)"
          strokeWidth="2.3"
          opacity="0.35"
        />

        {/* Center lane dashes */}
        <path
          d="M -30 760 C 210 600, 390 645, 570 540 C 800 420, 990 462, 1460 260"
          fill="none"
          stroke="rgba(250,204,21,0.95)"
          strokeWidth="4"
          strokeDasharray="20 18"
          style={{ animation: "laneDash 1.05s linear infinite" }}
          opacity="0.58"
        />

        {/* Subtle HUD marker (kept, but calmer) */}
        <g
          style={{ animation: "hudPulse 3.2s ease-in-out infinite" }}
          opacity="0.55"
        >
          <circle cx="1060" cy="280" r="54" fill="rgba(34,211,238,0.10)" />
          <circle cx="1060" cy="280" r="18" fill="rgba(236,72,153,0.12)" />
          <circle cx="1060" cy="280" r="4.8" fill="rgba(250,204,21,0.85)" />
        </g>

        {/* “People” pings (fewer, more intentional) */}
        {[
          { x: 420, y: 590, c: "rgba(34,211,238,0.70)", d: "peoplePingA" },
          { x: 610, y: 545, c: "rgba(236,72,153,0.70)", d: "peoplePingB" },
          { x: 980, y: 425, c: "rgba(250,204,21,0.70)", d: "peoplePingC" },
        ].map((p, i) => (
          <g
            key={i}
            opacity="0.85"
            style={{ animation: `${p.d} 3.0s ease-in-out infinite` }}
          >
            <circle cx={p.x} cy={p.y} r="3.6" fill={p.c} />
            <circle
              cx={p.x}
              cy={p.y}
              r="12"
              fill="transparent"
              stroke={p.c}
              strokeWidth="1"
              opacity="0.32"
            />
          </g>
        ))}
      </svg>

      {/* Solid sweep (no gradient) */}
      <div
        className="absolute -inset-y-32 -left-1/2 w-[34%] opacity-0"
        style={{
          backgroundColor: "rgba(34,211,238,0.16)",
          filter: "blur(12px)",
          animation: "sweep 7.0s linear infinite",
        }}
      />

      {/* Animated cars (small, less “plugin-y”, slightly staggered) */}
      <div
        className="absolute left-[-22%] top-[58%] h-2.5 w-10 rounded-full border border-yellow-300/35 bg-black/20"
        style={{
          boxShadow: "0 0 22px rgba(250,204,21,0.11)",
          transform: "skewX(-14deg)",
          animation: "car1 7.2s linear infinite",
        }}
      />
      <div
        className="absolute left-[-28%] top-[61%] h-2.5 w-12 rounded-full border border-pink-300/35 bg-black/20"
        style={{
          boxShadow: "0 0 22px rgba(236,72,153,0.10)",
          transform: "skewX(-14deg)",
          animation: "car2 9.0s linear infinite",
        }}
      />
      <div
        className="absolute left-[-18%] top-[64%] h-2 w-9 rounded-full border border-cyan-300/35 bg-black/20"
        style={{
          boxShadow: "0 0 22px rgba(34,211,238,0.10)",
          transform: "skewX(-14deg)",
          animation: "car3 8.1s linear infinite",
        }}
      />
    </div>
  );
}

function VectorMapPreview({ cursor }: { cursor: { x: number; y: number } }) {
  const x = (cursor.x / 100) * 1000;
  const y = (cursor.y / 100) * 520;

  return (
    <svg
      viewBox="0 0 1000 520"
      className="w-full h-[290px] sm:h-[340px]"
      preserveAspectRatio="none"
    >
      <rect x="0" y="0" width="1000" height="520" fill="#011316" />

      {/* Grid (no gradients) */}
      <g opacity="0.20">
        {Array.from({ length: 18 }).map((_, i) => (
          <path
            key={`v-${i}`}
            d={`M ${i * 60} 0 L ${i * 60} 520`}
            stroke="rgba(250,204,21,0.22)"
            strokeWidth="1"
          />
        ))}
        {Array.from({ length: 12 }).map((_, i) => (
          <path
            key={`h-${i}`}
            d={`M 0 ${i * 44} L 1000 ${i * 44}`}
            stroke="rgba(34,211,238,0.18)"
            strokeWidth="1"
          />
        ))}
      </g>

      {/* City blocks */}
      <g opacity="0.75">
        {Array.from({ length: 22 }).map((_, i) => {
          const bx = (i % 11) * 86 + 22;
          const by = Math.floor(i / 11) * 160 + 56;
          return (
            <rect
              key={i}
              x={bx}
              y={by}
              width="70"
              height="105"
              rx="10"
              fill="#021a1f"
              stroke="rgba(255,255,255,0.10)"
              strokeWidth="1"
            />
          );
        })}
      </g>

      {/* Routes (solids) */}
      <path
        d="M 70 420 C 180 350, 260 380, 340 300 C 430 210, 520 250, 610 180 C 730 90, 820 150, 935 95"
        fill="none"
        stroke="rgba(236,72,153,0.95)"
        strokeWidth="6.5"
        strokeLinecap="round"
        opacity="0.88"
        strokeDasharray="18 12"
        style={{ animation: "laneDash 1.35s linear infinite" }}
      />
      <path
        d="M 110 120 C 230 220, 310 170, 410 240 C 520 320, 640 300, 740 380 C 820 445, 900 450, 960 475"
        fill="none"
        stroke="rgba(34,211,238,0.95)"
        strokeWidth="4.25"
        strokeLinecap="round"
        strokeDasharray="12 9"
        opacity="0.60"
        style={{ animation: "laneDash 1.85s linear infinite" }}
      />

      {/* POIs + hazards (micro-animated pulses) */}
      {[
        { px: 340, py: 300, hazard: false, anim: "poiPulseA" },
        { px: 610, py: 180, hazard: false, anim: "poiPulseB" },
        { px: 935, py: 95, hazard: false, anim: "poiPulseC" },
        { px: 410, py: 240, hazard: true, anim: "poiPulseB" },
        { px: 740, py: 380, hazard: true, anim: "poiPulseA" },
      ].map((p, i) => (
        <g
          key={i}
          opacity="0.95"
          style={{ animation: `${p.anim} 2.6s ease-in-out infinite` }}
        >
          <circle
            cx={p.px}
            cy={p.py}
            r={p.hazard ? 16 : 14}
            fill={p.hazard ? "rgba(236,72,153,0.18)" : "rgba(250,204,21,0.18)"}
          />
          <circle
            cx={p.px}
            cy={p.py}
            r={p.hazard ? 5.2 : 4.8}
            fill={p.hazard ? "rgba(236,72,153,0.95)" : "rgba(250,204,21,0.92)"}
          />
        </g>
      ))}

      {/* Cursor (blink) */}
      <g
        transform={`translate(${x}, ${y})`}
        opacity="0.92"
        style={{ animation: "mapCursorBlink 1.2s steps(2,end) infinite" }}
      >
        <circle
          cx="0"
          cy="0"
          r="26"
          fill="none"
          stroke="rgba(250,204,21,0.55)"
          strokeWidth="1.5"
        />
        <circle cx="0" cy="0" r="3.8" fill="rgba(34,211,238,0.95)" />
        <path
          d="M -44 0 L -12 0 M 12 0 L 44 0 M 0 -44 L 0 -12 M 0 12 L 0 44"
          stroke="rgba(236,72,153,0.70)"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </g>

      {/* Labels */}
      <text
        x="24"
        y="36"
        fill="rgba(255,255,255,0.62)"
        fontSize="12"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
        letterSpacing="3"
      >
        VECTOR MAP / SIGNAL OVERLAY
      </text>
      <text
        x="24"
        y="58"
        fill="rgba(250,204,21,0.68)"
        fontSize="10"
        fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace"
        letterSpacing="2.5"
      >
        ROUTES: LIVE — SIGNALS: TRACKED — INCIDENTS: WATCHED
      </text>

      {/* POI pulse keyframes (SVG uses inline style animation names) */}
      <style>{`
        @keyframes poiPulseA { 0%,100% { opacity: .75; } 50% { opacity: 1; } }
        @keyframes poiPulseB { 0%,100% { opacity: .70; } 50% { opacity: .98; } }
        @keyframes poiPulseC { 0%,100% { opacity: .78; } 50% { opacity: 1; } }
      `}</style>
    </svg>
  );
}

function TrafficTotem() {
  return (
    <div className="relative rounded-3xl border border-white/12 bg-[#021a1f]/75 overflow-hidden">
      <div className="absolute inset-0">
        <Noise />
      </div>

      <div className="relative p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="text-[10px] font-mono tracking-[0.35em] text-white/55">
            TRAFFIC NODE
          </div>
          <div className="text-[10px] font-mono tracking-[0.35em] text-yellow-50/75">
            A-17 / ADAPTIVE
          </div>
        </div>

        <div className="mt-4 flex items-center gap-5">
          <div className="relative w-[96px] rounded-2xl border border-yellow-300/20 bg-black/20 p-3">
            <div className="space-y-3">
              <LightCell color="pink" />
              <LightCell color="yellow" pulse />
              <LightCell color="cyan" />
            </div>
            <div className="mt-3 pt-3 border-t border-white/10 text-[10px] font-mono tracking-widest text-white/55 flex items-center justify-between">
              <span>PHASE</span>
              <span className="text-yellow-100">CAUTION</span>
            </div>
          </div>

          <div className="flex-1">
            <div className="text-xl font-semibold tracking-tight text-white">
              Signal-aware routing
            </div>
            <p className="mt-2 text-sm leading-relaxed text-white/65">
              Reduce stops with Green Wave timing. Your map doesn’t just show
              roads — it predicts them.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <Pill tone="cyan">
                <Signal className="w-3.5 h-3.5" />
                GREEN WAVE
              </Pill>
              <Pill tone="pink">
                <Crosshair className="w-3.5 h-3.5" />
                ROUTE LOCK
              </Pill>
              <Pill tone="yellow">
                <Zap className="w-3.5 h-3.5" />
                FAST LANE
              </Pill>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LightCell({
  color,
  pulse,
}: {
  color: "pink" | "yellow" | "cyan";
  pulse?: boolean;
}) {
  const base =
    color === "pink"
      ? { fill: "bg-pink-500", glow: "shadow-[0_0_34px_rgba(236,72,153,0.85)]" }
      : color === "yellow"
        ? {
            fill: "bg-yellow-300",
            glow: "shadow-[0_0_34px_rgba(250,204,21,0.85)]",
          }
        : {
            fill: "bg-cyan-400",
            glow: "shadow-[0_0_34px_rgba(34,211,238,0.8)]",
          };

  return (
    <div className="relative h-14 rounded-xl border border-white/10 bg-white/5 overflow-hidden">
      <div
        className={cx(
          "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
          "h-8 w-8 rounded-full",
          base.fill,
          base.glow,
          pulse && "animate-pulse",
        )}
      />
    </div>
  );
}

export function CyberpunkMapLanding() {
  const tick = useIntervalTick(900);
  const [cursor, setCursor] = React.useState({ x: 64, y: 44 });

  React.useEffect(() => {
    const id = setInterval(() => {
      setCursor((p) => ({
        x: clamp(p.x + (Math.random() * 7 - 3.5), 12, 88),
        y: clamp(p.y + (Math.random() * 7 - 3.5), 14, 84),
      }));
    }, 950);
    return () => clearInterval(id);
  }, []);

  const syncLabel = tick % 2 === 0 ? "SYNC: GREEN-WAVE" : "SYNC: ADAPTIVE";
  const cursorLabel = `${Math.round(cursor.x)}.${Math.round(cursor.y)}`;

  return (
    <div className="w-full min-h-screen bg-[#021418] text-white">
      <style>{`
        @keyframes laneDash { 0% { stroke-dashoffset: 0; } 100% { stroke-dashoffset: -240; } }

        @keyframes sweep {
          0% { transform: translateX(-45%) skewX(-16deg); opacity: 0; }
          16% { opacity: .45; }
          52% { opacity: .16; }
          100% { transform: translateX(155%) skewX(-16deg); opacity: 0; }
        }

        @keyframes hudPulse { 0%,100% { opacity: .50; } 50% { opacity: .82; } }
        @keyframes floatY { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }

        /* Staggered “people” pings to avoid synchronized/robotic feel */
        @keyframes peoplePingA { 0%,100% { transform: scale(0.98); opacity: 0.40; } 55% { transform: scale(1.03); opacity: 0.92; } }
        @keyframes peoplePingB { 0%,100% { transform: scale(0.99); opacity: 0.36; } 50% { transform: scale(1.04); opacity: 0.88; } }
        @keyframes peoplePingC { 0%,100% { transform: scale(0.985); opacity: 0.44; } 58% { transform: scale(1.02); opacity: 0.95; } }

        /* Cars: slightly different arcs/speeds */
        @keyframes car1 { 0% { transform: translateX(0) translateY(0) skewX(-14deg); opacity: 0; } 10% { opacity: 1; } 100% { transform: translateX(160vw) translateY(-21vh) skewX(-14deg); opacity: 0; } }
        @keyframes car2 { 0% { transform: translateX(0) translateY(0) skewX(-14deg); opacity: 0; } 12% { opacity: 1; } 100% { transform: translateX(168vw) translateY(-26vh) skewX(-14deg); opacity: 0; } }
        @keyframes car3 { 0% { transform: translateX(0) translateY(0) skewX(-14deg); opacity: 0; } 12% { opacity: 1; } 100% { transform: translateX(154vw) translateY(-18vh) skewX(-14deg); opacity: 0; } }

        /* Comic bubble entrance (subtle) */
        @keyframes pop { 0% { transform: scale(0.985); opacity: 0.0; } 22% { opacity: 1; } 100% { transform: scale(1); opacity: 1; } }

        /* SVG micro-animations */
        @keyframes mapCursorBlink { 0%,45% { opacity: 1; } 46%,100% { opacity: 0.15; } }
      `}</style>

      <div className="relative min-h-screen overflow-hidden">
        <RoadwayAnimation />
        <Noise />
        <Scanlines />

        {/* More breathing room + more width (no max-w clamp) */}
        <div className="relative z-10 px-6 sm:px-10 md:px-14 lg:px-20 py-14 md:py-18">
          <NeonFrame className="mx-auto">
            <div className="relative p-10 sm:p-12 md:p-14 lg:p-16">
              {/* Top nav / brand strip */}
              <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl border border-yellow-300/25 bg-black/20 flex items-center justify-center shadow-[0_0_44px_rgba(250,204,21,0.12)]">
                    <MapPin className="w-5 h-5 text-pink-200" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono tracking-[0.45em] text-white/60">
                      CYBERMAP
                    </div>
                    <div className="text-[12px] text-white/55">
                      a map landing page that thinks it’s a neon comic panel
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Pill tone="cyan">
                    <Radar className="w-3.5 h-3.5" />
                    LIVE RADAR
                  </Pill>
                  <Pill tone="pink">
                    <Route className="w-3.5 h-3.5" />
                    NEON ROUTES
                  </Pill>
                  <Pill tone="yellow">
                    <Signal className="w-3.5 h-3.5" />
                    SIGNALS
                  </Pill>
                  <Pill tone="white">
                    <BadgeCheck className="w-3.5 h-3.5" />
                    NO-NONSENSE
                  </Pill>
                </div>
              </div>

              {/* Hero (more space + bigger road feel) */}
              <div className="mt-12 grid grid-cols-1 2xl:grid-cols-[1.25fr_0.75fr] gap-10 2xl:gap-14 items-start">
                <div>
                  <div
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/14 bg-white/5 px-4 py-2"
                    style={{ animation: "pop 700ms ease-out both" }}
                  >
                    <span className="text-[10px] font-mono tracking-[0.35em] text-white/55">
                      CYBER UI
                    </span>
                    <span className="text-[10px] font-mono tracking-[0.35em] text-yellow-50/80">
                      LANDING
                    </span>
                  </div>

                  <h1 className="mt-6 text-5xl sm:text-6xl 2xl:text-7xl font-semibold tracking-tight leading-[1.02]">
                    Signal-aware routes for a{" "}
                    <span className="text-cyan-100">faster city</span>.
                    <span className="text-pink-200"> Neon</span> looks.
                    <span className="text-yellow-100"> Practical</span> wins.
                  </h1>

                  <p className="mt-5 text-base sm:text-lg leading-relaxed text-white/70 max-w-3xl">
                    A landing page that sells the vibe{" "}
                    <span className="text-pink-100">and</span> the product:
                    signal-aware navigation, hazards, and fast lanes — with a
                    road that actually moves.
                  </p>

                  <div className="mt-7 flex flex-wrap gap-2">
                    <Pill tone="cyan">
                      <Shield className="w-3.5 h-3.5" />
                      PRIVATE BY DEFAULT
                    </Pill>
                    <Pill tone="pink">
                      <Siren className="w-3.5 h-3.5" />
                      HAZARD ALERTS
                    </Pill>
                    <Pill tone="yellow">
                      <Car className="w-3.5 h-3.5" />
                      ROADSTER MODE
                    </Pill>
                    <Pill tone="white">
                      <Crosshair className="w-3.5 h-3.5" />
                      ROUTE LOCK
                    </Pill>
                  </div>

                  {/* CTA row */}
                  <div className="mt-8 flex flex-col lg:flex-row gap-4 lg:items-center">
                    <button
                      type="button"
                      className={cx(
                        "inline-flex items-center justify-center gap-2",
                        "rounded-2xl px-6 py-4",
                        "text-base font-semibold tracking-wide",
                        "border border-yellow-300/40",
                        "bg-black/20",
                        "shadow-[0_0_34px_rgba(250,204,21,0.12)]",
                        "hover:border-pink-300/50 hover:shadow-[0_0_54px_rgba(236,72,153,0.14)]",
                        "transition",
                      )}
                    >
                      Start free{" "}
                      <ArrowRight className="w-5 h-5 text-pink-200" />
                    </button>

                    <button
                      type="button"
                      className={cx(
                        "inline-flex items-center justify-center gap-2",
                        "rounded-2xl px-6 py-4",
                        "text-base font-semibold tracking-wide",
                        "border border-white/20",
                        "bg-white/5",
                        "hover:bg-white/8 hover:border-white/26",
                        "transition",
                      )}
                    >
                      View docs <Shield className="w-5 h-5 text-cyan-100" />
                    </button>

                    <div className="lg:ml-auto rounded-2xl border border-white/14 bg-white/5 px-5 py-4">
                      <div className="text-[10px] font-mono tracking-[0.35em] text-white/45">
                        STATUS (COMIC CAPTION)
                      </div>
                      <div className="mt-1 text-[13px] font-mono tracking-widest text-yellow-50">
                        {syncLabel}
                        <span className="text-white/25"> / </span>
                        <span className="text-cyan-100">
                          CURSOR {cursorLabel}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Proof / stats */}
                  <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard label="SIGNALS" value="1,284" tone="yellow" />
                    <StatCard label="ROUTES" value="12" tone="cyan" />
                    <StatCard label="HAZARDS" value="07" tone="pink" />
                    <StatCard label="LOCK" value="ON" tone="white" />
                  </div>
                </div>

                {/* Side panel (more space + comic copy) */}
                <div className="space-y-6">
                  <div
                    className="rounded-3xl border border-white/12 bg-white/5 p-7"
                    style={{ animation: "floatY 4.2s ease-in-out infinite" }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] font-mono tracking-[0.35em] text-white/55">
                        WHAT YOU GET
                      </div>
                      <div className="text-[10px] font-mono tracking-[0.35em] text-pink-100/80">
                        “BONUS PANEL”
                      </div>
                    </div>

                    <div className="mt-5 space-y-3">
                      <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-5 py-4">
                        <span className="text-[11px] font-mono tracking-widest text-white/75 uppercase">
                          ETA boosting
                        </span>
                        <span className="text-[11px] font-mono tracking-widest text-cyan-100">
                          -18%
                        </span>
                      </div>
                      <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-5 py-4">
                        <span className="text-[11px] font-mono tracking-widest text-white/75 uppercase">
                          Stop reduction
                        </span>
                        <span className="text-[11px] font-mono tracking-widest text-yellow-50">
                          -2.1
                        </span>
                      </div>
                      <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-5 py-4">
                        <span className="text-[11px] font-mono tracking-widest text-white/75 uppercase">
                          Incident dodge
                        </span>
                        <span className="text-[11px] font-mono tracking-widest text-pink-100">
                          +41%
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 rounded-2xl border border-yellow-300/20 bg-black/15 px-5 py-4">
                      <div className="text-[10px] font-mono tracking-[0.35em] text-white/45">
                        NOTE
                      </div>
                      <div className="mt-2 text-sm leading-relaxed text-white/65">
                        Built like a landing page: clear story, proof, and a
                        live preview — not a dashboard dump.
                      </div>
                    </div>
                  </div>

                  <TrafficTotem />
                </div>
              </div>

              {/* Preview + feature grid (more space, wider) */}
              <div className="mt-14 grid grid-cols-1 2xl:grid-cols-[1.35fr_0.65fr] gap-8 2xl:gap-12">
                <div className="rounded-3xl border border-white/14 bg-black/15 overflow-hidden">
                  <div className="p-6 sm:p-7">
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] font-mono tracking-[0.35em] text-white/55">
                        LIVE PREVIEW
                      </div>
                      <div className="text-[10px] font-mono tracking-[0.35em] text-yellow-50/75">
                        HUD + ROAD
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-white/60">
                      Watch “cars” and “people” move. Your map landing should
                      feel alive.
                    </div>
                  </div>
                  <div className="border-t border-white/10 bg-black/20">
                    <VectorMapPreview cursor={cursor} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-1 gap-6">
                  <FeatureCard
                    tone="cyan"
                    icon={<Navigation className="w-4 h-4" />}
                    title="Route Intelligence"
                    desc="Pick paths that minimize stops and keep you moving."
                  />
                  <FeatureCard
                    tone="yellow"
                    icon={<Signal className="w-4 h-4" />}
                    title="Signal Phases"
                    desc="Overlay traffic-light timing on your map UI."
                  />
                  <FeatureCard
                    tone="pink"
                    icon={<Radar className="w-4 h-4" />}
                    title="Incident Radar"
                    desc="Detect hazards and roadworks in real time."
                  />
                  <FeatureCard
                    tone="white"
                    icon={<Shield className="w-4 h-4" />}
                    title="Privacy & Security"
                    desc="Encrypted telemetry and minimal collection."
                  />
                </div>
              </div>

              {/* Footer strip */}
              <div className="mt-14 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-[10px] font-mono tracking-[0.35em] text-white/45">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(34,211,238,0.18)]" />
                  <span>CYAN BASE</span>
                  <span className="text-white/25">/</span>
                  <span className="h-2 w-2 rounded-full bg-pink-400 shadow-[0_0_16px_rgba(236,72,153,0.16)]" />
                  <span>PINK HIGHLIGHTS</span>
                  <span className="text-white/25">/</span>
                  <span className="h-2 w-2 rounded-full bg-yellow-300 shadow-[0_0_16px_rgba(250,204,21,0.14)]" />
                  <span>YELLOW/WHITE EDGES</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white/40">BUILD</span>
                  <span className="text-yellow-50/75">CYBERMAP</span>
                  <span className="text-white/25">—</span>
                  <span className="text-pink-100/70">LANDING</span>
                </div>
              </div>
            </div>
          </NeonFrame>
        </div>
      </div>
    </div>
  );
}
