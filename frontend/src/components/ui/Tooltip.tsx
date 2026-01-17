import React from "react";

interface TooltipProps {
  text: string;
  children: React.ReactElement;
  position?: "top" | "bottom" | "left" | "right";
}

export const Tooltip: React.FC<TooltipProps> = ({
  text,
  children,
  position = "top",
}) => {
  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  const arrowClasses = {
    top: "top-full left-1/2 -translate-x-1/2 border-x-transparent border-t-gray-900",
    bottom:
      "bottom-full left-1/2 -translate-x-1/2 border-x-transparent border-b-gray-900",
    left: "left-full top-1/2 -translate-y-1/2 border-y-transparent border-l-gray-900",
    right:
      "right-full top-1/2 -translate-y-1/2 border-y-transparent border-r-gray-900",
  };

  const originClasses = {
    top: "origin-bottom",
    bottom: "origin-top",
    left: "origin-right",
    right: "origin-left",
  };

  return (
    <div className="relative flex items-center group">
      {children}
      <div
        className={`absolute z-50 w-max max-w-[240px] px-3 py-2 text-xs font-semibold text-center text-white bg-gray-900 rounded-lg shadow-lg
                    opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none transform group-hover:scale-100 scale-95
                    ${positionClasses[position]} ${originClasses[position]}`}
        role="tooltip"
      >
        {text}
        <div
          className={`absolute w-0 h-0 border-4 ${arrowClasses[position]}`}
        />
      </div>
    </div>
  );
};
