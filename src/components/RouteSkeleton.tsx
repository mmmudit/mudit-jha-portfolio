"use client";

import React from "react";
import { usePathname } from "next/navigation";

const skeleton =
  "animate-pulse rounded-lg bg-zinc-200/70 motion-reduce:animate-none dark:bg-zinc-800/70";

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

function HomeSkeleton() {
  return (
    <main aria-busy="true" aria-live="polite" className="min-h-screen">
      <span className="sr-only">Soft reloading portfolio</span>

      <section
        aria-hidden="true"
        className="mt-14 flex flex-col items-start justify-between gap-8 sm:mt-24 md:mt-40 md:flex-row md:items-center md:gap-10"
      >
        <div className="max-w-2xl space-y-4">
          <div className={`${skeleton} h-12 w-48 sm:h-14 sm:w-56`} />
          <div className="space-y-2">
            <div className={`${skeleton} h-6 w-full max-w-xl`} />
            <div className={`${skeleton} h-6 w-4/5 max-w-lg`} />
          </div>
        </div>
        <div className={`${skeleton} size-32 self-start rounded-full md:self-auto`} />
      </section>

      <div
        aria-hidden="true"
        className="my-12 h-px w-full bg-zinc-200 dark:bg-zinc-800"
      />

      <section
        aria-label="Loading projects"
        className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-x-8 md:gap-y-10"
      >
        <ProjectCardSkeleton />
        <ProjectCardSkeleton />
        <ProjectCardSkeleton />
        <ProjectCardSkeleton />
      </section>
    </main>
  );
}

function PlaySkeleton() {
  return (
    <main
      aria-busy="true"
      aria-live="polite"
      className="w-full min-h-[70vh] flex flex-col items-center justify-center relative select-none pt-20"
    >
      <span className="sr-only">Soft reloading playground</span>

      <div
        aria-hidden="true"
        className="rounded-full border border-zinc-300/80 bg-[#fbfaf5]/90 px-4 py-2 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/90 mb-8"
      >
        <div className="flex items-center gap-2">
          <span className={`${skeleton} size-2 rounded-full`} />
          <span className={`${skeleton} h-3 w-24`} />
          <span className={`${skeleton} h-3 w-28`} />
        </div>
      </div>

      <div
        aria-hidden="true"
        className="w-full max-w-2xl px-6 text-center space-y-4 mb-12"
      >
        <div className={`${skeleton} mx-auto h-12 w-64 sm:h-16 sm:w-80`} />
        <div className={`${skeleton} mx-auto mt-5 h-5 w-full max-w-lg`} />
        <div className={`${skeleton} mx-auto mt-2 h-5 w-4/5 max-w-md`} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <div className={`${skeleton} aspect-[16/10] w-full rounded-[22px]`} />
        <div className={`${skeleton} aspect-[16/10] w-full rounded-[22px]`} />
        <div className={`${skeleton} aspect-[16/10] w-full rounded-[22px]`} />
      </div>
    </main>
  );
}

function AboutSkeleton() {
  return (
    <main aria-busy="true" aria-live="polite" className="min-h-screen">
      <span className="sr-only">Soft reloading about page</span>

      <section
        aria-hidden="true"
        className="grid grid-cols-1 gap-8 pb-10 pt-28 sm:pb-20 sm:pt-36 lg:grid-cols-12 lg:gap-12"
      >
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

      <div aria-hidden="true" className="h-px w-full bg-zinc-200 dark:bg-zinc-800 my-8" />

      <section aria-hidden="true" className="space-y-6 pt-4">
        <div className={`${skeleton} h-9 w-56`} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className={`${skeleton} h-36 rounded-[22px]`} />
          <div className={`${skeleton} h-36 rounded-[22px]`} />
        </div>
      </section>
    </main>
  );
}

export function RouteSkeleton({ pathname }: { pathname?: string }) {
  const currentPath = usePathname() || pathname || "/";

  if (currentPath === "/play") {
    return <PlaySkeleton />;
  }

  if (currentPath === "/about") {
    return <AboutSkeleton />;
  }

  return <HomeSkeleton />;
}
