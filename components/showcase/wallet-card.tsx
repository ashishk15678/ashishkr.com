"use client";

import { motion } from "framer-motion";
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
  return (
    <div className={cn(" flex items-center justify-center", className)}>
      <div
        className="relative w-60 h-40 rounded-2xl
                  bg-radial-[at_50%] from-[#3a4d3f] to-[#243027]
                  shadow-[inset_0_1px_2px_rgba(255,255,255,0.1),0_10px_20px_rgba(0,0,0,0.5)]
                  overflow-hidden p-2"
      >
        <div className="border border-dashed border-white/30 bg-[length:40px_2px] h-full rounded-lg">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent"></div>

          <div className="relative flex flex-col items-center justify-center h-full pt-8">
            <span className="text-2xl font-bold text-[#1a241d] opacity-40">
              $250,000
            </span>
            <span className="text-[10px] uppercase tracking-widest text-[#1a241d] opacity-30 mt-1">
              Total Balance
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
