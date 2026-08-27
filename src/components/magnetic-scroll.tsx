"use client";

import { useEffect } from "react";

/**
 * Ultra-gentle magnetic alignment & card hover auto-scroll:
 * 1. Subtly glides the nearest section to center when the user finishes scrolling and idles.
 * 2. Auto-scrolls smoothly to the section when the user hovers over any card within it.
 * Uses a smooth quintic decelerating ease curve that never fights active user interaction.
 */
export function MagneticScroll({
  selector = "[data-magnetic-section]",
  cardSelector = "[data-magnetic-card], [data-magnetic-section] .group, [data-magnetic-section] article, [data-magnetic-section] [data-card]",
  offsetPx = 0,
  idleDelayMs = 380,
  hoverDelayMs = 180,
  maxSnapDistanceRatio = 0.3,
  enableHoverAutoScroll = true,
}: {
  selector?: string;
  cardSelector?: string;
  offsetPx?: number;
  idleDelayMs?: number;
  hoverDelayMs?: number;
  maxSnapDistanceRatio?: number;
  enableHoverAutoScroll?: boolean;
}) {
  useEffect(() => {
    // Respect user reduced-motion preferences
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    let isUserActive = false;
    let idleTimer: NodeJS.Timeout | null = null;
    let hoverTimer: NodeJS.Timeout | null = null;
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
      if (hoverTimer) clearTimeout(hoverTimer);
    };

    const onUserInteractionEnd = () => {
      isUserActive = false;
      scheduleGlide();
    };

    const computeTargetScrollForSection = (section: HTMLElement): number => {
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
      return Math.max(0, Math.min(maxScroll, targetScrollY));
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

      const targetScrollY = computeTargetScrollForSection(section);
      const viewportHeight = window.innerHeight;
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

    // Auto-scroll on card hover
    const onPointerOver = (e: MouseEvent) => {
      if (!enableHoverAutoScroll || isUserActive || animId !== null) return;

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const card = target.closest<HTMLElement>(cardSelector);
      if (!card) return;

      const section = card.closest<HTMLElement>(selector);
      if (!section) return;

      // Don't trigger if already aligned with this section
      const targetScrollY = computeTargetScrollForSection(section);
      const distance = Math.abs(targetScrollY - window.scrollY);
      if (distance <= 24) return;

      if (hoverTimer) clearTimeout(hoverTimer);

      hoverTimer = setTimeout(() => {
        if (isUserActive || animId !== null) return;
        const currentTargetScroll = computeTargetScrollForSection(section);
        const currentDistance = Math.abs(currentTargetScroll - window.scrollY);
        if (currentDistance > 24) {
          smoothGlideTo(currentTargetScroll);
        }
      }, hoverDelayMs);
    };

    const onPointerOut = (e: MouseEvent) => {
      const relatedTarget = e.relatedTarget as HTMLElement | null;
      if (!relatedTarget || !relatedTarget.closest(cardSelector)) {
        if (hoverTimer) {
          clearTimeout(hoverTimer);
          hoverTimer = null;
        }
      }
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

    if (enableHoverAutoScroll) {
      document.addEventListener("mouseover", onPointerOver, { passive: true });
      document.addEventListener("mouseout", onPointerOut, { passive: true });
    }

    return () => {
      stopGlide();
      if (idleTimer) clearTimeout(idleTimer);
      if (hoverTimer) clearTimeout(hoverTimer);
      if (wheelDebounce) clearTimeout(wheelDebounce);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onUserInteractionStart);
      window.removeEventListener("touchend", onUserInteractionEnd);
      window.removeEventListener("keydown", onUserInteractionStart);
      window.removeEventListener("keyup", onUserInteractionEnd);
      window.removeEventListener("scroll", onScroll);
      if (enableHoverAutoScroll) {
        document.removeEventListener("mouseover", onPointerOver);
        document.removeEventListener("mouseout", onPointerOut);
      }
    };
  }, [
    selector,
    cardSelector,
    offsetPx,
    idleDelayMs,
    hoverDelayMs,
    maxSnapDistanceRatio,
    enableHoverAutoScroll,
  ]);

  return null;
}
