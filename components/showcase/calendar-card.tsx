"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface CalendarCardProps {
  className?: string;
  month?: string;
  year?: number;
  todayDate?: number;
  eventDates?: number[];
}

const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

const DEFAULT_DATES = [
  [27, 28, 29, 30, 31, 1, 2],
  [3, 4, 5, 6, 7, 8, 9],
  [10, 11, 12, 13, 14, 15, 16],
  [17, 18, 19, 20, 21, 22, 23],
  [24, 25, 26, 27, 28, 29, 30],
];

export function CalendarCard({
  className,
  month = "January",
  year = 2025,
  todayDate = 15,
  eventDates = [5, 12, 19, 23],
}: CalendarCardProps) {
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
            <h3 className="text-sm font-semibold">
              {month} {year}
            </h3>
            <div className="flex gap-1">
              <div className="w-5 h-5 rounded flex items-center justify-center border border-border text-[10px] cursor-pointer hover:bg-muted transition-colors">
                ‹
              </div>
              <div className="w-5 h-5 rounded flex items-center justify-center border border-border text-[10px] cursor-pointer hover:bg-muted transition-colors">
                ›
              </div>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-0.5 text-center">
            {DAYS.map((d) => (
              <div
                key={d}
                className="text-[9px] text-muted-foreground py-1 font-medium"
              >
                {d}
              </div>
            ))}
            {DEFAULT_DATES.flat().map((d, i) => {
              const isCurrentMonth =
                (i < 4 && d > 20) || (i >= 4 && i < 31 + 4);
              const isPrevMonth = i < 4 && d > 20;
              const isToday = d === todayDate && isCurrentMonth && !isPrevMonth;
              const hasEvent =
                eventDates.includes(d) && isCurrentMonth && !isPrevMonth;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.2,
                    delay: i * 0.01,
                    ease: "easeOut",
                  }}
                  className={cn(
                    "text-[10px] py-1 rounded relative cursor-pointer transition-colors hover:bg-muted/50",
                    isPrevMonth && "text-muted-foreground/40",
                    isToday && "bg-foreground text-background font-bold hover:bg-foreground/90",
                    hasEvent && !isToday && "font-medium"
                  )}
                >
                  {d}
                  {hasEvent && !isToday && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-0.5 rounded-full bg-blue-500" />
                  )}
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
