"use client";

import { useState } from "react";
import { Mic, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function VoiceSearch() {
  const [isListening, setIsListening] = useState(false);

  return (
    <div className="relative flex items-center justify-center p-8 md:p-12 bg-[#eef2f6] rounded-xl overflow-hidden min-h-[200px]">
      <div
        className={cn(
          "relative flex items-center w-full max-w-[280px] h-14 pl-2 pr-6 rounded-full transition-all duration-500 bg-[#eef2f6]",
          "shadow-[8px_8px_16px_#c8ccd4,-8px_-8px_16px_#ffffff]",
        )}
      >
        {/* Mic Button */}
        <button
          onClick={() => setIsListening(!isListening)}
          className={cn(
            "relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300",
            isListening
              ? "text-red-500"
              : "text-slate-400 hover:text-red-400",
          )}
        >
          {/* Inner shadow for button when active */}
          {isListening && (
            <div className="absolute inset-0 rounded-full shadow-[inset_2px_2px_4px_#c8ccd4,inset_-2px_-2px_4px_#ffffff]" />
          )}

          <Mic
            className={cn(
              "w-5 h-5 transition-transform relative z-10",
              isListening && "scale-110",
            )}
          />
        </button>

        <span className="flex-1 ml-3 font-medium text-slate-600">
          {isListening ? (
            <span className="animate-pulse">Listening...</span>
          ) : (
            "Voice"
          )}
        </span>

        <Search className="w-5 h-5 text-slate-400" />

        {/* Mic Glow */}
        <div
          className={cn(
            "absolute bottom-[-6px] left-6 w-8 h-8 bg-red-500/40 blur-lg rounded-full transition-all duration-500 pointer-events-none",
            isListening ? "opacity-100 scale-150" : "opacity-0 scale-50",
          )}
        />
        {/* Bottom Bar Glow */}
        <div
          className={cn(
            "absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-red-400/20 blur-md rounded-full transition-all duration-500",
            isListening ? "opacity-100" : "opacity-0",
          )}
        />
      </div>
    </div>
  );
}
