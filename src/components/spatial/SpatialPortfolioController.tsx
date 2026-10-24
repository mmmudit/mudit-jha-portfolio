"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Search, X, Sparkles, Filter, Info, Mail } from "lucide-react";
import SpatialCanvas, {
  DEFAULT_SPATIAL_PROJECTS,
  type SpatialProject,
  type PortfolioViewMode,
  type SpatialSubMode,
} from "./SpatialCanvas";

export interface SpatialPortfolioControllerProps {
  initialViewMode?: PortfolioViewMode;
  initialSpatialMode?: SpatialSubMode;
  projects?: SpatialProject[];
  theme?: "light" | "dark";
  brandTitle?: string;
  headlineFirstLine?: string;
  headlineSecondLine?: string;
  onContactClick?: () => void;
  onInfoClick?: () => void;
  className?: string;
}

export default function SpatialPortfolioController({
  initialViewMode = "spatial",
  initialSpatialMode = "orbit",
  projects = DEFAULT_SPATIAL_PROJECTS,
  theme = "light",
  brandTitle = "MUDIT JHA",
  headlineFirstLine = "Designer of unique",
  headlineSecondLine = "brands and interfaces",
  className = "",
}: SpatialPortfolioControllerProps) {
  // Main view state: "spatial" | "index"
  const [viewMode, setViewMode] = useState<PortfolioViewMode>(initialViewMode);
  // Spatial sub-mode: "orbit" | "float"
  const [spatialMode, setSpatialMode] = useState<SpatialSubMode>(initialSpatialMode);

  // Card inspection & hover state
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [hoveredProject, setHoveredProject] = useState<SpatialProject | null>(null);

  // Info modal state
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  // Index search & tag filtering
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("All");

  const isDark = theme === "dark";

  // Derive all unique tags
  const allTags = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => p.tags?.forEach((t) => set.add(t)));
    return ["All", ...Array.from(set)];
  }, [projects]);

  // Filtered projects for Index view
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTag =
        selectedTag === "All" || p.tags?.includes(selectedTag);

      return matchesSearch && matchesTag;
    });
  }, [projects, searchQuery, selectedTag]);

  // Selected project object for detail overlay
  const activeSelectedProject = useMemo(() => {
    return projects.find((p) => p.id === selectedProjectId) || null;
  }, [projects, selectedProjectId]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLElement &&
        (e.target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName))
      ) {
        return;
      }

      if (e.key.toLowerCase() === "i") {
        setViewMode("index");
      } else if (e.key.toLowerCase() === "s") {
        setViewMode("spatial");
      } else if (e.key.toLowerCase() === "o" && viewMode === "spatial") {
        setSpatialMode("orbit");
      } else if (e.key.toLowerCase() === "f" && viewMode === "spatial") {
        setSpatialMode("float");
      } else if (e.key === "Escape") {
        if (selectedProjectId) setSelectedProjectId(null);
        if (showInfoModal) setShowInfoModal(false);
        if (showContactModal) setShowContactModal(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewMode, selectedProjectId, showInfoModal, showContactModal]);

  return (
    <div
      className={`relative w-screen h-screen overflow-hidden select-none font-sans ${
        isDark ? "bg-[#090a0d] text-white" : "bg-[#ffffff] text-zinc-900"
      } ${className}`}
    >
      {/* ===================================================================== */}
      {/* TOP HEADER: BRAND, SEGMENTED PILL CONTROLLER, NAV LINKS                */}
      {/* ===================================================================== */}
      <header className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-6 sm:px-10 py-6 pointer-events-none">
        {/* Left: Brand Identity */}
        <div className="pointer-events-auto">
          <Link
            href="/"
            className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-zinc-900 hover:text-zinc-600 transition-colors"
          >
            {brandTitle}
          </Link>
        </div>

        {/* Center: Segmented View Controller Pill (Index | Spatial) */}
        <div className="pointer-events-auto flex flex-col items-center">
          <div
            role="tablist"
            aria-label="Portfolio View Modes"
            className="flex items-center p-1 rounded-full bg-zinc-100/90 border border-zinc-200/80 shadow-[0_1px_4px_rgba(0,0,0,0.04)] backdrop-blur-md"
          >
            {/* Index Mode Button */}
            <button
              role="tab"
              aria-selected={viewMode === "index"}
              onClick={() => setViewMode("index")}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                viewMode === "index"
                  ? "bg-white text-zinc-900 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-800"
              }`}
            >
              Index
            </button>

            {/* Spatial Mode Button */}
            <button
              role="tab"
              aria-selected={viewMode === "spatial"}
              onClick={() => setViewMode("spatial")}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                viewMode === "spatial"
                  ? "bg-white text-zinc-900 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-800"
              }`}
            >
              Spatial
            </button>
          </div>

          {/* Subtext caption matching Airla */}
          <p className="mt-2 text-[11px] text-zinc-400 font-sans tracking-tight">
            {viewMode === "spatial"
              ? "Scroll up to enter and drag to rotate"
              : "Showing all projects in index view"}
          </p>
        </div>

        {/* Right: Info, Contact & Status Dot */}
        <div className="pointer-events-auto flex items-center gap-6 text-xs font-medium">
          <button
            onClick={() => setShowInfoModal(true)}
            className="text-zinc-800 hover:text-zinc-500 transition-colors cursor-pointer"
          >
            Info
          </button>
          <button
            onClick={() => setShowContactModal(true)}
            className="text-zinc-800 hover:text-zinc-500 transition-colors cursor-pointer"
          >
            Contact
          </button>
          {/* Status Indicator Dot */}
          <span
            className="w-2.5 h-2.5 rounded-full bg-zinc-900 animate-pulse"
            title="Available for select creative engineering commissions"
          />
        </div>
      </header>

      {/* ===================================================================== */}
      {/* LAYER 1: SPATIAL 3D CANVAS (Pauses with frameloop="demand" in Index)  */}
      {/* ===================================================================== */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ease-out ${
          viewMode === "spatial"
            ? "opacity-100 pointer-events-auto z-10"
            : "opacity-0 pointer-events-none -z-10"
        }`}
      >
        <SpatialCanvas
          projects={projects}
          mode={spatialMode}
          theme={theme}
          viewMode={viewMode}
          selectedId={selectedProjectId}
          onProjectSelect={(id) => setSelectedProjectId(id)}
          onHoverChange={(proj) => setHoveredProject(proj)}
          showConstellations={true}
          showPointField={true}
        />
      </div>

      {/* ===================================================================== */}
      {/* SPATIAL SUB-MODE CONTROLS: RIGHT-EDGE VERTICAL TICK RULER (Airla Look) */}
      {/* ===================================================================== */}
      {viewMode === "spatial" && (
        <aside
          aria-label="Spatial Navigation Physics"
          className="absolute right-6 sm:right-8 top-1/2 -translate-y-1/2 z-30 flex flex-col items-end pointer-events-auto select-none"
        >
          {/* Vertical tick marks column */}
          <div className="flex flex-col items-end gap-[5px] mb-3">
            {Array.from({ length: 32 }).map((_, i) => (
              <span
                key={i}
                className={`transition-all duration-300 ${
                  i % 4 === 0
                    ? "w-3.5 h-[1.5px] bg-zinc-400"
                    : "w-1.5 h-[1px] bg-zinc-300/80"
                } ${
                  (spatialMode === "float" && i < 16) ||
                  (spatialMode === "orbit" && i >= 16)
                    ? "bg-zinc-700"
                    : ""
                }`}
              />
            ))}
          </div>

          {/* Toggle between 'Orbit' and 'Float' */}
          <div className="flex flex-col items-end gap-1.5">
            <button
              onClick={() => setSpatialMode("orbit")}
              className={`text-[11px] font-mono tracking-wider uppercase transition-colors cursor-pointer ${
                spatialMode === "orbit"
                  ? "text-zinc-900 font-semibold"
                  : "text-zinc-400 hover:text-zinc-600"
              }`}
            >
              Orbit
            </button>
            <button
              onClick={() => setSpatialMode("float")}
              className={`text-[11px] font-mono tracking-wider uppercase transition-colors cursor-pointer ${
                spatialMode === "float"
                  ? "text-zinc-900 font-semibold"
                  : "text-zinc-400 hover:text-zinc-600"
              }`}
            >
              Float
            </button>
          </div>
        </aside>
      )}

      {/* ===================================================================== */}
      {/* SPATIAL EDITORIAL HEADLINE: BOTTOM-LEFT (Exact Airla Typography)      */}
      {/* ===================================================================== */}
      {viewMode === "spatial" && selectedProjectId === null && (
        <div className="absolute bottom-8 sm:bottom-12 left-6 sm:left-12 z-30 pointer-events-none select-none max-w-md">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-normal tracking-[-0.03em] text-zinc-900 leading-[1.08] mb-3">
            <span>{headlineFirstLine}</span>
            <br />
            <span>{headlineSecondLine}</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 tracking-tight font-sans">
            Hover over work to see related nodes
          </p>
        </div>
      )}

      {/* ===================================================================== */}
      {/* LAYER 2: INDEX 2D GRID VIEW (Accessible, Clean, Responsive)          */}
      {/* ===================================================================== */}
      <div
        className={`absolute inset-0 pt-28 pb-16 px-6 sm:px-12 overflow-y-auto transition-opacity duration-500 ease-out ${
          viewMode === "index"
            ? "opacity-100 pointer-events-auto z-20"
            : "opacity-0 pointer-events-none -z-10"
        }`}
      >
        <div className="max-w-6xl mx-auto">
          {/* Index Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-8 mb-8 border-b border-zinc-200">
            {/* Tag Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${
                    selectedTag === tag
                      ? "bg-zinc-900 text-white shadow-sm"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Quick Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
              <input
                type="text"
                placeholder="Search experiments…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-full bg-zinc-100 border border-transparent focus:border-zinc-300 focus:bg-white text-xs text-zinc-900 placeholder:text-zinc-400 outline-none transition-all"
              />
            </div>
          </div>

          {/* 2D Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <article
                key={project.id}
                onClick={() => setSelectedProjectId(project.id)}
                className="group flex flex-col cursor-pointer"
              >
                {/* 16:10 Thumbnail Card */}
                <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200/80 shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />

                  {/* Year Tag Badge */}
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-[10px] font-mono text-white/90">
                    {project.year}
                  </span>
                </div>

                {/* Metadata */}
                <div className="mt-3 flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-medium text-zinc-900 group-hover:text-zinc-600 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs text-zinc-500 font-mono mt-0.5">
                      {project.category}
                    </p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 transition-colors mt-0.5" />
                </div>

                {/* Tags */}
                {project.tags && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {project.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] font-mono text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-md"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-sm text-zinc-500 font-mono">No matching projects found.</p>
            </div>
          )}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* PROJECT DETAILS MODAL OVERLAY                                         */}
      {/* ===================================================================== */}
      {activeSelectedProject && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setSelectedProjectId(null)}
        >
          <div
            className="relative w-full max-w-xl p-6 sm:p-8 rounded-3xl bg-white border border-zinc-200 shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedProjectId(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Thumbnail Preview */}
            <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden mb-6 bg-zinc-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeSelectedProject.image}
                alt={activeSelectedProject.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Category & Year */}
            <div className="flex items-center gap-2 mb-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: activeSelectedProject.accentColor || "#3b82f6" }}
              />
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                {activeSelectedProject.category} · {activeSelectedProject.year}
              </span>
            </div>

            <h2 className="text-2xl font-semibold text-zinc-900 tracking-tight mb-3">
              {activeSelectedProject.title}
            </h2>

            <p className="text-sm text-zinc-600 leading-relaxed mb-6 font-sans">
              {activeSelectedProject.description}
            </p>

            {/* Tags */}
            {activeSelectedProject.tags && (
              <div className="flex flex-wrap gap-1.5 mb-6">
                {activeSelectedProject.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-0.5 rounded-full bg-zinc-100 text-[11px] font-mono text-zinc-600"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
              {activeSelectedProject.link ? (
                <a
                  href={activeSelectedProject.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 text-white text-xs font-medium hover:bg-zinc-800 transition-colors"
                >
                  <span>Launch Experience</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              ) : (
                <span />
              )}

              <button
                onClick={() => setSelectedProjectId(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
              >
                Close (ESC)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* INFO MODAL OVERLAY                                                    */}
      {/* ===================================================================== */}
      {showInfoModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setShowInfoModal(false)}
        >
          <div
            className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl bg-white border border-zinc-200 shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowInfoModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block mb-2">
              About Mudit Jha
            </span>
            <h2 className="text-xl font-semibold text-zinc-900 tracking-tight mb-3">
              Spatial Interface & Creative Technologist
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed mb-4">
              Building next-generation spatial computing interfaces, real-time WebGL shaders, and high-frequency design engineering tools.
            </p>
            <p className="text-xs text-zinc-500 font-mono leading-normal">
              Featured across VisionOS explorations, generative physics systems, and tactile digital products.
            </p>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* CONTACT MODAL OVERLAY                                                 */}
      {/* ===================================================================== */}
      {showContactModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setShowContactModal(false)}
        >
          <div
            className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl bg-white border border-zinc-200 shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowContactModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block mb-2">
              Inquiries
            </span>
            <h2 className="text-xl font-semibold text-zinc-900 tracking-tight mb-3">
              Get in Touch
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed mb-6">
              Available for select creative technologist consulting, spatial UI prototyping, and high-craft frontend engineering.
            </p>
            <a
              href="mailto:mudit@muditjha.com"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-zinc-900 text-white text-xs font-medium hover:bg-zinc-800 transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>Email: mudit@muditjha.com</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
