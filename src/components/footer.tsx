"use client";

import { useCallback, useEffect, useMemo, useState, type CSSProperties } from "react";
import { TextAnimationCollection } from "@designcodeio/threeui";
import { motion, useReducedMotion } from "framer-motion";
import { LiveClock } from "./live-clock";
import { SmartLinkPreview } from "./smart-link-preview";
import { play } from "@/lib/sound";
import { Magnetic } from "./magnetic";
import { useZeroGravity } from "@/context/zero-gravity-context";
import { useNotification } from "@/context/notification-context";
import { OrganicStars } from "@/app/prototypes/solar-footer/organic-stars";
import { getSolarPosition } from "@/app/prototypes/solar-footer/solar-position";
import styles from "@/app/prototypes/solar-footer/solar-footer.module.css";

type SolarStyle = CSSProperties & Record<`--${string}`, string>;

const SOLAR_CONFIG = {
  intensity: 0.50,
  softness: "100px",
  rayReach: "1500px",
  starStrength: "1.00",
  timeShift: 0, // Live Chicago solar time
};

const socialLinks = [
  { label: "Insta", href: "https://www.instagram.com/mmmudit/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/muditj3/" },
  { label: "Github", href: "https://github.com/mmmudit" },
  { label: "X", href: "https://x.com/MuditJ1" },
  { label: "Substack", href: "https://mmmudit.substack.com/" },
  { label: "Email", href: "mailto:hello@muditjha.me" },
] as const;

interface FooterStar {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
}

