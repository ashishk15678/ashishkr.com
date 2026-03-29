"use client";
import { useEffect, useRef, useState } from "react";

const TOTAL_FRAMES = 120;
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
  const [scrollProgress, setScrollProgress] = useState(0);

  // ── Load Frames ──
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
          drawFrame(0, images);
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

  // ── Smooth Animation Loop ──
  useEffect(() => {
    if (!loaded) return;
    const loop = () => {
      const target = targetFrameRef.current;
      if (Math.abs(target - currentFrameRef.current) > 0.01) {
        currentFrameRef.current += (target - currentFrameRef.current) * 0.1;
        drawFrame(Math.round(currentFrameRef.current));
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [loaded]);

  // ── Scroll Handling ──
  useEffect(() => {
    const onScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const total = containerRef.current.offsetHeight - window.innerHeight;
      const progress = Math.min(Math.max(-rect.top / total, 0), 1);

      setScrollProgress(progress);
      targetFrameRef.current = Math.floor(progress * (TOTAL_FRAMES - 1));
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [loaded]);

  return (
    <div
      style={{
        backgroundColor: "#050505",
        color: "#d1d1d1",
        fontFamily: "serif",
      }}
    >
      {/* ── STICKY FILM GRAIN (NOISE) ── */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          opacity: 0.08,
          pointerEvents: "none",
          zIndex: 9999,
          background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ── SECTION 1: VIDEO SCROLL ── */}
      <section
        ref={containerRef}
        style={{ height: "400vh", position: "relative" }}
      >
        <div
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            overflow: "hidden",
          }}
        >
          <canvas
            ref={canvasRef}
            width={1920}
            height={1080}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "brightness(0.7) contrast(1.2)",
            }}
          />

          {/* Overlay Hero Text */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              opacity: 1 - scrollProgress * 2,
              transition: "opacity 0.3s ease",
            }}
          >
            <h1
              style={{
                fontSize: "10vw",
                letterSpacing: "-0.05em",
                margin: 0,
                color: "#fff",
                fontWeight: 400,
              }}
            >
              AETHER
            </h1>
            <p
              style={{
                letterSpacing: "0.8em",
                textTransform: "uppercase",
                fontSize: "0.7rem",
                color: "#888",
              }}
            >
              The Nocturnal Cycle
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: THE MONOGRAPH (STORY) ── */}
      <section
        style={{
          minHeight: "100vh",
          padding: "15vh 10vw",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div style={{ maxWidth: "700px" }}>
          <span
            style={{
              color: "#444",
              fontSize: "0.7rem",
              letterSpacing: "0.5em",
            }}
          >
            CHAPTER 01
          </span>
          <h2
            style={{
              fontSize: "4.5rem",
              color: "#fff",
              margin: "20px 0",
              fontWeight: 300,
            }}
          >
            The Physics <br />
            of Shadows
          </h2>
          <p
            style={{
              fontSize: "1.4rem",
              lineHeight: 1.8,
              color: "#999",
              fontWeight: 300,
            }}
          >
            There is a specific moment in the forest where the light ceases to
            be a particle and becomes a shadow. The{" "}
            <span style={{ color: "#fff" }}>Morpho</span> doesn't just fly; it
            displaces the darkness. Every frame you scrolled through captures a
            micro-second of kinetic evolution—an erratic "clipping" motion
            designed to confuse the eyes of predators.
          </p>
          <div
            style={{
              height: "1px",
              width: "100px",
              background: "#333",
              marginTop: "40px",
            }}
          />
        </div>
      </section>

      {/* ── SECTION 3: DATA GRID (SCIENTIFIC) ── */}
      <section
        style={{
          padding: "10vh 10vw",
          backgroundColor: "#080808",
          borderTop: "1px solid #111",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "60px",
          }}
        >
          {[
            { label: "WINGSPAN", val: "120mm - 200mm" },
            { label: "HABITAT", val: "Tropical Canopy" },
            { label: "LIFESPAN", val: "115 Days" },
            { label: "PIGMENT", val: "Structural Coloration" },
          ].map((item, i) => (
            <div
              key={i}
              style={{ borderLeft: "1px solid #222", paddingLeft: "20px" }}
            >
              <p
                style={{
                  fontSize: "0.6rem",
                  letterSpacing: "0.4em",
                  color: "#444",
                  marginBottom: "10px",
                }}
              >
                {item.label}
              </p>
              <p style={{ fontSize: "1.5rem", color: "#eee" }}>{item.val}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 4: IMAGE GALLERY ── */}
      <section style={{ padding: "15vh 5vw" }}>
        <h3
          style={{
            textAlign: "center",
            marginBottom: "10vh",
            letterSpacing: "0.2em",
            color: "#444",
          }}
        >
          OBSERVATIONS
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.5fr",
            gap: "20px",
            height: "80vh",
          }}
        >
          <div
            style={{
              background: "#111",
              borderRadius: "4px",
              overflow: "hidden",
            }}
          >
            {/* Placeholder for macro shot */}
            <div
              style={{
                width: "100%",
                height: "100%",
                background: "linear-gradient(45deg, #050505, #111)",
              }}
            />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateRows: "1fr 1fr",
              gap: "20px",
            }}
          >
            <div style={{ background: "#0a0a0a", borderRadius: "4px" }} />
            <div style={{ background: "#0a0a0a", borderRadius: "4px" }} />
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        style={{
          padding: "10vh 10vw",
          borderTop: "1px solid #111",
          textAlign: "center",
        }}
      >
        <p style={{ color: "#333", fontSize: "0.8rem" }}>
          &copy; 2026 NOCTURNAL BIOMES | ALL RIGHTS RESERVED
        </p>
      </footer>
    </div>
  );
}
