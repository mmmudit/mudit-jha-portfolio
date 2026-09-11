const skeleton = "animate-pulse rounded-lg bg-zinc-200/70 motion-reduce:animate-none dark:bg-zinc-800/70";

function ProjectCardSkeleton() {
  return (
    <article aria-hidden="true" className="flex flex-col gap-3">
      <div className={`${skeleton} aspect-video w-full rounded-[26px]`} />
      <div className="space-y-2 px-3">
        <div className={`${skeleton} h-5 w-2/5`} />
        <div className={`${skeleton} h-4 w-4/5`} />
      </div>
    </article>
  );
}

export default function Loading() {
  return (
    <main aria-busy="true" aria-live="polite" className="min-h-screen">
      <span className="sr-only">Loading portfolio</span>

      <section aria-hidden="true" className="mt-14 flex flex-col items-start justify-between gap-8 sm:mt-24 md:mt-40 md:flex-row md:items-center md:gap-10">
        <div className="max-w-2xl space-y-4">
          <div className={`${skeleton} h-12 w-48 sm:h-14 sm:w-56`} />
          <div className="space-y-2">
            <div className={`${skeleton} h-6 w-full max-w-xl`} />
            <div className={`${skeleton} h-6 w-4/5 max-w-lg`} />
          </div>
        </div>
        <div className={`${skeleton} size-32 self-start rounded-full md:self-auto`} />
      </section>

      <div aria-hidden="true" className="my-12 h-px w-full bg-zinc-200 dark:bg-zinc-800" />

      <section aria-label="Loading projects" className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-x-8 md:gap-y-10">
        <ProjectCardSkeleton />
        <ProjectCardSkeleton />
        <ProjectCardSkeleton />
        <ProjectCardSkeleton />
      </section>
    </main>
  );
}
