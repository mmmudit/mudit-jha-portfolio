import React from "react";
import { notFound } from "next/navigation";
import { client } from "@/sanity/client";
import { PROJECT_BY_SLUG_QUERY, PROJECTS_QUERY } from "@/sanity/queries";
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
    return {
      title: "Project Not Found — Mudit Jha",
    };
  }

  return {
    title: `${project.title} — ${project.tagline || project.description}`,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  let project: Project | null = null;
  let allProjects: Project[] = [];

  try {
    const [fetchedProject, fetchedAll] = await Promise.all([
      client.fetch<Project | null>(PROJECT_BY_SLUG_QUERY, { slug }),
      client.fetch<Project[]>(PROJECTS_QUERY),
    ]);
    project = fetchedProject;
    allProjects = fetchedAll || [];
  } catch {
    project = null;
    allProjects = [];
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
