"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function ActomeSearch() {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative flex items-center justify-center p-8 md:p-12 bg-[#e0e5ec] rounded-xl overflow-hidden min-h-[200px]">
      {/* Light source simulation */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />

      <div
        className={cn(
          "relative flex items-center w-full max-w-[280px] h-14 px-6 rounded-full transition-all duration-500 ease-out",
          "bg-[#e0e5ec]",
          isFocused
            ? "shadow-[inset_2px_2px_5px_#b8b9be,inset_-3px_-3px_7px_#ffffff]"
            : "shadow-[6px_6px_12px_#b8b9be,-6px_-6px_12px_#ffffff]",
        )}
      >
        <input
          type="text"
          placeholder="Actome"
          className="w-full h-full bg-transparent border-none outline-none text-slate-600 placeholder-slate-500 font-medium text-base"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <Search className="w-5 h-5 text-slate-500 ml-2" />

        {/* Glow effect under the input */}
        <div
          className={cn(
            "absolute -bottom-[20px] left-1/2 -translate-x-1/2 w-3/4 h-8 bg-orange-400/30 blur-xl rounded-full transition-all duration-500 pointer-events-none",
            isFocused ? "opacity-100 scale-110" : "opacity-0 scale-75",
          )}
        />
      </div>
    </div>
  );
}
