"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { Divider } from "./divider";
import { LiveClock } from "./live-clock";

const socialLinks = [
  { label: "Instagram ↗", href: "https://www.instagram.com/mmmudit/" },
  { label: "LinkedIn ↗", href: "https://www.linkedin.com/in/muditj3/" },
  { label: "Github ↗", href: "https://github.com/mmmudit" },
  { label: "X ↗", href: "https://x.com/MuditJ1" },
  { label: "Substack ↗", href: "https://substack.com/@mmmudit" },
  { label: "Email ↗", href: "mailto:hello@muditjha.me" },
] as const;

export function Footer() {
  const [copied, setCopied] = useState(false);

  const handleEmailClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("mailto:")) {
      navigator.clipboard?.writeText("hello@muditjha.me");
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <footer className="relative pt-12">
      <div className="flex flex-col gap-9">
        <div className="flex flex-col gap-28">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex max-w-[450px] flex-col gap-4">
              <p className="font-hand text-[clamp(4rem,12vw,8rem)] leading-none tracking-[-3px] text-rust-grey">
                mudit
              </p>
              <LiveClock />
              <p className="px-7 font-hand text-[16px] leading-4 text-rust-grey">
                &ldquo;cool quotes that tickle my mind&rdquo;
              </p>
            </div>
            <nav className="relative flex flex-col gap-7 font-sans text-[clamp(2rem,5vw,3rem)] font-semibold leading-[27px] tracking-[-1px] text-willow-grey">
              <p className="absolute left-0 -top-14 hidden font-hand text-[48px] tracking-[-1px] text-willow-grey lg:block">
                say hi ↓
              </p>
              {socialLinks.map((link) => (
                <div key={link.label} className="relative inline-flex items-center gap-2">
                  <a
                    href={link.href}
                    onClick={(e) => handleEmailClick(e, link.href)}
                    target={
                      link.href.startsWith("mailto:") ? undefined : "_blank"
                    }
                    rel={
                      link.href.startsWith("mailto:")
                        ? undefined
                        : "noopener noreferrer"
                    }
                    className="pressable transition-opacity hover:opacity-70"
                  >
                    {link.label}
                  </a>

                  {link.label.startsWith("Email") && (
                    <AnimatePresence>
                      {copied && (
                        <motion.span
                          initial={{ opacity: 0, scale: 0.9, x: -4 }}
                          animate={{ opacity: 1, scale: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.9, x: -4 }}
                          transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-mono font-medium text-emerald-700 bg-emerald-100 rounded-full border border-emerald-300"
                        >
                          <Check className="size-3 text-emerald-600" />
                          <span>Copied</span>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </nav>
          </div>

          <Divider />
        </div>

        <div className="mx-auto flex w-[220px] flex-col items-center text-center">
          <a
            href="https://ethangwang.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 font-display text-[18px] font-medium tracking-[-0.1px] text-button-secondary transition-opacity hover:opacity-70"
          >
            © 2026 muditjha
          </a>
          <p className="p-2 text-[18px] font-light tracking-[-1px] text-button-secondary">
            CHANGELOG: 09-03-2003
          </p>
        </div>
      </div>
    </footer>
  );
}
