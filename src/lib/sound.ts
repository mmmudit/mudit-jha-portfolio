"use client";

import {
  play as cuelumePlay,
  setVolume as cuelumeSetVolume,
  setEnabled as cuelumeSetEnabled,
  bind as cuelumeBind,
  sounds,
  type SoundName,
} from "cuelume";

let isZeroGMuted = false;

export function setZeroGMuted(muted: boolean) {
  isZeroGMuted = muted;
  try {
    cuelumeSetEnabled(!muted);
  } catch (err) {
    // Fail silently
  }
}

export function isZeroGMutedState() {
  return isZeroGMuted;
}

/**
 * Safe wrapper around cuelume play for SSR & browser environments.
 * Strictly silences all audio during zero-gravity mode.
 */
export function playSound(
  name?: SoundName,
  options?: { volume?: number }
) {
  if (typeof window === "undefined" || isZeroGMuted) return;
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
