"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface WalletCardProps {
  balance?: string;
  label?: string;
  className?: string;
}

export function WalletCard({
  balance = "$250,000",
  label = "TOTAL BALANCE",
  className,
}: WalletCardProps) {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  const cards = [
    {
      id: 1,
      name: "AMERICAN",
      bg: "bg-gradient-to-br from-[#E9C46A] via-[#F4A261] to-[#E76F51]",
      textColor: "text-orange-950/60",
      pattern: "opacity-20",
    },
    {
      id: 2,
      name: "AMERICAN",
      bg: "bg-gradient-to-br from-[#457B9D] via-[#A8DADC] to-[#1D3557]",
      textColor: "text-blue-900/60",
      pattern: "opacity-30",
    },
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#3d4a3e]">
      {/* Outer Wallet Container */}
      <div className="relative w-80 h-64 bg-[#1f2e22] rounded-[2.5rem] shadow-2xl border-4 border-[#162118] overflow-hidden flex flex-col">
        {/* Top "Stitch" Detail */}
        <div className="absolute top-2 left-0 right-0 h-1 border-t border-dashed border-white/10 mx-6"></div>

        {/* Card Stack Area */}
        <div className="relative h-24 mt-4 px-4">
          {/* Gold Card */}
          <div className="absolute top-0 left-6 right-6 h-20 bg-gradient-to-br from-[#e5cf91] via-[#c4a65d] to-[#9a7d3a] rounded-t-xl shadow-lg flex justify-end p-3 border-t border-x border-white/20">
            <span className="text-[10px] font-black tracking-widest text-black/80">
              AMERICAN
            </span>
          </div>

          {/* Blue Card */}
          <div className="absolute top-6 left-4 right-4 h-20 bg-gradient-to-br from-[#93b9db] via-[#5b8db9] to-[#3a6081] rounded-t-xl shadow-lg flex justify-end p-3 border-t border-x border-white/20">
            <span className="text-[10px] font-black tracking-widest text-white/90">
              AMERICAN
            </span>
          </div>
        </div>

        {/* Front Pocket (The leather flap) */}
        <div className="relative flex-1 bg-gradient-to-b from-[#243527] to-[#1b291d] rounded-t-3xl shadow-[0_-8px_15px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center pt-4">
          {/* Subtle Inner Shadow for the "Pocket" edge */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-white/5 rounded-t-3xl"></div>

          {/* Main Balance (Debossed Effect) */}
          <h2 className="text-4xl font-light text-[#141d15] tracking-tight drop-shadow-[0_1px_1px_rgba(255,255,255,0.05)]">
            $250,000
          </h2>

          {/* Subtext */}
          <p className="text-[10px] font-bold tracking-[0.2em] text-[#141d15]/60 mt-2 uppercase">
            Total Balance
          </p>
        </div>
      </div>
    </div>
  );
}
