"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import clsx from "clsx";
import { DynamicIslandNav } from "./dynamic-island-nav";
import { InteractiveTsuLogo } from "./tsu-logo";
import { useAboutEye } from "@/context/about-eye-context";
import { useZeroGravity } from "@/context/zero-gravity-context";
import { useNotification } from "@/context/notification-context";

const CHAT_PHRASES = ["let’s chat", "say hello", "reach out", "try it lol ;)", "¯\\(ツ) /¯"] as const;

export function Header() {
  const [hover, setHover] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isAtBoundary, setIsAtBoundary] = useState(true);
  const reduce = useReducedMotion();
  const { activeSection, isAbout } = useAboutEye();
  const { isZeroGravity, isRestoring } = useZeroGravity();
  const { activeNotification } = useNotification();
  const isZeroG = isZeroGravity && !isRestoring;
  const isNotificationActive = Boolean(activeNotification);

  const cyclePhrase = useCallback(() => {
    setPhraseIndex((prev) => (prev + 1) % CHAT_PHRASES.length);
  }, []);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    const onChange = () => setIsMobile(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  // Track start / end of page for mobile pill expansion
  useEffect(() => {
    const handleScroll = () => {
      if (typeof window === "undefined") return;
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const viewportHeight = window.innerHeight;
      const totalHeight = document.documentElement.scrollHeight;

      const atTop = scrollY <= 60;
      const atBottom = scrollY + viewportHeight >= totalHeight - 90;

      setIsAtBoundary(atTop || atBottom);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const minW = 56;
  const expandedW = 126;
  const isExpanded = isMobile ? isAtBoundary || hover : hover;

  const showEyeInHeader = !isAbout || activeSection === "hero";

  return (
    <>
      {/* Top Solid Translucent Header Background on Mobile */}
      <div
        className="fixed top-0 left-0 right-0 w-full h-[calc(5rem+env(safe-area-inset-top,0px))] -z-10 pointer-events-none select-none bg-[#fbfaf5]/50 dark:bg-[#090b10]/60 backdrop-blur-md md:hidden transition-colors duration-700"
        aria-hidden="true"
      />

      <header className="relative z-10 flex items-center justify-between w-full pointer-events-none">
        {/* Left: Interactive Eye Toon Logo in Header */}
        <div className="size-[48px] sm:size-[56px] shrink-0 pointer-events-auto z-30">
          {showEyeInHeader && (
            <motion.div
              layoutId="about-tsu-eye"
              transition={{
                type: "spring",
                stiffness: 240,
                damping: 22,
                mass: 0.85,
              }}
              className="size-full"
            >
              <InteractiveTsuLogo />
            </motion.div>
          )}
        </div>

        {/* Center: Dynamic Island Navigation & Notification Bar (Sticky on scroll when notification is active) */}
        <div
          className={clsx(
            "pointer-events-auto z-50 flex items-center justify-center",
            isNotificationActive
              ? "fixed bottom-6 left-1/2 -translate-x-1/2 mb-[env(safe-area-inset-bottom,0px)] md:fixed md:top-[calc(1.5rem+env(safe-area-inset-top,0px)+27px)] md:bottom-auto md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2"
              : "fixed bottom-6 left-1/2 -translate-x-1/2 mb-[env(safe-area-inset-bottom,0px)] md:absolute md:top-1/2 md:bottom-auto md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2"
          )}
        >
          <DynamicIslandNav />
        </div>

        {/* Right: Contact email button (Always expanded on mobile at top/bottom, hover-expanded on desktop) */}
        <motion.a
          href="mailto:hello@muditjha.me"
          aria-label="Email Mudit Jha"
          onHoverStart={() => {
            setHover(true);
          }}
          onHoverEnd={() => {
            setHover(false);
            cyclePhrase();
          }}
          onClick={() => {
            cyclePhrase();
          }}
          initial={false}
          animate={
            reduce
              ? { width: isExpanded ? expandedW : minW }
              : {
                width: isExpanded ? expandedW : minW,
                backgroundColor: isZeroG
                  ? hover ? "#27272a" : "#18181b"
                  : hover ? "#e6e6e6" : "#fbfaf5",
              }
          }
          transition={
            reduce
              ? {}
              : { type: "spring", stiffness: 420, damping: 30, mass: 0.8 }
          }
          data-cuelume-hover="tick"
          data-cuelume-press
          data-cuelume-release
          className="pressable pointer-events-auto relative inline-flex shrink-0 items-center overflow-hidden rounded-full border-2 border-zinc-300 dark:border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 transition-colors duration-700"
        >
          <div className="relative h-[54px] w-full">
            <div className="absolute inset-0">
              {/* Left-aligned text */}
              <div className="absolute inset-0 flex items-center justify-start ps-4 overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={CHAT_PHRASES[phraseIndex]}
                    className="whitespace-nowrap text-sm font-bold tracking-[0.01em] text-zinc-800 dark:text-zinc-100"
                    initial={
                      reduce
                        ? { opacity: isExpanded ? 1 : 0 }
                        : {
                          opacity: 0,
                          y: 3,
                          filter: "blur(2px)",
                        }
                    }
                    animate={
                      reduce
                        ? { opacity: isExpanded ? 1 : 0 }
                        : {
                          transform: isExpanded
                            ? "translateX(0px) scale(1)"
                            : "translateX(8px) scale(0.96)",
                          filter: isExpanded ? "blur(0px)" : "blur(2px)",
                          opacity: isExpanded ? 1 : 0,
                          y: 0,
                        }
                    }
                    exit={
                      reduce
                        ? { opacity: 0 }
                        : {
                          opacity: 0,
                          y: -3,
                          filter: "blur(2px)",
                        }
                    }
                    transition={
                      reduce ? {} : { duration: 0.15, ease: [0.22, 1, 0.36, 1] }
                    }
                  >
                    {CHAT_PHRASES[phraseIndex]}
                  </motion.span>
                </AnimatePresence>
              </div>

              {/* Icon fixed at right */}
              <div className="absolute inset-0 flex items-center justify-end pe-2.5 pointer-events-none">
                <motion.span
                  initial={false}
                  animate={
                    reduce
                      ? {}
                      : {
                        color: isZeroG
                          ? isExpanded ? "#f4f4f5" : "#a1a1aa"
                          : isExpanded ? "#374151" : "#9CA3AF",
                        rotate: isExpanded && hover ? 5 : 0,
                        backgroundColor: isZeroG
                          ? isExpanded && hover ? "#27272a" : "#18181b"
                          : isExpanded && hover ? "#e6e6e6" : "#fbfaf5",
                      }
                  }
                  transition={
                    reduce ? {} : { duration: 0.15, ease: [0.22, 1, 0.36, 1] }
                  }
                  className="flex items-center justify-center w-[30px] h-[30px] text-zinc-400"
                >
                  <svg
                    preserveAspectRatio="none"
                    overflow="visible"
                    style={{ display: "block" }}
                    width="22.8333"
                    height="18.6667"
                    viewBox="0 0 22.8333 18.6667"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21.8333 3.08333C21.8333 1.9375 20.8958 1 19.75 1H3.08333C1.9375 1 1 1.9375 1 3.08333M21.8333 3.08333V15.5833C21.8333 16.7292 20.8958 17.6667 19.75 17.6667H3.08333C1.9375 17.6667 1 16.7292 1 15.5833V3.08333M21.8333 3.08333L11.4167 10.375L1 3.08333"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.span>
              </div>
            </div>
          </div>
        </motion.a>
      </header>
    </>
  );
}

