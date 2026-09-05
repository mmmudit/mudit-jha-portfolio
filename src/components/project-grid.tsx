"use client";

import React, { useState, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ProjectCard } from "./project-card";
import { CursorPill, type CursorPillHandle } from "./cursor-pill";
import { ProjectModal, type ProjectData, type ActiveProjectCardState } from "./project-modal";
import { play } from "@/lib/sound";
import { useZeroGravity } from "@/context/zero-gravity-context";

export type ProjectGridProps = {
  projects: ProjectData[];
};

const CARD_DRIFT_PRESETS = [
  { y: -32, x: -18, rotate: -2.8, duration: 6.2 },
  { y: -44, x: 22, rotate: 3.2, duration: 5.5 },
  { y: -28, x: -14, rotate: 2.1, duration: 7.0 },
  { y: -52, x: 16, rotate: -3.5, duration: 5.8 },
  { y: -36, x: -20, rotate: -1.8, duration: 6.5 },
  { y: -48, x: 24, rotate: 2.5, duration: 6.1 },
];

const PROJECT_CURSOR_LABELS: Record<string, string> = {
  clarity: "View case study",
  zeno: "Open concept",
  codequest: "Explore project",
  uilibrary: "Play with components",
  umend: "View hackathon",
};

function normalizeProjectKey(value: string | number | undefined) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function getProjectCursorLabel(project: ProjectData) {
  const customLabel = project.cursorLabel?.trim();
  if (customLabel) return customLabel;

  const projectKeys = [project.slug, project.id, project.title].map(normalizeProjectKey);
  const requestedLabel = projectKeys
    .map((key) => PROJECT_CURSOR_LABELS[key])
    .find(Boolean);

  return requestedLabel || project.actionText?.trim() || "View project";
}

