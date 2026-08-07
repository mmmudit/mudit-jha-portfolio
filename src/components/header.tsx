"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

export function Header() {
  const [hover, setHover] = useState(false);
  const reduce = useReducedMotion();

  const minW = 54;
  const expandedW = 125;
  const shiftX = (expandedW - minW) / 2;

  return (
    <header className="flex items-center justify-between">
      <div className="size-[100px] shrink-0 overflow-hidden rounded-[60px] bg-zinc-300">
        <Image
          src="/assets/avatar.png"
          alt="Mudit Jha"
          width={100}
          height={100}
          className="size-full object-cover"
          priority
        />
      </div>

      <motion.a
        href="mailto:hello@muditjha.com"
        aria-label="Email Mudit Jha"
        onHoverStart={() => setHover(true)}
        onHoverEnd={() => setHover(false)}
        initial={false}
        animate={
          reduce
            ? {}
            : {
                width: hover ? expandedW : minW,
                backgroundColor: hover ? "#e6e6e6" : "#fbfaf5",
              }
        }
        transition={reduce ? {} : { type: "spring", stiffness: 450, damping: 40 }}
        className="pressable relative inline-flex shrink-0 items-center overflow-hidden rounded-full border-2 border-zinc-300"
        style={{ width: minW }}
      >
        <div className="relative h-[54px] w-full">
          {/* Centered icon when idle; moves right and rotates on hover */}
          <div className="absolute inset-0">
            {/* Left-aligned text (hidden by default) */}
            <motion.div
              className="absolute inset-0 flex items-center justify-start pl-3"
              initial={false}
                animate={reduce ? {} : { opacity: hover ? 1 : 0 }}
                transition={reduce ? {} : { duration: 0.15 }}
            >
              <motion.span
                className="whitespace-nowrap text-sm font-medium text-zinc-800"
                initial={false}
                animate={reduce ? {} : { x: hover ? 0 : 6 }}
                transition={reduce ? {} : { duration: 0.15 }}
              >
                let's chat
              </motion.span>
            </motion.div>

            {/* Icon fixed at right; rotates and darkens on hover but does not move */}
            <div className="absolute inset-0 flex items-center justify-end pr-3 pointer-events-none">
              <motion.span
                initial={false}
                animate={
                  reduce
                    ? {}
                    : {
                        color: hover ? "#374151" : "#9CA3AF",
                        rotate: hover ? 5 : 0,
                      }
                }
                transition={reduce ? {} : { duration: 0.15 }}
                className="flex items-center justify-center w-[30px] h-[30px] text-zinc-400"
              >
                <svg
                  preserveAspectRatio="none"
                  overflow="visible"
                  style={{ display: "block" }}
                  width="22.8333"
                  height="18.6667"
                  viewBox="0 0 22.8333 18.6667"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21.8333 3.08333C21.8333 1.9375 20.8958 1 19.75 1H3.08333C1.9375 1 1 1.9375 1 3.08333M21.8333 3.08333V15.5833C21.8333 16.7292 20.8958 17.6667 19.75 17.6667H3.08333C1.9375 17.6667 1 16.7292 1 15.5833V3.08333M21.8333 3.08333L11.4167 10.375L1 3.08333"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.span>
            </div>
          </div>
        </div>
      </motion.a>
    </header>
  );
}
