"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function SimpleGlowInput() {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative flex items-center justify-center p-8 md:p-12 bg-[#d1d5db] rounded-xl overflow-hidden min-h-[200px]">
      <div
        className={cn(
          "relative flex items-center w-full max-w-[280px] h-14 px-6 rounded-full transition-all duration-500",
          "bg-[#d1d5db]",
          // Outer shadow
          "shadow-[6px_6px_12px_#aeb2b8,-6px_-6px_12px_#f4f6f8]",
        )}
      >
        {/* Inner inset shadow container - reveals on focus */}
        <div
          className={cn(
            "absolute inset-0 rounded-full transition-opacity duration-300 pointer-events-none",
            "shadow-[inset_3px_3px_6px_#aeb2b8,inset_-3px_-3px_6px_#f4f6f8]",
            isFocused ? "opacity-100" : "opacity-0",
          )}
        />

        <input
          type="text"
          placeholder="Input"
          className="relative z-10 w-full h-full bg-transparent border-none outline-none text-slate-600 placeholder-slate-500 font-medium text-base"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <Search className="relative z-10 w-5 h-5 text-slate-500 ml-2" />

        {/* Orange Glow - Bottom center */}
        <div
          className={cn(
            "absolute bottom-0 left-1/2 -translate-x-1/2 bg-orange-400 rounded-full blur-md transition-all duration-500",
            isFocused ? "opacity-80 w-16 h-1.5" : "opacity-0 w-0 h-0",
          )}
        />
      </div>
    </div>
  );
}
