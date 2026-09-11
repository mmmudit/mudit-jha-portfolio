"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import clsx from "clsx";

type Tab = {
  id: string;
  label: string;
  href: string;
};

type TabGeometry = Tab & {
  left: number;
  width: number;
  center: number;
};

type DragSession = {
  pointerId: number;
  startClientX: number;
  startPillX: number;
  lastClientX: number;
  lastTime: number;
  velocity: number;
};

const DEFAULT_TABS: Tab[] = [
  { id: "work", label: "work", href: "/" },
  { id: "play", label: "play", href: "/play" },
  { id: "about", label: "about", href: "/about" },
];

const DRAG_THRESHOLD = 4;

function getTabForPath(tabs: Tab[], pathname: string | null) {
  if (!pathname) return undefined;

  return tabs.find(
    (tab) =>
      tab.href === pathname ||
      (tab.href !== "/" && pathname.startsWith(tab.href)),
  );
}

function rubberband(distance: number, dimension: number, constant = 0.32) {
  return (
    (distance * dimension * constant) /
    (dimension + constant * Math.abs(distance))
  );
}

function nearestTab(geometries: TabGeometry[], point: number) {
  return geometries.reduce((nearest, tab) =>
    Math.abs(tab.center - point) < Math.abs(nearest.center - point)
      ? tab
      : nearest,
  );
}

