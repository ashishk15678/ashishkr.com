"use client";

import * as React from "react";
import {
  ArrowRight,
  Zap,
  BarChart3,
  MessageCircle,
  Eye,
  Clock,
  Users,
  Lightbulb,
} from "lucide-react";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function useSectionProgress<T extends HTMLElement>() {
  const ref = React.useRef<T | null>(null);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    let raf = 0;

    const update = () => {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const start = window.innerHeight;
      const end = -rect.height;
      const current = rect.top;

      const p = clamp((start - current) / (start - end), 0, 1);
      setProgress(p);
      raf = requestAnimationFrame(update);
    };

    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, []);

  return { ref, progress } as const;
}

function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none">
      <svg
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.02"
              numOctaves="4"
              result="noise"
            />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="20" />
          </filter>
          <radialGradient id="bg-glow" cx="30%" cy="30%" r="60%">
            <stop offset="0%" stopColor="rgba(0,0,0,0.02)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#bg-glow)" />
        {/* Floating geometric elements */}
        <circle
          cx="15%"
          cy="20%"
          r="200"
          fill="rgba(0,0,0,0.01)"
          filter="url(#noise)"
        />
        <circle
          cx="85%"
          cy="80%"
          r="250"
          fill="rgba(0,0,0,0.01)"
          filter="url(#noise)"
        />
        <circle
          cx="50%"
          cy="50%"
          r="180"
          fill="rgba(0,0,0,0.005)"
          filter="url(#noise)"
        />
      </svg>

      {/* Animated grid lines */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
        <defs>
          <pattern
            id="grid"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 80 0 L 0 0 0 80"
              fill="none"
              stroke="rgba(0,0,0,0.5)"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
}

function DotGrid() {
  return (
    <svg className="pointer-events-none absolute inset-0 w-full h-full opacity-20">
      <defs>
        <pattern id="dots" width="32" height="32" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="0.5" fill="rgba(0,0,0,0.1)" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dots)" />
    </svg>
  );
}