function FooterSparklingStars() {
  const reduce = useReducedMotion();

  const stars: FooterStar[] = useMemo(() => {
    const list: FooterStar[] = [];
    const count = 48;
    for (let i = 0; i < count; i++) {
      const seed1 = Math.sin((i + 42) * 883.1) * 10000;
      const r1 = seed1 - Math.floor(seed1);
      const seed2 = Math.cos((i + 42) * 419.3) * 10000;
      const r2 = seed2 - Math.floor(seed2);
      const seed3 = Math.sin((i + 42) * 617.7) * 10000;
      const r3 = seed3 - Math.floor(seed3);

      list.push({
        id: i,
        x: Math.floor(r1 * 96) + 2,
        y: Math.floor(r2 * 90) + 5,
        size: Number((1 + r3 * 2.2).toFixed(3)),
        opacity: Number((0.35 + r3 * 0.6).toFixed(3)),
        duration: Number((2.5 + r1 * 3.5).toFixed(3)),
        delay: Number((r2 * 2.5).toFixed(3)),
      });
    }
    return list;
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* Subtle radial celestial gradient overlay */}
      <div
        className="absolute inset-0 opacity-50 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(45, 60, 80, 0.25) 0%, rgba(9, 10, 15, 0.95) 85%)",
        }}
      />
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            boxShadow: star.size > 2 ? "0 0 6px rgba(255, 255, 255, 0.85)" : "none",
          }}
          animate={
            reduce
              ? { opacity: star.opacity }
              : {
                opacity: [star.opacity * 0.25, star.opacity, star.opacity * 0.25],
                scale: [0.8, 1.25, 0.8],
                y: ["0px", "-6px", "0px"],
              }
          }
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function getLatestDeploymentDate(): string {
  const rawDate =
    process.env.NEXT_PUBLIC_BUILD_DATE ||
    process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_DATE;

  try {
    if (!rawDate) return "09-13-2026";
    const d = new Date(rawDate);
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

  const [solarStyle, setSolarStyle] = useState<SolarStyle>({
    "--sun-intensity": SOLAR_CONFIG.intensity.toFixed(2),
    "--sun-softness": SOLAR_CONFIG.softness,
    "--ray-reach": SOLAR_CONFIG.rayReach,
    "--star-strength": SOLAR_CONFIG.starStrength,
    "--sun-x": "50%",
    "--sun-y": "0%",
    "--sun-ray-angle": "90deg",
    "--sun-azimuth": "180deg",
    "--sun-opacity": SOLAR_CONFIG.intensity.toFixed(2),
  });

  const applySolarPosition = useCallback(() => {
    const shiftedDate = new Date(Date.now() + SOLAR_CONFIG.timeShift * 3_600_000);
    const solar = getSolarPosition(shiftedDate);
    // Maintain a minimum ambient twilight floor so the solar haze light stays visible in all orientations & night hours
    const effectiveDaylight = Math.max(0.45, solar.daylight);

    setSolarStyle({
      "--sun-intensity": SOLAR_CONFIG.intensity.toFixed(2),
      "--sun-softness": SOLAR_CONFIG.softness,
      "--ray-reach": SOLAR_CONFIG.rayReach,
      "--star-strength": SOLAR_CONFIG.starStrength,
      "--sun-x": `${solar.edgeX.toFixed(3)}%`,
      "--sun-y": `${solar.edgeY.toFixed(3)}%`,
      "--sun-ray-angle": `${solar.rayAngle.toFixed(3)}deg`,
      "--sun-azimuth": `${solar.azimuth.toFixed(2)}deg`,
      "--sun-opacity": (effectiveDaylight * SOLAR_CONFIG.intensity).toFixed(3),
    });
  }, []);

  useEffect(() => {
    applySolarPosition();
    const interval = window.setInterval(() => applySolarPosition(), 30_000);
    return () => window.clearInterval(interval);
  }, [applySolarPosition]);

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
    <footer className="relative w-screen left-1/2 -translate-x-1/2 select-none">
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
      <div className="relative z-10 flex flex-col items-center w-full gap-10 md:gap-14 pt-8">
        {/* Top: Say Hi! + Chevron Down */}
        <div className="flex flex-col items-center gap-1 px-6 sm:px-14">
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
        <div className="relative flex flex-col md:flex-row items-center justify-center md:justify-between gap-y-3 sm:gap-y-4 md:gap-y-0 w-full px-6 sm:px-14 font-sans font-semibold text-[26px] sm:text-[32px] md:text-[38px] lg:text-[46px] tracking-[-1px] leading-tight md:leading-none text-willow-grey dark:text-[#c8d5bb]">
          {socialLinks.map((link) => {
            const isEmail = link.label === "Email";
            const linkElement = (
              <div className="relative inline-flex items-center">
                <Magnetic intensity={0.25} range={120}>
                  <a
                    href={link.href}
                    onClick={(e) => handleEmailClick(e, link.href)}
                    target={link.href.startsWith("mailto:") ? undefined : "_blank"}
                    rel={link.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                    data-cuelume-hover="tick"
                    data-cuelume-press
                    data-cuelume-release
                    className="pressable transition-[color] duration-200 hover:text-zinc-900 dark:hover:text-white dark:hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.7)] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 rounded-lg"
                  >
                    {link.label.toLowerCase()}
                  </a>
                </Magnetic>
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

        {/* Brand Black Footer Area Below Social Links with Organic Stars & Adaptive Sunlight */}
        <div
          style={solarStyle}
          className={`relative w-full text-zinc-400 pt-8 sm:pt-10 pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))] sm:pb-[max(1rem,env(safe-area-inset-bottom))] px-6 sm:px-14 flex flex-col items-center gap-6 sm:gap-8 mt-2 transition-[background-color,border-color] duration-300 ${isZeroG
            ? "bg-transparent border-t-0 overflow-visible"
            : "bg-[#090a0f] border-t border-white/10 overflow-hidden"
            }`}
        >
          {/* Organic Celestial Stars (Starlight 1.00 - Hidden in Zero-G in favor of ZeroG Cosmos) */}
          {!isZeroG && (
            <div
              className="absolute inset-0 pointer-events-none z-0"
              style={{ overflow: "hidden" }}
            >
              <OrganicStars tone="haze" />
            </div>
          )}

          {/* Adaptive Sunlight — Haze Variant */}
          <div
            className={styles.astralHaze}
            style={{ overflow: isZeroG ? "visible" : "hidden" }}
            aria-hidden="true"
          >
            <span className={styles.hazeBloom} />
            <span className={styles.hazeRibbon} />
            <span className={styles.hazeMote} />
          </div>

          {/* Sparkling Micro-Stars (Hidden in Zero-G mode) */}
          {!isZeroG && <FooterSparklingStars />}

          {/* Metadata Bar (Live Clock, Copyright, Changelog) */}
          <div className="relative z-30 pt-1 grid grid-cols-1 sm:grid-cols-3 items-center w-full max-w-[1400px] mx-auto gap-4 text-zinc-400 text-[13px] sm:text-[14px] md:text-[15px] tracking-tight">
            {/* Left: Live Clock + Status Dot */}
            <div className="flex items-center justify-center sm:justify-start text-zinc-300">
              <LiveClock />
            </div>

            {/* Center: Copyright (Centered in middle grid track) */}
            <div className="flex items-center justify-center font-mono text-xs sm:text-[13px] tracking-wider text-zinc-400">
              <a
                href="https://muditjha.me"
                className="pressable transition-opacity hover:opacity-80 hover:text-white"
              >
                © 2026 MUDIT JHA
              </a>
            </div>

            {/* Right: Changelog */}
            <div className="flex items-center justify-center sm:justify-end uppercase font-mono text-xs sm:text-[13px] tracking-wider text-zinc-400">
              <span>Changelog: {deploymentDate}</span>
            </div>
          </div>

          {/* Giant "MUDIT" Shaded Particle Wordmark (Bottom Anchor - Centered & Responsive) */}
          <div className="relative z-10 flex items-center justify-center w-full max-w-[1400px] mx-auto overflow-hidden aspect-[1600/210] min-h-[60px] sm:min-h-[100px] md:min-h-[130px] lg:min-h-[160px] max-h-[220px] bg-transparent">
            <TextAnimationCollection
              variant="particle-wordmark"
              text="mudit"
              mode="dark"
              hue={45}
              saturation={1.2}
              brightness={1.05}
              style={{ background: "transparent", backgroundColor: "transparent" }}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
