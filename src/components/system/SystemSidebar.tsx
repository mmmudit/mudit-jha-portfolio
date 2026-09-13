"use client";

import React from "react";
import {
  Bookmark,
  Sparkles,
  Palette,
  Type,
  Layers,
  Zap,
  Box,
  FileCode2,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { play } from "@/lib/sound";

export interface NavGroup {
  label: string;
  items: {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }[];
}

export const SIDEBAR_GROUPS: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { id: "introduction", label: "Introduction", icon: Bookmark },
      { id: "brand", label: "Brand Mark & Logo", icon: Sparkles },
      { id: "principles", label: "Design Principles", icon: ShieldCheck, badge: "Rules" },
    ],
  },
  {
    label: "Foundations",
    items: [
      { id: "colors", label: "Colors & Palettes", icon: Palette, badge: "8 Tokens" },
      { id: "typography", label: "Typography & Layout", icon: Type, badge: "4 Roles" },
      { id: "materials", label: "Paper Surfaces & Shadows", icon: Layers },
      { id: "motion", label: "Motion & Physics", icon: Zap },
    ],
  },
  {
    label: "Live Components",
    items: [
      { id: "components", label: "All Components", icon: Box, badge: "Live" },
    ],
  },
  {
    label: "System Specs",
    items: [
      { id: "unions", label: "Closed Type Unions", icon: FileCode2 },
      { id: "accessibility", label: "WCAG Accessibility", icon: ShieldCheck },
    ],
  },
];

interface SystemSidebarProps {
  activeView: string;
  onSelectView: (view: string) => void;
  className?: string;
}

export function SystemSidebar({
  activeView,
  onSelectView,
  className = "",
}: SystemSidebarProps) {
  return (
    <nav
      aria-label="Design System Navigation"
      className={`flex flex-col gap-6 py-6 text-sm ${className}`}
    >
      {SIDEBAR_GROUPS.map((group) => (
        <div key={group.label} className="flex flex-col gap-1.5">
          <div className="px-3 py-1 text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-400 select-none">
            {group.label}
          </div>

          <div className="flex flex-col gap-0.5">
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    play("toggle", { volume: 0.3 });
                    onSelectView(item.id);
                  }}
                  className={`group flex items-center justify-between gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-all text-left cursor-pointer ${
                    isActive
                      ? "bg-[#eae3d2] text-zinc-900 font-semibold shadow-2xs border border-[#d9d0bb]"
                      : "text-zinc-600 hover:bg-[#f5efe3]/80 hover:text-zinc-900"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`size-3.5 shrink-0 transition-colors ${
                        isActive
                          ? "text-zinc-900"
                          : "text-zinc-400 group-hover:text-zinc-700"
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {item.badge && (
                      <span
                        className={`rounded px-1.5 py-0.5 text-[9px] font-mono tracking-wide ${
                          isActive
                            ? "bg-[#d9d0bb] text-zinc-900 font-bold"
                            : "bg-[#f5efe3] text-zinc-500 border border-[#e4dccb]"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {isActive && (
                      <ChevronRight className="size-3 text-zinc-900 shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
