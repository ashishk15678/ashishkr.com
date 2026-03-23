"use client";

import { useState } from "react";
import { Lock, Unlock } from "lucide-react";
import { cn } from "@/lib/utils";

export function SecuritySlider() {
  const [value, setValue] = useState(4); // 0 to 6
  const [isLocked, setIsLocked] = useState(true);

  return (
    <div className="relative flex items-center justify-center p-8 md:p-12 bg-[#8e939b] rounded-xl overflow-hidden min-h-[200px]">
      {/* Darker theme background overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

      <div className="relative flex items-center justify-between w-full max-w-[280px] h-14 p-1.5 rounded-full bg-[#8e939b] shadow-[5px_5px_10px_#70747a,-5px_-5px_10px_#acb2be]">
        {/* Track */}
        <div className="flex-1 h-full rounded-full bg-[#7a7f87] shadow-[inset_2px_2px_5px_#5f6369,inset_-2px_-2px_5px_#959ba5] relative overflow-hidden flex items-center justify-between px-5">
          {/* Dots */}
          <div className="flex gap-2.5 z-10 w-full justify-between">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <button
                key={i}
                onClick={() => setValue(i)}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all duration-300",
                  i <= value
                    ? "bg-orange-300 shadow-[0_0_8px_rgba(253,186,116,0.9)] scale-110"
                    : "bg-slate-600",
                )}
              />
            ))}
          </div>
        </div>

        {/* Knob */}
        <button
          onClick={() => setIsLocked(!isLocked)}
          className="w-11 h-11 ml-3 rounded-full bg-[#8e939b] shadow-[3px_3px_6px_#70747a,-3px_-3px_6px_#acb2be] flex items-center justify-center text-slate-700 active:scale-95 transition-transform hover:text-slate-900"
        >
          {isLocked ? (
            <Lock className="w-4 h-4" />
          ) : (
            <Unlock className="w-4 h-4" />
          )}
        </button>

        {/* Ambient Glow */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-full h-12 bg-orange-500/20 blur-2xl rounded-full pointer-events-none" />
      </div>
    </div>
  );
}
