"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useZeroGravity } from "@/context/zero-gravity-context";

export interface IslandNotificationAction {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
}

export interface IslandNotification {
  id: string;
  type?: "zero-g" | "default" | "alert" | "info";
  title: string;
  subtitle?: string;
  badge?: string;
  leading?: React.ReactNode;
  action?: IslandNotificationAction;
  duration?: number;
  onDismiss?: () => void;
}

interface NotificationContextType {
  activeNotification: IslandNotification | null;
  triggerNotification: (notification: IslandNotification) => void;
  resolveNotification: (id?: string) => void;
}

const NotificationContext = createContext<NotificationContextType>({
  activeNotification: null,
  triggerNotification: () => { },
  resolveNotification: () => { },
});

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [customNotification, setCustomNotification] =
    useState<IslandNotification | null>(null);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  const { isZeroGravity, isRestoring, restoreGravity, tapCount } = useZeroGravity();

  const isZeroGActive = isZeroGravity && !isRestoring;

  const triggerNotification = useCallback((notification: IslandNotification) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setCustomNotification(notification);
    if (notification.duration && notification.duration > 0) {
      timerRef.current = setTimeout(() => {
        setCustomNotification((current) =>
          current?.id === notification.id ? null : current
        );
        timerRef.current = null;
      }, notification.duration);
    }
  }, []);

  const resolveNotification = useCallback((id?: string) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setCustomNotification((current) => {
      if (!id || current?.id === id) {
        current?.onDismiss?.();
        return null;
      }
      return current;
    });
  }, []);

  // Compute active notification: Zero-G takes priority, pre-Zero-G warning on repeated globe taps, then custom
  const activeNotification: IslandNotification | null = React.useMemo(() => {
    if (isZeroGActive) {
      return {
        id: "zero-g",
        type: "zero-g",
        badge: "ORBITAL ZERO-G",
        title: "Zero-G Activated",
        subtitle: "[ERR1] -- GRAVITY FAILURE --",
        action: {
          label: "restore",
          onClick: restoreGravity,
        },
        leading: (
          <span
            className="relative inline-flex items-center justify-center text-[15px] sm:text-[16px] leading-none shrink-0 ml-0.5 filter drop-shadow-[0_0_10px_rgba(140,180,255,0.95)] select-none animate-pulse"
            aria-hidden="true"
          >
            🌎
          </span>
        ),
      };
    }

    // Pre-Zero-G warning when user keeps tapping the globe
    if (tapCount >= 3) {
      return {
        id: "globe-warning",
        type: "alert",
        badge: "YO CHILL",
        title: "yo chill",
        subtitle:
          tapCount >= 4
            ? "[[[ I'M SERIOUS... STOP IT ]]]"
            : "[ don't do anything funny... ]",
        leading: (
          <span
            className="relative inline-flex items-center justify-center text-[15px] sm:text-[16px] leading-none shrink-0 ml-0.5 filter drop-shadow-[0_0_8px_rgba(251,191,36,0.95)] select-none animate-pulse"
            aria-hidden="true"
          >
            ⚠️
          </span>
        ),
      };
    }

    return customNotification;
  }, [isZeroGActive, restoreGravity, tapCount, customNotification]);

  return (
    <NotificationContext.Provider
      value={{
        activeNotification,
        triggerNotification,
        resolveNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  return useContext(NotificationContext);
}
