"use client";
import { Header } from "@/components/header";
import { useEffect, useRef } from "react";

export default function ReactionDiffusionPage() {
  const canvasRef = useRef(null);

  useEffect(() => {
    // --- START OF YOUR ORIGINAL LOGIC ---
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const BACKGROUND = "black";

    // Setting canvas size
    canvas.width = 400; // Adjusted for performance
    canvas.height = 300;

    const DIFF_A = 1.0;
    const DIFF_B = 0.5;
    const FEED = 0.055;
    const KILL = 0.06;

    class PetriDish {
      constructor(w, h) {
        this.w = w;
        this.h = h;
        this.grid = [];
        this.next = [];

        for (let x = 0; x < w; x++) {
          this.grid[x] = [];
          this.next[x] = [];
          for (let y = 0; y < h; y++) {
            this.grid[x][y] = { a: 1, b: 0 };
            this.next[x][y] = { a: 1, b: 0 };
          }
        }
      }

      seed(x, y, radius = 5) {
        for (let i = x - radius; i < x + radius; i++) {
          for (let j = y - radius; j < y + radius; j++) {
            if (i > 0 && i < this.w && j > 0 && j < this.h) {
              this.grid[i][j].b = 1;
            }
          }
        }
      }

      laplace(x, y, chemical) {
        let sum = 0;
        sum += this.grid[x][y][chemical] * -1;
        sum += this.grid[x - 1][y][chemical] * 0.2;
        sum += this.grid[x + 1][y][chemical] * 0.2;
        sum += this.grid[x][y - 1][chemical] * 0.2;
        sum += this.grid[x][y + 1][chemical] * 0.2;
        sum += this.grid[x - 1][y - 1][chemical] * 0.05;
        sum += this.grid[x + 1][y - 1][chemical] * 0.05;
        sum += this.grid[x - 1][y + 1][chemical] * 0.05;
        sum += this.grid[x + 1][y + 1][chemical] * 0.05;
        return sum;
      }

      update() {
        for (let x = 1; x < this.w - 1; x++) {
          for (let y = 1; y < this.h - 1; y++) {
            let a = this.grid[x][y].a;
            let b = this.grid[x][y].b;

            let reaction = a * b * b;
            this.next[x][y].a =
              a + DIFF_A * this.laplace(x, y, "a") - reaction + FEED * (1 - a);
            this.next[x][y].b =
              b +
              DIFF_B * this.laplace(x, y, "b") +
              reaction -
              (KILL + FEED) * b;

            this.next[x][y].a = Math.max(0, Math.min(1, this.next[x][y].a));
            this.next[x][y].b = Math.max(0, Math.min(1, this.next[x][y].b));
          }
        }
        let temp = this.grid;
        this.grid = this.next;
        this.next = temp;
      }

      draw() {
        const imgData = ctx.createImageData(this.w, this.h);
        for (let x = 0; x < this.w; x++) {
          for (let y = 0; y < this.h; y++) {
            let pos = (x + y * this.w) * 4;
            let val = Math.floor((this.grid[x][y].a - this.grid[x][y].b) * 255);

            imgData.data[pos] = val;
            imgData.data[pos + 1] = val / 2;
            imgData.data[pos + 2] = 255 - val;
            imgData.data[pos + 3] = 255;
          }
        }
        ctx.putImageData(imgData, 0, 0);
      }
    }

    const dish = new PetriDish(canvas.width, canvas.height);
    dish.seed(Math.floor(canvas.width / 2), Math.floor(canvas.height / 2), 10);

    let requestRef;
    function loop() {
      dish.update();
      dish.draw();
      requestRef = requestAnimationFrame(loop);
    }
    // --- END OF YOUR ORIGINAL LOGIC ---

    requestRef = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(requestRef);
  }, []);

  return (
    <div className="flex flex-row h-screen w-full bg-background overflow-hidden font-mono">
      {/* LEFT: ANIMATION */}
      <Header />
      <div className="w-1/2 h-full flex flex-col items-center justify-center border-r border-border bg-background p-4">
        <h1 className="text-zinc-500 text-xs mb-4 tracking-widest uppercase">
          Morphogenesis Simulator
        </h1>
        <canvas
          ref={canvasRef}
          className="border border-border shadow-2xl shadow-blue-900/20"
        />
      </div>

      {/* RIGHT: CODE DISPLAY */}
      <div className="w-1/2 h-full overflow-y-auto p-8 bg-background text-green-500">
        <pre className="text-sm leading-relaxed whitespace-pre-wrap">
          {`

            game.height = 400;
            game.width = 500;
            const BACKGROUND = "black";

            const ctx = game.getContext("2d");
            const DIFF_A = 1.0;
            const DIFF_B = 0.5;
            const FEED = 0.055;
            const KILL = 0.06;

            class PetriDish {
              constructor(w, h) {
                this.w = w;
                this.h = h;
                this.grid = [];
                this.next = [];

                for (let x = 0; x < w; x++) {
                  this.grid[x] = [];
                  this.next[x] = [];
                  for (let y = 0; y < h; y++) {
                    // Start with full Chemical A (1) and no Chemical B (0)
                    this.grid[x][y] = { a: 1, b: 0 };
                    this.next[x][y] = { a: 1, b: 0 };
                  }
                }
              }

              seed(x, y, radius = 5) {
                for (let i = x - radius; i < x + radius; i++) {
                  for (let j = y - radius; j < y + radius; j++) {
                    if (i > 0 && i < this.w && j > 0 && j < this.h) {
                      this.grid[i][j].b = 1;
                    }
                  }
                }
              }

              // The Laplacian function: checks 8 neighbors to see how chemicals spread
              laplace(x, y, chemical) {
                let sum = 0;
                sum += this.grid[x][y][chemical] * -1;
                sum += this.grid[x - 1][y][chemical] * 0.2;
                sum += this.grid[x + 1][y][chemical] * 0.2;
                sum += this.grid[x][y - 1][chemical] * 0.2;
                sum += this.grid[x][y + 1][chemical] * 0.2;
                sum += this.grid[x - 1][y - 1][chemical] * 0.05;
                sum += this.grid[x + 1][y - 1][chemical] * 0.05;
                sum += this.grid[x - 1][y + 1][chemical] * 0.05;
                sum += this.grid[x + 1][y + 1][chemical] * 0.05;
                return sum;
              }

              update() {
                for (let x = 1; x < this.w - 1; x++) {
                  for (let y = 1; y < this.h - 1; y++) {
                    let a = this.grid[x][y].a;
                    let b = this.grid[x][y].b;

                    let reaction = a * b * b;
                    this.next[x][y].a =
                      a + DIFF_A * this.laplace(x, y, "a") - reaction + FEED * (1 - a);
                    this.next[x][y].b =
                      b + DIFF_B * this.laplace(x, y, "b") + reaction - (KILL + FEED) * b;

                    // Clamp values between 0 and 1
                    this.next[x][y].a = Math.max(0, Math.min(1, this.next[x][y].a));
                    this.next[x][y].b = Math.max(0, Math.min(1, this.next[x][y].b));
                  }
                }
                // Swap grids
                let temp = this.grid;
                this.grid = this.next;
                this.next = temp;
              }

              draw() {
                const imgData = ctx.createImageData(this.w, this.h);
                for (let x = 0; x < this.w; x++) {
                  for (let y = 0; y < this.h; y++) {
                    let pos = (x + y * this.w) * 4;
                    let val = Math.floor((this.grid[x][y].a - this.grid[x][y].b) * 255);

                    imgData.data[pos] = val; // Red
                    imgData.data[pos + 1] = val / 2; // Green (makes it look organic/yellow)
                    imgData.data[pos + 2] = 255 - val; // Blue
                    imgData.data[pos + 3] = 255; // Alpha
                  }
                }
                ctx.putImageData(imgData, 0, 0);
              }
            }

            const dish = new PetriDish(game.width, game.height);
            dish.seed(game.width / 2, game.height / 2, 10);

            function loop() {
              dish.update();
              dish.draw();
              requestAnimationFrame(loop);
            }

            loop();


            `}
        </pre>
      </div>
    </div>
  );
}
