"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FolderProps {
  variant: "orange" | "dark" | "white";
  label?: string;
  sublabel?: string;
  hasDocuments?: boolean;
}

function Folder({
  variant,
  label = "Design Folder",
  sublabel = "16 items",
  hasDocuments = true,
}: FolderProps) {
  const styles = {
    orange: {
      body: "from-[#f5a623] via-[#f0961e] to-[#e8871a]",
      tab: "from-[#f5a623] to-[#e89620]",
      front: "from-[#fbbd4e] via-[#f7a82d] to-[#f09820]",
      shadow: "shadow-[0_8px_32px_rgba(245,166,35,0.25)]",
      textColor: "text-white/90",
      subColor: "text-white/50",
      docBg: "bg-[#ffecc8]",
      docLines: "bg-[#e8c98a]",
      border: "border-[#e8930f]/20",
      iconColor: "text-[#c67a10]",
    },
    dark: {
      body: "from-[#2a2a2e] via-[#232327] to-[#1e1e22]",
      tab: "from-[#2e2e32] to-[#262629]",
      front: "from-[#333338] via-[#2c2c31] to-[#26262b]",
      shadow: "shadow-[0_8px_32px_rgba(0,0,0,0.35)]",
      textColor: "text-white/80",
      subColor: "text-white/35",
      docBg: "bg-[#3a3a3f]",
      docLines: "bg-[#4a4a50]",
      border: "border-white/5",
      iconColor: "text-white/30",
    },
    white: {
      body: "from-[#f0f0f2] via-[#eaeaec] to-[#e4e4e7]",
      tab: "from-[#f2f2f4] to-[#eaeaed]",
      front: "from-[#fafafa] via-[#f5f5f7] to-[#eeeeef]",
      shadow: "shadow-[0_8px_32px_rgba(0,0,0,0.08)]",
      textColor: "text-zinc-700",
      subColor: "text-zinc-400",
      docBg: "bg-white",
      docLines: "bg-zinc-200",
      border: "border-zinc-200/80",
      iconColor: "text-zinc-400",
    },
  };

  const s = styles[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4, transition: { duration: 0.25 } }}
      className="relative flex flex-col items-center cursor-pointer group"
    >
      <div className={cn("relative w-[200px] h-[100px] group", s.shadow)}>
        {/* Folder tab (the small ear at the top-left) */}
        <div
          className={cn(
            "absolute -top-[14px] left-0 w-[52px] h-[20px] rounded-t-lg bg-gradient-to-b border border-b-0",
            s.tab,
            s.border,
          )}
        />

        {/* Folder back panel */}
        <div
          className={cn(
            "absolute inset-0 rounded-lg bg-gradient-to-b  ",
            s.body,
            s.border,
          )}
        />

        {/* Documents peeking out */}
        {hasDocuments && (
          <div className="absolute top-4 group-hover:-top-2 transition-all duration-300 left-1/2 -translate-x-1/2 z-10 flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                initial={{ y: 6 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * i }}
                className={cn(
                  "relative rounded-[3px] border overflow-hidden ",
                  s.docBg,
                  s.border,
                  `rotate(${i === 0 ? -30 : i === 30 ? 5 : 20}deg)`,
                )}
                style={{
                  width: i === 1 ? 30 : 26,
                  height: i === 1 ? 36 : 32,
                  transform: `rotate(${i === 0 ? -5 : i === 2 ? 5 : 0}deg)`,
                }}
              >
                {/* Document lines */}
                <div className="p-1.5 space-y-[3px]">
                  <div
                    className={cn("h-[2px] w-full rounded-full", s.docLines)}
                  />
                  <div
                    className={cn("h-[2px] w-3/4 rounded-full", s.docLines)}
                  />
                  <div
                    className={cn("h-[2px] w-full rounded-full", s.docLines)}
                  />
                  <div
                    className={cn("h-[2px] w-2/3 rounded-full", s.docLines)}
                  />
                  <div
                    className={cn("h-[2px] w-full rounded-full", s.docLines)}
                  />
                  <div
                    className={cn("h-[2px] w-1/2 rounded-full", s.docLines)}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Folder front panel (slightly overlapping) */}
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 h-[72px] perspective-distant group-hover:h-[65px] transition-all opacity-60 backdrop-blur-xl rounded-lg bg-gradient-to-b border",
            s.front,
            s.border,
            "z-20",
          )}
        >
          {/* Folder label area */}
          <div className="absolute bottom-3 left-3 right-3">
            <div
              className={cn(
                "text-[10px] font-semibold leading-none",
                s.textColor,
              )}
            >
              {label}
            </div>
            <div className={cn("text-[8px] mt-0.5 leading-none", s.subColor)}>
              {sublabel}
            </div>
          </div>

          {/* Subtle center icon / logo mark for dark variant */}
          {variant === "dark" && (
            <div className="absolute top-3 right-3">
              <svg
                viewBox="0 0 16 16"
                fill="none"
                className={cn("w-3.5 h-3.5", s.iconColor)}
              >
                <path
                  d="M8 2L6 8L8 14"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 2L10 8L8 14"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}

          {/* Subtle sheen/reflection */}
          <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-white/[0.06] to-transparent pointer-events-none" />
        </div>
      </div>
    </motion.div>
  );
}

interface DesktopFoldersProps {
  className?: string;
}

export function DesktopFolders({ className }: DesktopFoldersProps) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center p-10",
        className,
      )}
    >
      {/* Soft background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 rounded-2xl" />

      {/* Subtle dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] rounded-2xl"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, currentColor 0.5px, transparent 0)",
          backgroundSize: "16px 16px",
        }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 flex items-end gap-6 sm:gap-8"
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Folder
            variant="orange"
            label="Design Folder"
            sublabel="24 items"
            hasDocuments={true}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <Folder
            variant="dark"
            label="Design Folder"
            sublabel="16 items"
            hasDocuments={true}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Folder
            variant="white"
            label="Design Folder"
            sublabel="8 items"
            hasDocuments={true}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
