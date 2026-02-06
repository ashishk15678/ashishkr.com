"use client";

import { SimulationWrapper, SimulationParameter } from "@/components/simulation-wrapper";
import { useCallback, useRef } from "react";

const parameters: SimulationParameter[] = [
  { name: "length", label: "Pendulum Length", min: 50, max: 250, step: 10, defaultValue: 150 },
  { name: "gravity", label: "Gravity", min: 0.1, max: 2, step: 0.1, defaultValue: 0.5 },
  { name: "damping", label: "Damping", min: 0, max: 0.1, step: 0.005, defaultValue: 0.01 },
  { name: "initialAngle", label: "Initial Angle (°)", min: 10, max: 90, step: 5, defaultValue: 45 },
];

export default function PendulumPage() {
  const stateRef = useRef({
    angle: Math.PI / 4,
    angularVelocity: 0,
    initialized: false,
  });

  const onInit = useCallback(
    (
      _ctx: CanvasRenderingContext2D,
      _canvas: HTMLCanvasElement,
      params: Record<string, number>
    ) => {
      stateRef.current.angle = (params.initialAngle * Math.PI) / 180;
      stateRef.current.angularVelocity = 0;
      stateRef.current.initialized = true;
    },
    []
  );

  const renderSimulation = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement,
      params: Record<string, number>,
      deltaTime: number
    ) => {
      const { length, gravity, damping } = params;
      const state = stateRef.current;

      if (!state.initialized) {
        state.angle = (params.initialAngle * Math.PI) / 180;
        state.angularVelocity = 0;
        state.initialized = true;
      }

      // Physics update
      const angularAcceleration = (-gravity / length) * Math.sin(state.angle);
      state.angularVelocity += angularAcceleration;
      state.angularVelocity *= 1 - damping;
      state.angle += state.angularVelocity;

      // Clear canvas
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Pivot point
      const pivotX = canvas.width / 2;
      const pivotY = 80;

      // Bob position
      const bobX = pivotX + length * Math.sin(state.angle);
      const bobY = pivotY + length * Math.cos(state.angle);

      // Draw decorative elements
      ctx.strokeStyle = "rgba(139, 92, 246, 0.1)";
      ctx.lineWidth = 1;
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.arc(pivotX, pivotY, 50 + i * 60, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw trail arc
      ctx.strokeStyle = "rgba(139, 92, 246, 0.2)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(pivotX, pivotY, length, -Math.PI / 2 + 0.3, -Math.PI / 2 + Math.PI - 0.3);
      ctx.stroke();

      // Draw rod with gradient
      const gradient = ctx.createLinearGradient(pivotX, pivotY, bobX, bobY);
      gradient.addColorStop(0, "rgba(139, 92, 246, 0.8)");
      gradient.addColorStop(1, "rgba(236, 72, 153, 0.8)");
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(pivotX, pivotY);
      ctx.lineTo(bobX, bobY);
      ctx.stroke();

      // Draw pivot
      ctx.fillStyle = "#8b5cf6";
      ctx.beginPath();
      ctx.arc(pivotX, pivotY, 8, 0, Math.PI * 2);
      ctx.fill();

      // Draw bob with glow
      ctx.shadowBlur = 30;
      ctx.shadowColor = "#8b5cf6";
      const bobGradient = ctx.createRadialGradient(bobX, bobY, 0, bobX, bobY, 25);
      bobGradient.addColorStop(0, "#c084fc");
      bobGradient.addColorStop(0.5, "#8b5cf6");
      bobGradient.addColorStop(1, "#7c3aed");
      ctx.fillStyle = bobGradient;
      ctx.beginPath();
      ctx.arc(bobX, bobY, 25, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw velocity indicator
      const velocityScale = 20;
      const vx = state.angularVelocity * length * Math.cos(state.angle) * velocityScale;
      const vy = -state.angularVelocity * length * Math.sin(state.angle) * velocityScale;
      
      ctx.strokeStyle = "rgba(34, 211, 238, 0.6)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(bobX, bobY);
      ctx.lineTo(bobX + vx, bobY + vy);
      ctx.stroke();

      // Draw info
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      ctx.font = "12px monospace";
      ctx.fillText(`θ: ${((state.angle * 180) / Math.PI).toFixed(1)}°`, 20, canvas.height - 40);
      ctx.fillText(`ω: ${state.angularVelocity.toFixed(3)} rad/s`, 20, canvas.height - 20);
    },
    []
  );

  return (
    <SimulationWrapper
      title="Pendulum"
      description="A classic simple pendulum simulation demonstrating harmonic motion. Watch how gravity pulls the bob back toward equilibrium while momentum carries it past. Adjust the length to change the period, add damping to simulate air resistance, or crank up gravity to see faster oscillations."
      category="Physics"
      parameters={parameters}
      accentColor="violet"
      renderSimulation={renderSimulation}
      onInit={onInit}
    />
  );
}
