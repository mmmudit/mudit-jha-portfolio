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
  const [hoveredId, setHoveredId] = useState<string | number | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const reduce = useReducedMotion();

  const handleCardClick = (project: ProjectData, projectKey: string) => {
    const el = cardRefs.current[projectKey];
    if (el) {
      const r = el.getBoundingClientRect();
      const origin = {
        top: r.top,
        left: r.left,
        width: r.width,
        height: r.height,
      };

      const targetW = Math.min(940, window.innerWidth * 0.94);
      const targetH = Math.min(window.innerHeight * 0.88, 680);
      const targetTop = (window.innerHeight - targetH) / 2;
      const targetLeft = (window.innerWidth - targetW) / 2;

      const target = {
        top: targetTop,
        left: targetLeft,
        width: targetW,
        height: targetH,
      };

      play("bloom", { volume: 0.45 });
      setActiveCard({ project, origin, target });
    } else {
      const targetW = Math.min(940, window.innerWidth * 0.94);
      const targetH = Math.min(window.innerHeight * 0.88, 680);
      const targetTop = (window.innerHeight - targetH) / 2;
      const targetLeft = (window.innerWidth - targetW) / 2;
      play("bloom", { volume: 0.45 });
      setActiveCard({
        project,
        origin: { top: targetTop, left: targetLeft, width: targetW, height: targetH },
        target: { top: targetTop, left: targetLeft, width: targetW, height: targetH },
      });
    }
  };

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
                onMouseEnter={() => setHoveredId(id)}
                onMouseLeave={() => setHoveredId(null)}
                onFocus={() => setHoveredId(id)}
                onBlur={() => setHoveredId(null)}
                onClick={() => handleCardClick(project, projectKey)}
              />
            </motion.div>
          );
        })}
      </section>

      {/* 3D Slow & Savory Weighted Horizon Morph Overlay */}
      <ProjectModal
        activeCard={activeCard}
        onClose={() => setActiveCard(null)}
      />
    </>
  );
}
