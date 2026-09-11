"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { DynamicIslandNav } from "./dynamic-island-nav";
import { InteractiveTsuLogo } from "./tsu-logo";
import { useAboutEye } from "@/context/about-eye-context";
import { useZeroGravity } from "@/context/zero-gravity-context";
import { useNotification } from "@/context/notification-context";
import { Magnetic } from "./magnetic";

const CHAT_PHRASES = ["let’s chat", "say hello", "reach out", "try it lol ;)", "¯\\(ツ) /¯"] as const;

export function Header() {
  const [hover, setHover] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isAtBoundary, setIsAtBoundary] = useState(true);
  const reduce = useReducedMotion();
  const pathname = usePathname();
  const { activeSection, isAbout } = useAboutEye();
  const { isZeroGravity, isRestoring } = useZeroGravity();
  const { activeNotification } = useNotification();
  const isZeroG = isZeroGravity && !isRestoring;
  const isNotificationActive = Boolean(activeNotification);
  const isPlay = pathname === "/play";

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

  const [isNavVisible, setIsNavVisible] = useState(true);
  const lastScrollYRef = useRef(0);

  // Track scroll direction on About page to hide/show navigation pill
  useEffect(() => {
    if (!isAbout) {
      setIsNavVisible(true);
      return;
    }

    const handleAboutScroll = () => {
      if (typeof window === "undefined") return;
      const currentScrollY = window.scrollY || document.documentElement.scrollTop;
      const delta = currentScrollY - lastScrollYRef.current;

      if (currentScrollY <= 80) {
        setIsNavVisible(true);
      } else if (delta > 8) {
        setIsNavVisible(false);
      } else if (delta < -8) {
        setIsNavVisible(true);
      }

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener("scroll", handleAboutScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleAboutScroll);
  }, [isAbout]);

  const minW = 56;
  const expandedW = 126;
  const isExpanded = isMobile ? isAtBoundary || hover : hover;

  const isDesignSystem = pathname === "/design-system";
  const showEyeInHeader = (!isAbout || activeSection === "hero") && !isPlay;

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

        {/* Center: Dynamic Island Navigation & Notification Bar (Hidden on /design-system) */}
        {!isDesignSystem && (
          <motion.div
            initial={false}
            animate={{
              y: !isAbout || isNavVisible || isNotificationActive ? 0 : (isMobile ? 100 : -75),
              opacity: !isAbout || isNavVisible || isNotificationActive ? 1 : 0,
            }}
            transition={
              reduce
                ? { duration: 0.15 }
                : { type: "spring", stiffness: 360, damping: 28, mass: 0.8 }
            }
            className={clsx(
              "z-50 flex items-center justify-center transition-opacity",
              !isAbout || isNavVisible || isNotificationActive ? "pointer-events-auto" : "pointer-events-none",
              isNotificationActive
                ? "fixed bottom-6 left-1/2 -translate-x-1/2 mb-[env(safe-area-inset-bottom,0px)] md:fixed md:top-[calc(1.5rem+env(safe-area-inset-top,0px)+27px)] md:bottom-auto md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2"
                : "fixed bottom-6 left-1/2 -translate-x-1/2 mb-[env(safe-area-inset-bottom,0px)] md:absolute md:top-1/2 md:bottom-auto md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2"
            )}
          >
            <DynamicIslandNav />
          </motion.div>
        )}

        {/* Right: Contact email button (Always expanded on mobile at top/bottom, hover-expanded on desktop) */}
        <Magnetic intensity={0.2} range={60} className="pointer-events-auto">
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
                    : hover ? "#c8d5bb" : "#fbfaf5",
                  borderColor: isZeroG
                    ? "rgba(255,255,255,0.15)"
                    : hover ? "rgba(200,213,187,0.9)" : "#d4d4d8",
                  boxShadow: isZeroG || !hover
                    ? "none"
                    : "inset 0 1px 1px rgba(255,255,255,0.9), inset 0 -1px 1px rgba(0,0,0,0.02), 0 2px 4px rgba(0,0,0,0.06)",
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
            className="pressable relative inline-flex shrink-0 items-center overflow-hidden rounded-full border border-zinc-300 dark:border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 transition-colors duration-700"
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

                {/* Center the icon in the compact button; keep it at the trailing edge once text is visible. */}
                <div
                  className={clsx(
                    "absolute inset-0 flex items-center pointer-events-none",
                    isExpanded ? "justify-end pe-2.5" : "justify-center"
                  )}
                >
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
                        }
                    }
                    transition={
                      reduce ? {} : { duration: 0.15, ease: [0.22, 1, 0.36, 1] }
                    }
                    style={{ backgroundColor: "transparent" }}
                    className="flex h-[30px] w-[30px] items-center justify-center bg-transparent text-zinc-400"
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
        </Magnetic>
      </header>
    </>
  );
}
