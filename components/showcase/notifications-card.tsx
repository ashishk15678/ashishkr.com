"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Notification {
  title: string;
  desc: string;
  time: string;
  dot: string;
}

interface NotificationsCardProps {
  className?: string;
  notifications?: Notification[];
}

const defaultNotifications: Notification[] = [
  {
    title: "New sign-up",
    desc: "sarah@example.com",
    time: "2m",
    dot: "bg-emerald-500",
  },
  {
    title: "Payment received",
    desc: "$49 from Pro plan",
    time: "15m",
    dot: "bg-blue-500",
  },
  {
    title: "Server alert",
    desc: "CPU usage at 92%",
    time: "1h",
    dot: "bg-amber-500",
  },
  {
    title: "Deploy success",
    desc: "v2.4.1 is live",
    time: "3h",
    dot: "bg-violet-500",
  },
];

export function NotificationsCard({
  className,
  notifications = defaultNotifications,
}: NotificationsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn("w-full max-w-[340px]", className)}
    >
      <Card className="h-full">
        <CardContent className="p-5 space-y-2">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-semibold">Notifications</h3>
            <Badge variant="secondary" className="text-[9px] h-5">
              {notifications.filter((_, i) => i < 3).length} new
            </Badge>
          </div>
          {notifications.map((n, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.08, ease: "easeOut" }}
              className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <div
                className={cn(
                  "w-1.5 h-1.5 rounded-full mt-1.5 shrink-0",
                  n.dot
                )}
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{n.title}</p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {n.desc}
                </p>
              </div>
              <span className="text-[9px] text-muted-foreground shrink-0">
                {n.time}
              </span>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}
