"use client";
import { useEffect, useRef, useState } from "react";

const TOTAL_FRAMES = 480;
const FRAMES = Array.from(
  { length: TOTAL_FRAMES },
  (_, i) => `/designs/butterfly/frame_${String(i + 1).padStart(4, "0")}.webp`,
);

export default function ButterflyPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const targetFrameRef = useRef(0);
  const [loaded, setLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    let loadedCount = 0;
    const images: HTMLImageElement[] = new Array(TOTAL_FRAMES);

    FRAMES.forEach((src, i) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        images[i] = img;
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) {
          imagesRef.current = images;
          setLoaded(true);
          drawFrame(0, images); // draw first frame immediately
        }
      };
    });
  }, []);

  const drawFrame = (index: number, images?: HTMLImageElement[]) => {
    const canvas = canvasRef.current;
    const imgs = images || imagesRef.current;
    if (!canvas || !imgs[index]) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(imgs[index], 0, 0, canvas.width, canvas.height);
  };

  // ── rAF loop: instantly snap to target frame — no lerp, no lag ──
  useEffect(() => {
    if (!loaded) return;

    const loop = () => {
      const target = targetFrameRef.current;
      if (target !== currentFrameRef.current) {
        currentFrameRef.current = target;
        drawFrame(target);
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [loaded]);

  // ── Scroll → frame mapping ──
  useEffect(() => {
    if (!loaded) return;

    const onScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const scrolled = Math.max(0, -rect.top);
      const total = container.offsetHeight - window.innerHeight;
      const progress = Math.min(scrolled / total, 1);

      targetFrameRef.current = Math.min(
        Math.floor(progress * (TOTAL_FRAMES - 1)),
        TOTAL_FRAMES - 1,
      );

      setShowContent(progress >= 0.99);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [loaded]);

  return (
    <>
      <div ref={containerRef} style={{ height: "500vh" }}>
        <div
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            width: "100%",
            overflow: "hidden",
            background: "#000",
          }}
        >
          {!loaded && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 14,
                opacity: 0.5,
              }}
            >
              Loading...
            </div>
          )}
          <canvas
            ref={canvasRef}
            width={1920}
            height={1080}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "brightness(0.2)",
              opacity: loaded ? 1 : 0,
              transition: "opacity 0.3s",
            }}
          />
        </div>
      </div>

      <div
        style={{
          opacity: showContent ? 1 : 0,
          transform: showContent ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
          pointerEvents: showContent ? "auto" : "none",
        }}
      >
        <section style={{ minHeight: "100vh", padding: "80px 40px" }}>
          <h1>Your content here</h1>
        </section>
      </div>
    </>
  );
}
