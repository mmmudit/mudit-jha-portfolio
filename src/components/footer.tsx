"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { LiveClock } from "./live-clock";
import { ToonLinkPreview } from "./toon-link-preview";
import { play } from "@/lib/sound";

const socialLinks = [
  { label: "Insta", href: "https://www.instagram.com/mmmudit/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/muditj3/" },
  { label: "Github", href: "https://github.com/mmmudit" },
  { label: "X", href: "https://x.com/MuditJ1" },
  { label: "Substack", href: "https://substack.com/@mmmudit" },
  { label: "Email", href: "mailto:hello@muditjha.me" },
] as const;

export function Footer() {
  const [copied, setCopied] = useState(false);

  const handleEmailClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("mailto:")) {
      navigator.clipboard?.writeText("hello@muditjha.me");
      play("success", { volume: 0.6 });
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <footer className="relative w-screen left-1/2 -translate-x-1/2 px-6 sm:px-14 select-none">
      {/* Subtle Frost Blur Gradient Overlay with Color Willow (Spanning entire viewport width) */}
      <div
        className="absolute inset-0 pointer-events-none -z-10 select-none transition-[backdrop-filter,opacity] duration-250 ease-out"
        style={{
          background:
            "linear-gradient(to top, rgba(200, 213, 187, 0.75) 0%, rgba(200, 213, 187, 0.3) 50%, rgba(200, 213, 187, 0) 100%)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          maskImage:
            "linear-gradient(to top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.6) 50%, rgba(0, 0, 0, 0) 100%)",
          WebkitMaskImage:
            "linear-gradient(to top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.6) 50%, rgba(0, 0, 0, 0) 100%)",
        }}
        aria-hidden="true"
      />
      <div className="relative z-10 flex flex-col items-center w-full gap-10 md:gap-14">
        {/* Top: Say Hi! + Chevron Down */}
        <div className="flex flex-col items-center gap-1">
          <p className="font-hand text-[36px] sm:text-[44px] md:text-[48px] leading-tight tracking-[-1px] text-willow-grey">
            say hi!
          </p>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: [0.45, 0, 0.55, 1] }}
            className="text-willow-grey flex items-center justify-center -mt-1"
          >
            <svg
              className="size-8 sm:size-10 stroke-current"
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </motion.div>
        </div>

        {/* Social Links Row */}
        <div className="relative flex flex-col md:flex-row items-center justify-center md:justify-between gap-y-3 sm:gap-y-4 md:gap-y-0 w-full font-sans font-semibold text-[26px] sm:text-[32px] md:text-[38px] lg:text-[46px] tracking-[-1px] leading-tight md:leading-none text-willow-grey">
          {socialLinks.map((link) => {
            const isEmail = link.label === "Email";
            const linkElement = (
              <div className="relative inline-flex items-center">
                <a
                  href={link.href}
                  onClick={(e) => handleEmailClick(e, link.href)}
                  target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={link.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                  data-cuelume-hover="tick"
                  data-cuelume-press
                  data-cuelume-release
                  className="pressable transition-[transform,color] duration-150 hover:text-rust-grey active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-willow-grey/50 rounded-sm"
                >
                  {isEmail && copied ? (
                    <span className="text-emerald-800">Copied!</span>
                  ) : (
                    link.label.toLowerCase()
                  )}
                </a>

                {/* Copied Feedback for Email */}
                {isEmail && (
                  <AnimatePresence initial={false}>
                    {copied && (
                      <motion.span
                        initial={{ opacity: 0, y: 8, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -4, scale: 0.9 }}
                        transition={{ type: "spring", duration: 0.25, bounce: 0 }}
                        className="absolute left-1/2 -top-9 -translate-x-1/2 inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono font-medium text-emerald-800 bg-emerald-100/90 backdrop-blur-sm rounded-full border border-emerald-300 shadow-sm whitespace-nowrap z-20"
                      >
                        <Check className="size-3 text-emerald-700" />
                        <span>Copied</span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                )}
              </div>
            );

            return (
              <div
                key={link.label}
                className="flex items-center justify-center w-full md:w-auto"
              >
                {!isEmail ? (
                  <ToonLinkPreview
                    preview={{
                      title: `Mudit Jha on ${link.label}`,
                      url: link.href,
                      category: `Social / ${link.label}`,
                    }}
                  >
                    {linkElement}
                  </ToonLinkPreview>
                ) : (
                  linkElement
                )}
              </div>
            );
          })}
        </div>

        {/* Divider Line */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#c8d5bb]/80 to-transparent" />

        {/* Giant "mudit" Wordmark Asset */}
        <div className="relative flex items-center justify-center w-full pt-2 overflow-visible">
          <Image
            src="/assets/mudit-wordmark.png"
            alt="mudit"
            width={1024}
            height={449}
            priority
            className="w-full max-w-[1100px] h-auto object-contain pointer-events-none select-none drop-shadow-sm"
          />
        </div>

        {/* Bottom Metadata Bar (In-flow at the bottom of the page, high z-index above blur) */}
        <div className="relative z-30 mb-7 flex flex-col sm:flex-row items-center justify-between w-full gap-4 text-[#7f7f80] text-[13px] sm:text-[14px] md:text-[15px] tracking-tight">
          {/* Left: Live Clock + Status Dot */}
          <div className="flex items-center justify-center sm:justify-start">
            <LiveClock />
          </div>

          {/* Center: Copyright (Always exactly centered to the page) */}
          <div className="sm:absolute sm:left-1/2 sm:-translate-x-1/2 flex items-center justify-center lowercase font-sans font-light tracking-[-0.5px]">
            <a
              href="https://muditjha.me"
              className="pressable transition-opacity [@media(hover:hover)]:hover:opacity-70"
            >
              © 2026 MuditJha
            </a>
          </div>

          {/* Right: Changelog */}
          <div className="flex items-center justify-center sm:justify-end uppercase font-sans font-light tracking-[-0.5px]">
            <span>CHANGELOG: 09-03-2003</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
