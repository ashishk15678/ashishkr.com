"use client";

import { SimulationWrapper, SimulationParameter } from "@/components/simulation-wrapper";
import { useCallback, useRef } from "react";

const parameters: SimulationParameter[] = [
  { name: "rotationSpeed", label: "Rotation Speed", min: 0.5, max: 5, step: 0.25, defaultValue: 1 },
  { name: "distance", label: "Camera Distance", min: 0.8, max: 3, step: 0.1, defaultValue: 1.2 },
  { name: "cubeSize", label: "Cube Size", min: 0.15, max: 0.5, step: 0.05, defaultValue: 0.25 },
  { name: "lineWidth", label: "Line Width", min: 1, max: 5, step: 0.5, defaultValue: 2 },
];

export default function CubePage() {
  const angleRef = useRef(0);

  const renderSimulation = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement,
      params: Record<string, number>,
      deltaTime: number
    ) => {
      const { rotationSpeed, distance, cubeSize, lineWidth } = params;

      // Update angle
      angleRef.current += 0.02 * rotationSpeed;
      const angle = angleRef.current;

      // Math functions
      const screen = (p: { x: number; y: number }) => ({
        x: ((p.x + 1) / 2) * canvas.width,
        y: (1 - (p.y + 1) / 2) * canvas.height,
      });

      const project = ({ x, y, z }: { x: number; y: number; z: number }) => ({
        x: x / z,
        y: y / z,
      });

      const rotateXZ = ({ x, y, z }: { x: number; y: number; z: number }, ang: number) => ({
        x: x * Math.cos(ang) - z * Math.sin(ang),
        y,
        z: z * Math.cos(ang) + x * Math.sin(ang),
      });

      const translateZ = ({ x, y, z }: { x: number; y: number; z: number }, dz: number) => ({
        x,
        y,
        z: z + dz,
      });

      // Clear canvas
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw decorative grid
      ctx.strokeStyle = "rgba(139, 92, 246, 0.1)";
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 40) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Cube vertices
      const vs = [
        { x: cubeSize, y: cubeSize, z: 0.5 },
        { x: -cubeSize, y: cubeSize, z: 0.5 },
        { x: -cubeSize, y: -cubeSize, z: 0.5 },
        { x: cubeSize, y: -cubeSize, z: 0.5 },
        { x: cubeSize, y: cubeSize, z: -0.5 },
        { x: -cubeSize, y: cubeSize, z: -0.5 },
        { x: -cubeSize, y: -cubeSize, z: -0.5 },
        { x: cubeSize, y: -cubeSize, z: -0.5 },
      ];

      const faces = [
        [0, 1, 2, 3], // Front
        [4, 5, 6, 7], // Back
        [0, 4],
        [1, 5],
        [2, 6],
        [3, 7], // Connecting edges
      ];

      // Create gradient for lines
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, "#8b5cf6");
      gradient.addColorStop(0.5, "#ec4899");
      gradient.addColorStop(1, "#8b5cf6");

      ctx.strokeStyle = gradient;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = "round";

      // Draw cube
      for (const face of faces) {
        for (let i = 0; i < face.length; i++) {
          if (face.length === 2 && i === 1) continue;

          const a = vs[face[i]];
          const b = vs[face[(i + 1) % face.length]];

          const p1 = screen(project(translateZ(rotateXZ(a, angle), distance)));
          const p2 = screen(project(translateZ(rotateXZ(b, angle), distance)));

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }

      // Draw vertices with glow
      ctx.shadowBlur = 15;
      ctx.shadowColor = "#8b5cf6";
      ctx.fillStyle = "#c084fc";
      for (const v of vs) {
        const p = screen(project(translateZ(rotateXZ(v, angle), distance)));
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      // Info display
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.font = "12px monospace";
      ctx.fillText(`Angle: ${((angle * 180) / Math.PI).toFixed(1)}°`, 20, canvas.height - 20);
    },
    []
  );

  return (
    <SimulationWrapper
      title="3D Cube"
      description="A rotating wireframe cube rendered using 3D projection mathematics. The cube's vertices are transformed through rotation and perspective projection to create the illusion of depth. Adjust rotation speed, camera distance, and cube size to explore the geometry."
      category="Geometry"
      parameters={parameters}
      accentColor="violet"
      renderSimulation={renderSimulation}
    />
  );
}
