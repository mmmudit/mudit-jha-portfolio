const skeleton = "animate-pulse rounded-lg bg-zinc-200/70 motion-reduce:animate-none dark:bg-zinc-800/70";

function DividerSkeleton() {
  return <div aria-hidden="true" className="h-px w-full bg-zinc-200 dark:bg-zinc-800" />;
}

function CarouselSkeleton({ cardClassName }: { cardClassName: string }) {
  return (
    <div aria-hidden="true" className="flex gap-4 overflow-hidden py-3 sm:gap-6">
      {[0, 1, 2, 3].map((item) => (
        <div key={item} className={`${skeleton} shrink-0 ${cardClassName}`} />
      ))}
    </div>
  );
}

export default function Loading() {
  return (
    <main aria-busy="true" aria-live="polite" className="min-h-screen">
      <span className="sr-only">Loading about page</span>

      <section aria-hidden="true" className="grid grid-cols-1 gap-8 pb-10 pt-28 sm:pb-20 sm:pt-36 lg:grid-cols-12 lg:gap-12">
        <div className="space-y-6 lg:col-span-8">
          <div className={`${skeleton} h-12 w-52 sm:h-14 sm:w-64`} />
          <div className="flex flex-wrap gap-3">
            <div className={`${skeleton} h-4 w-28`} />
            <div className={`${skeleton} h-4 w-32`} />
            <div className={`${skeleton} h-4 w-24`} />
          </div>
          <div className="max-w-2xl space-y-3">
            <div className={`${skeleton} h-5 w-full`} />
            <div className={`${skeleton} h-5 w-11/12`} />
            <div className={`${skeleton} h-5 w-4/5`} />
          </div>
          <div className="flex gap-3">
            <div className={`${skeleton} h-10 w-32 rounded-full`} />
            <div className={`${skeleton} h-10 w-28 rounded-full`} />
          </div>
        </div>
        <div className={`${skeleton} aspect-[4/5] w-full rounded-[26px] lg:col-span-4`} />
      </section>

      <DividerSkeleton />

      <section aria-hidden="true" className="space-y-6 pt-8 sm:pt-14">
        <div className={`${skeleton} h-9 w-56`} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className={`${skeleton} h-36 rounded-[22px]`} />
          <div className={`${skeleton} h-36 rounded-[22px]`} />
        </div>
      </section>

      <DividerSkeleton />

      <section aria-hidden="true" className="space-y-5 pt-8">
        <div className={`${skeleton} h-9 w-64`} />
        <CarouselSkeleton cardClassName="h-56 w-36 rounded-[16px]" />
      </section>

      <DividerSkeleton />

      <section aria-hidden="true" className="space-y-5 pt-8">
        <div className={`${skeleton} h-9 w-56`} />
        <CarouselSkeleton cardClassName="h-48 w-36 rounded-[16px]" />
      </section>
    </main>
  );
}