function projectPath(project: ProjectData) {
  const slug = project.slug || project.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return `/projects/${encodeURIComponent(String(slug))}`;
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  const [activeCard, setActiveCard] = useState<ActiveProjectCardState | null>(null);
  const [currentIdx, setCurrentIdx] = useState<number | null>(null);
  const [hoveredId, setHoveredId] = useState<string | number | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const cursorPillRef = useRef<CursorPillHandle | null>(null);
  const reduce = useReducedMotion();
  const { isZeroGravity, isRestoring } = useZeroGravity();
  const isZeroG = isZeroGravity && !isRestoring;

  const openProjectAtIndex = (index: number) => {
    if (!projects || projects.length === 0) return;
    cursorPillRef.current?.hide();

    const boundedIdx = (index + projects.length) % projects.length;
    const project = projects[boundedIdx];
    const id = project._id || project.id || boundedIdx;
    const projectKey = String(id);
    setCurrentIdx(boundedIdx);

    if (typeof window !== "undefined") {
      const path = projectPath(project);
      const method = activeCard ? "replaceState" : "pushState";
      window.history[method]({ projectModal: true }, "", path);
    }

    const el = cardRefs.current[projectKey];
    const targetW = typeof window !== "undefined"
      ? Math.min(1240, window.innerWidth <= 640 ? window.innerWidth - 20 : window.innerWidth <= 1024 ? window.innerWidth * 0.94 : Math.min(1240, window.innerWidth * 0.92))
      : 1240;
    const targetH = typeof window !== "undefined"
      ? Math.min(window.innerHeight <= 640 ? window.innerHeight - 24 : window.innerHeight * 0.92, 900)
      : 900;
    const targetTop = typeof window !== "undefined" ? Math.max(12, (window.innerHeight - targetH) / 2) : 50;
    const targetLeft = typeof window !== "undefined" ? Math.max(10, (window.innerWidth - targetW) / 2) : 50;

    const target = {
      top: targetTop,
      left: targetLeft,
      width: targetW,
      height: targetH,
    };

    if (el) {
      const r = el.getBoundingClientRect();
      const origin = {
        top: r.top,
        left: r.left,
        width: r.width,
        height: r.height,
      };
      play("bloom", { volume: 0.45 });
      setActiveCard({ project, origin, target });
    } else {
      play("bloom", { volume: 0.45 });
      setActiveCard({
        project,
        origin: target,
        target,
      });
    }
  };

  const handleCardClick = (project: ProjectData, projectKey: string, index: number) => {
    setCurrentIdx(index);
    openProjectAtIndex(index);
  };

  // Keyboard navigation for grid and modal: J / K / Arrows / Enter
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in text inputs or modifier keys are held
      if (
        /^(INPUT|TEXTAREA|SELECT)$/.test((e.target as HTMLElement)?.tagName) ||
        (e.target as HTMLElement)?.isContentEditable ||
        e.metaKey ||
        e.ctrlKey ||
        e.altKey
      ) {
        return;
      }

      const isNextKey = e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === "j" || e.key === "J";
      const isPrevKey = e.key === "ArrowLeft" || e.key === "ArrowUp" || e.key === "k" || e.key === "K";

      if (isNextKey) {
        e.preventDefault();
        if (activeCard !== null && currentIdx !== null) {
          // Modal is open: flip to next case study
          openProjectAtIndex(currentIdx + 1);
        } else {
          // Grid view: navigate cards
          const nextIdx = currentIdx === null ? 0 : (currentIdx + 1) % projects.length;
          setCurrentIdx(nextIdx);
          const nextProject = projects[nextIdx];
          const nextKey = String(nextProject._id || nextProject.id || nextIdx);
          setHoveredId(nextProject._id || nextProject.id || nextIdx);
          cardRefs.current[nextKey]?.scrollIntoView({ behavior: "smooth", block: "nearest" });
          play("tick", { volume: 0.35 });
        }
      } else if (isPrevKey) {
        e.preventDefault();
        if (activeCard !== null && currentIdx !== null) {
          // Modal is open: flip to prev case study
          openProjectAtIndex(currentIdx - 1);
        } else {
          // Grid view: navigate cards
          const prevIdx = currentIdx === null ? projects.length - 1 : (currentIdx - 1 + projects.length) % projects.length;
          setCurrentIdx(prevIdx);
          const prevProject = projects[prevIdx];
          const prevKey = String(prevProject._id || prevProject.id || prevIdx);
          setHoveredId(prevProject._id || prevProject.id || prevIdx);
          cardRefs.current[prevKey]?.scrollIntoView({ behavior: "smooth", block: "nearest" });
          play("tick", { volume: 0.35 });
        }
      } else if ((e.key === "Enter" || e.key === " ") && activeCard === null && currentIdx !== null) {
        // Enter / Space opens the highlighted card
        e.preventDefault();
        openProjectAtIndex(currentIdx);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeCard, currentIdx, projects]);

  return (
    <>
      <section
        className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-x-8 md:gap-y-10"
        onMouseLeave={() => setHoveredId(null)}
      >
        {projects.map((project, index) => {
          const id = project._id || project.id || index;
          const projectKey = String(id);
          const isDimmed = hoveredId !== null && hoveredId !== id;
          const cardPreset = CARD_DRIFT_PRESETS[index % CARD_DRIFT_PRESETS.length];

          return (
            <motion.div
              key={id}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
              animate={
                reduce
                  ? { opacity: 1 }
                  : isZeroG
                  ? {
                      opacity: 1,
                      y: cardPreset.y,
                      x: cardPreset.x,
                      rotate: cardPreset.rotate,
                    }
                  : { opacity: 1, y: 0, x: 0, rotate: 0 }
              }
              transition={
                reduce
                  ? { duration: 0.15 }
                  : isZeroG
                  ? {
                      type: "spring",
                      stiffness: 35,
                      damping: 11,
                      mass: 1.15,
                      delay: 0.1 + index * 0.08,
                    }
                  : isRestoring
                  ? {
                      duration: 0.65,
                      ease: [0.23, 1, 0.32, 1],
                      delay: Math.min(index * 0.04, 0.2),
                    }
                  : {
                      duration: 0.25,
                      delay: Math.min(index * 0.04, 0.24),
                      ease: [0.22, 1, 0.36, 1],
                    }
              }
              className="w-full will-change-transform transform-gpu"
            >
              {/* Continuous microgravity ambient floating layer */}
              <motion.div
                animate={
                  isZeroG && !reduce
                    ? {
                        y: [-8, 8, -8],
                        x: [-6, 6, -6],
                        rotate: [-1.2, 1.2, -1.2],
                      }
                    : { y: 0, x: 0, rotate: 0 }
                }
                transition={
                  isZeroG && !reduce
                    ? {
                        duration: cardPreset.duration,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "easeInOut",
                        delay: 0.35 + index * 0.1,
                      }
                    : {
                        duration: 0.4,
                        ease: [0.23, 1, 0.32, 1],
                      }
                }
                className="w-full will-change-transform transform-gpu"
              >
                <ProjectCard
                  ref={(el) => {
                    cardRefs.current[projectKey] = el;
                  }}
                  index={index}
                  title={project.title}
                  slug={project.slug}
                  year={project.year}
                  description={project.description}
                  image={project.image}
                  muxPlaybackId={project.muxPlaybackId || project.muxVideo?.playbackId}
                  muxThumbTime={project.muxThumbTime ?? project.muxVideo?.thumbTime}
                  gradient={project.gradient}
                  href={project.href}
                  actionText={project.actionText}
                  cursorLabel={getProjectCursorLabel(project)}
                  priority={index < 2}
                  isDimmed={isDimmed}
                  onPointerEnter={(event, cursorLabel) => {
                    if (!cursorLabel) return;
                    cursorPillRef.current?.show({
                      anchor: event.currentTarget,
                      label: cursorLabel,
                      clientX: event.clientX,
                      clientY: event.clientY,
                      pointerType: event.pointerType,
                    });
                  }}
                  onPointerMove={(event) => {
                    cursorPillRef.current?.move({
                      clientX: event.clientX,
                      clientY: event.clientY,
                    });
                  }}
                  onPointerLeave={() => cursorPillRef.current?.hide()}
                  onPointerDown={(event) => {
                    if (event.pointerType === "mouse" && event.button === 0) {
                      cursorPillRef.current?.press();
                    }
                  }}
                  onPointerUp={(event) => {
                    if (event.pointerType === "mouse" && event.button === 0) {
                      cursorPillRef.current?.release();
                    }
                  }}
                  onPointerCancel={() => cursorPillRef.current?.hide()}
                  onMouseEnter={() => {
                    if (hoveredId !== id) {
                      play("ready", { volume: 0.35 });
                    }
                    setHoveredId(id);
                  }}
                  onMouseLeave={() => setHoveredId(null)}
                  onFocus={() => {
                    if (hoveredId !== id) {
                      play("ready", { volume: 0.35 });
                    }
                    setHoveredId(id);
                  }}
                  onBlur={() => setHoveredId(null)}
                  onClick={() => handleCardClick(project, projectKey, index)}
                />
              </motion.div>
            </motion.div>
          );
        })}
      </section>

      <CursorPill ref={cursorPillRef} />

      {/* 3D Slow & Savory Weighted Horizon Morph Overlay */}
      <ProjectModal
        activeCard={activeCard}
        projects={projects}
        currentIndex={currentIdx ?? 0}
        totalCount={projects.length}
        onSelectProject={(idx) => {
          openProjectAtIndex(idx);
        }}
        onNext={() => {
          if (currentIdx !== null) {
            openProjectAtIndex(currentIdx + 1);
          }
        }}
        onPrev={() => {
          if (currentIdx !== null) {
            openProjectAtIndex(currentIdx - 1);
          }
        }}
        onClose={() => {
          if (typeof window !== "undefined") window.history.pushState({}, "", "/");
          setActiveCard(null);
        }}
      />
    </>
  );
}
