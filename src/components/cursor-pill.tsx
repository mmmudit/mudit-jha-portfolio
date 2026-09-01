"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import styles from "./cursor-pill.module.css";

export const CURSOR_PILL_INTERPOLATION = 0.14;
export const CURSOR_PILL_OFFSET = { x: 18, y: 18 } as const;

const CURSOR_PILL_SAFE_PADDING = 8;
const POSITION_EPSILON = 0.1;
const FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

type Point = {
  x: number;
  y: number;
};

type Bounds = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export type CursorPillShowOptions = {
  anchor: HTMLElement;
  label: string;
  clientX: number;
  clientY: number;
  pointerType: string;
};

export type CursorPillMoveOptions = {
  clientX: number;
  clientY: number;
};

export type CursorPillHandle = {
  show: (options: CursorPillShowOptions) => void;
  move: (options: CursorPillMoveOptions) => void;
  hide: () => void;
  press: () => void;
  release: () => void;
};

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function readBounds(anchor: HTMLElement): Bounds {
  const rect = anchor.getBoundingClientRect();

  return {
    top: rect.top,
    right: rect.right,
    bottom: rect.bottom,
    left: rect.left,
  };
}

export const CursorPill = forwardRef<CursorPillHandle>(function CursorPill(
  _props,
  forwardedRef,
) {
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  const followerRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  const activeRef = useRef(false);
  const anchorRef = useRef<HTMLElement | null>(null);
  const boundsRef = useRef<Bounds | null>(null);
  const boundsDirtyRef = useRef(false);
  const pillSizeRef = useRef({ width: 0, height: 0 });
  const targetRef = useRef<Point>({ x: 0, y: 0 });
  const currentRef = useRef<Point>({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);
  const finePointerRef = useRef(false);
  const reducedMotionRef = useRef(false);

  const cancelFollow = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const writePosition = useCallback((point: Point) => {
    if (!followerRef.current) return;

    followerRef.current.style.transform = `translate3d(${point.x.toFixed(2)}px, ${point.y.toFixed(2)}px, 0)`;
  }, []);

  const setPressed = useCallback((pressed: boolean) => {
    if (!pillRef.current) return;
    pillRef.current.dataset.pressed = pressed ? "true" : "false";
  }, []);

  const hide = useCallback(() => {
    activeRef.current = false;
    anchorRef.current = null;
    boundsRef.current = null;
    boundsDirtyRef.current = false;
    cancelFollow();
    setPressed(false);

    if (pillRef.current) {
      pillRef.current.dataset.visible = "false";
    }
  }, [cancelFollow, setPressed]);

  const measureAnchor = useCallback(() => {
    const anchor = anchorRef.current;
    if (!anchor?.isConnected) {
      hide();
      return null;
    }

    const bounds = readBounds(anchor);
    boundsRef.current = bounds;
    boundsDirtyRef.current = false;
    return bounds;
  }, [hide]);

  const calculateTarget = useCallback(
    (clientX: number, clientY: number, bounds: Bounds): Point => {
      const { width, height } = pillSizeRef.current;
      const minX = bounds.left + CURSOR_PILL_SAFE_PADDING;
      const minY = bounds.top + CURSOR_PILL_SAFE_PADDING;
      const maxX = Math.max(
        minX,
        bounds.right - CURSOR_PILL_SAFE_PADDING - width,
      );
      const maxY = Math.max(
        minY,
        bounds.bottom - CURSOR_PILL_SAFE_PADDING - height,
      );

      return {
        x: clamp(clientX + CURSOR_PILL_OFFSET.x, minX, maxX),
        y: clamp(clientY + CURSOR_PILL_OFFSET.y, minY, maxY),
      };
    },
    [],
  );

  const follow = useCallback(() => {
    rafRef.current = null;
    if (!activeRef.current || reducedMotionRef.current) return;

    const current = currentRef.current;
    const target = targetRef.current;
    const deltaX = target.x - current.x;
    const deltaY = target.y - current.y;

    if (
      Math.abs(deltaX) <= POSITION_EPSILON &&
      Math.abs(deltaY) <= POSITION_EPSILON
    ) {
      currentRef.current = { ...target };
      writePosition(target);
      return;
    }

    const next = {
      x: current.x + deltaX * CURSOR_PILL_INTERPOLATION,
      y: current.y + deltaY * CURSOR_PILL_INTERPOLATION,
    };

    currentRef.current = next;
    writePosition(next);
    rafRef.current = requestAnimationFrame(follow);
  }, [writePosition]);

  const startFollow = useCallback(() => {
    if (
      rafRef.current !== null ||
      !activeRef.current ||
      reducedMotionRef.current
    ) {
      return;
    }

    const current = currentRef.current;
    const target = targetRef.current;
    if (
      Math.abs(target.x - current.x) <= POSITION_EPSILON &&
      Math.abs(target.y - current.y) <= POSITION_EPSILON
    ) {
      return;
    }

    rafRef.current = requestAnimationFrame(follow);
  }, [follow]);

  const move = useCallback(
    ({ clientX, clientY }: CursorPillMoveOptions) => {
      if (!activeRef.current || !finePointerRef.current) return;

      const bounds = boundsDirtyRef.current
        ? measureAnchor()
        : boundsRef.current;
      if (!bounds || !activeRef.current) return;

      const target = calculateTarget(clientX, clientY, bounds);
      targetRef.current = target;

      if (reducedMotionRef.current) {
        cancelFollow();
        currentRef.current = { ...target };
        writePosition(target);
        return;
      }

      startFollow();
    },
    [calculateTarget, cancelFollow, measureAnchor, startFollow, writePosition],
  );

  const show = useCallback(
    ({
      anchor,
      label,
      clientX,
      clientY,
      pointerType,
    }: CursorPillShowOptions) => {
      if (
        pointerType !== "mouse" ||
        !finePointerRef.current ||
        !anchor.isConnected ||
        !followerRef.current ||
        !pillRef.current ||
        !labelRef.current
      ) {
        hide();
        return;
      }

      cancelFollow();
      activeRef.current = true;
      anchorRef.current = anchor;
      boundsDirtyRef.current = false;
      labelRef.current.textContent = label;
      pillRef.current.dataset.visible = "false";
      pillRef.current.dataset.entering = "true";

      // Force reflow so initial collapsed state is registered
      void pillRef.current.offsetWidth;

      pillSizeRef.current = {
        width: pillRef.current.offsetWidth,
        height: pillRef.current.offsetHeight,
      };

      const bounds = readBounds(anchor);
      boundsRef.current = bounds;
      const target = calculateTarget(clientX, clientY, bounds);
      targetRef.current = target;
      currentRef.current = { ...target };
      writePosition(target);
      setPressed(false);

      requestAnimationFrame(() => {
        if (!pillRef.current || !activeRef.current) return;
        pillRef.current.dataset.entering = "false";
        pillRef.current.dataset.visible = "true";
      });
    },
    [calculateTarget, cancelFollow, hide, setPressed, writePosition],
  );

  const press = useCallback(() => {
    if (!activeRef.current || !finePointerRef.current) return;
    setPressed(true);
  }, [setPressed]);

  const release = useCallback(() => {
    setPressed(false);
  }, [setPressed]);

  useImperativeHandle(
    forwardedRef,
    () => ({
      show,
      move,
      hide,
      press,
      release,
    }),
    [hide, move, press, release, show],
  );

  useEffect(() => {
    setPortalTarget(document.body);
  }, []);

  useEffect(() => {
    const finePointerQuery = window.matchMedia(FINE_POINTER_QUERY);
    const reducedMotionQuery = window.matchMedia(REDUCED_MOTION_QUERY);

    const syncFinePointer = () => {
      finePointerRef.current = finePointerQuery.matches;
      if (!finePointerQuery.matches) hide();
    };

    const syncReducedMotion = () => {
      reducedMotionRef.current = reducedMotionQuery.matches;
      if (!activeRef.current || !reducedMotionQuery.matches) return;

      cancelFollow();
      currentRef.current = { ...targetRef.current };
      writePosition(targetRef.current);
    };

    const markBoundsDirty = () => {
      if (!activeRef.current) return;
      boundsDirtyRef.current = true;
      cancelFollow();
    };

    syncFinePointer();
    syncReducedMotion();

    finePointerQuery.addEventListener("change", syncFinePointer);
    reducedMotionQuery.addEventListener("change", syncReducedMotion);
    window.addEventListener("resize", markBoundsDirty, { passive: true });
    window.addEventListener("scroll", markBoundsDirty, {
      capture: true,
      passive: true,
    });

    return () => {
      activeRef.current = false;
      cancelFollow();
      finePointerQuery.removeEventListener("change", syncFinePointer);
      reducedMotionQuery.removeEventListener("change", syncReducedMotion);
      window.removeEventListener("resize", markBoundsDirty);
      window.removeEventListener("scroll", markBoundsDirty, true);
    };
  }, [cancelFollow, hide, writePosition]);

  if (!portalTarget) return null;

  return createPortal(
    <div
      ref={followerRef}
      aria-hidden="true"
      className={styles.follower}
    >
      <div
        ref={pillRef}
        className={styles.pill}
        data-visible="false"
        data-entering="false"
        data-pressed="false"
      >
        <span ref={labelRef} className={styles.label} />
        <svg
          className={styles.icon}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="7" y1="17" x2="17" y2="7" />
          <polyline points="7 7 17 7 17 17" />
        </svg>
      </div>
    </div>,
    portalTarget,
  );
});

CursorPill.displayName = "CursorPill";
