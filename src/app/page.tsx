import { Divider } from "@/components/divider";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Intro } from "@/components/intro";
import { ProjectCard } from "@/components/project-card";

const projects = Array.from({ length: 6 }, (_, index) => ({
  id: index + 1,
  title: `Project ${index + 1}`,
}));

export default function Home() {
  return (
    <div className="mx-auto min-h-screen w-full max-w-[1440px] bg-dough px-6 pb-16 pt-[60px] sm:px-14">
      <div className="mx-auto flex w-full max-w-[1334px] flex-col gap-12">
        <Header />

        <Intro />

        <Divider />

        <section className="grid grid-cols-1 gap-[42px] md:grid-cols-2 md:gap-x-[49px] md:gap-y-[42px]">
          {projects.map((project) => (
            <ProjectCard key={project.id} title={project.title} />
          ))}
        </section>

        <Divider />

        <Footer />
      </div>
    </div>
  );
}
