"use client";

import { motion } from "framer-motion";

export default function Rotate() {
  return (
    <motion.div
      style={box}
      animate={{ rotate: [0, 360] }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
    />
  );
}

/**
 * ==============   Styles   ================
 */

const box = {
  width: 100,
  height: 100,
  backgroundColor: "var(--willow-grey)",
  borderRadius: 5,
} as const;
