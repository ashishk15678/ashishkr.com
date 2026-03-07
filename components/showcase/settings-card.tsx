"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

interface SettingItem {
  label: string;
  on: boolean;
}

interface SettingsCardProps {
  className?: string;
  title?: string;
  settings?: SettingItem[];
}

const defaultSettings: SettingItem[] = [
  { label: "Email notifications", on: true },
  { label: "Push notifications", on: true },
  { label: "Marketing emails", on: false },
  { label: "Two-factor auth", on: true },
];

export function SettingsCard({
  className,
  title = "Preferences",
  settings = defaultSettings,
}: SettingsCardProps) {
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
          {settings.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06, ease: "easeOut" }}
              className="flex items-center justify-between"
            >
              <span className="text-xs">{s.label}</span>
              <Switch defaultChecked={s.on} />
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}
