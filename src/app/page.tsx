import { Divider } from "@/components/divider";
import { Footer } from "@/components/footer";
import { Intro } from "@/components/intro";
import { ProjectCard } from "@/components/project-card";
import * as motion from "framer-motion";
import Rotate from "@/components/rotate";
import NavigationTabs from "@/components/NavigationTabs";

const projects = Array.from({ length: 6 }, (_, index) => ({
  id: index + 1,
  title: `Project ${index + 1}`,
}));

export default function Home() {
  return (
    <main className="min-h-screen pb-16">
      <div className="flex w-full flex-col gap-12">
        <section className="grid grid-cols-1 gap-[42px] md:grid-cols-2 md:gap-x-[49px] md:gap-y-[42px]">
          {projects.map((project) => (
            <ProjectCard key={project.id} title={project.title} />
          ))}
        </section>

        <Divider />
        <Footer />
      </div>
    </main>
  );
}
