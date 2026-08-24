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
  const [copied, setCopied] = useState(false);
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
    if (variant === "compact" || isEmail || data || loading) return;
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

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    navigator.clipboard?.writeText("hello@muditjha.me");
    play("success", { volume: 0.6 });
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
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

  const CARD_WIDTH = variant === "compact" ? 280 : isEmail ? 360 : 312;

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
                : isEmail
                ? "relative rounded-[18px] border-[1.5px] border-zinc-950 bg-[#fffdfb] shadow-[5px_5px_0px_#18181b] overflow-hidden will-change-transform group"
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
            ) : isEmail ? (
              /* ── Figma Postcard Email Preview (Node 248:2982) ── */
              <div
                onClick={handleCopyEmail}
                className="relative bg-[#fffdfb] p-5 flex flex-col justify-between overflow-hidden cursor-pointer select-none min-h-[175px]"
                title="Click to copy email address"
              >
                {/* Envelope Flap Fold Triangular Watermark */}
                <svg
                  viewBox="0 0 360 110"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute top-0 inset-x-0 w-full h-[110px] pointer-events-none"
                >
                  <path
                    d="M0 0 L180 90 L360 0"
                    fill="rgba(242, 237, 226, 0.45)"
                    stroke="rgba(0, 0, 0, 0.07)"
                    strokeWidth="1.2"
                  />
                </svg>

                {/* Top Row: FROM Details (Left) and Tilted Eyes Sticker (Right) */}
                <div className="flex items-start justify-between relative z-10">
                  <div className="flex flex-col text-black">
                    <span className="font-mono text-[12px] text-zinc-500 font-normal tracking-wider">
                      FROM
                    </span>
                    <span className="font-mono text-[14px] font-bold text-zinc-950 tracking-[1.28px] leading-tight mt-0.5">
                      MUDIT JHA
                    </span>
                    <span className="font-mono text-[14px] font-bold text-zinc-950 tracking-[1.28px] leading-tight">
                      MINNEAPOLIS
                    </span>
                  </div>

                  {/* Figma "Full eye" rotated -15.24deg */}
                  <div className="w-[84px] h-[67px] shrink-0 -rotate-[15.24deg] transition-transform duration-200 group-hover:scale-105 select-none pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.06)]">
                    <svg
                      viewBox="0 0 142 109"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-full overflow-visible"
                    >
                      {/* Left eye white */}
                      <path
                        d="M38.5 4.5C60.0604 4.5 75.5 25.753 75.5 54V54.0977L75.4961 54.1953C74.7279 71.8637 70.9875 84.473 64.4453 92.7314C57.7193 101.222 48.5333 104.5 38.5 104.5C28.5727 104.5 19.6077 101.531 13.3789 92.958C7.40216 84.7319 4.5 72.0556 4.5 54C4.5 38.2889 7.45771 25.9972 13.3154 17.5068C19.3348 8.78247 28.1328 4.5 38.5 4.5Z"
                        fill="white"
                        stroke="black"
                        strokeWidth="9"
                      />
                      {/* Right eye white */}
                      <path
                        d="M100.5 4.5C122.06 4.5 137.5 25.753 137.5 54V54.0977L137.496 54.1953C136.728 71.8637 132.988 84.473 126.445 92.7314C119.719 101.222 110.533 104.5 100.5 104.5C90.5727 104.5 81.6077 101.531 75.3789 92.958C69.4022 84.7319 66.5 72.0556 66.5 54C66.5 38.2889 69.4577 25.9972 75.3154 17.5068C81.3348 8.78247 90.1328 4.5 100.5 4.5Z"
                        fill="white"
                        stroke="black"
                        strokeWidth="9"
                      />
                      {/* Pupils */}
                      <g transform="translate(22.8, 28.5)">
                        <path
                          d="M16.6533 0C25.0592 5.30063e-05 32.1437 7.05477 34.3145 18.2881L22.0264 24.4004L34.4082 32.3223C32.3222 46.9264 25.5563 52 16.6533 52C6.52068 52 0 45.9996 0 25.7139C0.000104278 8.28558 6.52076 0 16.6533 0Z"
                          fill="black"
                        />
                        <path
                          d="M78.6533 0C87.0592 5.30063e-05 94.1437 7.05477 96.3145 18.2881L84.0264 24.4004L96.4082 32.3223C94.3222 46.9264 87.5563 52 78.6533 52C68.5207 52 62 45.9996 62 25.7139C62.0001 8.28558 68.5208 0 78.6533 0Z"
                          fill="black"
                        />
                      </g>
                    </svg>
                  </div>
                </div>

                {/* Bottom Row: TO & Email Address */}
                <div className="flex flex-col text-black relative z-10 pt-5">
                  <span className="font-mono text-[12px] text-zinc-500 font-normal tracking-wider">
                    TO
                  </span>
                  <div className="flex items-center justify-between gap-2 mt-0.5">
                    <span className="font-mono text-[18px] sm:text-[20px] font-bold text-zinc-950 tracking-[1.5px] leading-none">
                      hello@muditjha.me
                    </span>
                    {copied ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-[10px] font-mono font-bold">
                        COPIED!
                      </span>
                    ) : (
                      <span className="font-mono text-[10px] text-zinc-400 font-medium tracking-tight group-hover:text-zinc-700">
                        CLICK TO COPY
                      </span>
                    )}
                  </div>
                </div>

                {/* Top Pointer Tail */}
                <div
                  style={{ left: `${tailLeft - 6}px` }}
                  className="absolute -top-[5px] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[5px] border-b-zinc-950 drop-shadow-[0_-1px_0_#18181b]"
                />
                <div
                  style={{ left: `${tailLeft - 5}px` }}
                  className="absolute -top-[4px] w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[4px] border-b-[#fffdfb]"
                />
              </div>
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
