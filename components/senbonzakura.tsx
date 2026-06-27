"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Petal {
  id: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
  size: number;
  rotation: number;
}

export function Senbonzakura() {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    // Generate petals to simulate Byakuya's Bankai (Senbonzakura Kageyoshi)
    // Using 60 petals for a good balance of effect and performance
    const newPetals = Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // random start X position (%)
      y: -10 - Math.random() * 20, // start above screen
      delay: Math.random() * 20, // random delay
      duration: 8 + Math.random() * 15, // speed of flow
      size: 6 + Math.random() * 10, // size variations
      rotation: Math.random() * 360,
    }));
    setPetals(newPetals);
  }, []);

  if (petals.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden mix-blend-screen">
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          // The shape and glow of a glowing pink blade/petal
          className="absolute bg-gradient-to-br from-pink-200 via-pink-400 to-pink-600 rounded-tl-full rounded-br-full rounded-tr-[1px] rounded-bl-[1px] shadow-[0_0_15px_rgba(236,72,153,0.8)]"
          style={{
            width: petal.size,
            height: petal.size * 0.45, 
            left: `${petal.x}%`,
            top: `${petal.y}%`,
          }}
          animate={{
            y: ["0vh", "120vh"],
            x: [
              "0vw",
              `${Math.sin(petal.id) * 35}vw`,
              `${-Math.cos(petal.id) * 25}vw`,
              `${Math.sin(petal.id) * 45}vw`,
            ],
            // 3D tumbling effect
            rotateX: [petal.rotation, petal.rotation + 720 * (petal.id % 2 === 0 ? 1 : -1)],
            rotateY: [petal.rotation, petal.rotation + 1080 * (petal.id % 2 === 0 ? 1 : -1)],
            rotateZ: [petal.rotation, petal.rotation + 360 * (petal.id % 2 === 0 ? 1 : -1)],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: petal.duration,
            repeat: Infinity,
            delay: petal.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
