"use client";

import { SimulationWrapper, SimulationParameter } from "@/components/simulation-wrapper";
import { useCallback, useRef } from "react";

const parameters: SimulationParameter[] = [
  { name: "preyBirth", label: "Prey Birth Rate", min: 0.01, max: 0.1, step: 0.01, defaultValue: 0.04 },
  { name: "predDeath", label: "Predator Death Rate", min: 0.01, max: 0.1, step: 0.01, defaultValue: 0.02 },
  { name: "predation", label: "Predation Rate", min: 0.001, max: 0.01, step: 0.001, defaultValue: 0.004 },
  { name: "efficiency", label: "Conversion Efficiency", min: 0.001, max: 0.005, step: 0.0005, defaultValue: 0.002 },
];

interface Creature {
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: "prey" | "predator";
  energy: number;
}

export default function PredatorPreyPage() {
  const creaturesRef = useRef<Creature[]>([]);
  const initializedRef = useRef(false);

  const renderSimulation = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement,
      params: Record<string, number>,
      _deltaTime: number
    ) => {
      const { preyBirth, predDeath, predation, efficiency } = params;

      // Initialize
      if (!initializedRef.current) {
        creaturesRef.current = [];
        // Add prey (rabbits)
        for (let i = 0; i < 80; i++) {
          creaturesRef.current.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            type: "prey",
            energy: 50 + Math.random() * 50,
          });
        }
        // Add predators (foxes)
        for (let i = 0; i < 15; i++) {
          creaturesRef.current.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 3,
            vy: (Math.random() - 0.5) * 3,
            type: "predator",
            energy: 100,
          });
        }
        initializedRef.current = true;
      }

      // Clear with fade
      ctx.fillStyle = "rgba(10, 10, 10, 0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const creatures = creaturesRef.current;
      const newCreatures: Creature[] = [];

      // Update creatures
      for (let i = creatures.length - 1; i >= 0; i--) {
        const c = creatures[i];

        // Movement with slight randomness
        c.vx += (Math.random() - 0.5) * 0.5;
        c.vy += (Math.random() - 0.5) * 0.5;
        c.vx = Math.max(-3, Math.min(3, c.vx));
        c.vy = Math.max(-3, Math.min(3, c.vy));
        c.x += c.vx;
        c.y += c.vy;

        // Wrap around
        if (c.x < 0) c.x = canvas.width;
        if (c.x > canvas.width) c.x = 0;
        if (c.y < 0) c.y = canvas.height;
        if (c.y > canvas.height) c.y = 0;

        if (c.type === "prey") {
          // Prey reproduction
          if (Math.random() < preyBirth && creatures.filter(cr => cr.type === "prey").length < 200) {
            newCreatures.push({
              x: c.x + (Math.random() - 0.5) * 20,
              y: c.y + (Math.random() - 0.5) * 20,
              vx: (Math.random() - 0.5) * 2,
              vy: (Math.random() - 0.5) * 2,
              type: "prey",
              energy: 50,
            });
          }
        } else {
          // Predator hunting
          c.energy -= 0.5;

          for (let j = creatures.length - 1; j >= 0; j--) {
            const prey = creatures[j];
            if (prey.type !== "prey") continue;

            const dx = c.x - prey.x;
            const dy = c.y - prey.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Chase prey
            if (dist < 100) {
              c.vx -= (dx / dist) * 0.1;
              c.vy -= (dy / dist) * 0.1;
            }

            // Catch prey
            if (dist < 10 && Math.random() < predation) {
              creatures.splice(j, 1);
              c.energy += 50;

              // Predator reproduction
              if (c.energy > 150 && Math.random() < efficiency) {
                newCreatures.push({
                  x: c.x,
                  y: c.y,
                  vx: (Math.random() - 0.5) * 3,
                  vy: (Math.random() - 0.5) * 3,
                  type: "predator",
                  energy: 80,
                });
                c.energy -= 60;
              }
              break;
            }
          }

          // Predator dies
          if (c.energy <= 0 || Math.random() < predDeath * 0.1) {
            creatures.splice(i, 1);
          }
        }
      }

      // Add new creatures
      creatures.push(...newCreatures);

      // Draw creatures
      for (const c of creatures) {
        if (c.type === "prey") {
          // Prey - green dots
          ctx.fillStyle = "#22c55e";
          ctx.beginPath();
          ctx.arc(c.x, c.y, 4, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Predator - red dots with glow
          ctx.shadowBlur = 10;
          ctx.shadowColor = "#ef4444";
          ctx.fillStyle = "#ef4444";
          ctx.beginPath();
          ctx.arc(c.x, c.y, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // Stats
      const preyCount = creatures.filter(c => c.type === "prey").length;
      const predCount = creatures.filter(c => c.type === "predator").length;

      ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      ctx.fillRect(10, 10, 120, 50);
      ctx.font = "11px monospace";
      ctx.fillStyle = "#22c55e";
      ctx.fillText(`Prey: ${preyCount}`, 20, 30);
      ctx.fillStyle = "#ef4444";
      ctx.fillText(`Predators: ${predCount}`, 20, 48);
    },
    []
  );

  return (
    <SimulationWrapper
      title="Predator-Prey"
      description="A Lotka-Volterra ecosystem simulation. Green prey reproduce and are hunted by red predators. Watch population dynamics oscillate as predators boom when prey are plentiful, then crash when food runs scarce, allowing prey to recover."
      category="Biology"
      parameters={parameters}
      accentColor="green"
      renderSimulation={renderSimulation}
    />
  );
}