function PulseOrb({ delay = 0 }: { delay?: number }) {
  return (
    <svg
      className="absolute w-64 h-64 pointer-events-none"
      style={{
        animation: `pulse 8s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
    >
      <defs>
        <radialGradient id="orb-gradient">
          <stop offset="0%" stopColor="rgba(0,0,0,0.08)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>
      <circle cx="50%" cy="50%" r="45%" fill="url(#orb-gradient)" />
      <circle
        cx="50%"
        cy="50%"
        r="40%"
        fill="none"
        stroke="rgba(0,0,0,0.04)"
        strokeWidth="0.5"
      />
      <circle
        cx="50%"
        cy="50%"
        r="35%"
        fill="none"
        stroke="rgba(0,0,0,0.02)"
        strokeWidth="0.5"
      />
    </svg>
  );
}

/**
 * Flowing Data Animation - Shows intelligence flowing through network
 */
function FlowingDataAnimation({ progress }: { progress: number }) {
  const offset1 = (progress * 200) % 200;
  const offset2 = (progress * 200 + 40) % 200;
  const offset3 = (progress * 200 + 80) % 200;

  return (
    <svg viewBox="0 0 800 500" className="w-full h-full">
      <defs>
        <linearGradient id="flow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(0,0,0,0)" />
          <stop offset="50%" stopColor="rgba(0,0,0,0.15)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </linearGradient>
      </defs>

      {/* Input source - glowing circle */}
      <circle
        cx="100"
        cy="250"
        r="30"
        fill="white"
        stroke="rgba(0,0,0,0.1)"
        strokeWidth="2"
      />
      <circle
        cx="100"
        cy="250"
        r="35"
        fill="none"
        stroke="rgba(0,0,0,0.05)"
        strokeWidth="1"
      />
      <circle
        cx="100"
        cy="250"
        r="40"
        fill="none"
        stroke="rgba(0,0,0,0.02)"
        strokeWidth="0.5"
      />

      {/* Processing nodes */}
      <g>
        {[250, 450, 650].map((x, i) => (
          <g key={i}>
            <rect
              x={x - 25}
              y={250 - 25}
              width="50"
              height="50"
              rx="8"
              fill="white"
              stroke="rgba(0,0,0,0.08)"
              strokeWidth="1.5"
            />
            <circle
              cx={x}
              cy={250}
              r="6"
              fill="rgba(0,0,0,0.1)"
              opacity={clamp(progress - i * 0.15, 0, 1)}
            />
          </g>
        ))}
      </g>

      {/* Flowing pathways with animated dashes */}
      <g fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="2">
        <path
          d="M 130 250 L 225 250"
          strokeDasharray="10,10"
          strokeDashoffset={offset1}
        />
        <path
          d="M 275 250 L 425 250"
          strokeDasharray="10,10"
          strokeDashoffset={offset2}
        />
        <path
          d="M 475 250 L 625 250"
          strokeDasharray="10,10"
          strokeDashoffset={offset3}
        />
      </g>

      {/* Output - insights node */}
      <circle
        cx="700"
        cy="250"
        r="30"
        fill="white"
        stroke="rgba(0,0,0,0.12)"
        strokeWidth="2"
      />
      <circle
        cx="700"
        cy="250"
        r="35"
        fill="none"
        stroke="rgba(0,0,0,0.08)"
        strokeWidth="1"
        opacity={clamp(progress - 0.5, 0, 1)}
      />
      <circle
        cx="700"
        cy="250"
        r="40"
        fill="none"
        stroke="rgba(0,0,0,0.04)"
        strokeWidth="0.5"
        opacity={clamp(progress - 0.5, 0, 1)}
      />

      {/* Particles flowing through */}
      {[0.2, 0.4, 0.6].map((phase, i) => (
        <circle
          key={i}
          cx={100 + (progress + phase) * 600}
          cy={250}
          r="2.5"
          fill="rgba(0,0,0,0.2)"
          opacity={Math.sin((progress + phase) * Math.PI * 2) * 0.5 + 0.5}
        />
      ))}
    </svg>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-slate-600 text-[11px] font-semibold uppercase tracking-widest">
      <span className="w-1 h-1 rounded-full bg-slate-400" />
      {children}
    </span>
  );
}

function PrimaryButton({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      className={`inline-flex items-center gap-2 h-12 px-6 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-black transition-colors ${
        className || ""
      }`}
    >
      {children}
    </button>
  );
}

function SecondaryButton({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      className={`inline-flex items-center gap-2 h-12 px-6 rounded-lg border border-slate-200 bg-white text-slate-900 text-sm font-semibold hover:bg-slate-50 transition-colors ${
        className || ""
      }`}
    >
      {children}
    </button>
  );
}

/**
 * Product Animation: Invisible Intelligence in Action
 */
function InvisibleProductAnimation({ progress }: { progress: number }) {
  const scalePhase = clamp(progress * 1.5, 0, 1);
  const contentPhase = clamp((progress - 0.2) * 1.5, 0, 1);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <svg viewBox="0 0 1000 600" className="w-full h-full">
        <defs>
          <filter id="glow-subtle">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="card-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>

        {/* Meeting interface frame - scales in */}
        <g
          opacity={scalePhase}
          style={{
            transformOrigin: "500px 300px",
            transform: `scale(${0.8 + scalePhase * 0.2})`,
          }}
        >
          {/* Main window */}
          <rect
            x="150"
            y="80"
            width="700"
            height="480"
            rx="24"
            fill="white"
            stroke="rgba(0,0,0,0.08)"
            strokeWidth="2"
            filter="url(#glow-subtle)"
          />

          {/* Window chrome */}
          <circle cx="180" cy="110" r="6" fill="rgba(0,0,0,0.08)" />
          <circle cx="210" cy="110" r="6" fill="rgba(0,0,0,0.08)" />
          <circle cx="240" cy="110" r="6" fill="rgba(0,0,0,0.08)" />

          <line
            x1="150"
            y1="140"
            x2="850"
            y2="140"
            stroke="rgba(0,0,0,0.04)"
            strokeWidth="1"
          />

          {/* Meeting content - fades in */}
          <g opacity={contentPhase}>
            {/* Participant indicators */}
            <text
              x="180"
              y="185"
              fontSize="14"
              fontWeight="600"
              fill="rgba(0,0,0,0.8)"
            >
              Meeting in progress
            </text>
            <text x="180" y="210" fontSize="12" fill="rgba(0,0,0,0.5)">
              4 participants • 23 minutes
            </text>

            {/* Central meeting area */}
            <rect
              x="170"
              y="240"
              width="660"
              height="160"
              rx="12"
              fill="rgba(0,0,0,0.02)"
              stroke="rgba(0,0,0,0.04)"
              strokeWidth="1"
            />

            {/* Insight badges appearing */}
            <g opacity={clamp(contentPhase * 1.5, 0, 1)}>
              {/* Badge 1 */}
              <rect
                x="190"
                y="265"
                width="280"
                height="50"
                rx="8"
                fill="white"
                stroke="rgba(0,0,0,0.06)"
                strokeWidth="1"
              />
              <circle cx="210" cy="290" r="4" fill="rgba(0,0,0,0.3)" />
              <text
                x="225"
                y="283"
                fontSize="11"
                fontWeight="600"
                fill="rgba(0,0,0,0.7)"
              >
                INSIGHT
              </text>
              <text x="225" y="305" fontSize="10" fill="rgba(0,0,0,0.5)">
                Key topic identified
              </text>

              {/* Badge 2 */}
              <rect
                x="530"
                y="265"
                width="280"
                height="50"
                rx="8"
                fill="white"
                stroke="rgba(0,0,0,0.06)"
                strokeWidth="1"
                opacity={clamp((contentPhase - 0.2) * 2, 0, 1)}
              />
              <circle
                cx="550"
                cy="290"
                r="4"
                fill="rgba(0,0,0,0.3)"
                opacity={clamp((contentPhase - 0.2) * 2, 0, 1)}
              />
              <text
                x="565"
                y="283"
                fontSize="11"
                fontWeight="600"
                fill="rgba(0,0,0,0.7)"
                opacity={clamp((contentPhase - 0.2) * 2, 0, 1)}
              >
                INSIGHT
              </text>
              <text
                x="565"
                y="305"
                fontSize="10"
                fill="rgba(0,0,0,0.5)"
                opacity={clamp((contentPhase - 0.2) * 2, 0, 1)}
              >
                Data correlation
              </text>
            </g>

            {/* Real-time data stream */}
            <g opacity={clamp(contentPhase * 0.8, 0, 1)}>
              <text
                x="190"
                y="350"
                fontSize="11"
                fontWeight="600"
                fill="rgba(0,0,0,0.6)"
                letterSpacing="1"
              >
                LIVE DATA STREAM
              </text>
              <line
                x1="190"
                y1="365"
                x2="770"
                y2="365"
                stroke="rgba(0,0,0,0.04)"
                strokeWidth="1"
              />

              {/* Data indicators */}
              <circle
                cx="210"
                cy="385"
                r="3"
                fill="rgba(0,0,0,0.15)"
                opacity={clamp(progress * 1.5, 0, 1)}
              />
              <circle
                cx="240"
                cy="385"
                r="3"
                fill="rgba(0,0,0,0.15)"
                opacity={clamp((progress - 0.1) * 1.5, 0, 1)}
              />
              <circle
                cx="270"
                cy="385"
                r="3"
                fill="rgba(0,0,0,0.15)"
                opacity={clamp((progress - 0.2) * 1.5, 0, 1)}
              />
              <circle
                cx="300"
                cy="385"
                r="3"
                fill="rgba(0,0,0,0.15)"
                opacity={clamp((progress - 0.3) * 1.5, 0, 1)}
              />
            </g>
          </g>
        </g>

        {/* Floating particles indicating intelligence */}
        {[0.1, 0.3, 0.5, 0.7].map((phase, i) => (
          <circle
            key={i}
            cx={150 + (contentPhase + phase) * 700}
            cy={100 + Math.sin((contentPhase + phase) * Math.PI) * 30}
            r="2"
            fill="rgba(0,0,0,0.1)"
            opacity={Math.sin((contentPhase + phase) * Math.PI * 2) * 0.5 + 0.5}
          />
        ))}
      </svg>
    </div>
  );
}

/**
 * Data Intelligence Animation
 * Shows how insights flow and connect in real-time
 */
function DataIntelligenceAnimation({ progress }: { progress: number }) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg viewBox="0 0 800 450" className="w-full h-full">
        <defs>
          <filter id="soft-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
          </filter>
          <radialGradient id="node-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(0,0,0,0.08)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
        </defs>

        {/* Input Node */}
        <g opacity={clamp(progress * 1.2, 0, 1)}>
          <circle cx="100" cy="225" r="45" fill="url(#node-glow)" />
          <rect
            x="70"
            y="195"
            width="60"
            height="60"
            rx="10"
            fill="white"
            stroke="rgba(0,0,0,0.08)"
            strokeWidth="2"
            filter="url(#soft-glow)"
          />
          <text
            x="100"
            y="225"
            textAnchor="middle"
            fontSize="11"
            fontWeight="600"
            fill="rgba(0,0,0,0.6)"
          >
            INPUT
          </text>
        </g>

        {/* Connection lines with flowing animation */}
        <g fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="2.5">
          <path d="M 115 225 L 285 150" />
          <path d="M 115 225 L 285 225" />
          <path d="M 115 225 L 285 300" />
        </g>

        {/* Flowing particles on paths */}
        {[0, 0.3, 0.6].map((pathDelay, pathIdx) => (
          <g key={pathIdx}>
            {[0.2, 0.5, 0.8].map((phase, i) => {
              const animPhase = (progress + phase + pathDelay) % 1;
              const pathData = [
                { x: 115 + animPhase * 170, y: 225 + animPhase * (150 - 225) },
                { x: 115 + animPhase * 170, y: 225 },
                { x: 115 + animPhase * 170, y: 225 + animPhase * (300 - 225) },
              ];

              return (
                <circle
                  key={i}
                  cx={pathData[pathIdx].x}
                  cy={pathData[pathIdx].y}
                  r="3"
                  fill="rgba(0,0,0,0.15)"
                  opacity={Math.sin(animPhase * Math.PI * 2) * 0.5 + 0.5}
                />
              );
            })}
          </g>
        ))}

        {/* Processing Nodes */}
        {[
          { x: 350, y: 150, label: "PARSE" },
          { x: 350, y: 225, label: "ANALYZE" },
          { x: 350, y: 300, label: "ENRICH" },
        ].map((node, i) => (
          <g key={i} opacity={clamp((progress - 0.2) * 1.5, 0, 1)}>
            <circle cx={node.x} cy={node.y} r="48" fill="url(#node-glow)" />
            <rect
              x={node.x - 35}
              y={node.y - 35}
              width="70"
              height="70"
              rx="12"
              fill="white"
              stroke="rgba(0,0,0,0.06)"
              strokeWidth="2"
              filter="url(#soft-glow)"
            />

            {/* Processing dots */}
            <circle
              cx={node.x - 10}
              cy={node.y - 8}
              r="4"
              fill="rgba(0,0,0,0.08)"
              opacity={clamp((progress - 0.3 - i * 0.1) * 2, 0, 1)}
            />
            <circle
              cx={node.x}
              cy={node.y - 8}
              r="4"
              fill="rgba(0,0,0,0.08)"
              opacity={clamp((progress - 0.4 - i * 0.1) * 2, 0, 1)}
            />
            <circle
              cx={node.x + 10}
              cy={node.y - 8}
              r="4"
              fill="rgba(0,0,0,0.08)"
              opacity={clamp((progress - 0.5 - i * 0.1) * 2, 0, 1)}
            />

            <text
              x={node.x}
              y={node.y + 8}
              textAnchor="middle"
              fontSize="10"
              fontWeight="600"
              fill="rgba(0,0,0,0.5)"
            >
              {node.label}
            </text>
          </g>
        ))}

        {/* Output connections */}
        <g
          fill="none"
          stroke="rgba(0,0,0,0.04)"
          strokeWidth="2.5"
          opacity={clamp((progress - 0.4) * 1.5, 0, 1)}
        >
          <path d="M 385 150 L 550 150" />
          <path d="M 385 225 L 550 225" />
          <path d="M 385 300 L 550 300" />
        </g>

        {/* Output Node - Insights */}
        <g opacity={clamp((progress - 0.5) * 1.5, 0, 1)}>
          <circle cx="625" cy="225" r="55" fill="url(#node-glow)" />
          <rect
            x="590"
            y="190"
            width="70"
            height="70"
            rx="12"
            fill="white"
            stroke="rgba(0,0,0,0.1)"
            strokeWidth="2.5"
            filter="url(#soft-glow)"
          />
          <circle
            cx="625"
            cy="215"
            r="5"
            fill="rgba(0,0,0,0.3)"
            opacity={clamp(progress - 0.6, 0, 1)}
          />
          <text
            x="625"
            y="245"
            textAnchor="middle"
            fontSize="11"
            fontWeight="600"
            fill="rgba(0,0,0,0.6)"
          >
            INSIGHTS
          </text>
        </g>

        {/* Pulsing rings on output */}
        {[0, 0.3].map((delay, i) => (
          <circle
            key={i}
            cx="625"
            cy="225"
            r={60 + ((progress + delay) % 1) * 30}
            fill="none"
            stroke="rgba(0,0,0,0.05)"
            strokeWidth="1"
            opacity={Math.max(0, 1 - ((progress + delay) % 1))}
          />
        ))}
      </svg>
    </div>
  );
}

export function ButterflyLanding() {
  const heroRef = useSectionProgress<HTMLDivElement>();
  const dataRef = useSectionProgress<HTMLDivElement>();
  const [reduced, setReduced] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    mq.addEventListener?.("change", (e) => setReduced(e.matches));
  }, []);

  const heroProgress = reduced ? 1 : heroRef.progress;
  const dataProgress = reduced ? 1 : dataRef.progress;

  return (
    <div className="min-h-screen w-full bg-white text-slate-900 font-sans relative">
      <AnimatedBackground />

      {/* Sticky Header */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">
              <Eye className="w-4 h-4" />
            </div>
            <span className="font-semibold text-sm tracking-tight">Cluely</span>
          </div>
          <div className="hidden sm:flex items-center gap-8">
            <a
              href="#"
              className="text-[13px] font-medium text-slate-500 hover:text-slate-900 transition-colors"
            >
              Manifesto
            </a>
            <a
              href="#"
              className="text-[13px] font-medium text-slate-500 hover:text-slate-900 transition-colors"
            >
              Enterprise
            </a>
            <PrimaryButton className="h-9 px-4 text-[12px]">
              Sign In
            </PrimaryButton>
          </div>
        </div>
      </nav>

      <main>
        {/* HERO SECTION */}
        <section className="px-6 sm:px-8 py-24 sm:py-40 max-w-6xl mx-auto flex flex-col items-center text-center">
          <Pill>AI Assistant for Meetings</Pill>

          <h1 className="mt-8 text-5xl sm:text-7xl font-semibold tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Invisible.
            <br />
            Powerful.
            <br />
            <span className="text-slate-500">Always on your side.</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed tracking-tight">
            Real-time AI insights woven seamlessly into your live meetings. No
            screen switching. No distractions. Just answers.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-center gap-4 justify-center">
            <PrimaryButton>
              Get Started <ArrowRight className="w-4 h-4" />
            </PrimaryButton>
            <SecondaryButton>View Demo</SecondaryButton>
          </div>
        </section>

        {/* HERO ANIMATION */}
        <section
          ref={heroRef.ref}
          className="px-6 sm:px-8 pb-32 max-w-5xl mx-auto"
        >
          <div className="relative w-full aspect-[16/10] rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden shadow-2xl shadow-slate-200/40">
            <DotGrid />
            <InvisibleProductAnimation progress={heroProgress} />
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="border-t border-slate-200 py-24 sm:py-32 px-6 sm:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-16">
              <Pill>How Cluely Works</Pill>
              <h2 className="mt-8 text-4xl sm:text-5xl font-semibold tracking-tight leading-tight max-w-3xl">
                Three principles of invisible intelligence
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <MessageCircle className="w-5 h-5" />,
                  title: "Real-Time Listening",
                  desc: "Analyzes meeting dialogue continuously without interruption or screen presence.",
                },
                {
                  icon: <Lightbulb className="w-5 h-5" />,
                  title: "Instant Insights",
                  desc: "Delivers relevant data, research, and recommendations exactly when you need them.",
                },
                {
                  icon: <Zap className="w-5 h-5" />,
                  title: "Seamless Integration",
                  desc: "Works within your existing tools. No setup. No friction. Just intelligence.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex flex-col p-8 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50/50 transition-colors"
                >
                  <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 mb-5">
                    {item.icon}
                  </div>
                  <h3 className="text-[15px] font-semibold text-slate-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DATA FLOW ANIMATION */}
        <section
          ref={dataRef.ref}
          className="border-t border-slate-200 bg-white py-24 sm:py-32 px-6 sm:px-8 relative"
        >
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
              <div>
                <Pill>How It Works</Pill>
                <h2 className="mt-8 text-4xl sm:text-5xl font-semibold tracking-tight leading-tight">
                  Intelligence at scale
                </h2>
                <p className="mt-6 text-lg text-slate-500 leading-relaxed">
                  Real-time processing of meeting data into actionable
                  intelligence. Parsed, analyzed, enriched, and delivered—all in
                  milliseconds.
                </p>
                <ul className="mt-10 space-y-5">
                  {[
                    "Sub-100ms end-to-end latency",
                    "Multi-modal meeting analysis",
                    "Enterprise-grade privacy",
                    "Seamless platform integration",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center">
                        <span className="w-2 h-2 rounded-full bg-slate-900" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative w-full aspect-square rounded-2xl border border-slate-200 bg-white overflow-hidden">
                <DotGrid />
                <FlowingDataAnimation progress={dataProgress} />
              </div>
            </div>
          </div>
        </section>

        {/* USE CASES */}
        <section className="border-t border-slate-200 py-24 sm:py-32 px-6 sm:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-16 text-center">
              <Pill>Use Cases</Pill>
              <h2 className="mt-8 text-4xl sm:text-5xl font-semibold tracking-tight">
                Trusted by teams across industries
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {[
                {
                  icon: <Users className="w-5 h-5" />,
                  label: "Sales Teams",
                  desc: "Real-time prospect research and objection handling",
                },
                {
                  icon: <BarChart3 className="w-5 h-5" />,
                  label: "Leadership",
                  desc: "Strategic insights across all critical conversations",
                },
                {
                  icon: <Clock className="w-5 h-5" />,
                  label: "HR",
                  desc: "Compliance tracking and candidate assessment",
                },
                {
                  icon: <Zap className="w-5 h-5" />,
                  label: "Product",
                  desc: "Customer feedback synthesis in real-time",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-6 rounded-xl border border-slate-200 bg-white hover:bg-slate-50/50 transition-colors flex gap-4"
                >
                  <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-slate-900">
                      {item.label}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="border-t border-slate-200 py-32 px-6 sm:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-5xl sm:text-6xl font-semibold tracking-tight leading-tight mb-6">
              Your meetings deserve better intelligence.
            </h2>
            <p className="text-lg text-slate-500 mb-10">
              Join teams reshaping how professionals access information in
              real-time.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
              <PrimaryButton className="h-13 px-8 text-base">
                Get Started Free
              </PrimaryButton>
              <SecondaryButton>Schedule Demo</SecondaryButton>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
