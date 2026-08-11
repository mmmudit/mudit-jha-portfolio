"use client";

import { useState } from "react";
import { ProjectCard } from "./project-card";
import { ProjectModal, type ProjectData } from "./project-modal";

export type ProjectGridProps = {
  projects: ProjectData[];
};

export function ProjectGrid({ projects }: ProjectGridProps) {
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const [hoveredId, setHoveredId] = useState<string | number | null>(null);

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
            <ProjectCard
              key={id}
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
