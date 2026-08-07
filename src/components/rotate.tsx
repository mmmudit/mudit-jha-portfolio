"use client";

import { motion } from "framer-motion";

export default function Rotate() {
  return (
    <motion.div
      style={box}
      animate={{ rotate: [0, 360] }}
      transition={{ duration: 1, repeat: Infinity }}
    />
  );
}

/**
 * ==============   Styles   ================
 */

const box = {
  width: 100,
  height: 100,
  backgroundColor: "var(--hue-1)",
  borderRadius: 5,
} as const;
