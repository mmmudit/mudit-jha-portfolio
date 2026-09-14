"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { play } from "@/lib/sound";

interface SoftReloadContextType {
  isSoftReloading: boolean;
  reloadKey: number;
  triggerSoftReload: (durationMs?: number) => void;
}

const SoftReloadContext = createContext<SoftReloadContextType>({
  isSoftReloading: false,
  reloadKey: 0,
  triggerSoftReload: () => {},
});

export function SoftReloadProvider({ children }: { children: React.ReactNode }) {
  const [isSoftReloading, setIsSoftReloading] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const router = useRouter();

  const triggerSoftReload = useCallback(
    (durationMs = 1600) => {
      setIsSoftReloading(true);
      play("droplet", { volume: 0.5 });

      // Soft revalidate Server Components and refresh state
      try {
        router.refresh();
      } catch {
        // Safe fallback in case router refresh is throttled
      }

      setTimeout(() => {
        setIsSoftReloading(false);
        setReloadKey((prev) => prev + 1);
        play("success", { volume: 0.45 });
      }, durationMs);
    },
    [router]
  );

  return (
    <SoftReloadContext.Provider
      value={{
        isSoftReloading,
        reloadKey,
        triggerSoftReload,
      }}
    >
      {children}
    </SoftReloadContext.Provider>
  );
}

export function useSoftReload() {
  return useContext(SoftReloadContext);
}
