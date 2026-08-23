"use client";

import { useEffect } from "react";
import { bind, setVolume, setEnabled } from "cuelume";

/**
 * SoundProvider wires up cuelume sound interaction listeners across the whole application.
 * Any element with `data-cuelume-hover`, `data-cuelume-press`, `data-cuelume-release`, or `data-cuelume-toggle`
 * will automatically play synthesized interface sounds.
 */
export function SoundProvider() {
  useEffect(() => {
    // Check reduced-motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updateSoundConfig = () => {
      if (mediaQuery.matches) {
        // Subdued volume for users preferring reduced sensory motion
        setVolume(0.3);
      } else {
        // Balanced, pleasant default loudness
        setVolume(0.5);
      }
    };

    updateSoundConfig();
    mediaQuery.addEventListener("change", updateSoundConfig);

    // Bind declarative interaction sound listeners to document
    bind();

    return () => {
      mediaQuery.removeEventListener("change", updateSoundConfig);
    };
  }, []);

  return null;
}

export default SoundProvider;
