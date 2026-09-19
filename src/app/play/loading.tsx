"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const skeleton = "animate-pulse rounded-lg bg-zinc-200/70 motion-reduce:animate-none dark:bg-zinc-800/70";

function CanvasCardSkeleton({ className }: { className: string }) {
  return (
    <div aria-hidden="true" className={`absolute ${className} rounded-[22px] border border-zinc-300/60 bg-[#fbfaf5] p-3 shadow-sm dark:border-zinc-700 dark:bg-zinc-900`}>
      <div className={`${skeleton} aspect-[16/10] w-full rounded-[16px]`} />
      <div className="mt-3 space-y-2 px-1">
        <div className={`${skeleton} h-3 w-2/5`} />
        <div className={`${skeleton} h-4 w-4/5`} />
      </div>
    </div>
  );
}

export default function Loading() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const content = (
    <main id="main-content" aria-busy="true" aria-live="polite" className="fixed inset-0 w-screen h-[100dvh] z-0 overflow-hidden bg-dough select-none" tabIndex={-1}>
      <span className="sr-only">Loading playground</span>

      <div aria-hidden="true" className="absolute left-1/2 top-20 z-10 -translate-x-1/2 rounded-full border border-zinc-300/80 bg-[#fbfaf5]/90 px-4 py-2 shadow-sm dark:border-zinc-700 dark:bg-zinc-900/90">
        <div className="flex items-center gap-2">
          <span className={`${skeleton} size-2 rounded-full`} />
          <span className={`${skeleton} h-3 w-24`} />
          <span className={`${skeleton} h-3 w-28`} />
        </div>
      </div>

      <div aria-hidden="true" className="absolute left-1/2 top-1/2 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 px-6 text-center">
        <div className={`${skeleton} mx-auto h-12 w-64 sm:h-16 sm:w-80`} />
        <div className={`${skeleton} mx-auto mt-5 h-5 w-full max-w-lg`} />
        <div className={`${skeleton} mx-auto mt-2 h-5 w-4/5 max-w-md`} />
      </div>

      <CanvasCardSkeleton className="left-[8%] top-[22%] hidden w-56 -rotate-3 md:block" />
      <CanvasCardSkeleton className="right-[9%] top-[18%] hidden w-64 rotate-3 md:block" />
      <CanvasCardSkeleton className="bottom-[13%] left-[16%] hidden w-64 rotate-2 md:block" />
      <CanvasCardSkeleton className="bottom-[11%] right-[15%] hidden w-56 -rotate-2 md:block" />
    </main>
  );

  if (!mounted || typeof document === "undefined") {
    return content;
  }

  return createPortal(content, document.body);
}
