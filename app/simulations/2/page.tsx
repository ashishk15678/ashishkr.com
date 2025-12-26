"use client";
import { Header } from "@/components/header";
import { useEffect, useRef } from "react";

export default function GravityPage() {
  const canvasRef = useRef(null);

  useEffect(() => {
    // --- START OF YOUR ORIGINAL LOGIC ---
    const BACKGROUND = "black";
    const FOREGROUND = "green";
    const background = canvasRef.current; // Linked to the Ref
    const FPS = 60;
    background.width = 600; // Adjusted for split screen
    background.height = 800;

    const ctx = background.getContext("2d");

    class point {
      constructor({ x, y, vx, vy, size = 20 }) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.size = size;
      }
      paint() {
        ctx.fillStyle = FOREGROUND;
        ctx.fillRect(
          this.x - this.size / 2,
          this.y - this.size / 2,
          this.size,
          this.size,
        );
      }
      update() {
        const centerX = background.width / 2;
        const centerY = background.height / 2;

        let dx = centerX - this.x;
        let dy = centerY - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        const gravity = 0.05;

        if (distance > 1) {
          this.vy += (dy / distance) * gravity;
          this.vx += (dx / distance) * gravity;
        }
        this.x += this.vx;
        this.y += this.vy;

        if (this)
          if (
            this.x + this.size / 2 >= background.width ||
            this.x - this.size / 2 <= 0
          ) {
            this.vx *= -1;
          }
        if (
          this.y + this.size / 2 >= background.height ||
          this.y - this.size / 2 <= 0
        ) {
          this.vy *= -1;
        }
      }
    }

    function clear() {
      ctx.fillStyle = BACKGROUND;
      ctx.fillRect(0, 0, background.width, background.height);
    }

    let points = [
      new point({ x: 100, y: 100, vx: 2, vy: 3 }),
      new point({ x: 100, y: 150, vx: -6, vy: -4 }),
      new point({ x: 150, y: 100, vx: 2, vy: -5 }),
      new point({ x: 150, y: 150, vx: -2, vy: 3 }),
    ];

    let requestRef;
    function frame() {
      clear();
      for (const p of points) {
        p.paint();
        p.update();
      }
      requestRef = requestAnimationFrame(frame);
    }
    // --- END OF YOUR ORIGINAL LOGIC ---

    requestRef = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(requestRef);
  }, []);

  return (
    <div className="flex flex-row h-screen w-full bg-background overflow-hidden font-mono">
      {/* LEFT: ANIMATION */}
      <Header />
      <div className="w-1/2 h-full flex items-center justify-center border-r border-border bg-background">
        <canvas ref={canvasRef} className="max-w-full max-h-full" />
      </div>

      {/* RIGHT: CODE DISPLAY */}
      <div className="w-1/2 h-full overflow-y-auto p-8 bg-background text-green-500">
        <h2 className="text-primary text-xl mb-4 border-b border-border pb-2">
          Gravity Simulation Code
        </h2>
        <pre className="text-sm leading-relaxed whitespace-pre-wrap">
          {`const BACKGROUND = "black";
const FOREGROUND = "green";
const background = document.getElementById("background");
const FPS = 60;

class point {
    constructor({ x, y, vx, vy, size = 20 }) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.size = size;
    }
    paint() {
        ctx.fillStyle = FOREGROUND;
        ctx.fillRect(
            this.x - this.size / 2,
            this.y - this.size / 2,
            this.size,
            this.size,
        );
    }
    update() {
        const centerX = background.width / 2;
        const centerY = background.height / 2;

        let dx = centerX - this.x;
        let dy = centerY - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        const gravity = 0.05;

        if (distance > 1) {
            this.vy += (dy / distance) * gravity;
            this.vx += (dx / distance) * gravity;
        }
        this.x += this.vx;
        this.y += this.vy;

        if (this.x + this.size / 2 >= background.width || this.x - this.size / 2 <= 0) {
            this.vx *= -1;
        }
        if (this.y + this.size / 2 >= background.height || this.y - this.size / 2 <= 0) {
            this.vy *= -1;
        }
    }
}`}
        </pre>
      </div>
    </div>
  );
}
