"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface UserRow {
  name: string;
  email: string;
  status: string;
  dot: string;
}

interface UserTableCardProps {
  className?: string;
  title?: string;
  subtitle?: string;
  users?: UserRow[];
}

const defaultUsers: UserRow[] = [
  {
    name: "Sarah Chen",
    email: "sarah@acme.co",
    status: "Active",
    dot: "bg-emerald-500",
  },
  {
    name: "James Wilson",
    email: "james@inc.co",
    status: "Invited",
    dot: "bg-amber-500",
  },
  {
    name: "Maria Garcia",
    email: "maria@lab.io",
    status: "Active",
    dot: "bg-emerald-500",
  },
  {
    name: "Alex Kim",
    email: "alex@dev.co",
    status: "Pending",
    dot: "bg-blue-500",
  },
];

export function UserTableCard({
  className,
  title = "Recent Users",
  subtitle = "Last 24h",
  users = defaultUsers,
}: UserTableCardProps) {
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
            <h3 className="text-sm font-semibold">{title}</h3>
            <span className="text-[9px] text-muted-foreground">{subtitle}</span>
          </div>
          {users.map((u, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.07, ease: "easeOut" }}
              className="flex items-center gap-2.5 py-1.5 border-b border-border/50 last:border-0 group cursor-pointer hover:bg-muted/30 -mx-1 px-1 rounded-md transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[8px] font-bold shrink-0 group-hover:ring-2 ring-border transition-all">
                {u.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{u.name}</p>
                <p className="text-[9px] text-muted-foreground truncate">
                  {u.email}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <div className={cn("w-1.5 h-1.5 rounded-full", u.dot)} />
                <span className="text-[9px] text-muted-foreground">
                  {u.status}
                </span>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}
