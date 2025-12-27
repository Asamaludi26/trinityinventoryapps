"use client";

import type React from "react";
import { TrinityLogoIcon } from "../icons/TrinityLogoIcon";

interface FullPageLoaderProps {
  message?: string;
}

export const FullPageLoader: React.FC<FullPageLoaderProps> = ({
  message = "Memuat Data...",
}) => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/90 backdrop-blur-md transition-opacity duration-300">
      <div className="relative flex flex-col items-center">
        {/* Logo with refined animation */}
        <div className="relative mb-8">
          {/* Outer ring pulse */}
          <div className="absolute inset-[-12px] rounded-full border-2 border-tm-primary/20 animate-ping" />

          {/* Inner container */}
          <div className="relative bg-white p-5 rounded-2xl shadow-xl border border-slate-100">
            <TrinityLogoIcon className="w-14 h-14 text-tm-primary" />
          </div>
        </div>

        {/* Brand text */}
        <div className="flex flex-col items-center gap-3">
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Trinity<span className="font-normal text-slate-500">Asset</span>
          </h1>

          {/* Loading indicator */}
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-tm-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-2 h-2 bg-tm-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-2 h-2 bg-tm-primary rounded-full animate-bounce" />
            </div>
          </div>

          <p className="text-sm font-medium text-slate-500">{message}</p>
        </div>
      </div>

      {/* Top progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate-100 overflow-hidden">
        <div className="h-full w-1/3 bg-gradient-to-r from-tm-primary via-tm-accent to-tm-primary rounded-full animate-[loading-bar_1.5s_ease-in-out_infinite]" />
      </div>

      <style>{`
                @keyframes loading-bar {
                    0% { transform: translateX(-100%); }
                    50% { transform: translateX(150%); }
                    100% { transform: translateX(400%); }
                }
            `}</style>
    </div>
  );
};
