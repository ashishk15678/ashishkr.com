"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface PricingFeature {
  text: string;
  included: boolean;
}

interface PricingCardProps {
  className?: string;
  planName?: string;
  description?: string;
  price?: string;
  period?: string;
  badge?: string;
  features?: PricingFeature[];
  ctaText?: string;
  onCtaClick?: () => void;
  highlighted?: boolean;
}

const defaultFeatures: PricingFeature[] = [
  { text: "Unlimited projects", included: true },
  { text: "Advanced analytics", included: true },
  { text: "Priority support", included: true },
  { text: "Custom domains", included: true },
  { text: "API access", included: true },
];

export function PricingCard({
  className,
  planName = "Pro Plan",
  description = "For growing teams",
  price = "$29",
  period = "/mo",
  badge = "Popular",
  features = defaultFeatures,
  ctaText = "Get Started",
  onCtaClick,
  highlighted = true,
}: PricingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn("w-full max-w-[340px]", className)}
    >
      <Card className="h-full relative overflow-hidden">
        {highlighted && (
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 via-blue-500 to-emerald-500" />
        )}
        <CardContent className="p-5 space-y-3">
          {badge && (
            <Badge variant="secondary" className="text-[9px] h-5">
              {badge}
            </Badge>
          )}
          <div>
            <h3 className="text-sm font-semibold">{planName}</h3>
            <p className="text-[10px] text-muted-foreground">{description}</p>
          </div>
          <div className="flex items-baseline gap-0.5">
            <span className="text-3xl font-bold">{price}</span>
            <span className="text-xs text-muted-foreground">{period}</span>
          </div>
          <Separator />
          <div className="space-y-2">
            {features.map((f, i) => (
              <motion.div
                key={f.text}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.06, ease: "easeOut" }}
                className="flex items-center gap-2 text-xs"
              >
                <CheckCircle2
                  className={cn(
                    "w-3 h-3 shrink-0",
                    f.included
                      ? "text-emerald-500"
                      : "text-muted-foreground/40"
                  )}
                />
                <span
                  className={cn(
                    !f.included && "text-muted-foreground line-through"
                  )}
                >
                  {f.text}
                </span>
              </motion.div>
            ))}
          </div>
          <Button className="w-full h-8 text-xs" onClick={onCtaClick}>
            {ctaText}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
