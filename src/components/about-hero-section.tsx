"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { TactilePhotoCard } from "./TactilePhotoCard";
import { SmartLinkPreview } from "./smart-link-preview";
import { EmailPreviewBadge } from "./email-preview-badge";
import {
  MapPin,
  GraduationCap,
  Mail,
  Calendar,
  FileDown,
  ArrowUp,
  Check,
  Film,
} from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

export function AboutHeroSection() {
  const reduce = useReducedMotion();
  const [message, setMessage] = useState("");
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const [isHeadingNear, setIsHeadingNear] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const PROXIMITY_DISTANCE = 90; // Configurable px amount to reveal phonetic text

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!headingRef.current) return;
      const rect = headingRef.current.getBoundingClientRect();
      const dx = Math.max(rect.left - e.clientX, 0, e.clientX - rect.right);
      const dy = Math.max(rect.top - e.clientY, 0, e.clientY - rect.bottom);
      const dist = Math.sqrt(dx * dx + dy * dy);
      setIsHeadingNear(dist <= PROXIMITY_DISTANCE);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 8 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: reduce ? 0.1 : 0.25,
      delay: reduce ? 0 : delay,
      ease,
    },
  });

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard?.writeText("hello@muditjha.me");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSending) return;
    setIsSending(true);
    setIsSent(true);
    const subject = encodeURIComponent("Portfolio Message from Mudit's About Page");
    const body = encodeURIComponent(message);
    window.location.href = `mailto:hello@muditjha.me?subject=${subject}&body=${body}`;
    setTimeout(() => {
      setIsSending(false);
      setIsSent(false);
      setMessage("");
    }, 1800);
  };

  return (
    <section className="relative w-full pt-28 sm:pt-36">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Bio, Details & Quick Contact */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Header Row: Name + Proximity/Touch-triggered Pronunciation */}
          <motion.div
            {...fadeUp(0)}
            className="flex flex-wrap items-baseline gap-3.5 sm:gap-4"
          >
            <h1
              data-cuelume-hover="ready"
              data-cuelume-press
              data-cuelume-release
              ref={headingRef}
              onClick={() => setIsHeadingNear((prev) => !prev)}
              aria-label="Mudit Jha (pronounced MOO-dit JHAH)"
              className="font-display text-[38px] sm:text-[48px] font-semibold tracking-[-0.5px] text-zinc-900 leading-none cursor-pointer sm:cursor-default text-balance select-none"
            >
              mudit jha
            </h1>
            <motion.span
              animate={
                reduce
                  ? { opacity: isHeadingNear ? 1 : 0 }
                  : {
                      opacity: isHeadingNear ? 1 : 0,
                      transform: isHeadingNear ? "translateX(0px)" : "translateX(-6px)",
                      filter: isHeadingNear ? "blur(0px)" : "blur(2px)",
                    }
              }
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="font-sans text-[15px] sm:text-[16px] text-zinc-500 font-normal select-none pointer-events-none"
              aria-hidden="true"
            >
              / MOO-dit JHAH /
            </motion.span>
          </motion.div>

          {/* Sub-row: Role, Location, Education */}
          <motion.div
            {...fadeUp(0.04)}
            className="flex flex-wrap items-center justify-between gap-y-2 gap-x-6 text-[14px] sm:text-[15px] text-zinc-600 pb-1"
          >
            <div className="font-display font-semibold text-zinc-800">
              Design Engineer
            </div>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-1.5 font-display font-normal">
                <MapPin className="size-4 text-zinc-500 stroke-[1.75]" />
                <span>Minneapolis, MN</span>
              </div>
              <div className="flex items-center gap-1.5 font-display font-normal">
                <GraduationCap className="size-4 text-zinc-500 stroke-[1.75]" />
                <span>B.S. CS + UX &amp; Psychology @ UMN</span>
              </div>
            </div>
          </motion.div>

          {/* Bio paragraphs */}
          <motion.div
            {...fadeUp(0.08)}
            className="flex flex-col gap-3.5 font-display text-[16px] sm:text-[18px] font-medium leading-relaxed sm:leading-[1.65] text-[#6b6b6e] tracking-[-0.1px] text-pretty max-w-[700px]"
          >
            <p className="text-pretty">
              Design engineer &amp; creative generalist. Building thoughtful things at the
              intersection of tech and human behavior.
            </p>
            <p className="text-pretty">
              I craft digital software with an obsessive focus on tactile materials, spatial flow,
              and fluid motion physics. Currently exploring spatial computing, interactive Web Audio
              shaders, and high-craft design systems.
            </p>
          </motion.div>

          {/* Quick Contact & Action Box Container */}
          <motion.div
            {...fadeUp(0.12)}
            className="flex flex-col gap-2.5 pt-2 w-full max-w-[620px]"
          >
            {/* Top Toolbar: Socials (Left) & Quick Links (Right) */}
            <div className="flex flex-wrap items-center justify-between gap-y-2 px-0.5 text-[#82745d]">
              {/* Left Social Icons */}
              <div className="flex items-center gap-1">
                {/* X / Twitter */}
                <SmartLinkPreview url="https://x.com/MuditJ1">
                  <a
                    href="https://x.com/MuditJ1"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="X profile"
                    className="pressable relative p-1.5 after:absolute after:-inset-1.5 rounded-md hover:text-zinc-800 hover:bg-[#eae3d2]/40 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-1 transition-[transform,color,background-color] duration-150 inline-flex items-center"
                  >
                    <svg className="size-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                </SmartLinkPreview>

                {/* GitHub */}
                <SmartLinkPreview url="https://github.com/mmmudit">
                  <a
                    href="https://github.com/mmmudit"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub profile"
                    className="pressable relative p-1.5 after:absolute after:-inset-1.5 rounded-md hover:text-zinc-800 hover:bg-[#eae3d2]/40 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-1 transition-[transform,color,background-color] duration-150 inline-flex items-center"
                  >
                    <svg className="size-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                  </a>
                </SmartLinkPreview>

                {/* LinkedIn */}
                <SmartLinkPreview url="https://www.linkedin.com/in/muditj3/">
                  <a
                    href="https://www.linkedin.com/in/muditj3/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn profile"
                    className="pressable relative p-1.5 after:absolute after:-inset-1.5 rounded-md hover:text-zinc-800 hover:bg-[#eae3d2]/40 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-1 transition-[transform,color,background-color] duration-150 inline-flex items-center"
                  >
                    <svg className="size-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0 0-3.28 1.64 1.64 0 0 0 0 3.28m1.4 9.74v-8.37H5.06v8.37h2.8z" />
                    </svg>
                  </a>
                </SmartLinkPreview>

                {/* Letterboxd */}
                <SmartLinkPreview url="https://letterboxd.com">
                  <a
                    href="https://letterboxd.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Letterboxd profile"
                    className="pressable relative p-1.5 after:absolute after:-inset-1.5 rounded-md hover:text-zinc-800 hover:bg-[#eae3d2]/40 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-1 transition-[transform,color,background-color] duration-150 inline-flex items-center"
                  >
                    <Film className="size-3.5" aria-hidden="true" />
                  </a>
                </SmartLinkPreview>
              </div>

              {/* Right Quick Actions */}
              <div className="flex items-center gap-1 sm:gap-2 text-[12px] font-sans">
                {/* Email button with copy state and rich preview */}
                <EmailPreviewBadge>
                  <div className="relative inline-flex items-center">
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="pressable inline-flex items-center gap-1.5 px-2 py-1 rounded-md hover:text-zinc-800 hover:bg-[#eae3d2]/40 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-1 transition-[transform,color,background-color] duration-150"
                    >
                      <Mail className="size-3.5 stroke-[1.75]" />
                      <span>{copiedEmail ? "Copied!" : "Email"}</span>
                    </button>
                    <AnimatePresence>
                      {copiedEmail && (
                        <motion.span
                          initial={reduce ? { opacity: 0 } : { opacity: 0, y: -16, scale: 0.92 }}
                          animate={
                            reduce
                              ? { opacity: 1 }
                              : {
                                  opacity: 1,
                                  y: -24,
                                  scale: 1,
                                  transition: { type: "spring", stiffness: 450, damping: 26 },
                                }
                          }
                          exit={
                            reduce
                              ? { opacity: 0 }
                              : {
                                  opacity: 0,
                                  y: -28,
                                  scale: 0.92,
                                  transition: { duration: 0.12, ease: [0.22, 1, 0.36, 1] },
                                }
                          }
                          className="absolute left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-mono font-medium text-emerald-800 bg-emerald-100/90 backdrop-blur-sm rounded-full border border-emerald-300 shadow-sm whitespace-nowrap z-20"
                        >
                          <Check className="size-2.5 text-emerald-700" />
                          <span>Copied hello@muditjha.me</span>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </EmailPreviewBadge>

                {/* Book a call */}
                <SmartLinkPreview url="https://cal.com">
                  <a
                    href="https://cal.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pressable inline-flex items-center gap-1.5 px-2 py-1 rounded-md hover:text-zinc-800 hover:bg-[#eae3d2]/40 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-1 transition-[transform,color,background-color] duration-150"
                  >
                    <Calendar className="size-3.5 stroke-[1.75]" />
                    <span>Book a call</span>
                  </a>
                </SmartLinkPreview>

                {/* CV */}
                <SmartLinkPreview url="https://muditjha.me/resume.pdf" fallbackTitle="Mudit Jha – Curriculum Vitae" fallbackDescription="Design engineering, product architecture, and human-centered research resume.">
                  <a
                    href="/resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pressable inline-flex items-center gap-1.5 px-2 py-1 rounded-md hover:text-zinc-800 hover:bg-[#eae3d2]/40 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-1 transition-[transform,color,background-color] duration-150"
                  >
                    <FileDown className="size-3.5 stroke-[1.75]" />
                    <span>CV</span>
                  </a>
                </SmartLinkPreview>
              </div>
            </div>

            {/* Interactive Message Input Box */}
            <form
              onSubmit={handleSendMessage}
              className="relative flex items-center w-full rounded-2xl border border-[#d9d0bb]/80 bg-[#f7f5ed]/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] focus-within:border-zinc-400 focus-within:ring-2 focus-within:ring-zinc-400/20 transition-[border-color,box-shadow] duration-200 p-2 ps-4"
            >
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                aria-label="Message for Mudit"
                placeholder="A role, a project, an idea, or just a hello. Say what’s on your mind."
                className="w-full bg-transparent text-[16px] sm:text-[14px] text-zinc-800 placeholder:text-zinc-400/90 focus:outline-none pe-3 font-display"
              />

              <button
                type="submit"
                disabled={isSending || !message.trim()}
                aria-label="Send message"
                className="pressable relative shrink-0 flex items-center justify-center size-8 rounded-full border border-zinc-300 bg-[#fbfaf5] text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 transition-[color,background-color,transform,box-shadow] duration-150 shadow-xs overflow-hidden active:scale-[0.96]"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isSent ? (
                    <motion.div
                      key="sent-check"
                      initial={
                        reduce
                          ? { opacity: 0 }
                          : { opacity: 0, scale: 0.3, filter: "blur(2px)" }
                      }
                      animate={
                        reduce
                          ? { opacity: 1 }
                          : { opacity: 1, scale: 1, filter: "blur(0px)" }
                      }
                      exit={
                        reduce
                          ? { opacity: 0 }
                          : { opacity: 0, scale: 0.3, filter: "blur(2px)" }
                      }
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="text-emerald-700"
                    >
                      <Check className="size-4 stroke-[2.5]" aria-hidden="true" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="send-arrow"
                      initial={
                        reduce
                          ? { opacity: 0 }
                          : { opacity: 0, scale: 0.3, filter: "blur(2px)" }
                      }
                      animate={
                        reduce
                          ? { opacity: 1 }
                          : { opacity: 1, scale: 1, filter: "blur(0px)" }
                      }
                      exit={
                        reduce
                          ? { opacity: 0 }
                          : { opacity: 0, scale: 0.3, filter: "blur(2px)" }
                      }
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <ArrowUp className="size-4 stroke-[2.2]" aria-hidden="true" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </form>

            <p className="text-[12px] text-zinc-400 font-sans ps-1">
              All queries go straight to my inbox.
            </p>
          </motion.div>
        </div>

        {/* Right Column: Physical Polaroid / Interactive 3D Photo Card */}
        <div className="order-first lg:order-none lg:col-span-4 flex justify-center lg:justify-end pt-4 lg:pt-0">
          <TactilePhotoCard />
        </div>
      </div>
    </section>
  );
}
