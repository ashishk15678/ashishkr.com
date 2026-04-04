"use client";

import React, { use } from "react";
import { getDesignBySlug } from "@/lib/constants/designs";
import {
  ClerkDashboard,
  AppleDashboard,
  TerminalDashboard,
  CyberpunkMapLanding,
  ButterflyLanding,
} from "@/components/dashboards";

const demoComponents: Record<string, React.ComponentType> = {
  "clerk-dashboard": ClerkDashboard,
  "apple-dashboard": AppleDashboard,
  "terminal-dashboard": TerminalDashboard,
  "cyberpunk-map-landing": CyberpunkMapLanding,
  "butterfly-landing": ButterflyLanding,
};

export default function DesignPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const design = getDesignBySlug(slug);

  if (!design) {
    return (
      <main className="min-h-screen w-full bg-background text-foreground flex items-center justify-center">
        <div className="text-sm text-muted-foreground">Design not found</div>
      </main>
    );
  }

  const DemoComponent = demoComponents[slug];

  if (!DemoComponent) {
    return (
      <main className="min-h-screen w-full bg-background text-foreground flex items-center justify-center">
        <div className="text-sm text-muted-foreground">
          Preview not available
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full bg-background text-foreground">
      <DemoComponent />
    </main>
  );
}
