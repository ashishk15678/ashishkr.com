"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface Metric {
  label: string;
  value: string;
  color: string;
}

interface MetricsCardProps {
  className?: string;
  title?: string;
  metrics?: Metric[];
  sparklineData?: number[];
}

const defaultMetrics: Metric[] = [
  { label: "CPU", value: "67%", color: "bg-blue-500" },
  { label: "Memory", value: "82%", color: "bg-violet-500" },
  { label: "Disk", value: "45%", color: "bg-emerald-500" },
  { label: "Network", value: "23%", color: "bg-amber-500" },
];

const defaultSparkline = [
  20, 45, 30, 60, 40, 70, 55, 80, 65, 90, 50, 75, 85, 60, 95, 70,
];

export function MetricsCard({
  className,
  title = "System Metrics",
  metrics = defaultMetrics,
  sparklineData = defaultSparkline,
}: MetricsCardProps) {
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
          <div className="grid grid-cols-2 gap-2">
            {metrics.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.3,
                  delay: i * 0.07,
                  ease: "easeOut",
                }}
                className="p-2 rounded-lg bg-muted/50 space-y-1.5 group cursor-pointer hover:bg-muted/80 transition-colors"
              >
                <div className="flex justify-between text-[10px]">
                  <span className="text-muted-foreground">{m.label}</span>
                  <span className="font-medium">{m.value}</span>
                </div>
                <div className="h-1 rounded-full bg-muted">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: m.value }}
                    transition={{
                      duration: 0.6,
                      delay: 0.2 + i * 0.08,
                      ease: "easeOut",
                    }}
                    className={cn("h-full rounded-full", m.color)}
                  />
                </div>
              </motion.div>
            ))}
          </div>
          {/* Mini sparklines */}
          <div className="flex items-end gap-0.5 h-10 pt-1">
            {sparklineData.map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{
                  duration: 0.3,
                  delay: i * 0.02,
                  ease: "easeOut",
                }}
                className="flex-1 rounded-sm bg-foreground/10 hover:bg-foreground/20 transition-colors"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
