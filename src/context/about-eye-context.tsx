"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { usePathname } from "next/navigation";
import { play } from "@/lib/sound";

interface AboutEyeContextType {
  activeSection: string;
  isAbout: boolean;
}

const AboutEyeContext = createContext<AboutEyeContextType>({
  activeSection: "hero",
  isAbout: false,
});

export function AboutEyeProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAbout = pathname === "/about";
  const [activeSection, setActiveSection] = useState<string>("hero");
  const lastSectionRef = useRef<string>("hero");

  const checkActiveSection = useCallback(() => {
    // Disable heading drop interaction on mobile (width < 768px)
    if (!isAbout || typeof window === "undefined" || window.innerWidth < 768) {
      if (lastSectionRef.current !== "hero") {
        lastSectionRef.current = "hero";
        setActiveSection("hero");
      }
      return;
    }

    // Trigger line: 42% from the top of the viewport
    const triggerY = window.innerHeight * 0.42;

    // Check headings in descending page order (bottom to top)
    const sections = ["moments", "music", "reads", "essays"];
    let newSection = "hero";

    for (const id of sections) {
      const el = document.querySelector(`[data-about-heading="${id}"]`);
      if (el) {
        const rect = el.getBoundingClientRect();
        // A section heading is active once it has crossed into or above the trigger line
        if (rect.top <= triggerY) {
          newSection = id;
          break;
        }
      }
    }

    if (newSection !== lastSectionRef.current) {
      lastSectionRef.current = newSection;
      play("sparkle", { volume: 0.2 });
      setActiveSection(newSection);
    }
  }, [isAbout]);

  useEffect(() => {
    checkActiveSection();

    let animationFrameId: number;
    const handleScroll = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(checkActiveSection);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [checkActiveSection]);

  return (
    <AboutEyeContext.Provider value={{ activeSection, isAbout }}>
      {children}
    </AboutEyeContext.Provider>
  );
}

export function useAboutEye() {
  return useContext(AboutEyeContext);
}
