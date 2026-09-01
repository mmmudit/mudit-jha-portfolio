import React from "react";
import { notFound } from "next/navigation";
import { client } from "@/sanity/client";
import { PROJECT_BY_SLUG_QUERY, PROJECTS_QUERY } from "@/sanity/queries";
import { DEFAULT_PROJECTS, CLARITY_PROJECT } from "@/data/projects";
import { ExpandedProjectView } from "@/components/case-study/ExpandedProjectView";
import { Divider } from "@/components/divider";
import { Footer } from "@/components/footer";
import { Project } from "@/types/project";

export const revalidate = 0;

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug } = await params;
  let project: Project | null = null;

  try {
    project = await client.fetch<Project | null>(PROJECT_BY_SLUG_QUERY, { slug });
  } catch {
    project = null;
  }

  if (!project) {
    project = DEFAULT_PROJECTS.find((p) => p.slug === slug || p.id === slug) || null;
  }

  if (!project) {
    if (slug === "clarity") {
      project = CLARITY_PROJECT;
    } else {
      return {
        title: "Project Not Found — Mudit Jha",
      };
    }
  }

  return {
    title: `${project.title} — ${project.tagline || project.description}`,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  let project: Project | null = null;
  let rawAllProjects: Project[] = [];

  try {
    const [fetchedProject, fetchedAll] = await Promise.all([
      client.fetch<Project | null>(PROJECT_BY_SLUG_QUERY, { slug }),
      client.fetch<Project[]>(PROJECTS_QUERY),
    ]);
    project = fetchedProject;
    rawAllProjects = fetchedAll || [];
  } catch {
    project = null;
    rawAllProjects = [];
  }

  if (rawAllProjects.length === 0) {
    rawAllProjects = DEFAULT_PROJECTS;
  }

  // Merge Sanity project list with defaults
  const allProjects = rawAllProjects.map((p) => {
    const fallback = DEFAULT_PROJECTS.find(
      (def) =>
        def.slug === p.slug ||
        def.id === p.slug ||
        def._id === p._id ||
        def.title?.toLowerCase() === p.title?.toLowerCase()
    );
    if (fallback) {
      return {
        ...fallback,
        ...p,
        tagline: p.tagline || fallback.tagline,
        role: p.role || fallback.role,
        team: p.team && p.team.length > 0 ? p.team : fallback.team,
        skills: p.skills && p.skills.length > 0 ? p.skills : fallback.skills,
        heroMedia: p.heroMedia?.image || p.heroMedia?.video ? p.heroMedia : fallback.heroMedia,
        caseStudy: p.caseStudy && p.caseStudy.length > 0 ? p.caseStudy : fallback.caseStudy,
      };
    }
    return p;
  });

  const fallback = DEFAULT_PROJECTS.find(
    (def) =>
      def.slug === slug ||
      def.id === slug ||
      (project && (def._id === project._id || def.title?.toLowerCase() === project.title?.toLowerCase()))
  );

  if (!project && !fallback) {
    if (slug === "clarity") {
      project = CLARITY_PROJECT;
    } else {
      notFound();
    }
  } else if (fallback && project) {
    project = {
      ...fallback,
      ...project,
      tagline: project.tagline || fallback.tagline,
      role: project.role || fallback.role,
      team: project.team && project.team.length > 0 ? project.team : fallback.team,
      skills: project.skills && project.skills.length > 0 ? project.skills : fallback.skills,
      heroMedia: project.heroMedia?.image || project.heroMedia?.video ? project.heroMedia : fallback.heroMedia,
      caseStudy: project.caseStudy && project.caseStudy.length > 0 ? project.caseStudy : fallback.caseStudy,
    };
  } else if (!project && fallback) {
    project = fallback;
  }

  if (!project) {
    notFound();
  }

  let currentIndex = allProjects.findIndex(
    (p) => p.slug === slug || p.id === slug || p._id === project?._id
  );
  if (currentIndex === -1) {
    currentIndex = 0;
  }

  return (
    <main className="min-h-screen">
      <div className="flex w-full flex-col gap-12">
        <ExpandedProjectView
          project={project}
          projects={allProjects}
          currentIndex={currentIndex}
        />

        <Divider />
        <Footer />
      </div>
    </main>
  );
}
