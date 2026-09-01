"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState, useEffect } from "react";
import NavigationTabs from "./NavigationTabs";
import { InteractiveTsuLogo } from "./tsu-logo";
import { useAboutEye } from "@/context/about-eye-context";

export function Header() {
  const [hover, setHover] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isAtBoundary, setIsAtBoundary] = useState(true);
  const reduce = useReducedMotion();
  const { activeSection, isAbout } = useAboutEye();

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
  const expandedW = 125;
  const isExpanded = isMobile ? isAtBoundary || hover : hover;

  const showEyeInHeader = !isAbout || activeSection === "hero";

  return (
    <>
      {/* Top Solid Translucent Header Background on Mobile */}
      <div
        className="fixed top-0 left-0 right-0 w-full h-[calc(5rem+env(safe-area-inset-top,0px))] -z-10 pointer-events-none select-none bg-[#fbfaf5]/50 backdrop-blur-md  md:hidden"
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

        {/* Center: Navigation Bar (Bottom-centered floating dock on mobile, absolutely centered in header on desktop) */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 mb-[env(safe-area-inset-bottom,0px)] md:absolute md:top-1/2 md:bottom-auto md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 flex items-center justify-center pointer-events-auto z-50">
          <div className="rounded-full border border-zinc-300/70 bg-[#fbfaf5]/90 backdrop-blur-md p-1 shadow-[0_8px_30px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.04)] md:shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
            <NavigationTabs />
          </div>
        </div>

        {/* Right: Contact email button (Always expanded on mobile at top/bottom, hover-expanded on desktop) */}
        <motion.a
          href="mailto:hello@muditjha.me"
          aria-label="Email Mudit Jha"
          onHoverStart={() => setHover(true)}
          onHoverEnd={() => setHover(false)}
          initial={false}
          animate={
            reduce
              ? { width: isExpanded ? expandedW : minW }
              : {
                width: isExpanded ? expandedW : minW,
                backgroundColor: hover ? "#e6e6e6" : "#fbfaf5",
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
          className="pressable pointer-events-auto relative inline-flex shrink-0 items-center overflow-hidden rounded-full border-2 border-zinc-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2"
        >
          <div className="relative h-[54px] w-full">
            <div className="absolute inset-0">
              {/* Left-aligned text */}
              <div className="absolute inset-0 flex items-center justify-start ps-4">
                <motion.span
                  className="whitespace-nowrap text-sm font-bold tracking-[0.01em] text-zinc-800"
                  initial={false}
                  animate={
                    reduce
                      ? { opacity: isExpanded ? 1 : 0 }
                      : {
                        transform: isExpanded
                          ? "translateX(0px) scale(1)"
                          : "translateX(8px) scale(0.96)",
                        filter: isExpanded ? "blur(0px)" : "blur(2px)",
                        opacity: isExpanded ? 1 : 0,
                      }
                  }
                  transition={
                    reduce ? {} : { duration: 0.15, ease: [0.22, 1, 0.36, 1] }
                  }
                >
                  let’s chat
                </motion.span>
              </div>

              {/* Icon fixed at right */}
              <div className="absolute inset-0 flex items-center justify-end pe-2.5 pointer-events-none">
                <motion.span
                  initial={false}
                  animate={
                    reduce
                      ? {}
                      : {
                        color: isExpanded ? "#374151" : "#9CA3AF",
                        rotate: isExpanded && hover ? 5 : 0,
                        backgroundColor: isExpanded && hover ? "#e6e6e6" : "#fbfaf5",
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