export default function NavigationTabs({
  tabs = DEFAULT_TABS,
  initialActiveId,
}: {
  tabs?: Tab[];
  initialActiveId?: string;
  layoutId?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const reduce = useReducedMotion();
  const navRef = useRef<HTMLElement>(null);
  const tabRefs = useRef(new Map<string, HTMLAnchorElement>());
  const dragSessionRef = useRef<DragSession | null>(null);
  const didDragRef = useRef(false);
  const [geometries, setGeometries] = useState<TabGeometry[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragTargetId, setDragTargetId] = useState<string>();
  const pathActiveId = getTabForPath(tabs, pathname)?.id ?? initialActiveId;
  const [optimisticSelection, setOptimisticSelection] = useState<{
    sourcePath: string | null;
    id: string;
  }>();
  const activeId =
    optimisticSelection?.sourcePath === pathname
      ? optimisticSelection.id
      : pathActiveId;
  const setActiveId = useCallback(
    (id: string) => {
      setOptimisticSelection({ sourcePath: pathname, id });
    },
    [pathname],
  );

  const xTarget = useMotionValue(0);
  const widthTarget = useMotionValue(0);
  const stretchTarget = useMotionValue(1);
  const xSpring = useSpring(xTarget, {
    stiffness: 720,
    damping: 48,
    mass: 0.55,
  });
  const widthSpring = useSpring(widthTarget, {
    stiffness: 560,
    damping: 42,
    mass: 0.6,
  });
  const stretchSpring = useSpring(stretchTarget, {
    stiffness: 520,
    damping: 30,
    mass: 0.45,
  });

  const measureTabs = useCallback(() => {
    const nav = navRef.current;
    if (!nav) return;

    const navRect = nav.getBoundingClientRect();
    const nextGeometries = tabs.flatMap((tab) => {
      const element = tabRefs.current.get(tab.id);
      if (!element) return [];

      const rect = element.getBoundingClientRect();
      const left = rect.left - navRect.left;

      return [
        {
          ...tab,
          left,
          width: rect.width,
          center: left + rect.width / 2,
        },
      ];
    });

    setGeometries(nextGeometries);
  }, [tabs]);

  useLayoutEffect(() => {
    measureTabs();

    const nav = navRef.current;
    if (!nav) return;

    const resizeObserver = new ResizeObserver(measureTabs);
    resizeObserver.observe(nav);
    tabRefs.current.forEach((element) => resizeObserver.observe(element));

    return () => resizeObserver.disconnect();
  }, [measureTabs]);

  useEffect(() => {
    if (dragSessionRef.current) return;

    const activeGeometry = geometries.find((tab) => tab.id === activeId);
    if (!activeGeometry) return;

    xTarget.set(activeGeometry.left);
    widthTarget.set(activeGeometry.width);
    stretchTarget.set(1);
  }, [activeId, geometries, stretchTarget, widthTarget, xTarget]);

  const finishDrag = useCallback(
    (event: ReactPointerEvent<HTMLElement>, cancelled = false) => {
      const session = dragSessionRef.current;
      if (!session || event.pointerId !== session.pointerId) return;

      dragSessionRef.current = null;
      setIsDragging(false);
      stretchTarget.set(1);

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }

      const currentTab = geometries.find((tab) => tab.id === activeId);
      if (cancelled || !didDragRef.current || geometries.length === 0) {
        if (currentTab) {
          xTarget.set(currentTab.left);
          widthTarget.set(currentTab.width);
        }
        setDragTargetId(undefined);
        return;
      }

      const navRect = navRef.current?.getBoundingClientRect();
      if (!navRect) return;

      const projectedPoint =
        event.clientX - navRect.left + session.velocity * 0.09;
      const destination = nearestTab(geometries, projectedPoint);

      setActiveId(destination.id);
      setDragTargetId(destination.id);
      xTarget.set(destination.left);
      widthTarget.set(destination.width);

      if (destination.id !== activeId) {
        router.push(destination.href);
      }

      window.setTimeout(() => {
        didDragRef.current = false;
        setDragTargetId(undefined);
      }, 0);
    },
    [
      activeId,
      geometries,
      router,
      setActiveId,
      stretchTarget,
      widthTarget,
      xTarget,
    ],
  );

  const handlePointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.button !== 0 || geometries.length === 0) return;

    const link = (event.target as HTMLElement).closest<HTMLElement>(
      "[data-nav-tab]",
    );
    if (link?.dataset.navTab !== activeId) return;

    const activeGeometry = geometries.find((tab) => tab.id === activeId);
    if (!activeGeometry) return;

    didDragRef.current = false;
    setDragTargetId(activeId);
    dragSessionRef.current = {
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startPillX: xTarget.get(),
      lastClientX: event.clientX,
      lastTime: event.timeStamp,
      velocity: 0,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const session = dragSessionRef.current;
    if (!session || event.pointerId !== session.pointerId) return;

    const delta = event.clientX - session.startClientX;
    if (!didDragRef.current && Math.abs(delta) < DRAG_THRESHOLD) return;

    if (!didDragRef.current) {
      didDragRef.current = true;
      setIsDragging(true);
    }

    event.preventDefault();

    const elapsed = Math.max(event.timeStamp - session.lastTime, 1);
    const instantaneousVelocity =
      ((event.clientX - session.lastClientX) / elapsed) * 1000;
    session.velocity = session.velocity * 0.65 + instantaneousVelocity * 0.35;
    session.lastClientX = event.clientX;
    session.lastTime = event.timeStamp;

    const nav = navRef.current;
    if (!nav) return;

    const navRect = nav.getBoundingClientRect();
    const pointerPosition = event.clientX - navRect.left;
    const targetTab = nearestTab(geometries, pointerPosition);
    const maxX = Math.max(navRect.width - targetTab.width, 0);
    const rawX = session.startPillX + delta;
    const nextX =
      rawX < 0
        ? rubberband(rawX, navRect.width)
        : rawX > maxX
          ? maxX + rubberband(rawX - maxX, navRect.width)
          : rawX;

    xTarget.set(nextX);
    widthTarget.set(targetTab.width);
    stretchTarget.set(
      reduce ? 1 : 1 + Math.min(Math.abs(session.velocity) / 9000, 0.09),
    );
    setDragTargetId(targetTab.id);
  };

  const visualActiveId = dragTargetId ?? activeId;
  const pillStyle = reduce
    ? { x: xTarget, width: widthTarget, scaleX: 1 }
    : { x: xSpring, width: widthSpring, scaleX: stretchSpring };

  return (
    <nav
      ref={navRef}
      className={clsx(
        "relative z-10 inline-flex touch-pan-y items-center gap-1 select-none",
        isDragging && "cursor-grabbing",
      )}
      aria-label="Main Navigation"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={(event) => finishDrag(event)}
      onPointerCancel={(event) => finishDrag(event, true)}
      onLostPointerCapture={(event) => finishDrag(event, true)}
      onDragStart={(event) => event.preventDefault()}
    >
      {geometries.length > 0 && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 overflow-hidden rounded-full border border-[rgba(200,213,187,0.9)] bg-[#C8D5BB]/80 backdrop-blur-xl backdrop-saturate-150 will-change-transform dark:border-white/15 dark:bg-willow-grey/80"
          style={{
            ...pillStyle,
            transformOrigin: "center",
          }}
        >
          <span className="absolute inset-x-1 top-px h-1/2 rounded-full bg-gradient-to-b from-white/55 to-transparent dark:from-white/15" />
          <span className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/20 dark:ring-white/10" />
        </motion.div>
      )}

      {tabs.map((tab) => {
        const isActive = visualActiveId === tab.id;

        return (
          <Link
            ref={(element) => {
              if (element) {
                tabRefs.current.set(tab.id, element);
              } else {
                tabRefs.current.delete(tab.id);
              }
            }}
            key={tab.id}
            href={tab.href}
            draggable={false}
            data-nav-tab={tab.id}
            data-cuelume-hover="tick"
            data-cuelume-press
            data-cuelume-release
            onClick={(event) => {
              if (didDragRef.current) {
                event.preventDefault();
                return;
              }

              setActiveId(tab.id);
            }}
            onDragStart={(event) => event.preventDefault()}
            className={clsx(
              "pressable relative rounded-full px-[15px] py-[6px] text-[18px] tracking-[-1px] transition-[transform,color] duration-150 active:scale-[0.97] motion-reduce:transform-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-1 select-none [-webkit-user-drag:none]",
              tab.id === activeId && (isDragging ? "cursor-grabbing" : "cursor-grab"),
              isActive
                ? "font-medium text-zinc-900 dark:text-zinc-100"
                : "font-normal text-zinc-500 dark:text-zinc-400 [@media(hover:hover)]:hover:text-zinc-900 dark:[@media(hover:hover)]:hover:text-zinc-100",
            )}
          >
            <span className="relative z-10 pointer-events-none">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
