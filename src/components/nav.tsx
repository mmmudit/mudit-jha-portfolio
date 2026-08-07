"use client";

import { useState } from "react";

const links = ["work", "play", "about"] as const;

type NavLink = (typeof links)[number];

export function Nav() {
  const [active, setActive] = useState<NavLink>("work");

  return (
    <nav className="flex items-center gap-1">
      {links.map((link) => {
        const isActive = active === link;

        return (
          <button
            key={link}
            type="button"
            onClick={() => setActive(link)}
            className={[
              "rounded-full px-[15px] py-[6px] text-[18px] font-light tracking-[-1px] transition-colors",
              isActive
                ? "nav-pill-active border border-white/50 px-[21px] text-button-primary"
                : "border border-transparent text-button-secondary hover:text-button-primary",
            ].join(" ")}
          >
            {link}
          </button>
        );
      })}
    </nav>
  );
}
