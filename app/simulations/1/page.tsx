"use client";
import { Header } from "@/components/header";
import { useEffect, useRef } from "react";

export default function Page() {
  const game = useRef(null);

  useEffect(() => {
    // Standard setup
    const BACKGROUND = "black";
    const FOREGROUND = "#00FF41"; // Matrix green
    const FPS = 60;
    const canvas = game.current;
    const ctx = canvas.getContext("2d");

    // Handle high-DPI displays for sharpness
    canvas.width = 600;
    canvas.height = 800;

    // --- MATH LOGIC ---
    const screen = (p) => ({
      x: ((p.x + 1) / 2) * canvas.width,
      y: (1 - (p.y + 1) / 2) * canvas.height,
    });

    const project = ({ x, y, z }) => ({ x: x / z, y: y / z });

    const rotate_xz = ({ x, y, z }, angle) => ({
      x: x * Math.cos(angle) - z * Math.sin(angle),
      y,
      z: z * Math.cos(angle) + x * Math.sin(angle),
    });

    const translateZ = ({ x, y, z }, dz) => ({ x, y, z: z + dz });

    const line = (p1, p2) => {
      ctx.strokeStyle = FOREGROUND;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    };

    // --- DATA ---
    const vs = [
      { x: 0.25, y: 0.25, z: 0.5 },
      { x: -0.25, y: 0.25, z: 0.5 },
      { x: -0.25, y: -0.25, z: 0.5 },
      { x: 0.25, y: -0.25, z: 0.5 },
      { x: 0.25, y: 0.25, z: -0.5 },
      { x: -0.25, y: 0.25, z: -0.5 },
      { x: -0.25, y: -0.25, z: -0.5 },
      { x: 0.25, y: -0.25, z: -0.5 },
    ];

    const faces = [
      [0, 1, 2, 3],
      [4, 5, 6, 7], // Front/Back
      [0, 4],
      [1, 5],
      [2, 6],
      [3, 7], // Connecting lines
    ];

    let angle = 0;
    let dz = 1.2; // Camera distance
    let requestRef;

    const animate = () => {
      angle += 0.02;

      // Clear
      ctx.fillStyle = BACKGROUND;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw
      for (const face of faces) {
        for (let i = 0; i < face.length; i++) {
          // If it's a connection line (length 2), don't loop back to start
          if (face.length === 2 && i === 1) continue;

          const a = vs[face[i]];
          const b = vs[face[(i + 1) % face.length]];

          line(
            screen(project(translateZ(rotate_xz(a, angle), dz))),
            screen(project(translateZ(rotate_xz(b, angle), dz))),
          );
        }
      }
      requestRef = requestAnimationFrame(animate);
    };

    requestRef = requestAnimationFrame(animate);

    // Cleanup to prevent memory leaks/multiple loops
    return () => cancelAnimationFrame(requestRef);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-background text-green-500">
      {/* Header can go here */}
      <Header />
      <div className="flex flex-row flex-1 overflow-hidden">
        {/* LEFT: ANIMATION (Sticky) */}
        <div className="w-1/2 flex items-center justify-center border-r border-border bg-background sticky top-0">
          <canvas ref={game} className="max-w-full max-h-full object-contain" />
        </div>

        {/* RIGHT: CODE (Scrollable) */}
        <div className="w-1/2 overflow-y-auto p-6 font-mono text-sm bg-background">
          <h2 className="text-white mb-4 text-xl border-b border-green-800 pb-2">
            3D Projection Engine
          </h2>
          <pre className="text-green-500">
            {`

              const BACKGROUND = "black";
              const FOREGROUND = "green";
              const FPS = 60;
              game.width = 600;
              game.height = 800;

              const ctx = game.getContext("2d");
              console.log({ ctx });
              function clear() {
                ctx.fillStyle = BACKGROUND;
                ctx.fillRect(0, 0, game.width, game.height);
              }
              function point(size = 20, { x, y }) {
                ctx.fillStyle = FOREGROUND;
                ctx.fillRect(x - size / 2, y - size / 2, size, size);
              }

              function screen(p) {
                // -1..1 => 0.ww/h
                return {
                  x: ((p.x + 1) / 2) * game.width,
                  y: (1 - (p.y + 1) / 2) * game.height,
                };
              }

              function project({ x, y, z }) {
                return {
                  x: x / z,
                  y: y / z,
                };
              }
              const vs = [
                { x: 0.25, y: 0.25, z: 0.5 },
                { x: -0.25, y: 0.25, z: 0.5 },
                { x: -0.25, y: -0.25, z: 0.5 },
                { x: 0.25, y: -0.25, z: 0.5 },

                { x: 0.25, y: 0.25, z: -0.5 },
                { x: -0.25, y: 0.25, z: -0.5 },
                { x: -0.25, y: -0.25, z: -0.5 },
                { x: 0.25, y: -0.25, z: -0.5 },
              ];

              const faces = [
                [0, 1, 2, 3],
                [4, 5, 6, 7],
                [0, 4],
                [1, 5],
                [2, 6],
                [3, 7],
              ];

              function translateZ({ x, y, z }, dz) {
                return { x: x, y: y, z: z + dz };
              }

              function rotate_xz({ x, y, z }, angle) {
                let x_dash = x * Math.cos(angle) - z * Math.sin(angle);
                let z_dash = z * Math.cos(angle) + x * Math.sin(angle);
                return { x: x_dash, y, z: z_dash };
              }

              function line(p1, p2) {
                ctx.strokeStyle = FOREGROUND;
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
              }

              let dz = 1;
              let angle = 0;

              function frame() {
                const dt = 1 / FPS;
                //dz += 1 * dt;
                angle += Math.PI * dt;
                clear();
                //  for (const v of vs) {
                //  point(20, screen(project(translateZ(rotate_xz(v, angle), dz))));
                //}
                for (const face of faces) {
                  for (let i = 0; i < face.length; i++) {
                    const a = vs[face[i]];
                    const b = vs[face[(i + 1) % face.length]];
                    line(
                      screen(project(translateZ(rotate_xz(a, angle), dz))),
                      screen(project(translateZ(rotate_xz(b, angle), dz))),
                    );
                  }
                }
                setTimeout(frame, 1000 / FPS);
              }

              setTimeout(frame, 1000 / FPS);
              ashish@1:~$



              `}
          </pre>
        </div>
      </div>
    </div>
  );
}
