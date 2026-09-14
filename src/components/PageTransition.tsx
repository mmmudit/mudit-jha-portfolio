"use client";

import { ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { FrozenRouter } from "./FrozenRouter";
import { useSoftReload } from "@/context/soft-reload-context";
import { RouteSkeleton } from "./RouteSkeleton";

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const { isSoftReloading, reloadKey } = useSoftReload();

  // Guard: group /projects routes under a stable key so modal URL sync
  // and inter-project navigation do not cause AnimatePresence to unmount the page
  const transitionKey = pathname.startsWith("/projects") ? "/projects" : pathname;

  const isPlayPage = pathname === "/play";

  return (
    <AnimatePresence mode="wait" initial={false}>
      {isSoftReloading ? (
        <motion.div
          key="soft-reload-skeleton"
          initial={{ opacity: 0, filter: "blur(4px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(4px)" }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="w-full transform-gpu"
        >
          <RouteSkeleton pathname={pathname} />
        </motion.div>
      ) : (
        <motion.div
          key={`${transitionKey}-reload-${reloadKey}`}
          initial={{
            opacity: isPlayPage ? 1 : 0,
            y: reduce || isPlayPage ? 0 : 8,
            filter: reduce || isPlayPage ? "blur(0px)" : "blur(3px)",
          }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{
            opacity: isPlayPage ? 1 : 0,
            y: reduce || isPlayPage ? 0 : -8,
            filter: reduce || isPlayPage ? "blur(0px)" : "blur(3px)",
          }}
          transition={{
            duration: reduce ? 0.12 : 0.25,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="w-full transform-gpu"
        >
          <FrozenRouter>{children}</FrozenRouter>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
