"use client";

import { TextAnimationCollection } from "@designcodeio/threeui";
import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { LiveClock } from "./live-clock";
import { SmartLinkPreview } from "./smart-link-preview";
import { play } from "@/lib/sound";
import { useZeroGravity } from "@/context/zero-gravity-context";
import { useNotification } from "@/context/notification-context";

const socialLinks = [
  { label: "Insta", href: "https://www.instagram.com/mmmudit/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/muditj3/" },
  { label: "Github", href: "https://github.com/mmmudit" },
  { label: "X", href: "https://x.com/MuditJ1" },
  { label: "Substack", href: "https://mmmudit.substack.com/" },
  { label: "Email", href: "mailto:hello@muditjha.me" },
] as const;

function getLatestDeploymentDate(): string {
  const rawDate =
    process.env.NEXT_PUBLIC_BUILD_DATE ||
    process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_DATE;

  try {
    const d = rawDate ? new Date(rawDate) : new Date();
    if (isNaN(d.getTime())) {
      return "09-03-2026";
    }
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${mm}-${dd}-${yyyy}`;
  } catch {
    return "09-03-2026";
  }
}

export function Footer() {
  const reduce = useReducedMotion();
  const deploymentDate = getLatestDeploymentDate();
  const { isZeroGravity, isRestoring } = useZeroGravity();
  const { triggerNotification } = useNotification();
  const isZeroG = isZeroGravity && !isRestoring;

  const handleEmailClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("mailto:")) {
      e.preventDefault();
      navigator.clipboard?.writeText("hello@muditjha.me");
      play("success", { volume: 0.6 });
      triggerNotification({
        id: "email-copied",
        type: "info",
        badge: "COPIED",
        title: "Email Copied",
        subtitle: "hello@muditjha.me",
        duration: 3200,
        action: {
          label: "Send Mail",
          onClick: () => {
            window.location.href = "mailto:hello@muditjha.me";
          },
        },
      });
    }
  };

  return (
    <footer className="relative w-screen left-1/2 -translate-x-1/2 px-6 sm:px-14 pb-[calc(7.5rem+env(safe-area-inset-bottom,0px))] sm:pb-[max(1.5rem,env(safe-area-inset-bottom))] select-none">
      {/* Subtle Frost Blur Gradient Overlay with Color Willow (Spanning entire viewport width) */}
      <div
        className="absolute inset-0 pointer-events-none -z-10 select-none transition-[backdrop-filter,opacity] duration-250 ease-out dark:opacity-0"
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
          <p className="font-hand text-[36px] sm:text-[44px] md:text-[48px] leading-tight tracking-[-1px] text-willow-grey dark:text-[#c8d5bb]">
            say hi!
          </p>
          <motion.div
            animate={reduce ? undefined : { y: [0, 5, 0] }}
            transition={
              reduce
                ? undefined
                : { duration: 2.6, repeat: Infinity, ease: [0.45, 0, 0.55, 1] }
            }
            className="text-willow-grey dark:text-[#c8d5bb] flex items-center justify-center -mt-1"
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
        <div className="relative flex flex-col md:flex-row items-center justify-center md:justify-between gap-y-3 sm:gap-y-4 md:gap-y-0 w-full font-sans font-semibold text-[26px] sm:text-[32px] md:text-[38px] lg:text-[46px] tracking-[-1px] leading-tight md:leading-none text-willow-grey dark:text-[#c8d5bb]">
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
                  className="pressable transition-[color,transform] duration-200 hover:text-zinc-900 dark:hover:text-white dark:hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.7)] [@media(hover:hover)]:hover:scale-[1.03] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 rounded-lg"
                >
                  {link.label.toLowerCase()}
                </a>
              </div>
            );

            return (
              <div
                key={link.label}
                className="flex items-center justify-center w-full md:w-auto"
              >
                <SmartLinkPreview url={link.href} variant={isEmail ? "card" : "compact"}>
                  {linkElement}
                </SmartLinkPreview>
              </div>
            );
          })}
        </div>

        {/* Divider Line */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-[#c8d5bb]/80 dark:via-white/20 to-transparent" />

        {/* Metadata Bar (Live Clock, Copyright, Changelog) */}
        <div className="relative z-30 pt-1 grid grid-cols-1 sm:grid-cols-3 items-center w-full gap-4 text-[#7f7f80] dark:text-zinc-400 text-[13px] sm:text-[14px] md:text-[15px] tracking-tight">
          {/* Left: Live Clock + Status Dot */}
          <div className="flex items-center justify-center sm:justify-start">
            <LiveClock />
          </div>

          {/* Center: Copyright (Centered in middle grid track) */}
          <div className="flex items-center justify-center font-mono text-xs sm:text-[13px] tracking-wider text-[#7f7f80] dark:text-zinc-400">
            <a
              href="https://muditjha.me"
              className="pressable transition-opacity [@media(hover:hover)]:hover:opacity-70 dark:[@media(hover:hover)]:hover:text-zinc-200"
            >
              © 2026 MUDIT JHA
            </a>
          </div>

          {/* Right: Changelog */}
          <div className="flex items-center justify-center sm:justify-end uppercase font-mono text-xs sm:text-[13px] tracking-wider text-[#7f7f80] dark:text-zinc-400">
            <span>Changelog: {deploymentDate}</span>
          </div>
        </div>

        {/* Giant "MUDIT" Shaded Particle Wordmark (Bottom Anchor - Full Page Width) */}
        <div className="relative flex items-center justify-center w-screen left-1/2 -translate-x-1/2 pt-2 overflow-visible aspect-[2200/320] bg-transparent">
          <TextAnimationCollection
            variant="particle-wordmark"
            text="mudit"
            mode={isZeroG ? "dark" : "light"}
            hue={45}
            saturation={1.2}
            brightness={1.05}
            style={{ background: "transparent", backgroundColor: "transparent" }}
          />
        </div>
      </div>
    </footer>
  );
}
