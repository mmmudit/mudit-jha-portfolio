"use client";

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";
import { play } from "@/lib/sound";

interface ZeroGravityContextType {
  isZeroGravity: boolean;
  tapCount: number;
  isRestoring: boolean;
  registerGlobeTap: () => void;
  restoreGravity: () => void;
}

const ZeroGravityContext = createContext<ZeroGravityContextType>({
  isZeroGravity: false,
  tapCount: 0,
  isRestoring: false,
  registerGlobeTap: () => {},
  restoreGravity: () => {},
});

const TAP_THRESHOLD = 5;
const TAP_TIMEOUT_MS = 1800;

export function ZeroGravityProvider({ children }: { children: React.ReactNode }) {
  const [isZeroGravity, setIsZeroGravity] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [isRestoring, setIsRestoring] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastTapRef = useRef<number>(0);

  const resetTaps = useCallback(() => {
    setTapCount(0);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const registerGlobeTap = useCallback(() => {
    if (isZeroGravity || isRestoring) return;

    const now = Date.now();
    if (now - lastTapRef.current < 90) return;
    lastTapRef.current = now;

    setTapCount((prev) => {
      const next = prev + 1;

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        setTapCount(0);
      }, TAP_TIMEOUT_MS);

      if (next === 3) {
        play("bloom", { volume: 0.35 });
      } else if (next === 4) {
        play("sparkle", { volume: 0.45 });
      } else if (next >= TAP_THRESHOLD) {
        if (timerRef.current) clearTimeout(timerRef.current);
        play("arrival", { volume: 0.6 });
        setIsZeroGravity(true);
        return 0;
      } else {
        play("pulse", { volume: 0.25 });
      }

      return next;
    });
  }, [isZeroGravity, isRestoring]);

  const restoreGravity = useCallback(() => {
    if (!isZeroGravity || isRestoring) return;

    setIsRestoring(true);
    play("success", { volume: 0.55 });

    // Allow the pull-down gravity spring/transition to settle before exiting zero-g mode
    setTimeout(() => {
      setIsZeroGravity(false);
      setIsRestoring(false);
      resetTaps();
    }, 700);
  }, [isZeroGravity, isRestoring, resetTaps]);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.dataset.zeroGravity = isZeroGravity && !isRestoring ? "true" : "false";
    }
  }, [isZeroGravity, isRestoring]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (typeof document !== "undefined") {
        delete document.body.dataset.zeroGravity;
      }
    };
  }, []);

  return (
    <ZeroGravityContext.Provider
      value={{
        isZeroGravity,
        tapCount,
        isRestoring,
        registerGlobeTap,
        restoreGravity,
      }}
    >
      {children}
    </ZeroGravityContext.Provider>
  );
}

export function useZeroGravity() {
  return useContext(ZeroGravityContext);
}
