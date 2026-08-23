"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ExternalLink } from "lucide-react";

interface EssayItem {
  id: string;
  title: string;
  badge?: string;
  description: string;
  date: string;
  link?: string;
  iconBg?: string;
  renderIcon: () => React.ReactNode;
}

const essays: EssayItem[] = [
  {
    id: "innernote",
    title: "innernote",
    description: "Grow your audience in your voice, on autopilot.",
    date: "Jul 2026",
    link: "https://innernote.ai",
    renderIcon: () => (
      <svg className="size-5 text-white" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="2.5" fill="currentColor" />
        <circle cx="12" cy="4" r="1.5" fill="currentColor" opacity="0.8" />
        <circle cx="12" cy="20" r="1.5" fill="currentColor" opacity="0.8" />
        <circle cx="4" cy="12" r="1.5" fill="currentColor" opacity="0.8" />
        <circle cx="20" cy="12" r="1.5" fill="currentColor" opacity="0.8" />
        <circle cx="6.34" cy="6.34" r="1.5" fill="currentColor" opacity="0.6" />
        <circle cx="17.66" cy="17.66" r="1.5" fill="currentColor" opacity="0.6" />
        <circle cx="6.34" cy="17.66" r="1.5" fill="currentColor" opacity="0.6" />
        <circle cx="17.66" cy="6.34" r="1.5" fill="currentColor" opacity="0.6" />
      </svg>
    ),
  },
  {
    id: "livedocs",
    title: "LiveDocs",
    badge: "figdev 2026",
    description: "General data agent.",
    date: "Sep 2024 – Jan 2026",
    link: "https://livedocs.dev",
    renderIcon: () => (
      <svg className="size-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    id: "networkzero",
    title: "networkzero",
    description: "Software and AI for how businesses work.",
    date: "Apr 2026",
    link: "https://networkzero.io",
    renderIcon: () => (
      <svg className="size-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <line x1="3.6" y1="9" x2="20.4" y2="9" />
        <line x1="3.6" y1="15" x2="20.4" y2="15" />
        <path d="M12 3a14.5 14.5 0 0 0 0 18" />
        <path d="M12 3a14.5 14.5 0 0 1 0 18" />
      </svg>
    ),
  },
  {
    id: "eigen-video",
    title: "Eigen Video",
    description: "Turn raw footage into short-form video.",
    date: "Mar 2026",
    link: "https://eigenvideo.ai",
    renderIcon: () => (
      <svg className="size-5 text-white" viewBox="0 0 24 24" fill="currentColor">
        <rect x="2" y="4" width="20" height="16" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
        <polygon points="10,8 16,12 10,16" />
      </svg>
    ),
  },
  {
    id: "curated-people",
    title: "Curated People",
    description: "Human infrastructure for social life.",
    date: "Nov 2025 – Mar 2026",
    link: "https://curatedpeople.org",
    renderIcon: () => (
      <svg className="size-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

const additionalEssays: EssayItem[] = [
  {
    id: "tactile-interfaces",
    title: "On Tactile Interfaces",
    description: "Why the next wave of software will feel physical again.",
    date: "Jan 2025",
    link: "#",
    renderIcon: () => (
      <svg className="size-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="4" y="4" width="16" height="16" rx="3" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    id: "spatial-computing",
    title: "Spatial Computing Latency",
    description: "Designing zero-lag gestural affordances.",
    date: "Oct 2024",
    link: "#",
    renderIcon: () => (
      <svg className="size-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    ),
  },
];

export function AboutEssaysSection() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="relative w-full py-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
        {/* Left Column: Heading */}
        <div className="md:col-span-4 lg:col-span-5">
          <h2 className="font-display text-[30px] sm:text-[36px] font-medium leading-tight text-[#8a7c64] tracking-tight text-balance">
            essays i’ve written
          </h2>
        </div>

        {/* Right Column: Essays List */}
        <div className="md:col-span-8 lg:col-span-7 flex flex-col">
          {/* Base Essays List */}
          <div className="flex flex-col divide-y divide-zinc-200/50">
            {essays.map((item, index) => (
              <motion.a
                key={item.id}
                data-magnetic-card
                data-cuelume-hover="tick"
                data-cuelume-press
                data-cuelume-release
                href={item.link || "#"}
                target={item.link?.startsWith("http") ? "_blank" : undefined}
                rel={item.link?.startsWith("http") ? "noopener noreferrer" : undefined}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.03, ease: [0.22, 1, 0.36, 1] }}
                className="group flex items-center justify-between gap-4 py-3.5 px-2 -mx-2 rounded-xl hover:bg-[#eae3d2]/30 transition-colors"
              >
                {/* Left: Icon + Title & Desc */}
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Icon badge */}
                  <div className="shrink-0 size-11 rounded-[8px] bg-[#120d0b] border border-black/10 p-2 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                    {item.renderIcon()}
                  </div>

                  {/* Text details */}
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-medium text-[14px] sm:text-[15px] text-zinc-900 group-hover:text-zinc-700 transition-colors">
                        {item.title}
                      </span>

                      {/* Badge if present */}
                      {item.badge && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-[3px] bg-[rgba(254,48,1,0.08)] border border-[rgba(254,48,1,0.25)] text-[9px] font-display font-medium uppercase tracking-[0.5px] text-[rgba(254,48,1,0.85)]">
                          {item.badge}
                        </span>
                      )}
                    </div>

                    <p className="font-display text-[12px] sm:text-[13px] text-zinc-500 font-normal truncate max-w-[340px] sm:max-w-[420px]">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Right: Date */}
                <div className="shrink-0 flex items-center gap-2 text-right">
                  <span className="tabular-nums font-display text-[11px] sm:text-[12px] text-zinc-400 font-normal">
                    {item.date}
                  </span>
                  <ExternalLink className="size-3 text-zinc-400 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-[transform,opacity] duration-200 ease-out hidden sm:block" />
                </div>
              </motion.a>
            ))}
          </div>

          {/* Animated Expandable Additional Essays Accordion */}
          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden flex flex-col divide-y divide-zinc-200/50"
              >
                {additionalEssays.map((item, index) => (
                  <motion.a
                    key={item.id}
                    data-magnetic-card
                    data-cuelume-hover="tick"
                    data-cuelume-press
                    data-cuelume-release
                    href={item.link || "#"}
                    target={item.link?.startsWith("http") ? "_blank" : undefined}
                    rel={item.link?.startsWith("http") ? "noopener noreferrer" : undefined}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
                    className="group flex items-center justify-between gap-4 py-3.5 px-2 -mx-2 rounded-xl hover:bg-[#eae3d2]/30 transition-colors"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="shrink-0 size-11 rounded-[8px] bg-[#120d0b] border border-black/10 p-2 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                        {item.renderIcon()}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-display font-medium text-[14px] sm:text-[15px] text-zinc-900 group-hover:text-zinc-700 transition-colors">
                          {item.title}
                        </span>
                        <p className="font-display text-[12px] sm:text-[13px] text-zinc-500 font-normal truncate max-w-[340px] sm:max-w-[420px]">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0 flex items-center gap-2 text-right">
                      <span className="tabular-nums font-display text-[11px] sm:text-[12px] text-zinc-400 font-normal">
                        {item.date}
                      </span>
                      <ExternalLink className="size-3 text-zinc-400 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-[transform,opacity] duration-200 ease-out hidden sm:block" />
                    </div>
                  </motion.a>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* View All Button */}
          <div className="flex items-center justify-center pt-5">
            <button
              type="button"
              data-cuelume-toggle
              onClick={() => setIsExpanded(!isExpanded)}
              className="pressable inline-flex items-center gap-1.5 text-[12px] font-display font-normal text-zinc-400 hover:text-zinc-700 transition-colors py-1 px-3 rounded-full hover:bg-[#eae3d2]/40"
            >
              <span>{isExpanded ? "Show fewer essays" : "View all essays"}</span>
              <ChevronDown
                className={`size-3.5 transition-transform duration-200 ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
