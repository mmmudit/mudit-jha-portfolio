import { Intro } from "@/components/intro";
import { Divider } from "@/components/divider";
import { Footer } from "@/components/footer";
import { ProjectGrid } from "@/components/project-grid";
import { client } from "@/sanity/client";
import { PROJECTS_QUERY } from "@/sanity/queries";
import { Project } from "@/types/project";

export const revalidate = 0;

export default async function Home() {
  let projects: Project[] = [];
  try {
    projects = await client.fetch<Project[]>(PROJECTS_QUERY);
  } catch (error) {
    console.error("Error fetching projects from Sanity:", error);
    projects = [];
  }

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
