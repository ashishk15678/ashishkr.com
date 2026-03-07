"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AnalyticsCardProps {
  className?: string;
  title?: string;
  value?: string;
  change?: string;
  changePositive?: boolean;
  data?: number[];
}

const defaultData = [35, 52, 41, 68, 45, 82, 58, 91, 72, 95, 65, 88, 78, 96];

export function AnalyticsCard({
  className,
  title = "Revenue",
  value = "$48,295",
  change = "+12.5%",
  changePositive = true,
  data = defaultData,
}: AnalyticsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn("w-full max-w-[340px]", className)}
    >
      <Card className="h-full">
        <CardContent className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">{title}</h3>
            <Badge
              variant="outline"
              className={cn(
                "text-[9px] h-5",
                changePositive
                  ? "text-emerald-600 border-emerald-200 dark:text-emerald-400 dark:border-emerald-800"
                  : "text-red-600 border-red-200 dark:text-red-400 dark:border-red-800"
              )}
            >
              {change}
            </Badge>
          </div>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          {/* Mini bar chart */}
          <div className="flex items-end gap-1 h-16">
            {data.map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{
                  duration: 0.4,
                  delay: i * 0.03,
                  ease: "easeOut",
                }}
                className={cn(
                  "flex-1 rounded-sm transition-colors",
                  i >= data.length - 2 ? "bg-emerald-500" : "bg-foreground/15"
                )}
              />
            ))}
          </div>
          <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-foreground/15" />
              Previous
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              Current
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
