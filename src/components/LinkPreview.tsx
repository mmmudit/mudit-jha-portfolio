"use client";

import React, { useState, useCallback, ReactNode } from "react";
import * as HoverCard from "@radix-ui/react-hover-card";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { play } from "@/lib/sound";
import type { LinkPreviewData } from "@/app/api/link-preview/route";

export interface LinkPreviewProps {
  href: string;
  children: ReactNode;
  className?: string;
  fallbackTitle?: string;
  fallbackDescription?: string;
  fallbackImage?: string;
}

// Global in-memory client cache across component instances
const clientPreviewCache = new Map<string, LinkPreviewData>();

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

export function LinkPreview({
  href,
  children,
  className,
  fallbackTitle,
  fallbackDescription,
  fallbackImage,
}: LinkPreviewProps) {
  const [data, setData] = useState<LinkPreviewData | null>(() => clientPreviewCache.get(href) || null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const reduce = useReducedMotion();

  // Extract domain for fallback
  const getDomain = (url: string) => {
    try {
      const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
      return parsed.hostname.replace(/^www\./, "");
    } catch {
      return url.replace(/^mailto:/, "");
    }
  };

  const domain = data?.domain || getDomain(href);
  const favicon = data?.favicon || `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

  const fetchPreview = useCallback(async () => {
    if (data || clientPreviewCache.has(href) || loading) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/link-preview?url=${encodeURIComponent(href)}`);
      if (res.ok) {
        const json: LinkPreviewData = await res.json();
        setData(json);
        clientPreviewCache.set(href, json);
      }
    } catch {
      // Graceful fallback
      const fallbackObj: LinkPreviewData = {
        title: fallbackTitle || domain,
        description: fallbackDescription,
        image: fallbackImage,
        domain,
        favicon,
      };
      setData(fallbackObj);
      clientPreviewCache.set(href, fallbackObj);
    } finally {
      setLoading(false);
    }
  }, [href, data, loading, domain, favicon, fallbackTitle, fallbackDescription, fallbackImage]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      play("tick", { volume: 0.18 });
      fetchPreview();
    }
  };

  const isExternal = !href.startsWith("/") && !href.startsWith("#");
  const isMailto = href.startsWith("mailto:");

  const activeTitle = data?.title || fallbackTitle || domain;
  const activeDescription = data?.description || fallbackDescription;
  const activeImage = !imgError ? (data?.image || fallbackImage) : undefined;

  return (
    <HoverCard.Root openDelay={200} closeDelay={150} onOpenChange={handleOpenChange}>
      <HoverCard.Trigger asChild>
        <a
          href={href}
          target={isExternal && !isMailto ? "_blank" : undefined}
          rel={isExternal && !isMailto ? "noopener noreferrer" : undefined}
          className={className}
        >
          {children}
        </a>
      </HoverCard.Trigger>

      <HoverCard.Portal>
        <HoverCard.Content
          side="bottom"
          sideOffset={6}
          align="center"
          avoidCollisions
          asChild
        >
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={
                  reduce
                    ? { opacity: 0 }
                    : {
                        opacity: 0,
                        scale: 0.97,
                        y: 0,
                      }
                }
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: 0,
                }}
                exit={
                  reduce
                    ? { opacity: 0 }
                    : {
                        opacity: 0,
                        scale: 0.99,
                        y: 0,
                      }
                }
                transition={{
                  duration: reduce ? 0.1 : 0.16,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{
                  transformOrigin: "var(--radix-hover-card-content-transform-origin)",
                }}
                className="z-[999999] w-[312px] rounded-[18px] border-[1.5px] border-zinc-950 bg-[#fffdfa] p-3 shadow-[4px_4px_0px_#18181b] overflow-hidden select-none will-change-transform flex flex-col gap-2.5"
              >
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
                    <div className="flex items-center gap-2">
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
                      <span className="font-mono text-xs font-bold text-zinc-800 tracking-tight">
                        {domain}
                      </span>
                    </div>
                    <ArrowUpRight className="size-4 text-zinc-500" />
                  </div>
                )}

                {/* 2. Metadata: Favicon + Domain Name (small and muted) */}
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
                  {activeDescription ? (
                    <p className="font-sans text-[12px] text-zinc-600 leading-relaxed line-clamp-2">
                      {activeDescription}
                    </p>
                  ) : (
                    <p className="font-sans text-[11.5px] text-zinc-400 italic">
                      Visit {domain} ↗
                    </p>
                  )}
                </div>

                {/* Radix HoverCard Arrow styled with design system border and fill */}
                <HoverCard.Arrow className="fill-[#fffdfa] stroke-zinc-950 stroke-[1.5px]" width={12} height={6} />
              </motion.div>
            )}
          </AnimatePresence>
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}

export default LinkPreview;
