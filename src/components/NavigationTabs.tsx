"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { useRouter } from "next/navigation";

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

const TRANSITION_CLASS = "transition-[transform,width,opacity] duration-300 ease-out";

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
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const tabRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const pendingHref = useRef<string | null>(null);

  const [activeId, setActiveId] = useState<string | undefined>(initialActiveId ?? tabs[0]?.id);
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

  // Click handling that waits for transition
  const onTabClick = (e: React.MouseEvent, tab: Tab) => {
    // modifiers bypass
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    e.preventDefault();
    // set pending destination
    pendingHref.current = tab.href;
    setActiveId(tab.id);
    // measure immediately so slide starts
    measureActive();
  };

  const onTransitionEnd = (e: React.TransitionEvent) => {
    if (e.propertyName !== "transform") return;
    if (!pendingHref.current) return;
    const href = pendingHref.current;
    pendingHref.current = null;
    router.push(href, { scroll: false });
  };

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
    <div ref={containerRef} className="relative inline-flex items-center">
      {/* Static fallback pill to avoid flash */}
      {!indicatorReady && (
        <div
          aria-hidden
          className="absolute rounded-full bg-white/6 backdrop-blur-sm border border-white/10 shadow-md"
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
          onTransitionEnd={onTransitionEnd}
          className={clsx("absolute rounded-full bg-white/6 backdrop-blur-sm border border-white/10 shadow-md", TRANSITION_CLASS)}
          style={{
            width: indicator.width,
            height: indicator.height,
            transform: `translate3d(${indicator.left}px, ${indicator.top}px, 0)`,
            opacity: indicator.opacity,
            pointerEvents: "none",
          }}
        />
      )}

      <div className="flex items-center gap-1 relative z-10">
        {tabs.map((tab) => {
          const isActive = tab.id === activeId;
          return (
            <Link
              key={tab.id}
              href={tab.href}
              ref={(el: HTMLAnchorElement | null) => (tabRefs.current[tab.id] = el)}
              onClick={(e) => onTabClick(e as any, tab)}
              onMouseEnter={() => prefetch(tab.href)}
              onFocus={() => prefetch(tab.href)}
              onTouchStart={() => prefetch(tab.href)}
              className={clsx(
                "relative rounded-full px-[15px] py-[6px] text-[18px] font-light tracking-[-1px] transition-colors",
                isActive
                  ? "text-button-primary"
                  : "text-button-secondary hover:text-button-primary"
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
