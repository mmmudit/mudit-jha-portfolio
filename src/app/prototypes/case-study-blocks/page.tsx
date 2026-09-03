"use client";

import React, { Suspense, useState, useEffect, useRef, useLayoutEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FieldReference } from "./variants/FieldReference";
import { DesignIntent } from "./variants/DesignIntent";
import { InteractiveCanvas } from "./variants/InteractiveCanvas";

const VARIANTS = [
  { name: "Field Reference", component: FieldReference },
  { name: "Design Intent", component: DesignIntent },
  { name: "Interactive Canvas", component: InteractiveCanvas },
];

function PrototypeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read ?v=1..3 fallback to 0
  const initialIndex = Math.max(
    0,
    Math.min(VARIANTS.length - 1, (parseInt(searchParams.get("v") || "1", 10) || 1) - 1)
  );

  const [current, setCurrent] = useState<number>(initialIndex);
  const [remountKey, setRemountKey] = useState<number>(0);
  const [isReady, setIsReady] = useState<boolean>(false);

  const pickerRef = useRef<HTMLElement>(null);
  const highlightRef = useRef<HTMLSpanElement>(null);
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);

  // Update highlight pill position
  const updateHighlight = () => {
    const btn = buttonsRef.current[current];
    const highlight = highlightRef.current;
    if (btn && highlight) {
      highlight.style.width = `${btn.offsetWidth}px`;
      highlight.style.transform = `translateX(${btn.offsetLeft}px)`;
    }
  };

  useLayoutEffect(() => {
    updateHighlight();
  }, [current]);

  useEffect(() => {
    window.addEventListener("resize", updateHighlight);
    // Mark picker as ready on next tick so first paint doesn't animate
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsReady(true));
    });
    return () => {
      window.removeEventListener("resize", updateHighlight);
      cancelAnimationFrame(raf);
    };
  }, []);

  const switchVariant = (index: number) => {
    if (index < 0 || index >= VARIANTS.length) return;
    setCurrent(index);
    setRemountKey((k) => k + 1);
    const params = new URLSearchParams(window.location.search);
    params.set("v", String(index + 1));
    router.replace(`?${params.toString()}`);
  };

  const replayCurrent = () => {
    setRemountKey((k) => k + 1);
  };

  // Keyboard navigation contract per PICKER.md
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        ["INPUT", "TEXTAREA", "SELECT"].includes((e.target as HTMLElement)?.tagName) ||
        (e.target as HTMLElement)?.isContentEditable
      ) {
        return;
      }
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= VARIANTS.length) {
        e.preventDefault();
        switchVariant(num - 1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        switchVariant((current + 1) % VARIANTS.length);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        switchVariant((current - 1 + VARIANTS.length) % VARIANTS.length);
      } else if (e.key.toLowerCase() === "r") {
        e.preventDefault();
        replayCurrent();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [current]);

  const ActiveComponent = VARIANTS[current].component;

  return (
    <div className="relative min-h-screen">
      {/* Active variant rendered full size in realistic context */}
      <main key={`${current}-${remountKey}`}>
        <ActiveComponent />
      </main>

      {/* Verbatim Picker from PICKER.md */}
      <nav
        ref={pickerRef}
        className="proto-picker"
        data-ready={isReady ? "" : undefined}
        aria-label="Prototype variants"
      >
        <span
          ref={highlightRef}
          className="proto-picker-highlight"
          aria-hidden="true"
        />

        {VARIANTS.map((v, idx) => (
          <button
            key={v.name}
            ref={(el) => {
              buttonsRef.current[idx] = el;
            }}
            className="proto-picker-item"
            data-active={current === idx ? "" : undefined}
            aria-current={current === idx ? "true" : undefined}
            onClick={() => switchVariant(idx)}
          >
            {v.name}
          </button>
        ))}

        <span className="proto-picker-divider" aria-hidden="true" />

        <button
          className="proto-picker-item proto-picker-replay"
          aria-label="Replay animation (R)"
          title="Replay (R)"
          onClick={replayCurrent}
        >
          ↻
        </button>
      </nav>

      {/* Injected Styles verbatim from PICKER.md */}
      <style jsx global>{`
        .proto-picker {
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 2147483647;
          display: flex;
          align-items: center;
          gap: 2px;
          padding: 4px;
          border-radius: 999px;
          background: rgba(10, 10, 10, 0.82);
          -webkit-backdrop-filter: blur(12px) saturate(1.4);
          backdrop-filter: blur(12px) saturate(1.4);
          box-shadow:
            0 0 0 1px rgba(255, 255, 255, 0.08) inset,
            0 8px 24px rgba(0, 0, 0, 0.24),
            0 2px 6px rgba(0, 0, 0, 0.12);
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          font-size: 13px;
          line-height: 1;
          -webkit-font-smoothing: antialiased;
          user-select: none;
          -webkit-user-select: none;
        }

        .proto-picker-highlight {
          position: absolute;
          top: 4px;
          left: 0;
          height: 28px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.12);
          will-change: transform;
        }

        .proto-picker[data-ready] .proto-picker-highlight {
          transition:
            transform 250ms cubic-bezier(0.23, 1, 0.32, 1),
            width 250ms cubic-bezier(0.23, 1, 0.32, 1);
        }

        @media (prefers-reduced-motion: reduce) {
          .proto-picker[data-ready] .proto-picker-highlight {
            transition: none;
          }
        }

        .proto-picker-item {
          position: relative;
          display: flex;
          align-items: center;
          height: 28px;
          padding: 0 12px;
          border: 0;
          border-radius: 999px;
          background: transparent;
          color: rgba(255, 255, 255, 0.55);
          font: inherit;
          cursor: pointer;
          transition: color 150ms ease-out;
        }

        .proto-picker-item:hover {
          color: rgba(255, 255, 255, 0.85);
        }

        .proto-picker-item:active {
          transform: scale(0.97);
        }

        .proto-picker-item:focus-visible {
          outline: 2px solid rgba(255, 255, 255, 0.4);
          outline-offset: 2px;
        }

        .proto-picker-item[data-active] {
          color: #fff;
        }

        .proto-picker-divider {
          width: 1px;
          height: 16px;
          margin: 0 4px;
          background: rgba(255, 255, 255, 0.12);
        }

        .proto-picker-replay {
          padding: 0 10px;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
}

export default function PrototypePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#faf9f5]" />}>
      <PrototypeContent />
    </Suspense>
  );
}
