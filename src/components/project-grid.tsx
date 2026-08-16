"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ProjectCard } from "./project-card";
import { ProjectModal, type ProjectData } from "./project-modal";

export type ProjectGridProps = {
  projects: ProjectData[];
};

export function ProjectGrid({ projects }: ProjectGridProps) {
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [hoveredId, setHoveredId] = useState<string | number | null>(null);
  const reduce = useReducedMotion();

  return (
    <>
      <section
        className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-x-8 md:gap-y-10"
        onMouseLeave={() => setHoveredId(null)}
      >
        {projects.map((project, index) => {
          const id = project._id || project.id || index;
          const isDimmed = hoveredId !== null && hoveredId !== id;

          return (
            <motion.div
              key={id}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
              transition={{
                duration: reduce ? 0.15 : 0.25,
                delay: reduce ? 0 : Math.min(index * 0.05, 0.3),
                ease: [0.22, 1, 0.36, 1],
              }}
              className="w-full"
            >
              <ProjectCard
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
                onClick={() => setSelectedProject(project)}
              />
            </motion.div>
          );
        })}
      </section>

      {/* Modal Page Component */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
}
