"use client";

import { useState } from "react";
import { ProjectCard } from "./project-card";
import { ProjectModal, type ProjectData } from "./project-modal";

export type ProjectGridProps = {
  projects: ProjectData[];
};

export function ProjectGrid({ projects }: ProjectGridProps) {
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);

  return (
    <>
      <section className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-x-8 md:gap-y-10">
        {projects.map((project, index) => (
          <ProjectCard
            key={project._id || project.id || index}
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
            onClick={() => setSelectedProject(project)}
          />
        ))}
      </section>

      {/* Modal Page Component */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </>
  );
}
