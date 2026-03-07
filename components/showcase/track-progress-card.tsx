"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface ProgressStage {
  stage: string;
  count: number;
  pct: number;
  color: string;
}

interface TrackProgressCardProps {
  className?: string;
  title?: string;
  description?: string;
  stages?: ProgressStage[];
}

const defaultStages: ProgressStage[] = [
  { stage: "Applied", count: 42, pct: 100, color: "bg-blue-500" },
  { stage: "Screening", count: 28, pct: 67, color: "bg-violet-500" },
  { stage: "Interview", count: 14, pct: 33, color: "bg-emerald-500" },
  { stage: "Offer", count: 5, pct: 12, color: "bg-amber-500" },
];

export function TrackProgressCard({
  className,
  title = "Track progress",
  description = "Track every step of the candidate's journey, from initial application to rejected appraisal.",
  stages = defaultStages,
}: TrackProgressCardProps) {
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
          <p className="text-xs text-muted-foreground leading-relaxed">
            {description}
          </p>
          <div className="space-y-3 pt-1">
            {stages.map((item) => (
              <div key={item.stage} className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-muted-foreground">{item.stage}</span>
                  <span className="font-medium">{item.count}</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.pct}%` }}
                    transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                    className={cn("h-full rounded-full", item.color)}
                  />
                </div>
              </div>
            ))}
          </div>
          {/* Step indicators */}
          <div className="flex items-center gap-1 pt-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1.5 flex-1 rounded-full",
                  i < stages.length ? "bg-foreground/20" : "bg-muted"
                )}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
