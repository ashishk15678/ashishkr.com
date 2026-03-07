"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface ActivityItem {
  user: string;
  action: string;
  time: string;
  color: string;
}

interface ActivityFeedCardProps {
  className?: string;
  title?: string;
  activities?: ActivityItem[];
}

const defaultActivities: ActivityItem[] = [
  {
    user: "AK",
    action: "pushed to main",
    time: "now",
    color: "bg-violet-500",
  },
  {
    user: "RJ",
    action: "opened PR #142",
    time: "5m",
    color: "bg-blue-500",
  },
  {
    user: "SM",
    action: "merged #138",
    time: "12m",
    color: "bg-emerald-500",
  },
  {
    user: "PL",
    action: "commented #136",
    time: "1h",
    color: "bg-amber-500",
  },
  {
    user: "NK",
    action: "deployed v2.4",
    time: "2h",
    color: "bg-pink-500",
  },
];

export function ActivityFeedCard({
  className,
  title = "Activity",
  activities = defaultActivities,
}: ActivityFeedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn("w-full max-w-[340px]", className)}
    >
      <Card className="h-full">
        <CardContent className="p-5 space-y-2">
          <h3 className="text-sm font-semibold mb-2">{title}</h3>
          {activities.map((a, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.07, ease: "easeOut" }}
              className="flex items-center gap-2.5 py-0.5 group cursor-pointer"
            >
              <div
                className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center text-[7px] font-bold text-white shrink-0 transition-transform group-hover:scale-110",
                  a.color
                )}
              >
                {a.user}
              </div>
              <span className="text-xs flex-1 truncate group-hover:text-muted-foreground transition-colors">
                {a.action}
              </span>
              <span className="text-[9px] text-muted-foreground shrink-0">
                {a.time}
              </span>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}
