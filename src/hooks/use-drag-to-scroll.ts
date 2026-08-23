"use client";

import { useRef, useEffect, useCallback, useState } from "react";

export function useDragToScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollBoundaries = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const tolerance = 4; // px buffer
    const maxScrollLeft = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > tolerance);
    setCanScrollRight(maxScrollLeft > tolerance && el.scrollLeft < maxScrollLeft - tolerance);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    checkScrollBoundaries();

    // ResizeObserver to detect layout and content size changes
    const resizeObserver = new ResizeObserver(() => {
      checkScrollBoundaries();
    });
    resizeObserver.observe(el);

    const onScroll = () => {
      checkScrollBoundaries();
    };
    el.addEventListener("scroll", onScroll, { passive: true });

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    let velX = 0;
    let lastX = 0;
    let momentumID: number;

    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      isDown = true;
      isDraggingRef.current = false;
      startX = e.pageX - el.offsetLeft;
      lastX = e.pageX;
      scrollLeft = el.scrollLeft;
      velX = 0;
      cancelAnimationFrame(momentumID);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();

      const x = e.pageX - el.offsetLeft;
      const walk = x - startX;

      if (Math.abs(walk) > 4) {
        isDraggingRef.current = true;
      }

      velX = e.pageX - lastX;
      lastX = e.pageX;

      el.scrollLeft = scrollLeft - walk;
      checkScrollBoundaries();
    };

    const applyMomentum = () => {
      if (Math.abs(velX) > 0.5) {
        el.scrollLeft -= velX;
        velX *= 0.94; // friction decay
        checkScrollBoundaries();
        momentumID = requestAnimationFrame(applyMomentum);
      }
    };

    const onMouseUp = () => {
      if (!isDown) return;
      isDown = false;
      applyMomentum();
      setTimeout(() => {
        isDraggingRef.current = false;
      }, 50);
    };

    const onMouseLeave = () => {
      if (!isDown) return;
      isDown = false;
      applyMomentum();
      setTimeout(() => {
        isDraggingRef.current = false;
      }, 50);
    };

    el.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    el.addEventListener("mouseleave", onMouseLeave);

    return () => {
      resizeObserver.disconnect();
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      el.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(momentumID);
    };
  }, [checkScrollBoundaries]);

  const handleLinkClick = useCallback((e: React.MouseEvent) => {
    if (isDraggingRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, []);

  return { containerRef, handleLinkClick, canScrollLeft, canScrollRight, checkScrollBoundaries };
}
