"use client";

import type React from "react";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  height?: string | number;
  width?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  variant = "text",
  height,
  width,
}) => {
  const variantClasses = {
    text: "rounded-md",
    circular: "rounded-full",
    rectangular: "rounded-xl",
  };

  const style: React.CSSProperties = {};
  if (width) style.width = width;
  if (height) style.height = height;

  return (
    <div
      className={`
                relative overflow-hidden
                bg-slate-200/60
                ${variantClasses[variant]} 
                ${className}
            `}
      style={style}
    >
      {/* Shimmer effect overlay */}
      <div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_1.5s_infinite]"
        style={{
          backgroundSize: "200% 100%",
        }}
      />
    </div>
  );
};
