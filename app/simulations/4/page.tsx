"use client";

import { SimulationWrapper, SimulationParameter } from "@/components/simulation-wrapper";
import { useCallback, useRef } from "react";

const parameters: SimulationParameter[] = [
  { name: "agentCount", label: "Agent Count", min: 100, max: 800, step: 50, defaultValue: 400 },
  { name: "sensorDist", label: "Sensor Distance", min: 5, max: 40, step: 5, defaultValue: 20 },
  { name: "turnSpeed", label: "Turn Speed", min: 0.05, max: 0.4, step: 0.05, defaultValue: 0.15 },
  { name: "moveSpeed", label: "Move Speed", min: 0.5, max: 4, step: 0.5, defaultValue: 2 },
];

interface Agent {
  x: number;
  y: number;
  angle: number;
}

export default function SlimeMoldPage() {
  const agentsRef = useRef<Agent[]>([]);
  const lastCountRef = useRef(0);

  const renderSimulation = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement,
      params: Record<string, number>,
      _deltaTime: number
    ) => {
      const { agentCount, sensorDist, turnSpeed, moveSpeed } = params;

      // Initialize or resize agents
      if (lastCountRef.current !== agentCount) {
        agentsRef.current = [];
        for (let i = 0; i < agentCount; i++) {
          agentsRef.current.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            angle: Math.random() * Math.PI * 2,
          });
        }
        lastCountRef.current = agentCount;
        
        // Clear canvas on reset
        ctx.fillStyle = "#0a0a0a";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      const sensorAngle = 0.5;

      // Evaporation / fade
      ctx.fillStyle = "rgba(10, 10, 10, 0.03)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Sensor function
      const getSensorValue = (agent: Agent, offsetAngle: number) => {
        const sx = Math.floor(agent.x + Math.cos(agent.angle + offsetAngle) * sensorDist);
        const sy = Math.floor(agent.y + Math.sin(agent.angle + offsetAngle) * sensorDist);

        if (sx < 0 || sx >= canvas.width || sy < 0 || sy >= canvas.height) return 0;

        const pixelData = ctx.getImageData(sx, sy, 1, 1).data;
        return pixelData[1]; // Green channel
      };

      // Update agents
      for (const agent of agentsRef.current) {
        const valCenter = getSensorValue(agent, 0);
        const valLeft = getSensorValue(agent, -sensorAngle);
        const valRight = getSensorValue(agent, sensorAngle);

        if (valCenter > valLeft && valCenter > valRight) {
          // Continue straight
        } else if (valLeft > valRight) {
          agent.angle -= turnSpeed;
        } else if (valRight > valLeft) {
          agent.angle += turnSpeed;
        } else {
          agent.angle += (Math.random() - 0.5) * 0.2;
        }

        agent.x += Math.cos(agent.angle) * moveSpeed;
        agent.y += Math.sin(agent.angle) * moveSpeed;

        // Wrap around
        if (agent.x < 0) agent.x = canvas.width;
        if (agent.x > canvas.width) agent.x = 0;
        if (agent.y < 0) agent.y = canvas.height;
        if (agent.y > canvas.height) agent.y = 0;

        // Draw trail
        ctx.fillStyle = "#22c55e";
        ctx.fillRect(agent.x - 1, agent.y - 1, 2, 2);
      }

      // Info overlay
      ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
      ctx.fillRect(10, canvas.height - 35, 140, 25);
      ctx.fillStyle = "rgba(34, 197, 94, 0.8)";
      ctx.font = "11px monospace";
      ctx.fillText(`Agents: ${agentsRef.current.length}`, 15, canvas.height - 18);
    },
    []
  );

  return (
    <SimulationWrapper
      title="Physarum (Slime Mold)"
      description="A simulation of Physarum polycephalum, a fascinating slime mold that creates efficient transport networks. Each agent follows pheromone trails left by others, creating emergent self-organizing patterns similar to real slime mold behavior. Adjust sensor distance and turn speed to see different network structures form."
      category="Biology"
      parameters={parameters}
      accentColor="cyan"
      renderSimulation={renderSimulation}
    />
  );
}
