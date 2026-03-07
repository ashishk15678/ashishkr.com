"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface Integration {
  name: string;
  emoji: string;
  connected: boolean;
}

interface IntegrationCardProps {
  className?: string;
  title?: string;
  description?: string;
  integrations?: Integration[];
}

const defaultIntegrations: Integration[] = [
  { name: "GitHub", emoji: "🐙", connected: true },
  { name: "Slack", emoji: "💬", connected: true },
  { name: "Figma", emoji: "🎨", connected: false },
  { name: "Linear", emoji: "🔷", connected: true },
  { name: "Notion", emoji: "📝", connected: false },
  { name: "Vercel", emoji: "▲", connected: true },
];

export function IntegrationCard({
  className,
  title = "Integrations",
  description = "Connect your favorite tools and automate workflows.",
  integrations = defaultIntegrations,
}: IntegrationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn("w-full max-w-[340px]", className)}
    >
      <Card className="h-full">
        <CardContent className="p-5 space-y-3">
          <h3 className="text-sm font-semibold">{title}</h3>
          <p className="text-[10px] text-muted-foreground">{description}</p>
          <div className="grid grid-cols-3 gap-2">
            {integrations.map((app, i) => (
              <motion.div
                key={app.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.3,
                  delay: i * 0.06,
                  ease: "easeOut",
                }}
                className={cn(
                  "p-2 rounded-lg border text-center space-y-1 transition-colors cursor-pointer",
                  app.connected
                    ? "border-border bg-muted/30 hover:bg-muted/60"
                    : "border-dashed border-border/50 hover:border-border"
                )}
              >
                <div className="text-base">{app.emoji}</div>
                <p className="text-[9px] font-medium">{app.name}</p>
                <p
                  className={cn(
                    "text-[7px]",
                    app.connected
                      ? "text-emerald-500"
                      : "text-muted-foreground"
                  )}
                >
                  {app.connected ? "Connected" : "Available"}
                </p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
