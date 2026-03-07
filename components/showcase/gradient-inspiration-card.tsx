"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GradientInspirationCardProps {
  title?: string;
  subtitle?: string;
  author?: string;
  className?: string;
}

export function GradientInspirationCard({
  title = "New Inspirations",
  subtitle = "for Designers",
  author = "suraj.dsgn",
  className,
}: GradientInspirationCardProps) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center p-6",
        className
      )}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-[300px] h-[420px] rounded-2xl overflow-hidden shadow-2xl border border-white/5"
      >
        {/* Base dark background */}
        <div className="absolute inset-0 bg-[#0a0a0a]" />

        {/* Gradient mesh - bottom left warm blob */}
        <div className="absolute -bottom-20 -left-20 w-[350px] h-[350px]">
          <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/80 via-orange-400/50 to-transparent rounded-full blur-[60px]" />
        </div>

        {/* Gradient mesh - bottom right pink blob */}
        <div className="absolute -bottom-10 -right-16 w-[280px] h-[280px]">
          <div className="absolute inset-0 bg-gradient-to-tl from-pink-500/70 via-fuchsia-400/40 to-transparent rounded-full blur-[50px]" />
        </div>

        {/* Gradient mesh - center warm highlight */}
        <div className="absolute bottom-20 left-1/4 w-[200px] h-[200px]">
          <div className="absolute inset-0 bg-gradient-to-t from-amber-400/40 via-orange-300/20 to-transparent rounded-full blur-[40px]" />
        </div>

        {/* Subtle top-to-bottom dark vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />

        {/* Author tag - top left */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="absolute top-5 left-5 z-10 flex items-center gap-1.5"
        >
          <div className="w-3.5 h-3.5 flex items-center justify-center">
            <svg
              viewBox="0 0 16 16"
              fill="none"
              className="w-3.5 h-3.5 text-white/70"
            >
              <path
                d="M8 1L6.5 6.5L1 8L6.5 9.5L8 15L9.5 9.5L15 8L9.5 6.5L8 1Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <span className="text-[11px] text-white/70 font-medium tracking-wide">
            {author}
          </span>
        </motion.div>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[28px] font-semibold text-white tracking-tight leading-tight text-center"
          >
            {title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="text-[15px] text-white/60 font-normal mt-1 tracking-wide"
          >
            {subtitle}
          </motion.p>
        </div>

        {/* Bottom right icon button */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="absolute bottom-5 right-5 z-10"
        >
          <div className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="w-4 h-4 text-white/70"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.63a4.5 4.5 0 00-1.242-7.244l4.5-4.5a4.5 4.5 0 016.364 6.364l-1.757 1.757"
              />
            </svg>
          </div>
        </motion.div>

        {/* Noise texture overlay for realism */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none z-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundSize: "128px 128px",
          }}
        />
      </motion.div>
    </div>
  );
}
