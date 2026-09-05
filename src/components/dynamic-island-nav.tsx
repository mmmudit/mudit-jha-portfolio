"use client";

import React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { RotateCcw, Mail } from "lucide-react";
import clsx from "clsx";
import NavigationTabs from "./NavigationTabs";
import { useNotification } from "@/context/notification-context";
import { play } from "@/lib/sound";

export function DynamicIslandNav() {
  const { activeNotification, resolveNotification } = useNotification();
  const reduce = useReducedMotion();

  const isNotificationActive = Boolean(activeNotification);

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeNotification?.action) {
      play("success", { volume: 0.55 });
      activeNotification.action.onClick();
      resolveNotification(activeNotification.id);
    }
  };

  // Uses Apple's fluid spring dynamics: liquid initial stretch with subtle organic settle
  const springTransition = reduce
    ? { duration: 0.15 }
    : {
      type: "spring" as const,
      stiffness: 350,
      damping: 28,
      mass: 0.8,
    };

  return (
    <div
      role="region"
      aria-label={isNotificationActive ? "System Alert" : "Navigation"}
      className="relative flex items-center justify-center"
    >
      <motion.div
        layout
        transition={springTransition}
        style={{ borderRadius: 9999 }}
        className={clsx(
          "relative flex items-center justify-center rounded-full backdrop-blur-md overflow-hidden p-1 transition-colors duration-500",
          isNotificationActive
            ? "bg-zinc-900/90 border border-white/15 text-zinc-100 shadow-[0_8px_30px_rgba(0,0,0,0.6)]"
            : "border border-zinc-300/70 dark:border-white/15 bg-[#fbfaf5]/90 dark:bg-zinc-900/90 shadow-[0_8px_30px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.04)] md:shadow-[0_4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.6)]"
        )}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {isNotificationActive && activeNotification ? (
            /* Always Dark Mode Dynamic Island Notification */
            <motion.div
              key={`island-${activeNotification.id}`}
              initial={
                reduce
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.94, filter: "blur(4px)" }
              }
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={
                reduce
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.94, filter: "blur(4px)" }
              }
              transition={{
                opacity: { duration: 0.18, ease: [0.22, 1, 0.36, 1] },
                scale: { duration: 0.18, ease: [0.22, 1, 0.36, 1] },
                filter: { duration: 0.18, ease: [0.22, 1, 0.36, 1] },
              }}
              className="flex items-center justify-between gap-3 sm:gap-4 w-full min-w-0 px-2.5 py-1 sm:px-3.5 sm:py-1 max-w-[calc(100vw-32px)] sm:max-w-md whitespace-nowrap"
            >
              {/* Leading status indicator with Willow Grey beacon */}
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                {activeNotification.leading ? (
                  activeNotification.leading
                ) : (
                  <span
                    className="relative inline-flex items-center justify-center text-[15px] sm:text-[16px] leading-none shrink-0 ml-0.5 filter drop-shadow-[0_0_8px_rgba(140,180,255,0.95)] select-none animate-pulse"
                    aria-hidden="true"
                  >
                    🌍
                  </span>
                )}

                {/* Telemetry info in permanent dark mode */}
                <div className="flex flex-col min-w-0 text-left">
                  <span
                    className={clsx(
                      "font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider",
                      activeNotification.type === "alert" ? "text-amber-400" : "text-[#C8D5BB]"
                    )}
                  >
                    {activeNotification.badge || activeNotification.title}
                  </span>
                  {activeNotification.subtitle && (
                    <span className="font-sans text-[12px] sm:text-[13px] font-normal text-red-300 tracking-[-0.02em] truncate max-w-[210px] sm:max-w-[340px]">
                      {activeNotification.subtitle}
                    </span>
                  )}
                </div>
              </div>

              {/* Trailing action button in permanent dark mode */}
              {activeNotification.action && (
                <button
                  type="button"
                  onClick={handleActionClick}
                  data-cuelume-hover="tick"
                  data-cuelume-press
                  data-cuelume-release
                  className="pressable inline-flex items-center justify-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-full bg-[#C8D5BB] text-zinc-950 font-medium text-[12px] sm:text-[13px] tracking-[-0.02em] border border-white/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_2px_8px_rgba(0,0,0,0.4)] hover:brightness-105 active:scale-[0.96] transition-[transform,filter] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] shrink-0 cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8D5BB] focus-visible:ring-offset-1 focus-visible:ring-offset-zinc-900"
                >
                  {activeNotification.action.icon || (
                    activeNotification.type === "zero-g" ? (
                      <RotateCcw size={12} className="stroke-[2.2]" />
                    ) : (
                      <Mail size={12} className="stroke-[2.2]" />
                    )
                  )}
                  <span>{activeNotification.action.label}</span>
                </button>
              )}
            </motion.div>
          ) : (
            /* Standard Navigation Mode */
            <motion.div
              key="island-navigation"
              initial={
                reduce
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.94, filter: "blur(4px)" }
              }
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={
                reduce
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.94, filter: "blur(4px)" }
              }
              transition={{
                opacity: { duration: 0.18, ease: [0.22, 1, 0.36, 1] },
                scale: { duration: 0.18, ease: [0.22, 1, 0.36, 1] },
                filter: { duration: 0.18, ease: [0.22, 1, 0.36, 1] },
              }}
              className="flex items-center whitespace-nowrap"
            >
              <NavigationTabs />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
