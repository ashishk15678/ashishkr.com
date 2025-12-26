"use client";
import { Header } from "@/components/header";
import { useEffect, useRef } from "react";

export default function SlimeMoldPage() {
  const canvasRef = useRef(null);

  useEffect(() => {
    // --- START OF YOUR ORIGINAL LOGIC ---
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const BACKGROUND = "black";
    const FOREGROUND = "green";

    canvas.width = 600;
    canvas.height = 800;

    function clear() {
      ctx.fillStyle = BACKGROUND;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function point(size = 2, { x, y }) {
      ctx.fillStyle = FOREGROUND;
      ctx.fillRect(x - size / 2, y - size / 2, size, size);
    }

    class Agent {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.angle = Math.random() * (Math.PI * 2);
        this.sensorDist = 20;
        this.sensorAngle = 0.5;
        this.turnSpeed = 0.15;
        this.speed = 2;
      }

      getSensorValue(sensorAngle) {
        const sx = Math.floor(
          this.x + Math.cos(this.angle + sensorAngle) * this.sensorDist,
        );
        const sy = Math.floor(
          this.y + Math.sin(this.angle + sensorAngle) * this.sensorDist,
        );

        if (sx < 0 || sx >= canvas.width || sy < 0 || sy >= canvas.height)
          return 0;

        const pixelData = ctx.getImageData(sx, sy, 1, 1).data;
        return pixelData[1]; // Return Green channel
      }

      update() {
        const valCenter = this.getSensorValue(0);
        const valLeft = this.getSensorValue(-this.sensorAngle);
        const valRight = this.getSensorValue(this.sensorAngle);

        if (valCenter > valLeft && valCenter > valRight) {
          // Continue straight
        } else if (valLeft > valRight) {
          this.angle -= this.turnSpeed;
        } else if (valRight > valLeft) {
          this.angle += this.turnSpeed;
        } else {
          this.angle += (Math.random() - 0.5) * 0.2;
        }

        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;

        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;

        point(2, { x: this.x, y: this.y });
      }
    }

    // Population of agents for collective behavior
    let agents = Array.from({ length: 400 }, () => new Agent());

    let requestRef;
    function frame() {
      // EVAPORATION: Slowly fade trails
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (const a of agents) {
        a.update();
      }
      requestRef = requestAnimationFrame(frame);
    }
    // --- END OF YOUR ORIGINAL LOGIC ---

    clear();
    requestRef = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(requestRef);
  }, []);

  return (
    <div className="flex flex-row h-screen w-full bg-background overflow-hidden font-mono">
      {/* LEFT: ANIMATION */}
      <Header />
      <div className="w-1/2 h-full flex flex-col items-center justify-center border-r border-green-900 bg-background p-4">
        <h1 className="text-green-500 text-xs mb-4 tracking-tighter opacity-50 uppercase">
          Physarum Transport System
        </h1>
        <canvas ref={canvasRef} className="border border-green-900/30" />
      </div>

      {/* RIGHT: CODE DISPLAY */}
      <div className="w-1/2 h-full overflow-y-auto p-8 bg-background text-green-500 selection:bg-green-900">
        <h2 className="text-white text-xl mb-4 border-b border-green-900/30 pb-2">
          Slime Mold Sensor Logic
        </h2>
        <pre className="text-sm leading-relaxed whitespace-pre-wrap">
          {`class Agent {
  getSensorValue(offsetAngle) {
    const sx = this.x + Math.cos(this.angle + offsetAngle) * this.sensorDist;
    const sy = this.y + Math.sin(this.angle + offsetAngle) * this.sensorDist;

    // Read pheromone (green channel) from canvas
    const data = ctx.getImageData(sx, sy, 1, 1).data;
    return data[1];
  }

  update() {
    const forward = this.getSensorValue(0);
    const left = this.getSensorValue(-0.5);
    const right = this.getSensorValue(0.5);

    // Turn toward highest concentration
    if (left > right) this.angle -= this.turnSpeed;
    else if (right > left) this.angle += this.turnSpeed;

    this.x += Math.cos(this.angle) * speed;
    this.y += Math.sin(this.angle) * speed;
  }
}`}
        </pre>
      </div>
    </div>
  );
}
