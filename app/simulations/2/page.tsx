"use client";

import { SimulationWrapper, SimulationParameter } from "@/components/simulation-wrapper";
import { useCallback, useRef } from "react";

const parameters: SimulationParameter[] = [
  { name: "gravity", label: "Gravity Strength", min: 0.01, max: 0.2, step: 0.01, defaultValue: 0.05 },
  { name: "numPoints", label: "Number of Particles", min: 2, max: 10, step: 1, defaultValue: 4 },
  { name: "particleSize", label: "Particle Size", min: 10, max: 40, step: 5, defaultValue: 20 },
  { name: "bounciness", label: "Bounciness", min: 0.5, max: 1, step: 0.05, defaultValue: 1 },
];

interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  hue: number;
}

export default function GravityPage() {
  const pointsRef = useRef<Point[]>([]);
  const lastNumPointsRef = useRef(0);

  const renderSimulation = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement,
      params: Record<string, number>,
      _deltaTime: number
    ) => {
      const { gravity, numPoints, particleSize, bounciness } = params;

      // Initialize or resize points array
      if (lastNumPointsRef.current !== numPoints) {
        pointsRef.current = [];
        for (let i = 0; i < numPoints; i++) {
          pointsRef.current.push({
            x: 100 + Math.random() * 400,
            y: 100 + Math.random() * 200,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8,
            size: particleSize,
            hue: (i / numPoints) * 360,
          });
        }
        lastNumPointsRef.current = numPoints;
      }

      // Clear with fade (trail effect)
      ctx.fillStyle = "rgba(10, 10, 10, 0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Draw center attractor
      ctx.shadowBlur = 40;
      ctx.shadowColor = "#22d3ee";
      const attractorGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, 30
      );
      attractorGradient.addColorStop(0, "#22d3ee");
      attractorGradient.addColorStop(0.5, "#0891b2");
      attractorGradient.addColorStop(1, "transparent");
      ctx.fillStyle = attractorGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw gravitational field rings
      ctx.strokeStyle = "rgba(34, 211, 238, 0.1)";
      ctx.lineWidth = 1;
      for (let r = 50; r < 300; r += 50) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Update and draw points
      for (const p of pointsRef.current) {
        // Update size from params
        p.size = particleSize;

        // Calculate gravity toward center
        const dx = centerX - p.x;
        const dy = centerY - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 1) {
          p.vy += (dy / distance) * gravity;
          p.vx += (dx / distance) * gravity;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Bounce off walls
        if (p.x + p.size / 2 >= canvas.width || p.x - p.size / 2 <= 0) {
          p.vx *= -bounciness;
          p.x = Math.max(p.size / 2, Math.min(canvas.width - p.size / 2, p.x));
        }
        if (p.y + p.size / 2 >= canvas.height || p.y - p.size / 2 <= 0) {
          p.vy *= -bounciness;
          p.y = Math.max(p.size / 2, Math.min(canvas.height - p.size / 2, p.y));
        }

        // Draw particle with glow
        ctx.shadowBlur = 20;
        ctx.shadowColor = `hsl(${p.hue}, 80%, 60%)`;
        
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size / 2);
        gradient.addColorStop(0, `hsl(${p.hue}, 90%, 70%)`);
        gradient.addColorStop(0.7, `hsl(${p.hue}, 80%, 50%)`);
        gradient.addColorStop(1, `hsl(${p.hue}, 70%, 30%)`);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(
          p.x - p.size / 2,
          p.y - p.size / 2,
          p.size,
          p.size
        );

        // Draw velocity vector
        ctx.strokeStyle = `hsla(${p.hue}, 80%, 60%, 0.5)`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.vx * 5, p.y + p.vy * 5);
        ctx.stroke();
      }
      ctx.shadowBlur = 0;

      // Info display
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.font = "12px monospace";
      ctx.fillText(`Particles: ${pointsRef.current.length}`, 20, canvas.height - 20);
    },
    []
  );

  return (
    <SimulationWrapper
      title="Gravity Boxes"
      description="Particles orbit around a central gravitational attractor. Each particle experiences a gravitational pull proportional to its distance from the center. Watch as they trace orbital paths, bounce off walls, and interact with the field. Adjust gravity strength, particle count, and bounciness to explore different behaviors."
      category="Physics"
      parameters={parameters}
      accentColor="cyan"
      renderSimulation={renderSimulation}
    />
  );
}
