import { Intro } from "@/components/intro";
import { SpaceFSOrbitHero } from "@/components/spacefs-orbit-hero";
import { Divider } from "@/components/divider";
import { Footer } from "@/components/footer";
import { ProjectGrid } from "@/components/project-grid";
import { client } from "@/sanity/client";
import { PROJECTS_QUERY } from "@/sanity/queries";

export const revalidate = 0;

const defaultProjects = [
  {
    _id: "1",
    title: "Apple",
    slug: "apple",
    year: "2025",
    description: "Designing new features to drive spatial interaction and user delight.",
    image: "/assets/projects/apple_vision.png",
    gradient: "from-amber-100/80 via-rose-100/80 to-purple-100/80",
    href: "https://apple.com",
  },
  {
    _id: "2",
    title: "Roblox",
    slug: "roblox",
    year: "2024",
    description: "Reimagining the future of social gameplay and user communication.",
    image: "/assets/projects/canvas_os.png",
    gradient: "from-sky-100/80 via-blue-100/80 to-indigo-100/80",
    href: "https://roblox.com",
  },
  {
    _id: "3",
    title: "Polaroid Studio",
    slug: "polaroid-studio",
    year: "2025",
    description: "Interactive digital camera app with real-time film emulsion shaders.",
    image: "/assets/projects/polaroid_studio.png",
    actionText: "Try It Out!",
    gradient: "from-amber-100/80 via-orange-100/80 to-yellow-100/80",
    href: "#",
  },
  {
    _id: "4",
    title: "Screentime Receipt",
    slug: "screentime-receipt",
    year: "2025",
    description: "Visualizing personal digital consumption as thermal printed store receipts.",
    image: "/assets/projects/screentime_receipt.png",
    actionText: "Try It Out!",
    gradient: "from-stone-200/80 via-zinc-200/80 to-neutral-300/80",
    href: "#",
  },
  {
    _id: "5",
    title: "Film Diary",
    slug: "film-diary",
    year: "2024",
    description: "Cinematic frame archiver and automated color palette extraction tool.",
    image: "/assets/projects/polaroid_studio.png",
    actionText: "Try It Out!",
    gradient: "from-emerald-100/80 via-teal-100/80 to-cyan-100/80",
    href: "#",
  },
  {
    _id: "6",
    title: "Canvas OS",
    slug: "canvas-os",
    year: "2024-25",
    description: "Infinite spatial workspace with physics-based nodes and gesture flow.",
    image: "/assets/projects/canvas_os.png",
    actionText: "Try Prototype",
    gradient: "from-violet-100/80 via-purple-100/80 to-fuchsia-100/80",
    href: "#",
  },
];

export default async function Home() {
  let sanityProjects: any[] = [];
  try {
    sanityProjects = await client.fetch(PROJECTS_QUERY);
  } catch {
    sanityProjects = [];
  }

  const projects = sanityProjects && sanityProjects.length > 0 ? sanityProjects : defaultProjects;

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
