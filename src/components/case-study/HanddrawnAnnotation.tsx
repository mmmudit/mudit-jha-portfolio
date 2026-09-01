import React from "react";
import { AnnotationItem } from "@/types/project";

interface HanddrawnAnnotationProps {
  annotation: AnnotationItem;
  className?: string;
}

export function HanddrawnAnnotation({ annotation, className = "" }: HanddrawnAnnotationProps) {
  const positionClasses = {
    "top-left": "top-3 left-3",
    "top-right": "top-3 right-3",
    "bottom-left": "bottom-3 left-3",
    "bottom-right": "bottom-3 right-3",
    center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
  }[annotation.position || "top-right"];

  return (
    <div
      className={`absolute ${positionClasses} pointer-events-none z-20 flex items-center gap-1.5 select-none ${className}`}
    >
      <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#fbfaf5]/90 border border-black/10 shadow-[0_2px_8px_rgba(0,0,0,0.06)] backdrop-blur-sm">
        <span className="font-hand text-[15px] sm:text-[17px] text-[#47585c] leading-none pt-0.5 whitespace-nowrap">
          {annotation.text}
        </span>
        <span className="text-[#c8d5bb] font-sans text-xs">✦</span>
      </div>
    </div>
  );
}
