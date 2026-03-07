"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DevBentoCardProps {
  className?: string;
  name?: string;
  handle?: string;
  bio?: string;
  location?: string;
  age?: number;
}

const fadeIn = (delay: number) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay, ease: "easeOut" as const },
});

function TechStackCell() {
  const frontendItems = [
    "React",
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "Framer Motion",
  ];
  const backendItems = ["Node.js", "Express", "PostgreSQL", "Prisma", "Redis"];
  const toolItems = ["Git", "Docker", "Vercel", "Figma", "VS Code"];

  return (
    <motion.div
      {...fadeIn(0.1)}
      className="col-span-2 row-span-2 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 overflow-hidden"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg font-mono font-bold text-zinc-800 dark:text-zinc-200">
          {"{ }"}
        </span>
        <span className="text-xs font-bold uppercase tracking-widest text-zinc-800 dark:text-zinc-200">
          Tech Stack
        </span>
      </div>

      <div className="space-y-2.5">
        {[
          { label: "Frontend", items: frontendItems },
          { label: "Backend", items: backendItems },
          { label: "Tools", items: toolItems },
        ].map((section) => (
          <div key={section.label}>
            <p className="text-[9px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1">
              {section.label}
            </p>
            <div className="flex flex-wrap gap-1">
              {section.items.map((item) => (
                <span
                  key={item}
                  className="px-1.5 py-0.5 text-[8px] font-medium rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200/60 dark:border-zinc-700/60"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function ProfileCell({
  name,
  handle,
  bio,
  location,
  age,
}: {
  name: string;
  handle: string;
  bio: string;
  location: string;
  age: number;
}) {
  return (
    <motion.div
      {...fadeIn(0.15)}
      className="col-span-3 row-span-2 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 overflow-hidden"
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-600 flex items-center justify-center">
            <span className="text-lg font-bold text-zinc-500 dark:text-zinc-400">
              {name.charAt(0)}
            </span>
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-900" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
              {name}
            </h3>
            <span className="text-[9px] text-zinc-400">•</span>
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">
              @{handle}
            </span>
          </div>
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5">
            {bio}
          </p>
        </div>
      </div>

      {/* Info */}
      <div className="mt-3 space-y-1.5">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <svg
              className="w-3 h-3 text-zinc-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="text-[9px] text-zinc-500 dark:text-zinc-400">
              {location}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <svg
              className="w-3 h-3 text-zinc-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-[9px] text-zinc-500 dark:text-zinc-400">
              {age} years old
            </span>
          </div>
        </div>

        {/* Chat bubbles */}
        <div className="space-y-1 mt-2">
          <div className="flex justify-start">
            <div className="bg-zinc-100 dark:bg-zinc-800 rounded-xl rounded-tl-sm px-2.5 py-1 max-w-[80%]">
              <p className="text-[9px] text-zinc-600 dark:text-zinc-300">
                &quot;How do I center a div?&quot;
              </p>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="bg-blue-500 rounded-xl rounded-tr-sm px-2.5 py-1 max-w-[80%]">
              <p className="text-[9px] text-white">
                &quot;flexbox. always flexbox.&quot;
              </p>
            </div>
          </div>
          <div className="flex justify-start">
            <div className="bg-zinc-100 dark:bg-zinc-800 rounded-xl rounded-tl-sm px-2.5 py-1 max-w-[80%]">
              <p className="text-[9px] text-zinc-600 dark:text-zinc-300">
                &quot;Available for work?&quot;
              </p>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="bg-blue-500 rounded-xl rounded-tr-sm px-2.5 py-1 max-w-[80%]">
              <p className="text-[9px] text-white">
                &quot;Let&apos;s talk! 🚀&quot;
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function LinksCell() {
  const links = [
    { label: "X", icon: "𝕏" },
    { label: "GitHub", icon: "◆" },
    { label: "Gmail", icon: "✉" },
    { label: "LinkedIn", icon: "in" },
    { label: "Portfolio", icon: "◎" },
    { label: "Resume", icon: "📄" },
  ];

  return (
    <motion.div
      {...fadeIn(0.2)}
      className="col-span-2 row-span-2 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 overflow-hidden"
    >
      <div className="flex items-center gap-1.5 mb-2.5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-800 dark:text-zinc-200">
          Links
        </span>
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {links.map((link, i) => (
          <motion.div
            key={link.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25 + i * 0.05, duration: 0.3 }}
            className="flex flex-col items-center gap-1 p-1.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-700/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <span className="text-sm">{link.icon}</span>
            <span className="text-[7px] font-medium text-zinc-500 dark:text-zinc-400">
              {link.label}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function DailyToolStackCell() {
  const tools = [
    { name: "VS Code", color: "bg-blue-500" },
    { name: "Arc", color: "bg-violet-500" },
    { name: "Figma", color: "bg-pink-500" },
    { name: "Notion", color: "bg-zinc-800 dark:bg-zinc-200" },
    { name: "Slack", color: "bg-green-600" },
    { name: "Spotify", color: "bg-emerald-500" },
  ];

  return (
    <motion.div
      {...fadeIn(0.25)}
      className="col-span-2 row-span-1 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 overflow-hidden"
    >
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          Daily
        </span>
        <span className="text-[10px] font-bold text-zinc-800 dark:text-zinc-200">
          Tool Stack
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {tools.map((tool, i) => (
          <motion.div
            key={tool.name}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.04, duration: 0.3 }}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-700/50"
          >
            <div className={cn("w-2 h-2 rounded-full", tool.color)} />
            <span className="text-[8px] font-medium text-zinc-600 dark:text-zinc-400">
              {tool.name}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function ProjectsCell() {
  const projects = [
    {
      name: "swift",
      desc: "A blazing-fast UI kit",
      color: "from-orange-400 to-red-500",
      emoji: "⚡",
    },
    {
      name: "nocturn",
      desc: "Dark mode everything",
      color: "from-indigo-500 to-purple-600",
      emoji: "🌙",
    },
    {
      name: "forge",
      desc: "Component builder",
      color: "from-cyan-400 to-blue-500",
      emoji: "🔨",
    },
  ];

  return (
    <motion.div
      {...fadeIn(0.3)}
      className="col-span-3 row-span-1 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 overflow-hidden"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-800 dark:text-zinc-200">
            Projects
          </span>
          <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 font-medium">
            {projects.length}
          </span>
        </div>
        <span className="text-[8px] font-semibold text-zinc-400 dark:text-zinc-500 flex items-center gap-0.5">
          工 SSS
        </span>
      </div>
      <div className="space-y-1.5">
        {projects.map((proj, i) => (
          <motion.div
            key={proj.name}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 + i * 0.06, duration: 0.3 }}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer group"
          >
            <div
              className={cn(
                "w-7 h-7 rounded-lg bg-gradient-to-br flex items-center justify-center text-xs shadow-sm",
                proj.color
              )}
            >
              {proj.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold text-zinc-800 dark:text-zinc-200 truncate">
                {proj.name}
              </p>
              <p className="text-[8px] text-zinc-400 dark:text-zinc-500 truncate">
                {proj.desc}
              </p>
            </div>
            <svg
              className="w-3 h-3 text-zinc-300 dark:text-zinc-600 group-hover:text-zinc-500 dark:group-hover:text-zinc-400 transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function GalleryCell() {
  return (
    <motion.div
      {...fadeIn(0.35)}
      className="col-span-2 row-span-1 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800"
    >
      <div className="h-full grid grid-cols-2 gap-px bg-zinc-200 dark:bg-zinc-700">
        {[
          "from-rose-300 to-orange-200",
          "from-blue-300 to-cyan-200",
          "from-violet-300 to-purple-200",
          "from-emerald-300 to-teal-200",
        ].map((gradient, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 + i * 0.05, duration: 0.4 }}
            className={cn(
              "bg-gradient-to-br flex items-center justify-center",
              gradient,
              i === 0 && "rounded-tl-2xl",
              i === 1 && "rounded-tr-2xl",
              i === 2 && "rounded-bl-2xl",
              i === 3 && "rounded-br-2xl"
            )}
          >
            <span className="text-white/60 text-[8px] font-medium">
              {["Screenshot", "Preview", "Demo", "Design"][i]}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function StatusCell() {
  return (
    <motion.div
      {...fadeIn(0.32)}
      className="col-span-1 row-span-1 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-3 flex flex-col justify-between overflow-hidden"
    >
      <p className="text-[8px] font-semibold text-white/60 uppercase tracking-wider">
        Status
      </p>
      <div>
        <p className="text-[10px] font-bold text-white leading-tight">
          Building cool stuff
        </p>
        <p className="text-[8px] text-white/60 mt-0.5">since 2020</p>
      </div>
    </motion.div>
  );
}

export function DevBentoCard({
  className,
  name = "Shawn.",
  handle = "zzzzShawn",
  bio = "I build WebApps. Full-stack developer crafting modern interfaces.",
  location = "Goa, India",
  age = 22,
}: DevBentoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn("w-full max-w-[520px]", className)}
    >
      <div className="rounded-2xl bg-zinc-100/80 dark:bg-zinc-950/80 p-2 sm:p-2.5">
        <div className="grid grid-cols-7 auto-rows-[52px] gap-2">
          {/* Row 1-2: Tech Stack (2 cols) + Profile (3 cols) + Links (2 cols) */}
          <TechStackCell />
          <ProfileCell
            name={name}
            handle={handle}
            bio={bio}
            location={location}
            age={age}
          />
          <LinksCell />

          {/* Row 3: Daily Tool Stack (2 cols) + Projects (3 cols) + Gallery (2 cols) */}
          <DailyToolStackCell />
          <ProjectsCell />
          <GalleryCell />

          {/* Row 4 extra: Status accent */}
        </div>
      </div>
    </motion.div>
  );
}
