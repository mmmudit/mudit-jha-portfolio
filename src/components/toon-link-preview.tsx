"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Copy, Check } from "lucide-react";
import { play } from "@/lib/sound";

export interface LinkPreviewData {
  title: string;
  url: string;
  category?: string;
  description?: string;
  image?: string;
  icon?: React.ReactNode;
}

interface ToonLinkPreviewProps {
  preview: LinkPreviewData;
  children: React.ReactNode;
  className?: string;
}

export function ToonLinkPreview({ preview, children, className }: ToonLinkPreviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const triggerRef = useRef<HTMLSpanElement>(null);

  const updatePosition = () => {
    if (triggerRef.current) {
      setTriggerRect(triggerRef.current.getBoundingClientRect());
    }
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    updatePosition();
    setIsOpen(true);
    play("tick", { volume: 0.2 });
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      setTriggerRect(null);
    }, 160);
  };

  const handleCardEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const handleCardLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      setTriggerRect(null);
    }, 150);
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    navigator.clipboard?.writeText(preview.url);
    play("success", { volume: 0.5 });
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (isOpen) updatePosition();
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [isOpen]);

  const CARD_HEIGHT = 86;
  const CARD_WIDTH = 290;

  // Render below by default, only flip above if viewport bottom boundary is reached
  const isAbove =
    typeof window !== "undefined" && triggerRect
      ? triggerRect.bottom + CARD_HEIGHT + 24 > window.innerHeight && triggerRect.top > CARD_HEIGHT + 24
      : false;

  const top = triggerRect
    ? isAbove
      ? triggerRect.top - CARD_HEIGHT - 10
      : triggerRect.bottom + 8
    : 0;

  const left = triggerRect
    ? Math.max(
        12,
        Math.min(
          (typeof window !== "undefined" ? window.innerWidth : 1200) - CARD_WIDTH - 12,
          triggerRect.left + triggerRect.width / 2 - CARD_WIDTH / 2
        )
      )
    : 0;

  // Calculate pointer tail location directly aligned with trigger center
  const tailLeft = triggerRect
    ? Math.max(16, Math.min(CARD_WIDTH - 24, triggerRect.left + triggerRect.width / 2 - left))
    : CARD_WIDTH / 2;

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={className || "inline-block"}
      >
        {children}
      </span>

      <AnimatePresence>
        {isOpen && triggerRect && (
          <div
            style={{ top: `${top}px`, left: `${left}px` }}
            className="fixed z-[99999] pointer-events-auto select-none"
            onMouseEnter={handleCardEnter}
            onMouseLeave={handleCardLeave}
          >
            {/* Invisible Hover Hit Bridge between trigger and card */}
            <div
              className={`absolute left-0 right-0 ${
                isAbove ? "-bottom-3 h-4" : "-top-3 h-4"
              } bg-transparent pointer-events-auto`}
            />

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.96,
                y: isAbove ? 6 : -6,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.97,
                y: isAbove ? 4 : -4,
              }}
              transition={{
                duration: 0.18,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{
                transformOrigin: isAbove
                  ? `${tailLeft}px bottom`
                  : `${tailLeft}px top`,
              }}
              className="relative flex items-center gap-3 p-2.5 rounded-[18px] bg-[#fffdfa] border-[2px] border-zinc-950 shadow-[4px_4px_0px_#18181b] w-[290px]"
            >
              {/* Left: Thumbnail Image or Branded Icon Badge */}
              {preview.image ? (
                <div className="relative size-12 rounded-xl border-[1.5px] border-zinc-950 bg-zinc-100 overflow-hidden shrink-0 shadow-[1px_1px_0px_#000]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={preview.image} alt={preview.title} className="size-full object-cover" />
                </div>
              ) : preview.icon ? (
                <div className="relative size-12 rounded-xl border-[1.5px] border-zinc-950 bg-zinc-950 text-white overflow-hidden shrink-0 shadow-[1px_1px_0px_#000] flex items-center justify-center p-2.5">
                  {preview.icon}
                </div>
              ) : (
                <div className="relative size-12 rounded-xl border-[1.5px] border-zinc-950 bg-[#c8d5bb] overflow-hidden shrink-0 shadow-[1px_1px_0px_#000] flex items-center justify-center">
                  <div className="size-4 rounded-full bg-zinc-950 relative">
                    <div className="size-1 rounded-full bg-white absolute top-0.5 right-0.5" />
                  </div>
                </div>
              )}

              {/* Center: Details */}
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                {preview.category && (
                  <span className="font-mono text-[9px] font-black uppercase tracking-wider text-[#8a7c64] truncate">
                    {preview.category}
                  </span>
                )}
                <h4 className="font-hand text-[16px] font-bold text-zinc-950 truncate leading-tight">
                  {preview.title}
                </h4>
                <span className="font-mono text-[10px] text-zinc-400 font-bold truncate">
                  {preview.url.replace(/^https?:\/\//, "")}
                </span>
              </div>

              {/* Right: Action Buttons */}
              <div className="flex flex-col items-end gap-1 shrink-0">
                <a
                  href={preview.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => play("bloom", { volume: 0.45 })}
                  className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-[5px] bg-[#ff4500] hover:bg-[#e03d00] active:scale-95 text-white font-mono text-[9px] font-black tracking-wider uppercase border border-zinc-950 shadow-[1px_1px_0px_#000] transition-colors"
                >
                  <span>OPEN ↗</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-1.5 py-0.5 rounded border border-zinc-950 bg-white hover:bg-zinc-100 active:scale-95 text-[9px] font-mono font-bold text-zinc-700 shadow-xs transition-colors"
                >
                  {copied ? "COPIED" : "COPY"}
                </button>
              </div>

              {/* Centered Pointer Tail */}
              {!isAbove ? (
                <>
                  <div
                    style={{ left: `${tailLeft - 7}px` }}
                    className="absolute -top-[8px] w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-b-[8px] border-b-zinc-950 drop-shadow-[0_-1px_0_#18181b]"
                  />
                  <div
                    style={{ left: `${tailLeft - 5.5}px` }}
                    className="absolute -top-[6px] w-0 h-0 border-l-[5.5px] border-l-transparent border-r-[5.5px] border-r-transparent border-b-[6.5px] border-b-[#fffdfa]"
                  />
                </>
              ) : (
                <>
                  <div
                    style={{ left: `${tailLeft - 7}px` }}
                    className="absolute -bottom-[8px] w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[8px] border-t-zinc-950 drop-shadow-[0_1px_0_#18181b]"
                  />
                  <div
                    style={{ left: `${tailLeft - 5.5}px` }}
                    className="absolute -bottom-[6px] w-0 h-0 border-l-[5.5px] border-l-transparent border-r-[5.5px] border-r-transparent border-t-[6.5px] border-t-[#fffdfa]"
                  />
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
