"use client";

import { SimulationWrapper, SimulationParameter } from "@/components/simulation-wrapper";
import { useCallback, useRef } from "react";

const parameters: SimulationParameter[] = [
  { name: "growthRate", label: "Growth Rate", min: 0.01, max: 0.1, step: 0.01, defaultValue: 0.03 },
  { name: "branchProb", label: "Branch Probability", min: 0.01, max: 0.1, step: 0.01, defaultValue: 0.04 },
  { name: "maxBranches", label: "Max Branches", min: 50, max: 500, step: 50, defaultValue: 200 },
  { name: "windStrength", label: "Wind Strength", min: 0, max: 0.5, step: 0.05, defaultValue: 0.1 },
];

interface Branch {
  x: number;
  y: number;
  angle: number;
  length: number;
  thickness: number;
  growing: boolean;
  children: number[];
}

export default function PlantGrowthPage() {
  const branchesRef = useRef<Branch[]>([]);
  const initializedRef = useRef(false);
  const timeRef = useRef(0);

  const renderSimulation = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement,
      params: Record<string, number>,
      deltaTime: number
    ) => {
      const { growthRate, branchProb, maxBranches, windStrength } = params;
      timeRef.current += deltaTime;

      // Initialize with seed
      if (!initializedRef.current || branchesRef.current.length === 0) {
        branchesRef.current = [{
          x: canvas.width / 2,
          y: canvas.height - 20,
          angle: -Math.PI / 2,
          length: 0,
          thickness: 8,
          growing: true,
          children: [],
        }];
        initializedRef.current = true;
      }

      // Clear canvas
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw ground
      ctx.fillStyle = "#1a1512";
      ctx.fillRect(0, canvas.height - 20, canvas.width, 20);

      const branches = branchesRef.current;
      const wind = Math.sin(timeRef.current * 2) * windStrength;

      // Update and draw branches
      for (let i = 0; i < branches.length; i++) {
        const b = branches[i];

        // Grow
        if (b.growing && b.length < 60 + Math.random() * 40) {
          b.length += growthRate * 30;

          // Create new branch
          if (
            b.length > 20 &&
            Math.random() < branchProb &&
            branches.length < maxBranches
          ) {
            const side = Math.random() > 0.5 ? 1 : -1;
            const newAngle = b.angle + side * (0.3 + Math.random() * 0.4);
            
            const endX = b.x + Math.cos(b.angle + wind * 0.1) * b.length;
            const endY = b.y + Math.sin(b.angle) * b.length;

            branches.push({
              x: endX,
              y: endY,
              angle: newAngle,
              length: 0,
              thickness: Math.max(1, b.thickness * 0.7),
              growing: true,
              children: [],
            });
            b.children.push(branches.length - 1);
          }

          // Stop growing based on thickness
          if (b.length > 40 && b.thickness < 2 && Math.random() < 0.05) {
            b.growing = false;
          }
        }

        // Apply wind to angle for drawing
        const displayAngle = b.angle + wind * (1 - b.thickness / 10) * 0.3;

        // Draw branch
        const endX = b.x + Math.cos(displayAngle) * b.length;
        const endY = b.y + Math.sin(displayAngle) * b.length;

        // Branch gradient (brown to green)
        const gradient = ctx.createLinearGradient(b.x, b.y, endX, endY);
        if (b.thickness > 3) {
          gradient.addColorStop(0, "#4a3728");
          gradient.addColorStop(1, "#3d5c3a");
        } else {
          gradient.addColorStop(0, "#3d5c3a");
          gradient.addColorStop(1, "#22c55e");
        }

        ctx.strokeStyle = gradient;
        ctx.lineWidth = b.thickness;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(b.x, b.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Draw leaves on thin branches
        if (b.thickness < 2 && b.length > 10) {
          ctx.fillStyle = `rgba(34, 197, 94, ${0.3 + Math.random() * 0.4})`;
          const leafCount = Math.floor(b.length / 15);
          for (let l = 0; l < leafCount; l++) {
            const t = (l + 1) / (leafCount + 1);
            const lx = b.x + Math.cos(displayAngle) * b.length * t;
            const ly = b.y + Math.sin(displayAngle) * b.length * t;
            
            ctx.beginPath();
            ctx.ellipse(
              lx + (Math.random() - 0.5) * 5,
              ly + (Math.random() - 0.5) * 5,
              3 + Math.random() * 3,
              2 + Math.random() * 2,
              Math.random() * Math.PI,
              0,
              Math.PI * 2
            );
            ctx.fill();
          }
        }
      }

      // Stats
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      ctx.fillRect(10, 10, 110, 30);
      ctx.font = "11px monospace";
      ctx.fillStyle = "#22c55e";
      ctx.fillText(`Branches: ${branches.length}`, 20, 30);
    },
    []
  );

  return (
    <SimulationWrapper
      title="L-System Plant"
      description="A procedural plant growth simulation using L-system-like rules. Watch as the plant sprouts from a seed, grows branches probabilistically, and develops leaves. Wind gently sways the thinner branches while the thick trunk stays stable."
      category="Biology"
      parameters={parameters}
      accentColor="green"
      renderSimulation={renderSimulation}
    />
  );
}
