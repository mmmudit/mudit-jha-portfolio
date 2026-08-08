"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";

type Tab = {
  id: string;
  label: string;
  href: string;
};

type IndicatorRect = {
  left: number;
  top: number;
  width: number;
  height: number;
  opacity: number;
};

const TRANSITION_CLASS = "transition-[transform,width,opacity]";

// Color pulled from Figma node 80:901
const NAV_COLOR = "#c8d5bb";
// Willow grey (used for pill background)
const WILLOW_HEX = "#C8D5BB";

const hexToRgba = (hex: string, alpha = 1) => {
  const cleaned = hex.replace("#", "");
  const bigint = parseInt(cleaned, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function NavigationTabs({
  tabs = [
    { id: "work", label: "work", href: "/" },
    { id: "play", label: "play", href: "/play" },
    { id: "about", label: "about", href: "/about" },
  ],
  initialActiveId,
}: {
  tabs?: Tab[];
  initialActiveId?: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const pathname = usePathname();

  const [activeId, setActiveId] = useState<string | undefined>(
    initialActiveId ?? tabs[0]?.id,
  );
  const [indicator, setIndicator] = useState<IndicatorRect | null>(null);
  const [indicatorReady, setIndicatorReady] = useState(false);

  // Measure helper
  const measureActive = () => {
    const container = containerRef.current;
    const activeEl = activeId ? tabRefs.current[activeId] : null;
    if (!container || !activeEl) return null;

    const cRect = container.getBoundingClientRect();
    const aRect = activeEl.getBoundingClientRect();

    const rect = {
      left: aRect.left - cRect.left,
      top: aRect.top - cRect.top,
      width: aRect.width,
      height: aRect.height,
      opacity: 1,
    } as IndicatorRect;

    setIndicator(rect);
    // Mark ready on next frame to avoid first-frame flash
    requestAnimationFrame(() => setIndicatorReady(true));
    return rect;
  };

  useEffect(() => {
    measureActive();
    const ro = new ResizeObserver(() => measureActive());
    if (containerRef.current) ro.observe(containerRef.current);
    tabs.forEach((t) => {
      const el = tabRefs.current[t.id];
      if (el) ro.observe(el);
    });
    const onResize = () => measureActive();
    window.addEventListener("orientationchange", onResize);
    return () => {
      ro.disconnect();
      window.removeEventListener("orientationchange", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  // Update activeId when route changes so the pill follows the current URL
  useEffect(() => {
    if (!pathname) return;
    const match = tabs.find(
      (t) =>
        t.href === pathname || (t.href !== "/" && pathname.startsWith(t.href)),
    );
    if (match) setActiveId(match.id);
    else setActiveId(tabs[0]?.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Prefetch on hover/focus/touchstart
  const prefetch = (href: string) => {
    try {
      // next/navigation router doesn't expose prefetch here; use link prefetch via document
      if (typeof window !== "undefined" && (window as any).__next_s) {
        // no-op; Next handles Link prefetch automatically; still keep function
      }
    } catch {
      // ignore
    }
  };

  return (
    <div ref={containerRef} className="relative inline-flex items-center z-30">
      {/* Static fallback pill to avoid flash */}
      {!indicatorReady && (
        <div
          aria-hidden
          className="absolute rounded-full bg-white/6 backdrop-blur-md border border-white/10 shadow-md"
          style={{
            left: 0,
            top: 0,
            width: 8,
            height: 8,
            transform: "translate3d(0,0,0)",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Animated floating pill */}
      {indicator && (
        <div
          aria-hidden
          className={clsx(
            "absolute rounded-full backdrop-blur-sm shadow-md nav-pill-transition",
            TRANSITION_CLASS,
          )}
          style={{
            width: indicator.width,
            height: indicator.height,
            transform: `translate3d(${indicator.left}px, ${indicator.top}px, 0)`,
            opacity: indicator.opacity,
            backgroundColor: WILLOW_HEX,
            border: `1px solid ${hexToRgba(WILLOW_HEX, 0.9)}`,
            pointerEvents: "none",
          }}
        />
      )}

      <div className="flex items-center gap-1 relative z-10">
        {tabs.map((tab) => {
          const isActive = tab.id === activeId;
          return (
            <Link key={tab.id} href={tab.href} legacyBehavior>
              <a
                ref={(el: HTMLAnchorElement | null) => {
                  tabRefs.current[tab.id] = el;
                }}
                onMouseEnter={() => prefetch(tab.href)}
                onFocus={() => prefetch(tab.href)}
                onTouchStart={() => prefetch(tab.href)}
                className={clsx(
                  "relative rounded-full px-[15px] py-[6px] text-[18px] font-light tracking-[-1px] pressable",
                  isActive
                    ? "text-zinc-900"
                    : "text-zinc-500 hover:text-zinc-900",
                )}
              >
                {tab.label}
              </a>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
