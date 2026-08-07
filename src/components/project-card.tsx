type ProjectCardProps = {
  title?: string;
  href?: string;
};

export function ProjectCard({ title, href = "#" }: ProjectCardProps) {
  return (
    <a
      href={href}
      className="group relative block aspect-[16/9] w-full overflow-hidden rounded-[45px] border border-willow-grey bg-dough transition-transform duration-300 hover:-translate-y-1"
      aria-label={title ?? "Project"}
    >
      <div className="dot-grid absolute inset-0 rounded-[45px]" />
      <div className="absolute inset-0 rounded-[45px] ring-1 ring-inset ring-willow-grey/30 transition-colors group-hover:ring-willow-grey/60" />
    </a>
  );
}
