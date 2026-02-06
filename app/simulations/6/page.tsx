"use client";

import { SimulationWrapper, SimulationParameter } from "@/components/simulation-wrapper";
import { useCallback } from "react";

const parameters: SimulationParameter[] = [
  { name: "frequency1", label: "Wave 1 Frequency", min: 0.01, max: 0.1, step: 0.005, defaultValue: 0.03 },
  { name: "frequency2", label: "Wave 2 Frequency", min: 0.01, max: 0.1, step: 0.005, defaultValue: 0.04 },
  { name: "amplitude", label: "Amplitude", min: 20, max: 100, step: 5, defaultValue: 50 },
  { name: "speed", label: "Animation Speed", min: 0.5, max: 5, step: 0.5, defaultValue: 2 },
];

export default function WaveInterferencePage() {
  const renderSimulation = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement,
      params: Record<string, number>,
      _deltaTime: number
    ) => {
      const { frequency1, frequency2, amplitude, speed } = params;
      const time = Date.now() * 0.001 * speed;

      // Clear with fade effect for trails
      ctx.fillStyle = "rgba(10, 10, 10, 0.1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Wave sources positions
      const source1X = centerX - 100;
      const source1Y = centerY;
      const source2X = centerX + 100;
      const source2Y = centerY;

      // Draw interference pattern
      const resolution = 4;
      for (let x = 0; x < canvas.width; x += resolution) {
        for (let y = 0; y < canvas.height; y += resolution) {
          // Distance from each source
          const d1 = Math.sqrt((x - source1X) ** 2 + (y - source1Y) ** 2);
          const d2 = Math.sqrt((x - source2X) ** 2 + (y - source2Y) ** 2);

          // Wave values
          const wave1 = Math.sin(d1 * frequency1 - time);
          const wave2 = Math.sin(d2 * frequency2 - time);

          // Interference (superposition)
          const combined = (wave1 + wave2) / 2;

          // Color based on interference
          const intensity = (combined + 1) / 2; // 0 to 1
          
          // Use cyan color scheme
          const r = Math.floor(intensity * 34);
          const g = Math.floor(intensity * 211);
          const b = Math.floor(intensity * 238);
          const a = 0.3 + intensity * 0.7;

          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
          ctx.fillRect(x, y, resolution, resolution);
        }
      }

      // Draw source 1 with glow
      ctx.shadowBlur = 30;
      ctx.shadowColor = "#22d3ee";
      ctx.fillStyle = "#22d3ee";
      ctx.beginPath();
      ctx.arc(source1X, source1Y, 12, 0, Math.PI * 2);
      ctx.fill();

      // Draw source 2 with glow
      ctx.shadowColor = "#06b6d4";
      ctx.fillStyle = "#06b6d4";
      ctx.beginPath();
      ctx.arc(source2X, source2Y, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw expanding circles from sources
      const maxRadius = 300;
      const numCircles = 8;
      ctx.lineWidth = 1;

      for (let i = 0; i < numCircles; i++) {
        const phase = ((time * 50) + i * (maxRadius / numCircles)) % maxRadius;
        const alpha = 1 - phase / maxRadius;

        // Source 1 circles
        ctx.strokeStyle = `rgba(34, 211, 238, ${alpha * 0.3})`;
        ctx.beginPath();
        ctx.arc(source1X, source1Y, phase, 0, Math.PI * 2);
        ctx.stroke();

        // Source 2 circles
        ctx.strokeStyle = `rgba(6, 182, 212, ${alpha * 0.3})`;
        ctx.beginPath();
        ctx.arc(source2X, source2Y, phase, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw labels
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.font = "bold 12px monospace";
      ctx.textAlign = "center";
      ctx.fillText("Source 1", source1X, source1Y + 30);
      ctx.fillText("Source 2", source2X, source2Y + 30);

      // Draw legend
      ctx.textAlign = "left";
      ctx.font = "11px monospace";
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.fillText("Bright = Constructive Interference", 20, canvas.height - 40);
      ctx.fillText("Dark = Destructive Interference", 20, canvas.height - 20);
    },
    []
  );

  return (
    <SimulationWrapper
      title="Wave Interference"
      description="Visualize how two wave sources create interference patterns. When waves meet in phase (constructive interference), they amplify. When out of phase (destructive interference), they cancel. Adjust frequencies to see different patterns emerge, or change the amplitude to see stronger contrasts."
      category="Physics"
      parameters={parameters}
      accentColor="cyan"
      renderSimulation={renderSimulation}
    />
  );
}
