"use client";

import { SimulationWrapper, SimulationParameter } from "@/components/simulation-wrapper";
import { useCallback, useRef } from "react";

const parameters: SimulationParameter[] = [
  { name: "feed", label: "Feed Rate", min: 0.02, max: 0.08, step: 0.005, defaultValue: 0.055 },
  { name: "kill", label: "Kill Rate", min: 0.04, max: 0.08, step: 0.005, defaultValue: 0.06 },
  { name: "diffA", label: "Diffusion A", min: 0.5, max: 1.5, step: 0.1, defaultValue: 1.0 },
  { name: "diffB", label: "Diffusion B", min: 0.2, max: 0.8, step: 0.05, defaultValue: 0.5 },
];

interface Cell {
  a: number;
  b: number;
}

export default function ReactionDiffusionPage() {
  const gridRef = useRef<Cell[][] | null>(null);
  const nextRef = useRef<Cell[][] | null>(null);
  const initializedRef = useRef(false);

  const renderSimulation = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement,
      params: Record<string, number>,
      _deltaTime: number
    ) => {
      const { feed, kill, diffA, diffB } = params;
      const w = canvas.width;
      const h = canvas.height;

      // Initialize grids
      if (!initializedRef.current || !gridRef.current || !nextRef.current) {
        gridRef.current = [];
        nextRef.current = [];
        
        for (let x = 0; x < w; x++) {
          gridRef.current[x] = [];
          nextRef.current[x] = [];
          for (let y = 0; y < h; y++) {
            gridRef.current[x][y] = { a: 1, b: 0 };
            nextRef.current[x][y] = { a: 1, b: 0 };
          }
        }
        
        // Seed center
        const cx = Math.floor(w / 2);
        const cy = Math.floor(h / 2);
        const radius = 15;
        for (let i = cx - radius; i < cx + radius; i++) {
          for (let j = cy - radius; j < cy + radius; j++) {
            if (i > 0 && i < w && j > 0 && j < h) {
              gridRef.current[i][j].b = 1;
            }
          }
        }
        initializedRef.current = true;
      }

      const grid = gridRef.current;
      const next = nextRef.current;

      // Laplacian function
      const laplace = (x: number, y: number, chemical: "a" | "b") => {
        let sum = 0;
        sum += grid[x][y][chemical] * -1;
        sum += grid[x - 1][y][chemical] * 0.2;
        sum += grid[x + 1][y][chemical] * 0.2;
        sum += grid[x][y - 1][chemical] * 0.2;
        sum += grid[x][y + 1][chemical] * 0.2;
        sum += grid[x - 1][y - 1][chemical] * 0.05;
        sum += grid[x + 1][y - 1][chemical] * 0.05;
        sum += grid[x - 1][y + 1][chemical] * 0.05;
        sum += grid[x + 1][y + 1][chemical] * 0.05;
        return sum;
      };

      // Update simulation
      for (let x = 1; x < w - 1; x++) {
        for (let y = 1; y < h - 1; y++) {
          const a = grid[x][y].a;
          const b = grid[x][y].b;

          const reaction = a * b * b;
          next[x][y].a = a + diffA * laplace(x, y, "a") - reaction + feed * (1 - a);
          next[x][y].b = b + diffB * laplace(x, y, "b") + reaction - (kill + feed) * b;

          next[x][y].a = Math.max(0, Math.min(1, next[x][y].a));
          next[x][y].b = Math.max(0, Math.min(1, next[x][y].b));
        }
      }

      // Swap buffers
      const temp = gridRef.current;
      gridRef.current = nextRef.current;
      nextRef.current = temp;

      // Draw
      const imgData = ctx.createImageData(w, h);
      for (let x = 0; x < w; x++) {
        for (let y = 0; y < h; y++) {
          const pos = (x + y * w) * 4;
          const val = gridRef.current[x][y].a - gridRef.current[x][y].b;
          
          // Color scheme: cyan to violet
          const intensity = Math.floor(val * 255);
          imgData.data[pos] = Math.floor(intensity * 0.5 + 50);     // R
          imgData.data[pos + 1] = Math.floor(intensity * 0.8 + 30); // G
          imgData.data[pos + 2] = 255 - Math.floor(intensity * 0.3); // B
          imgData.data[pos + 3] = 255;
        }
      }
      ctx.putImageData(imgData, 0, 0);

      // Overlay info
      ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
      ctx.fillRect(10, canvas.height - 35, 180, 25);
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.font = "11px monospace";
      ctx.fillText(`Feed: ${feed.toFixed(3)} | Kill: ${kill.toFixed(3)}`, 15, canvas.height - 18);
    },
    []
  );

  return (
    <SimulationWrapper
      title="Petri Dish"
      description="A reaction-diffusion simulation modeling morphogenesis patterns found in nature. Two chemicals (A and B) diffuse and react, creating organic Turing patterns. Adjust the feed and kill rates to discover coral, spots, stripes, and labyrinthine patterns that emerge from simple rules."
      category="Biology"
      parameters={parameters}
      accentColor="cyan"
      renderSimulation={renderSimulation}
    />
  );
}
