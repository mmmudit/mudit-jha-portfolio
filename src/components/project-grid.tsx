"use client";

import React, { useState, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ProjectCard } from "./project-card";
import { ProjectModal, type ProjectData, type ActiveProjectCardState } from "./project-modal";
import { play } from "@/lib/sound";

export type ProjectGridProps = {
  projects: ProjectData[];
};

export function ProjectGrid({ projects }: ProjectGridProps) {
  const [activeCard, setActiveCard] = useState<ActiveProjectCardState | null>(null);
  const [currentIdx, setCurrentIdx] = useState<number | null>(null);
  const [hoveredId, setHoveredId] = useState<string | number | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const reduce = useReducedMotion();

  const openProjectAtIndex = (index: number) => {
    if (!projects || projects.length === 0) return;
    const boundedIdx = (index + projects.length) % projects.length;
    const project = projects[boundedIdx];
    const id = project._id || project.id || boundedIdx;
    const projectKey = String(id);
    setCurrentIdx(boundedIdx);

    const el = cardRefs.current[projectKey];
    const targetW = typeof window !== "undefined"
      ? Math.min(940, window.innerWidth <= 640 ? window.innerWidth - 24 : window.innerWidth * 0.92)
      : 940;
    const targetH = typeof window !== "undefined"
      ? Math.min(window.innerHeight <= 640 ? window.innerHeight - 36 : window.innerHeight * 0.88, 680)
      : 680;
    const targetTop = (window.innerHeight - targetH) / 2;
    const targetLeft = (window.innerWidth - targetW) / 2;

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

          return (
            <motion.div
              key={id}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
              transition={{
                duration: reduce ? 0.15 : 0.25,
                delay: reduce ? 0 : Math.min(index * 0.04, 0.24),
                ease: [0.22, 1, 0.36, 1],
              }}
              className="w-full"
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
                gradient={project.gradient}
                href={project.href}
                actionText={project.actionText}
                priority={index < 2}
                isDimmed={isDimmed}
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
          );
        })}
      </section>

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
          setActiveCard(null);
        }}
      />
    </>
  );
}
