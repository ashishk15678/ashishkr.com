import * as React from "react";
import {
  Code,
  Cpu,
  Database,
  Globe,
  Hash,
  LayoutGrid,
  Package,
  Server,
  Terminal,
  Workflow,
  Wrench,
} from "lucide-react";

/**
 * Tech Icon System
 * ---------------
 * Maps project tags (strings) -> icons.
 *
 * Goals:
 * - Work with your existing `Project.tags: string[]` without changing data shape.
 * - Handle variants like "NEXT.JS 15", "TailwindCSS", "Node", etc.
 * - Graceful fallback when the tag is unknown.
 *
 * Usage:
 *   <TechIcon tag="HTML" className="w-4 h-4" />
 *
 *   {project.tags.map((t) => (
 *     <span key={t} className="...">
 *       <TechIcon tag={t} className="w-3.5 h-3.5" />
 *       {t}
 *     </span>
 *   ))}
 */

export type TechIconTone =
  | "zinc"
  | "blue"
  | "cyan"
  | "green"
  | "emerald"
  | "lime"
  | "yellow"
  | "amber"
  | "orange"
  | "red"
  | "rose"
  | "pink"
  | "purple"
  | "violet"
  | "indigo";

export type TechIconDescriptor = {
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label?: string;
  tone?: TechIconTone;
};

function cx(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

const TONE_CLASS: Record<TechIconTone, string> = {
  zinc: "text-zinc-300",
  blue: "text-blue-300",
  cyan: "text-cyan-300",
  green: "text-green-300",
  emerald: "text-emerald-300",
  lime: "text-lime-300",
  yellow: "text-yellow-300",
  amber: "text-amber-300",
  orange: "text-orange-300",
  red: "text-red-300",
  rose: "text-rose-300",
  pink: "text-pink-300",
  purple: "text-purple-300",
  violet: "text-violet-300",
  indigo: "text-indigo-300",
};

/**
 * Normalizes tags so your mapper is resilient.
 * Examples:
 * - "NEXT.JS 15"  -> "nextjs"
 * - "TailwindCSS" -> "tailwindcss"
 * - "Node.js"     -> "nodejs"
 * - "C++"         -> "cpp"
 */
export function normalizeTechTag(tag: string): string {
  const raw = (tag || "").trim().toLowerCase();

  // Collapse some common patterns early
  const noSpaces = raw.replace(/\s+/g, "");
  const noDots = noSpaces.replace(/\./g, "");
  const noSlashes = noDots.replace(/\//g, "");

  // Strip most punctuation except + and # (handled below) then simplify
  let s = noSlashes.replace(/[^a-z0-9+#]/g, "");

  // Special language cases
  if (s === "c++" || s === "cplusplus") s = "cpp";
  if (s === "c#" || s === "csharp") s = "csharp";

  // Version suffixes: "nextjs15" -> "nextjs"
  s = s.replace(/\d+$/g, "");

  // Common aliases
  const alias: Record<string, string> = {
    "nextjs": "nextjs",
    "next": "nextjs",
    "reactjs": "react",
    "node": "nodejs",
    "nodejs": "nodejs",
    "tailwind": "tailwindcss",
    "tailwindcss": "tailwindcss",
    "postgres": "postgresql",
    "postgre": "postgresql",
    "postgresql": "postgresql",
    "ts": "typescript",
    "typescript": "typescript",
    "js": "javascript",
    "javascript": "javascript",
    "html": "html",
    "css": "css",
    "php": "php",
    "java": "java",
    "linux": "linux",
    "cli": "cli",
    "trpc": "trpc",
    "swingui": "swing",
    "swing": "swing",
  };

  return alias[s] ?? s;
}

/**
 * Icon map: normalizedTag -> descriptor.
 * You can expand this anytime without touching rendering code.
 */
export const TECH_ICON_MAP: Record<string, TechIconDescriptor> = {
  // Web basics
  html: { Icon: Code, label: "HTML", tone: "orange" },
  css: { Icon: LayoutGrid, label: "CSS", tone: "blue" },
  javascript: { Icon: Code, label: "JavaScript", tone: "yellow" },
  typescript: { Icon: Code, label: "TypeScript", tone: "blue" },

  // Frameworks / libs
  react: { Icon: Workflow, label: "React", tone: "cyan" },
  nextjs: { Icon: Globe, label: "Next.js", tone: "zinc" },
  tailwindcss: { Icon: Wrench, label: "Tailwind CSS", tone: "cyan" },

  // Backend / infra
  nodejs: { Icon: Server, label: "Node.js", tone: "green" },
  trpc: { Icon: Workflow, label: "tRPC", tone: "violet" },
  postgresql: { Icon: Database, label: "PostgreSQL", tone: "blue" },

  // Systems
  c: { Icon: Cpu, label: "C", tone: "indigo" },
  cpp: { Icon: Cpu, label: "C++", tone: "indigo" },
  linux: { Icon: Terminal, label: "Linux", tone: "emerald" },
  cli: { Icon: Terminal, label: "CLI", tone: "zinc" },

  // Other
  php: { Icon: Package, label: "PHP", tone: "purple" },
  xampp: { Icon: Server, label: "XAMPP", tone: "orange" },
  java: { Icon: Package, label: "Java", tone: "red" },
  swing: { Icon: LayoutGrid, label: "Swing UI", tone: "amber" },
};

export function getTechIconDescriptor(tag: string): TechIconDescriptor {
  const key = normalizeTechTag(tag);
  return (
    TECH_ICON_MAP[key] ?? {
      Icon: Hash,
      label: tag?.trim() || "Unknown",
      tone: "zinc",
    }
  );
}

export type TechIconProps = {
  tag: string;
  className?: string;
  /**
   * If true, adds a subtle glow via drop-shadow to match neon/modern UIs.
   */
  glow?: boolean;
  /**
   * Override tone color (otherwise uses the mapped tone).
   */
  tone?: TechIconTone;
  /**
   * Accessible label override.
   */
  "aria-label"?: string;
};

export function TechIcon({
  tag,
  className,
  glow = false,
  tone,
  "aria-label": ariaLabel,
}: TechIconProps) {
  const desc = getTechIconDescriptor(tag);
  const Icon = desc.Icon;

  const resolvedTone = tone ?? desc.tone ?? "zinc";
  const toneClass = TONE_CLASS[resolvedTone];

  return (
    <Icon
      aria-hidden={ariaLabel ? undefined : true}
      aria-label={ariaLabel ?? undefined}
      className={cx(
        "shrink-0",
        toneClass,
        glow && "drop-shadow-[0_0_10px_rgba(255,255,255,0.15)]",
        className,
      )}
    />
  );
}

/**
 * Helper: render "tag pill" content with an icon + text.
 * Use this to replace your existing tag spans with a consistent UI.
 */
export function TechTagPill({
  tag,
  className,
  iconClassName,
  glow = false,
}: {
  tag: string;
  className?: string;
  iconClassName?: string;
  glow?: boolean;
}) {
  const desc = getTechIconDescriptor(tag);
  return (
    <span className={cx("inline-flex items-center gap-2", className)}>
      <TechIcon tag={tag} className={iconClassName} glow={glow} />
      <span>{desc.label ?? tag}</span>
    </span>
  );
}
