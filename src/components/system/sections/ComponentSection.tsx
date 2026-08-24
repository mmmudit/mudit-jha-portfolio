"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { SectionHeader } from "../primitives";
import { InteractiveTsuLogo } from "../../tsu-logo";
import NavigationTabs from "../../NavigationTabs";
import { LiveClock } from "../../live-clock";
import { ProjectCard } from "../../project-card";
import { Divider } from "../../divider";
import { SmartLinkPreview } from "../../smart-link-preview";
import { EmailPreviewBadge } from "../../email-preview-badge";
import { LinkPreview } from "../../LinkPreview";

export function ComponentSection() {
  const [chatHover, setChatHover] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard?.writeText("hello@muditjha.me");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <section className="flex flex-col mb-20">
      <SectionHeader
        id="components"
        title="Live Shared Components"
        subtitle="Mounting real, live instances of components directly imported from existing files across the repository."
      />

      <div className="flex flex-col gap-10">
        {/* 1. Interactive Toon Eye Logo */}
        <div className="p-6 bg-[#fbfaf5] rounded-2xl border border-zinc-300 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-200">
            <div>
              <h3 className="font-sans font-semibold text-base text-zinc-900">
                Interactive Toon Eye Logo (`&lt;InteractiveTsuLogo /&gt;`)
              </h3>
              <p className="text-xs text-zinc-500">
                Spring pupil tracking pointer coordinates, auto-blink (15s), hover trigger, and double-click easter egg.
              </p>
            </div>
            <code className="text-xs font-mono text-zinc-500">src/components/tsu-logo.tsx</code>
          </div>
          <div className="flex items-center justify-center p-8 bg-white/70 rounded-xl border border-zinc-200">
            <InteractiveTsuLogo />
          </div>
        </div>

        {/* 2. Floating Navigation Bar & Tabs */}
        <div className="p-6 bg-[#fbfaf5] rounded-2xl border border-zinc-300 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-200">
            <div>
              <h3 className="font-sans font-semibold text-base text-zinc-900">
                Navigation Tabs (`&lt;NavigationTabs /&gt;`)
              </h3>
              <p className="text-xs text-zinc-500">
                Active pill with Willow Grey background and Framer Motion shared layoutId spring transition.
              </p>
            </div>
            <code className="text-xs font-mono text-zinc-500">src/components/NavigationTabs.tsx</code>
          </div>
          <div className="flex items-center justify-center p-8 bg-white/70 rounded-xl border border-zinc-200">
            <div className="rounded-full border border-zinc-300/70 bg-[#fbfaf5]/85 backdrop-blur-md p-1 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
              <NavigationTabs layoutId="demo-active-nav-pill" initialActiveId="work" />
            </div>
          </div>
        </div>

        {/* 3. Live Clock (Both Variants) */}
        <div className="p-6 bg-[#fbfaf5] rounded-2xl border border-zinc-300 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-200">
            <div>
              <h3 className="font-sans font-semibold text-base text-zinc-900">
                Live Clock HUD (`&lt;LiveClock /&gt;`)
              </h3>
              <p className="text-xs text-zinc-500">
                Real-time ticking characters with AnimatePresence per digit and Minneapolis green status beacon.
              </p>
            </div>
            <code className="text-xs font-mono text-zinc-500">src/components/live-clock.tsx</code>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6 bg-white/70 rounded-xl border border-zinc-200">
            <div className="p-4 bg-[#fbfaf5] rounded-xl border border-zinc-200 flex flex-col items-center justify-center gap-2">
              <span className="text-[11px] font-mono text-zinc-400 uppercase">Header Variant</span>
              <LiveClock variant="header" />
            </div>
            <div className="p-4 bg-[#fbfaf5] rounded-xl border border-zinc-200 flex flex-col items-center justify-center gap-2">
              <span className="text-[11px] font-mono text-zinc-400 uppercase">Footer Variant</span>
              <LiveClock variant="footer" />
            </div>
          </div>
        </div>

        {/* 4. Let's Chat Expandable Contact Pill Button */}
        <div className="p-6 bg-[#fbfaf5] rounded-2xl border border-zinc-300 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-200">
            <div>
              <h3 className="font-sans font-semibold text-base text-zinc-900">
                Header Contact Email Pill
              </h3>
              <p className="text-xs text-zinc-500">
                Spring expansion on hover (56px $\rightarrow$ 125px) with blurred text reveal and rotating mail icon.
              </p>
            </div>
            <code className="text-xs font-mono text-zinc-500">src/components/header.tsx</code>
          </div>
          <div className="flex items-center justify-center p-8 bg-white/70 rounded-xl border border-zinc-200">
            <motion.div
              onHoverStart={() => setChatHover(true)}
              onHoverEnd={() => setChatHover(false)}
              animate={{
                width: chatHover ? 125 : 56,
                backgroundColor: chatHover ? "#e6e6e6" : "#fbfaf5",
              }}
              transition={{ type: "spring", stiffness: 420, damping: 30, mass: 0.8 }}
              className="pressable relative inline-flex shrink-0 items-center overflow-hidden rounded-full border-2 border-zinc-300 cursor-pointer shadow-xs"
              style={{ width: 56 }}
            >
              <div className="relative h-[54px] w-full">
                <div className="absolute inset-0">
                  <div className="absolute inset-0 flex items-center justify-start pl-4">
                    <motion.span
                      className="whitespace-nowrap text-sm font-bold tracking-[0.01em] text-zinc-800"
                      animate={{
                        transform: chatHover ? "translateX(0px) scale(1)" : "translateX(8px) scale(0.96)",
                        filter: chatHover ? "blur(0px)" : "blur(2px)",
                        opacity: chatHover ? 1 : 0,
                      }}
                      transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                    >
                      let’s chat
                    </motion.span>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-end pr-2.5 pointer-events-none">
                    <motion.span
                      animate={{
                        color: chatHover ? "#374151" : "#9CA3AF",
                        rotate: chatHover ? 5 : 0,
                        backgroundColor: chatHover ? "#e6e6e6" : "#fbfaf5",
                      }}
                      transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                      className="flex items-center justify-center w-[30px] h-[30px] text-zinc-400"
                    >
                      <svg
                        width="22.8"
                        height="18.6"
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
            </motion.div>
          </div>
        </div>

        {/* 5. Live Project Card Instance */}
        <div className="p-6 bg-[#fbfaf5] rounded-2xl border border-zinc-300 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-200">
            <div>
              <h3 className="font-sans font-semibold text-base text-zinc-900">
                Project Card (`&lt;ProjectCard /&gt;`)
              </h3>
              <p className="text-xs text-zinc-500">
                Media aspect container with squircle radius (26px), floating glass badge, image scale, and scroll transforms.
              </p>
            </div>
            <code className="text-xs font-mono text-zinc-500">src/components/project-card.tsx</code>
          </div>
          <div className="max-w-xl mx-auto p-4 bg-white/70 rounded-2xl border border-zinc-200">
            <ProjectCard
              title="Polaroid Studio"
              year="2025"
              description="Interactive digital camera app with real-time film emulsion shaders."
              actionText="Try It Out!"
              gradient="from-amber-100/80 via-orange-100/80 to-yellow-100/80"
              href="#"
            />
          </div>
        </div>

        {/* 6. Email Copied Micro-Toast */}
        <div className="p-6 bg-[#fbfaf5] rounded-2xl border border-zinc-300 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-200">
            <div>
              <h3 className="font-sans font-semibold text-base text-zinc-900">
                Copied Feedback Pill Toast
              </h3>
              <p className="text-xs text-zinc-500">
                Spring pop-up toast on clipboard interaction in the footer.
              </p>
            </div>
            <code className="text-xs font-mono text-zinc-500">src/components/footer.tsx</code>
          </div>
          <div className="flex items-center justify-center p-8 bg-white/70 rounded-xl border border-zinc-200">
            <div className="relative inline-flex items-center">
              <button
                type="button"
                onClick={handleCopyEmail}
                className="pressable font-sans font-semibold text-2xl tracking-[-1px] text-willow-grey hover:text-rust-grey transition-colors"
              >
                {copiedEmail ? (
                  <span className="text-emerald-800">Copied!</span>
                ) : (
                  "email"
                )}
              </button>
              <AnimatePresence>
                {copiedEmail && (
                  <motion.span
                    initial={{ opacity: 0, y: 8, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.9 }}
                    transition={{ type: "spring", duration: 0.25, bounce: 0 }}
                    className="absolute left-1/2 -top-9 -translate-x-1/2 inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono font-medium text-emerald-800 bg-emerald-100/90 backdrop-blur-sm rounded-full border border-emerald-300 shadow-sm whitespace-nowrap z-20"
                  >
                    <Check className="size-3 text-emerald-700" />
                    <span>Copied to clipboard</span>
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* 7. Smart Link Preview Badges */}
        <div className="p-6 bg-[#fbfaf5] rounded-2xl border border-zinc-300 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-200">
            <div>
              <h3 className="font-sans font-semibold text-base text-zinc-900">
                Link Previews &amp; Social Badges (`&lt;SmartLinkPreview /&gt;`)
              </h3>
              <p className="text-xs text-zinc-500">
                Standard hover cards with live OpenGraph metadata extraction (favicon, domain, cover image, title, and description) in the warm paper theme.
              </p>
            </div>
            <code className="text-xs font-mono text-zinc-500">src/components/smart-link-preview.tsx</code>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 p-8 bg-white/70 rounded-xl border border-zinc-200">
            <SmartLinkPreview url="https://x.com/MuditJ1">
              <span className="px-3.5 py-1.5 rounded-full bg-white hover:bg-zinc-100 border border-zinc-950 text-zinc-900 font-mono text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-[2px_2px_0px_#18181b]">
                <span>X / Twitter</span>
                <span className="text-zinc-400">↗</span>
              </span>
            </SmartLinkPreview>

            <SmartLinkPreview url="https://github.com/mmmudit">
              <span className="px-3.5 py-1.5 rounded-full bg-white hover:bg-zinc-100 border border-zinc-950 text-zinc-900 font-mono text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-[2px_2px_0px_#18181b]">
                <span>GitHub</span>
                <span className="text-zinc-400">↗</span>
              </span>
            </SmartLinkPreview>

            <SmartLinkPreview url="https://cal.com">
              <span className="px-3.5 py-1.5 rounded-full bg-white hover:bg-zinc-100 border border-zinc-950 text-zinc-900 font-mono text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-[2px_2px_0px_#18181b]">
                <span>cal.com</span>
                <span className="text-zinc-400">↗</span>
              </span>
            </SmartLinkPreview>

            <EmailPreviewBadge>
              <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 font-mono text-xs font-bold hover:bg-emerald-100 transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-xs">
                <span>Email Badge</span>
                <span className="text-emerald-600">↗</span>
              </span>
            </EmailPreviewBadge>
          </div>
        </div>

        {/* 8. Accessible Radix LinkPreview (<LinkPreview />) */}
        <div className="p-6 bg-[#fbfaf5] rounded-2xl border border-zinc-300 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-200">
            <div>
              <h3 className="font-sans font-semibold text-base text-zinc-900">
                Accessible Radix Link Preview (`&lt;LinkPreview /&gt;`)
              </h3>
              <p className="text-xs text-zinc-500">
                Built on `@radix-ui/react-hover-card` with full keyboard ARIA focus support, 200ms intent delay, server-side OpenGraph scraper, and Framer Motion spring physics.
              </p>
            </div>
            <code className="text-xs font-mono text-zinc-500">src/components/LinkPreview.tsx</code>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 p-8 bg-white/70 rounded-xl border border-zinc-200 text-sm font-sans text-zinc-700">
            <p className="text-center sm:text-left leading-relaxed">
              Check out reference designs on{" "}
              <LinkPreview
                href="https://cali.so"
                className="font-semibold text-zinc-900 underline underline-offset-4 decoration-zinc-400 hover:decoration-zinc-900 transition-colors"
              >
                cali.so
              </LinkPreview>
              , explore tools on{" "}
              <LinkPreview
                href="https://github.com"
                className="font-semibold text-zinc-900 underline underline-offset-4 decoration-zinc-400 hover:decoration-zinc-900 transition-colors"
              >
                GitHub
              </LinkPreview>
              , or read writing on{" "}
              <LinkPreview
                href="https://substack.com/@mmmudit"
                className="font-semibold text-zinc-900 underline underline-offset-4 decoration-zinc-400 hover:decoration-zinc-900 transition-colors"
              >
                Substack
              </LinkPreview>
              .
            </p>
          </div>
        </div>

        {/* 9. Divider Line */}
        <div className="p-6 bg-[#fbfaf5] rounded-2xl border border-zinc-300 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-200">
            <div>
              <h3 className="font-sans font-semibold text-base text-zinc-900">
                Gradient Divider (`&lt;Divider /&gt;`)
              </h3>
              <p className="text-xs text-zinc-500">
                1px subtle horizontal divider with Willow Grey tint.
              </p>
            </div>
            <code className="text-xs font-mono text-zinc-500">src/components/divider.tsx</code>
          </div>
          <div className="p-6 bg-white/70 rounded-xl border border-zinc-200">
            <Divider />
          </div>
        </div>
      </div>
    </section>
  );
}
