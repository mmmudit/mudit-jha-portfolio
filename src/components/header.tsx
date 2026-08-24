"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import NavigationTabs from "./NavigationTabs";
import { InteractiveTsuLogo } from "./tsu-logo";

export function Header() {
  const [hover, setHover] = useState(false);
  const reduce = useReducedMotion();

  const minW = 56;
  const expandedW = 125;

  return (
    <>
      {/* Top Progressive Gradient Blur Overlay (Decreasing Top-to-Bottom) */}
      <div
        className="fixed top-0 inset-x-0 h-36 sm:h-44 pt-[env(safe-area-inset-top,0px)] -z-10 pointer-events-none select-none transition-[backdrop-filter,opacity] duration-250 ease-out"
        style={{
          background:
            "linear-gradient(to bottom, rgba(251, 250, 245, 0.92) 0%, rgba(251, 250, 245, 0.4) 60%, rgba(251, 250, 245, 0) 100%)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          maskImage:
            "linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.5) 60%, rgba(0, 0, 0, 0) 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.5) 60%, rgba(0, 0, 0, 0) 100%)",
        }}
        aria-hidden="true"
      />

      <header className="relative z-10 flex items-center justify-between w-full pointer-events-none">
        {/* Left: Interactive Eye Toon Logo */}
        <div className="pointer-events-auto">
          <InteractiveTsuLogo />
        </div>

        {/* Center: Navigation Bar (Floating Pill - Absolutely Centered so button animation never shifts it) */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-auto">
          <div className="rounded-full border border-zinc-300/70 bg-[#fbfaf5]/85 backdrop-blur-md p-1 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
            <NavigationTabs />
          </div>
        </div>

        {/* Right: Contact email button (Direct click to mailto, no preview popover) */}
        <motion.a
          href="mailto:hello@muditjha.me"
          aria-label="Email Mudit Jha"
          onHoverStart={() => setHover(true)}
          onHoverEnd={() => setHover(false)}
          initial={false}
          animate={
            reduce
              ? {}
              : {
                  width: hover ? expandedW : minW,
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
          className="pressable pointer-events-auto relative inline-flex shrink-0 items-center overflow-hidden rounded-full border-2 border-zinc-300"
          style={{ width: minW }}
        >
          <div className="relative h-[54px] w-full">
            <div className="absolute inset-0">
              {/* Left-aligned text (hidden by default) */}
              <div className="absolute inset-0 flex items-center justify-start ps-4">
                <motion.span
                  className="whitespace-nowrap text-sm font-bold tracking-[0.01em] text-zinc-800"
                  initial={false}
                  animate={
                    reduce
                      ? {}
                      : {
                          transform: hover
                            ? "translateX(0px) scale(1)"
                            : "translateX(8px) scale(0.96)",
                          filter: hover ? "blur(0px)" : "blur(2px)",
                          opacity: hover ? 1 : 0,
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
                          color: hover ? "#374151" : "#9CA3AF",
                          rotate: hover ? 5 : 0,
                          backgroundColor: hover ? "#e6e6e6" : "#fbfaf5",
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
