"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { HomeLoader } from "./home-loader";

const SESSION_KEY = "portfolio-loader-seen";

interface Props {
  children: React.ReactNode;
}

/**
 * Session-aware gate that shows the Gray-Scott loader once per browser session,
 * then renders children underneath it (loader is fixed-positioned overlay).
 */
export function HomeLoaderWrapper({ children }: Props) {
  const [showLoader, setShowLoader] = useState<boolean | null>(null);

  useEffect(() => {
    const seen = sessionStorage.getItem(SESSION_KEY);
    setShowLoader(!seen);
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem(SESSION_KEY, "1");
    setShowLoader(false);
  };

  return (
    <>
      {/* Page content renders immediately (SEO-safe, no layout shift) */}
      {children}

      {/* Loader overlay — only mounted when active */}
      {showLoader !== null && (
        <AnimatePresence>
          {showLoader && (
            <HomeLoader key="loader" onDismiss={handleDismiss} />
          )}
        </AnimatePresence>
      )}
    </>
  );
}
