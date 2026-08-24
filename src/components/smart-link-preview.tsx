"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Mail } from "lucide-react";
import { play } from "@/lib/sound";
import type { LinkPreviewData } from "@/app/api/link-preview/route";

export interface SmartLinkPreviewProps {
  url: string;
  children: React.ReactNode;
  className?: string;
  variant?: "card" | "compact";
  fallbackTitle?: string;
  fallbackCategory?: string;
  fallbackDescription?: string;
  fallbackImage?: string;
}

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

export function SmartLinkPreview({
  url,
  children,
  className,
  variant = "card",
  fallbackTitle,
  fallbackDescription,
  fallbackImage,
}: SmartLinkPreviewProps) {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null);
  const [data, setData] = useState<LinkPreviewData | null>(null);
  const [loading, setLoading] = useState(false);
  const [imgError, setImgError] = useState(false);

  const reduce = useReducedMotion();
  const enterTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const triggerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getDomain = (targetUrl: string) => {
    try {
      const parsed = new URL(targetUrl.startsWith("http") ? targetUrl : `https://${targetUrl}`);
      return parsed.hostname.replace(/^www\./, "");
    } catch {
      return targetUrl.replace(/^mailto:/, "");
    }
  };

  const getCleanUrlText = (targetUrl: string) => {
    if (targetUrl.startsWith("mailto:")) {
      return targetUrl.replace(/^mailto:/, "");
    }
    return targetUrl
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .replace(/\/$/, "");
  };

  const isEmail = url.startsWith("mailto:") || url.includes("hello@muditjha.me");
  const domain = data?.domain || getDomain(url);
  const cleanUrl = getCleanUrlText(url);
  const favicon = data?.favicon || `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

  // Fetch real metadata on hover (only for full card variant)
  const fetchMetadata = async () => {
    if (variant === "compact" || data || loading) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/link-preview?url=${encodeURIComponent(url)}`);
      if (res.ok) {
        const json: LinkPreviewData = await res.json();
        setData(json);
      }
    } catch {
      // Graceful fallback
    } finally {
      setLoading(false);
    }
  };

  const updatePosition = () => {
    if (triggerRef.current) {
      setTriggerRect(triggerRef.current.getBoundingClientRect());
    }
  };

  const handleMouseEnter = () => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    updatePosition();
    fetchMetadata();
    enterTimeoutRef.current = setTimeout(() => {
      updatePosition();
      setIsOpen(true);
      play("tick", { volume: 0.18 });
    }, 50);
  };

  const handleMouseLeave = () => {
    if (enterTimeoutRef.current) {
      clearTimeout(enterTimeoutRef.current);
      enterTimeoutRef.current = null;
    }
    if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    leaveTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      setTriggerRect(null);
    }, 180);
  };

  const handleCardEnter = () => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const handleCardLeave = () => {
    if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    leaveTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      setTriggerRect(null);
    }, 160);
  };

  useEffect(() => {
    const handleScrollOrResize = () => {
      if (isOpen) updatePosition();
    };
    window.addEventListener("scroll", handleScrollOrResize, { passive: true });
    window.addEventListener("resize", handleScrollOrResize, { passive: true });
    return () => {
      if (enterTimeoutRef.current) clearTimeout(enterTimeoutRef.current);
      if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
      window.removeEventListener("scroll", handleScrollOrResize);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isOpen]);

  const CARD_WIDTH = variant === "compact" ? 280 : 312;

  // The card MUST appear directly below the hovered item, almost touching the text
  const top = triggerRect ? triggerRect.bottom + 3 : 0;

  const left = triggerRect
    ? Math.max(
        12,
        Math.min(
          (typeof window !== "undefined" ? window.innerWidth : 1200) - CARD_WIDTH - 12,
          triggerRect.left + triggerRect.width / 2 - CARD_WIDTH / 2
        )
      )
    : 0;

  // Triangle pointer tail aligned directly with center of hovered trigger item
  const tailLeft = triggerRect
    ? Math.max(18, Math.min(CARD_WIDTH - 24, triggerRect.left + triggerRect.width / 2 - left))
    : CARD_WIDTH / 2;

  const activeTitle = data?.title || fallbackTitle || domain;
  const activeDesc = data?.description || fallbackDescription;
  const activeImage = !imgError ? (data?.image || fallbackImage) : undefined;

  const previewContent = (
    <AnimatePresence>
      {isOpen && triggerRect && (
        <div
          style={{ top: `${top}px`, left: `${left}px` }}
          className="fixed z-[999999] pointer-events-auto select-none"
          onMouseEnter={handleCardEnter}
          onMouseLeave={handleCardLeave}
        >
          {/* Invisible Hover Hit Bridge between trigger and card */}
          <div className="absolute left-0 right-0 -top-2 h-3 bg-transparent pointer-events-auto" />

          <motion.div
            initial={
              reduce
                ? { opacity: 0 }
                : {
                    opacity: 0,
                    scale: 0.96,
                    y: -4,
                  }
            }
            animate={
              reduce
                ? { opacity: 1 }
                : {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                  }
            }
            exit={
              reduce
                ? { opacity: 0 }
                : {
                    opacity: 0,
                    scale: 0.96,
                    y: -3,
                  }
            }
            transition={{
              duration: 0.15,
              ease: EASE_OUT,
            }}
            style={{
              transformOrigin: `${tailLeft}px 0px`,
              width: variant === "compact" ? undefined : `${CARD_WIDTH}px`,
            }}
            className={
              variant === "compact"
                ? "relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border-[1.5px] border-zinc-950 bg-[#fffdfa] shadow-[3px_3px_0px_#18181b] whitespace-nowrap will-change-transform"
                : "relative rounded-[18px] border-[1.5px] border-zinc-950 bg-[#fffdfa] p-3 shadow-[4px_4px_0px_#18181b] overflow-hidden will-change-transform flex flex-col gap-2.5"
            }
          >
            {variant === "compact" ? (
              <>
                {isEmail ? (
                  <Mail className="size-3.5 text-zinc-700 shrink-0" />
                ) : (
                  <div className="size-4 rounded-full border border-zinc-950/15 bg-white p-0.5 shadow-xs overflow-hidden shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={favicon}
                      alt=""
                      className="size-full object-contain rounded-full"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  </div>
                )}
                <span className="font-mono text-[12px] font-bold text-zinc-900 tracking-tight">
                  {cleanUrl}
                </span>
                {!isEmail && <ArrowUpRight className="size-3.5 text-zinc-400 shrink-0" />}

                {/* Compact Pointer Tail */}
                <div
                  style={{ left: `${tailLeft - 6}px` }}
                  className="absolute -top-[5px] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[5px] border-b-zinc-950 drop-shadow-[0_-1px_0_#18181b]"
                />
                <div
                  style={{ left: `${tailLeft - 5}px` }}
                  className="absolute -top-[4px] w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[4px] border-b-[#fffdfa]"
                />
              </>
            ) : (
              <>
                {/* 1. Destination's og:image (if present), full width, ~128px tall, object-cover */}
                {activeImage ? (
                  <div className="w-full h-[128px] rounded-[12px] border border-zinc-950/20 bg-zinc-100 overflow-hidden relative shadow-xs shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={activeImage}
                      alt={activeTitle}
                      onError={() => setImgError(true)}
                      className="size-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="w-full h-[72px] rounded-[12px] border border-zinc-950/10 bg-gradient-to-br from-[#f5f2e9] via-[#ebe6d6] to-[#d8e0ce]/50 flex items-center justify-between px-4 shrink-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="size-6 rounded-full border border-zinc-950/15 bg-white p-0.5 shadow-xs overflow-hidden shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={favicon}
                          alt=""
                          className="size-full object-contain rounded-full"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = "none";
                          }}
                        />
                      </div>
                      <span className="font-mono text-xs font-bold text-zinc-800 tracking-tight truncate">
                        {domain}
                      </span>
                    </div>
                    <ArrowUpRight className="size-4 text-zinc-500 shrink-0" />
                  </div>
                )}

                {/* 2. Favicon + Domain Name (small and muted) */}
                {activeImage && (
                  <div className="flex items-center gap-1.5 pt-0.5">
                    <div className="size-4 rounded-full border border-zinc-950/15 bg-white p-0.5 shadow-xs overflow-hidden shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={favicon}
                        alt=""
                        className="size-full object-contain rounded-full"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    </div>
                    <span className="font-mono text-[11px] font-medium text-zinc-500 truncate">
                      {domain}
                    </span>
                  </div>
                )}

                {/* 3. Page Title (bold, single line, line-clamp-1) */}
                <div className="flex flex-col gap-0.5">
                  <h4 className="font-sans font-bold text-[13.5px] text-zinc-950 leading-snug line-clamp-1 truncate">
                    {activeTitle}
                  </h4>

                  {/* 4. Page Description (smaller, muted, max 2 lines with line-clamp-2) */}
                  {activeDesc ? (
                    <p className="font-sans text-[12px] text-zinc-600 leading-relaxed line-clamp-2">
                      {activeDesc}
                    </p>
                  ) : (
                    <p className="font-sans text-[11.5px] text-zinc-400 italic">
                      Visit {domain} ↗
                    </p>
                  )}
                </div>

                {/* Top Pointer Tail pointing up snugly to hovered text */}
                <div
                  style={{ left: `${tailLeft - 6}px` }}
                  className="absolute -top-[5px] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[5px] border-b-zinc-950 drop-shadow-[0_-1px_0_#18181b]"
                />
                <div
                  style={{ left: `${tailLeft - 5}px` }}
                  className="absolute -top-[4px] w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[4px] border-b-[#fffdfa]"
                />
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <span
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={className || "inline-flex items-center"}
      >
        {children}
      </span>

      {mounted && typeof document !== "undefined" && createPortal(previewContent, document.body)}
    </>
  );
}

export default SmartLinkPreview;
