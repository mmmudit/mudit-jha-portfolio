# Component inventory

This inventory covers exported UI under `src/components`, excluding the design-system catalog itself. “Canonical” means agents may choose it for the stated role. “Composed” means use the owning page/feature rather than mounting its internals elsewhere. “Supporting” means an implementation detail. “Experimental” means do not use in product without an explicit adoption decision.

## Canonical reusable components

| Component | Source | Role |
| --- | --- | --- |
| `NavigationTabs` | `NavigationTabs.tsx` | Primary route tabs |
| `LiveClock` | `live-clock.tsx` | Header globe/time or footer time |
| `Divider` | `divider.tsx` | Major section separator |
| `AboutSectionHeader` | `about-section-header.tsx` | About heading with year/category filters |
| `ProjectGrid` | `project-grid.tsx` | Work index and modal owner |
| `ProjectCard` | `project-card.tsx` | Work project card inside its owner |
| `DragCanvas` | `DragCanvas.tsx` | Spatial `/play` collection |
| `TactileFolderCard` | `TactileFolderCard.tsx` | Play collection/folder |
| `TactilePhotoCard` | `TactilePhotoCard.tsx` | About portrait reveal |
| `SmartLinkPreview` | `smart-link-preview.tsx` | Product URL/email preview |
| `EmailPreviewBadge` | `email-preview-badge.tsx` | Fixed portfolio email preview |
| `Magnetic` | `magnetic.tsx` | Fine-pointer attraction wrapper |
| `Typewriter` | `fancy/text/typewriter.tsx` | About-section typing effect |
| `InteractiveTsuLogo` | `tsu-logo.tsx` | Shared interactive eye mark |

## Composed route and feature owners

| Component | Source | Owner |
| --- | --- | --- |
| `Header` | `header.tsx` | `src/app/layout.tsx` |
| `DynamicIslandNav` | `dynamic-island-nav.tsx` | `Header` |
| `Intro` | `intro.tsx` | Home |
| `Footer` | `footer.tsx` | Home, about, and project routes |
| `AboutHeroSection` | `about-hero-section.tsx` | About |
| `AboutEssaysSection` | `about-essays-section.tsx` | About |
| `AboutReadsSection` | `about-reads-section.tsx` | About |
| `AboutMusicSection` | `about-music-section.tsx` | About |
| `AboutMomentsSection` | `about-moments-section.tsx` | About |
| `ExpandedProjectView` | `case-study/ExpandedProjectView.tsx` | Project route/modal |
| `CaseStudyRenderer` | `case-study/CaseStudyRenderer.tsx` | Project story |
| `CaseStudyHero` | `case-study/CaseStudyHero.tsx` | Renderer |
| `CaseStudyMetadata` | `case-study/CaseStudyMetadata.tsx` | Case-study hero |
| `ZeroGravityHome` | `zero-gravity/ZeroGravityHome.tsx` | Home mode |

## Case-study internals

`CaseStudySection`, `MediaBlock`, `FigmaEmbedBlock`, `FeatureBlock`, `DecisionBlock`, `ComparisonBlock`, `ReflectionBlock`, `HanddrawnAnnotation`, `HighlightFeatureBlock`, `FeatureContentBlock`, `StatementBlock`, `GalleryBlock`, `ProcessBlock`, and `ResultsBlock` are selected by `CaseStudyRenderer`. Author content types; do not choose these components in page code.

## Supporting internals

| Component | Source | Used by |
| --- | --- | --- |
| `IntroLoader` | `IntroLoader.tsx` | Global shell |
| `PageTransition` | `PageTransition.tsx` | Global shell |
| `GrainOverlay` | `grain-overlay.tsx` | Global shell |
| `SoundProvider` | `sound-provider.tsx` | Global shell |
| `CursorClickEffect` | `cursor-click-effect.tsx` | Global shell |
| `CursorPill` | `cursor-pill.tsx` | Project grid |
| `ProjectModal` | `project-modal.tsx` | Project grid |
| `MuxHoverVideo` | `mux-hover-video.tsx` | Project card |
| `AppleDockText` | `apple-dock-text.tsx` | Home intro |
| `UmnHoverPreview` | `umn-hover-preview.tsx` | Home intro |
| `MagneticScroll` | `magnetic-scroll.tsx` | About route |
| `MobileScrollReveal` | `mobile-scroll-reveal.tsx` | About route |
| `PixelAudioVisualizer` | `PixelAudioVisualizer.tsx` | About music |
| `LiquidGlassReveal` | `LiquidGlassReveal.tsx` | Tactile photo card |
| `PixelDissolveReveal` | `PixelDissolveReveal.tsx` | Tactile photo card |
| `VoxelGlobeHero` | `hero/VoxelGlobeHero.tsx` | Live clock |
| `ZeroGravityCosmos` | `zero-gravity/ZeroGravityCosmos.tsx` | Global shell |
| `ZeroGravityNotification` | `zero-gravity/ZeroGravityNotification.tsx` | Zero-gravity state |

## Experimental or legacy exports

| Component | Evidence | Rule |
| --- | --- | --- |
| `LinkPreview` | Prototype and catalog only | Do not replace product previews without adoption |
| `FlipCard` | Prototype only | Do not use as a base card |
| `MagneticText` | Text-animation prototype only | Its ten variants are experiments |
| `TextFlip` | No product call site | Do not add until a product use is approved |
| `SpaceFSOrbitHero` | Commented home call site | Not part of the current product |
| `PulsingGlobe` | Prototype only | Use `LiveClock` for the product globe |
| root `Typewriter` | Duplicate export | Product imports `fancy/text/typewriter.tsx` |

`AgentationClient` is development tooling, not design-system UI. Shader collections under `src/shaders` and all `src/app/prototypes` variants remain isolated experiments.
