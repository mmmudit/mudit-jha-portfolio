"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { play } from "@/lib/sound";

const STORAGE_KEY = "portfolio_intro_seen";
const SKIP_DELAY_MS = 800;
const FADE_DURATION_MS = 1000;

interface IntroLoaderProps {
  children?: React.ReactNode;
}

export function IntroLoader({ children }: IntroLoaderProps) {
  // Default to true so initial SSR / HTML has the overlay immediately covering the page
  const [isOverlayActive, setIsOverlayActive] = useState(true);
  // isFadingOut triggers the opacity-0 transition
  const [isFadingOut, setIsFadingOut] = useState(false);
  // canSkip enables skip button and whole-screen tap-to-skip after delay
  const [canSkip, setCanSkip] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const skipTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fadeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fallbackTimerRef = useRef<NodeJS.Timeout | null>(null);

  const completeIntro = useCallback(() => {
    if (isFadingOut) return;

    try {
      sessionStorage.setItem(STORAGE_KEY, "true");
      document.documentElement.classList.add("intro-dismissed");
    } catch {
      // Ignore sessionStorage exceptions
    }

    setIsFadingOut(true);
    play("ready", { volume: 0.4 });

    if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    fadeTimerRef.current = setTimeout(() => {
      setIsOverlayActive(false);
    }, FADE_DURATION_MS);
  }, [isFadingOut]);

  useEffect(() => {
    const isForcedPreview =
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).has("intro");

    if (isForcedPreview) {
      document.documentElement.classList.remove("intro-dismissed");
    }

    // 1. Check if already marked as dismissed by head script or session
    if (!isForcedPreview) {
      if (document.documentElement.classList.contains("intro-dismissed")) {
        setIsOverlayActive(false);
        return;
      }

      try {
        const alreadySeen = sessionStorage.getItem(STORAGE_KEY);
        if (alreadySeen === "true") {
          document.documentElement.classList.add("intro-dismissed");
          setIsOverlayActive(false);
          return;
        }
      } catch { }

      // 2. Check for mobile devices (< 768px)
      const isMobile =
        typeof window !== "undefined" &&
        window.matchMedia("(max-width: 767px)").matches;

      if (isMobile) {
        try {
          sessionStorage.setItem(STORAGE_KEY, "true");
        } catch { }
        document.documentElement.classList.add("intro-dismissed");
        setIsOverlayActive(false);
        return;
      }

      // 3. Check for prefers-reduced-motion
      if (
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        try {
          sessionStorage.setItem(STORAGE_KEY, "true");
        } catch { }
        document.documentElement.classList.add("intro-dismissed");
        setIsOverlayActive(false);
        return;
      }
    }

    // Attempt video playback
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // If autoplay is strictly blocked, let fallback / user tap handle it
      });
    }

    // 3. Unlock skip capability after delay
    skipTimerRef.current = setTimeout(() => {
      setCanSkip(true);
    }, SKIP_DELAY_MS);

    // 4. Safety fallback: if video stalls or takes too long (> 8s), auto-dismiss
    fallbackTimerRef.current = setTimeout(() => {
      completeIntro();
    }, 8000);

    return () => {
      if (skipTimerRef.current) clearTimeout(skipTimerRef.current);
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
      if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
    };
  }, [completeIntro]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (!canSkip) return;
    e.stopPropagation();
    completeIntro();
  };

  const handleSkipButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (canSkip) {
      completeIntro();
    }
  };

  return (
    <>
      {/* Underlying page content */}
      {children}

      {/* Fullscreen Video Preloader Overlay */}
      {isOverlayActive && (
        <div
          id="intro-overlay"
          role="dialog"
          aria-label="Intro Video"
          aria-modal="true"
          onClick={handleOverlayClick}
          className={`fixed inset-0 z-[10000] bg-black flex items-center justify-center overflow-hidden select-none transition-opacity ease-out ${isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          style={{ transitionDuration: `${FADE_DURATION_MS}ms` }}
        >
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            preload="auto"
            onEnded={completeIntro}
            onError={completeIntro}
            className="w-full h-full object-cover pointer-events-none"
          >
            <source src="/intro.webm" type="video/webm" />
            <source src="/intro.mp4" type="video/mp4" />
          </video>

          {/* Subtle Skip Button in bottom-right corner */}
          <button
            type="button"
            onClick={handleSkipButtonClick}
            aria-label="Skip Intro"
            className={`fixed sm:bottom-8 sm:right-8 z-10 px-1 py-1 rounded-full text-xs font-mono tracking-wider uppercase transition-all duration-300 ${canSkip
              ? "opacity-60 hover:opacity-100 cursor-pointer bg-white/10 hover:bg-white/20 text-black backdrop-blur-sm"
              : "opacity-0 pointer-events-none"
              }`}
          >
            {`[Click Anywhere to Skip]`}
          </button>
        </div>
      )}
    </>
  );
}

export default IntroLoader;

