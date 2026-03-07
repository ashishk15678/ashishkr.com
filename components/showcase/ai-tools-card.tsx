"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface AITool {
  name: string;
  logo: React.ReactNode;
  x: number;
  y: number;
  size: number;
  delay: number;
}

interface AIToolsCardProps {
  className?: string;
  title?: string;
  description?: string;
}

// ── SVG Logos for AI Tools ──

function ChatGPTLogo({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"
        fill="currentColor"
      />
    </svg>
  );
}

function GoogleLogo({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function PerplexityLogo({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2L4 7v10l8 5 8-5V7l-8-5zm0 2.2L18 8v3h-3V8.5L12 6.2 9 8.5V11H6V8l6-3.8zM6 13h3v3.5l3 1.8 3-1.8V13h3v4l-6 3.8L6 17v-4z"
        fill="currentColor"
      />
    </svg>
  );
}

function ClaudeLogo({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.1 0 2 .67 2 1.5S13.1 8 12 8s-2-.67-2-1.5S10.9 5 12 5zm-4.5 5c.55 0 1.08.16 1.53.44L12 12l2.97-1.56c.45-.28.98-.44 1.53-.44.83 0 1.5.45 1.5 1s-.67 1-1.5 1c-.17 0-.34-.03-.5-.08L12 14l-4-2.08c-.16.05-.33.08-.5.08-.83 0-1.5-.45-1.5-1s.67-1 1.5-1zM12 19c-2.76 0-5-1.34-5-3h2c0 .55 1.34 1 3 1s3-.45 3-1h2c0 1.66-2.24 3-5 3z"
        fill="currentColor"
      />
    </svg>
  );
}

function GeminiLogo({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2C12 2 12 8.5 7 12c5 3.5 5 10 5 10s0-6.5 5-10c-5-3.5-5-10-5-10z"
        fill="url(#gemini-grad)"
      />
      <defs>
        <linearGradient
          id="gemini-grad"
          x1="7"
          y1="2"
          x2="17"
          y2="22"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#4285F4" />
          <stop offset="0.5" stopColor="#9B72CB" />
          <stop offset="1" stopColor="#D96570" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function MetaAILogo({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 7c0-1.5 1.2-3 3-3 1.2 0 2.3.7 3.2 1.8L12 6.8l.8-1C13.7 4.7 14.8 4 16 4c1.8 0 3 1.5 3 3v1.5c0 2.5-1.5 5-3.5 7L12 19l-3.5-3.5C6.5 13.5 5 11 5 8.5V7z"
        fill="url(#meta-grad)"
      />
      <defs>
        <linearGradient
          id="meta-grad"
          x1="5"
          y1="4"
          x2="19"
          y2="19"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#0668E1" />
          <stop offset="0.5" stopColor="#7C3AED" />
          <stop offset="1" stopColor="#0668E1" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function MistralLogo({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Mistral-style starburst */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * 45 * Math.PI) / 180;
        const len = i % 2 === 0 ? 9 : 6;
        return (
          <line
            key={i}
            x1="12"
            y1="12"
            x2={12 + Math.cos(angle) * len}
            y2={12 + Math.sin(angle) * len}
            stroke="#F7631B"
            strokeWidth="2"
            strokeLinecap="round"
          />
        );
      })}
      <circle cx="12" cy="12" r="2" fill="#F7631B" />
    </svg>
  );
}

function CopilotLogo({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 3C7.58 3 4 5.69 4 9c0 1.2.5 2.3 1.3 3.2L4 21l3.5-2.1c1.3.7 2.9 1.1 4.5 1.1 4.42 0 8-2.69 8-6s-3.58-6-8-6z"
        fill="currentColor"
        opacity="0.15"
      />
      <path
        d="M9.5 10.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5M14.5 10.5c0-.83-.67-1.5-1.5-1.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M12 3C7.58 3 4 5.69 4 9c0 1.2.5 2.3 1.3 3.2L4 21l3.5-2.1c1.3.7 2.9 1.1 4.5 1.1 4.42 0 8-2.69 8-6s-3.58-6-8-6z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

const AI_TOOLS: AITool[] = [
  {
    name: "ChatGPT",
    logo: <ChatGPTLogo size={28} />,
    x: 68,
    y: 35,
    size: 40,
    delay: 0.1,
  },
  {
    name: "Google",
    logo: <GoogleLogo size={26} />,
    x: 22,
    y: 62,
    size: 38,
    delay: 0.2,
  },
  {
    name: "Perplexity",
    logo: <PerplexityLogo size={24} />,
    x: 38,
    y: 22,
    size: 36,
    delay: 0.15,
  },
  {
    name: "Claude",
    logo: <ClaudeLogo size={24} />,
    x: 15,
    y: 35,
    size: 34,
    delay: 0.25,
  },
  {
    name: "Gemini",
    logo: <GeminiLogo size={26} />,
    x: 52,
    y: 55,
    size: 38,
    delay: 0.3,
  },
  {
    name: "Mistral",
    logo: <MistralLogo size={24} />,
    x: 75,
    y: 58,
    size: 36,
    delay: 0.35,
  },
  {
    name: "Meta AI",
    logo: <MetaAILogo size={22} />,
    x: 42,
    y: 48,
    size: 32,
    delay: 0.18,
  },
  {
    name: "Copilot",
    logo: <CopilotLogo size={22} />,
    x: 58,
    y: 18,
    size: 32,
    delay: 0.28,
  },
];

export function AIToolsCard({
  className,
  title = "All Your AI Tools in One Place",
  description = "Connect and use leading AI models from a single interface. Faster, simpler, and seamless.",
}: AIToolsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn("w-full max-w-[340px]", className)}
    >
      <Card className="h-full overflow-hidden bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
        <CardContent className="p-0">
          {/* ── Grid area with floating logos ── */}
          <div className="relative h-[200px] overflow-hidden">
            {/* Dot grid background */}
            <div className="absolute inset-0">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern
                    id="ai-grid-dots"
                    x="0"
                    y="0"
                    width="20"
                    height="20"
                    patternUnits="userSpaceOnUse"
                  >
                    <circle
                      cx="10"
                      cy="10"
                      r="0.8"
                      fill="currentColor"
                      className="text-zinc-200 dark:text-zinc-800"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#ai-grid-dots)" />
              </svg>
            </div>

            {/* Fine line grid */}
            <div className="absolute inset-0">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern
                    id="ai-grid-lines"
                    x="0"
                    y="0"
                    width="40"
                    height="40"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 40 0 L 0 0 0 40"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="0.5"
                      className="text-zinc-100 dark:text-zinc-800/50"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#ai-grid-lines)" />
              </svg>
            </div>

            {/* Radial fade from edges */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,white_80%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_30%,rgb(9,9,11)_80%)]" />

            {/* Floating AI tool logos */}
            {AI_TOOLS.map((tool) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, scale: 0.5, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: tool.delay,
                  ease: "easeOut",
                }}
                className="absolute"
                style={{
                  left: `${tool.x}%`,
                  top: `${tool.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <motion.div
                  animate={{
                    y: [0, -4, 0],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: tool.delay * 2,
                  }}
                  className={cn(
                    "flex items-center justify-center rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-700/80 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  )}
                  style={{
                    width: tool.size,
                    height: tool.size,
                  }}
                >
                  <div className="text-zinc-800 dark:text-zinc-200">
                    {tool.logo}
                  </div>
                </motion.div>
              </motion.div>
            ))}

            {/* Mouse cursor decoration */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="absolute"
              style={{ left: "45%", top: "28%" }}
            >
              <svg
                width="14"
                height="18"
                viewBox="0 0 14 18"
                fill="none"
                className="text-zinc-900 dark:text-zinc-100 drop-shadow-md"
              >
                <path
                  d="M1 1L1 13.5L4.5 10L8.5 17L10.5 16L6.5 9L11 9L1 1Z"
                  fill="currentColor"
                  stroke="white"
                  strokeWidth="0.8"
                />
              </svg>
            </motion.div>
          </div>

          {/* ── Text area ── */}
          <div className="px-5 pb-5 pt-3 space-y-1.5">
            <motion.h3
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="text-sm font-semibold text-zinc-900 dark:text-zinc-100"
            >
              {title}
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400"
            >
              {description}
            </motion.p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
