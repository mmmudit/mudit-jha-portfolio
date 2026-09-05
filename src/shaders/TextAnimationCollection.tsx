"use client";

import React from "react";
import "./threeui.css";
import {
  ParticleWordmark,
  AudioWordmark,
  ThreeUIIntro,
  GalleryHeading,
  type NeuformIsolatedEffectProps,
} from "./neuform-isolated/NeuformIsolatedEffects";

export type TextAnimationCollectionProps = NeuformIsolatedEffectProps & {
  variant?: "particle-wordmark" | "audio-wordmark" | "threeui-intro" | "gallery-heading" | string;
};

export function TextAnimationCollection({
  variant = "particle-wordmark",
  ...props
}: TextAnimationCollectionProps) {
  switch (variant) {
    case "audio-wordmark":
      return <AudioWordmark {...props} />;
    case "threeui-intro":
      return <ThreeUIIntro {...props} />;
    case "gallery-heading":
      return <GalleryHeading {...props} />;
    case "particle-wordmark":
    default:
      return <ParticleWordmark {...props} />;
  }
}
