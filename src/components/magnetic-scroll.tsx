"use client";

import { useEffect } from "react";

/**
 * Ultra-gentle magnetic alignment:
 * Subtly glides the nearest section to center only when the user has settled
 * close to it, using a smooth decelerating ease curve that never fights the user.
 */
export function MagneticScroll({
  selector = "[data-magnetic-section]",
  offsetPx = 0,
  idleDelayMs = 380,
  maxSnapDistanceRatio = 0.3,
}: {
  selector?: string;
  offsetPx?: number;
  idleDelayMs?: number;
  maxSnapDistanceRatio?: number;
}) {
  useEffect(() => {
    // Respect user reduced-motion preferences
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    let isUserActive = false;
    let idleTimer: NodeJS.Timeout | null = null;
    let animId: number | null = null;

    const stopGlide = () => {
      if (animId !== null) {
        cancelAnimationFrame(animId);
        animId = null;
      }
    };

    const onUserInteractionStart = () => {
      isUserActive = true;
      stopGlide();
      if (idleTimer) clearTimeout(idleTimer);
    };

    const onUserInteractionEnd = () => {
      isUserActive = false;
      scheduleGlide();
    };

    const findClosestSection = (): HTMLElement | null => {
      const sections = Array.from(
        document.querySelectorAll<HTMLElement>(selector)
      );
      if (sections.length === 0) return null;

      const viewportCenter = window.scrollY + window.innerHeight / 2;
      let closestSection: HTMLElement | null = null;
      let minDistance = Infinity;

      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        const sectionTop = window.scrollY + rect.top;
        const sectionCenter = sectionTop + rect.height / 2;
        const dist = Math.abs(viewportCenter - sectionCenter);

        if (dist < minDistance) {
          minDistance = dist;
          closestSection = section;
        }
      }

      return closestSection;
    };

    const smoothGlideTo = (targetY: number) => {
      stopGlide();

      const startY = window.scrollY;
      const distance = targetY - startY;
      if (Math.abs(distance) < 2) return;

      const duration = 650; // Smooth, gentle 650ms glide
      const startTime = performance.now();

      const step = (currentTime: number) => {
        if (isUserActive) {
          stopGlide();
          return;
        }

        const elapsed = currentTime - startTime;
        const progress = Math.min(1, elapsed / duration);

        // Quintic ease-out for a very soft, cushioned landing
        const ease = 1 - Math.pow(1 - progress, 5);

        window.scrollTo(0, startY + distance * ease);

        if (progress < 1) {
          animId = requestAnimationFrame(step);
        } else {
          animId = null;
        }
      };

      animId = requestAnimationFrame(step);
    };

    const checkAndGlide = () => {
      if (isUserActive || animId !== null) return;

      const section = findClosestSection();
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const sectionTop = window.scrollY + rect.top;
      const sectionHeight = rect.height;
      const viewportHeight = window.innerHeight;

      let targetScrollY: number;
      if (sectionHeight > viewportHeight * 0.85) {
        targetScrollY = sectionTop - 64 + offsetPx;
      } else {
        targetScrollY = sectionTop + sectionHeight / 2 - viewportHeight / 2 + offsetPx;
      }

      const maxScroll = document.documentElement.scrollHeight - viewportHeight;
      targetScrollY = Math.max(0, Math.min(maxScroll, targetScrollY));

      const currentScrollY = window.scrollY;
      const distance = Math.abs(targetScrollY - currentScrollY);

      // Only gently nudge if user already landed relatively close (between 32px and maxSnapDistanceRatio)
      const maxAllowedDistance = viewportHeight * maxSnapDistanceRatio;
      if (distance >= 32 && distance <= maxAllowedDistance) {
        smoothGlideTo(targetScrollY);
      }
    };

    const scheduleGlide = () => {
      if (idleTimer) clearTimeout(idleTimer);
      if (isUserActive || animId !== null) return;

      idleTimer = setTimeout(() => {
        checkAndGlide();
      }, idleDelayMs);
    };

    const onScroll = () => {
      if (animId !== null) return;
      scheduleGlide();
    };

    let wheelDebounce: NodeJS.Timeout | null = null;
    const onWheel = () => {
      onUserInteractionStart();
      if (wheelDebounce) clearTimeout(wheelDebounce);
      wheelDebounce = setTimeout(() => {
        onUserInteractionEnd();
      }, 160);
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onUserInteractionStart, { passive: true });
    window.addEventListener("touchend", onUserInteractionEnd, { passive: true });
    window.addEventListener("keydown", onUserInteractionStart, { passive: true });
    window.addEventListener("keyup", onUserInteractionEnd, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      stopGlide();
      if (idleTimer) clearTimeout(idleTimer);
      if (wheelDebounce) clearTimeout(wheelDebounce);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onUserInteractionStart);
      window.removeEventListener("touchend", onUserInteractionEnd);
      window.removeEventListener("keydown", onUserInteractionStart);
      window.removeEventListener("keyup", onUserInteractionEnd);
      window.removeEventListener("scroll", onScroll);
    };
  }, [selector, offsetPx, idleDelayMs, maxSnapDistanceRatio]);

  return null;
}
