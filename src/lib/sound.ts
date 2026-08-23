"use client";

import {
  play as cuelumePlay,
  setVolume as cuelumeSetVolume,
  setEnabled as cuelumeSetEnabled,
  bind as cuelumeBind,
  sounds,
  type SoundName,
} from "cuelume";

/**
 * Safe wrapper around cuelume play for SSR & browser environments.
 */
export function playSound(
  name?: SoundName,
  options?: { volume?: number }
) {
  if (typeof window === "undefined") return;
  try {
    cuelumePlay(name, options);
  } catch (err) {
    // Fail silently
  }
}

export const play = playSound;
export const setVolume = cuelumeSetVolume;
export const setEnabled = cuelumeSetEnabled;
export const bindSounds = cuelumeBind;
export { sounds, type SoundName };
