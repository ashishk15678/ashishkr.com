"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Search,
  Home,
  Settings,
  Users,
  FileText,
  BarChart3,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CommandItem {
  icon: React.ElementType;
  label: string;
  shortcut: string;
}

interface CommandPaletteCardProps {
  className?: string;
  placeholder?: string;
  items?: CommandItem[];
  activeIndex?: number;
}

const defaultItems: CommandItem[] = [
  { icon: Home, label: "Home", shortcut: "⌘H" },
  { icon: Settings, label: "Settings", shortcut: "⌘," },
  { icon: Users, label: "Team Members", shortcut: "⌘T" },
  { icon: FileText, label: "Documentation", shortcut: "⌘D" },
  { icon: BarChart3, label: "Analytics", shortcut: "⌘A" },
];

export function CommandPaletteCard({
  className,
  placeholder = "Type a command or search...",
  items = defaultItems,
  activeIndex = 0,
}: CommandPaletteCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn("w-full max-w-[340px]", className)}
    >
      <Card className="h-full overflow-hidden">
        <CardContent className="p-0">
          <div className="px-4 py-3 border-b border-border flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground flex-1">
              {placeholder}
            </span>
            <Badge variant="outline" className="text-[8px] h-4 px-1.5">
              ⌘K
            </Badge>
          </div>
          <div className="p-1.5">
            <p className="text-[9px] text-muted-foreground px-2 py-1 tracking-wider uppercase">
              Suggestions
            </p>
            {items.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.3,
                  delay: i * 0.05,
                  ease: "easeOut",
                }}
                className={cn(
                  "flex items-center gap-2.5 px-2 py-1.5 rounded-md text-xs cursor-pointer transition-colors hover:bg-muted/50",
                  i === activeIndex && "bg-muted/50"
                )}
              >
                <item.icon className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="flex-1">{item.label}</span>
                <span className="text-[9px] text-muted-foreground font-mono">
                  {item.shortcut}
                </span>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
