import { Intro } from "@/components/intro";
import { SpaceFSOrbitHero } from "@/components/spacefs-orbit-hero";
import { Divider } from "@/components/divider";
import { Footer } from "@/components/footer";
import { ProjectGrid } from "@/components/project-grid";
import { client } from "@/sanity/client";
import { PROJECTS_QUERY } from "@/sanity/queries";

export const revalidate = 0;

import { DEFAULT_PROJECTS } from "@/data/projects";

export default async function Home() {
  let sanityProjects: any[] = [];
  try {
    sanityProjects = await client.fetch(PROJECTS_QUERY);
  } catch {
    sanityProjects = [];
  }

  const rawProjects = sanityProjects && sanityProjects.length > 0 ? sanityProjects : DEFAULT_PROJECTS;
  const projects = rawProjects.map((p) => {
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

  return (
    <main className="min-h-screen">
      <div className="flex w-full flex-col gap-12">
        <Intro />
        {/* <SpaceFSOrbitHero /> */}
        <Divider />

        <ProjectGrid projects={projects} />

        <Divider />
        <Footer />
      </div>
    </main>
  );
}
