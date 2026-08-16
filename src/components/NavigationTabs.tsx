"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import clsx from "clsx";

type Tab = {
  id: string;
  label: string;
  href: string;
};

// Willow grey (used for active pill background)
const WILLOW_HEX = "#C8D5BB";

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
  const pathname = usePathname();
  const reduce = useReducedMotion();

  const [activeId, setActiveId] = useState<string | undefined>(
    initialActiveId ?? tabs[0]?.id,
  );

  // Update activeId when route changes so the pill follows the current URL
  useEffect(() => {
    if (!pathname) return;
    const match = tabs.find(
      (t) =>
        t.href === pathname || (t.href !== "/" && pathname.startsWith(t.href)),
    );
    if (match) setActiveId(match.id);
    else setActiveId(tabs[0]?.id);
  }, [pathname, tabs]);

  return (
    <nav className="relative inline-flex items-center gap-1 z-10" aria-label="Main Navigation">
      {tabs.map((tab) => {
        const isActive = activeId === tab.id;
        return (
          <Link
            key={tab.id}
            href={tab.href}
            className={clsx(
              "relative rounded-full px-[15px] py-[6px] text-[18px] tracking-[-1px] transition-colors duration-150 pressable focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-1 select-none",
              isActive
                ? "font-medium text-zinc-900"
                : "font-normal text-zinc-500 [@media(hover:hover)]:hover:text-zinc-900"
            )}
          >
            {isActive && (
              <motion.div
                layoutId={reduce ? undefined : "active-nav-pill"}
                className="absolute inset-0 rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),inset_0_-1px_1px_rgba(0,0,0,0.02),0_2px_4px_rgba(0,0,0,0.06)] pointer-events-none"
                style={{
                  backgroundColor: WILLOW_HEX,
                  border: `1px solid rgba(200, 213, 187, 0.9)`,
                }}
                transition={
                  reduce
                    ? { duration: 0 }
                    : {
                      type: "spring",
                      stiffness: 400,
                      damping: 32,
                      mass: 0.8,
                    }
                }
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
