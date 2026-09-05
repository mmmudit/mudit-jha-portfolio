export type CaseStudyBlockType =
  | "textSection"
  | "mediaBlock"
  | "figmaEmbed"
  | "decisionBlock"
  | "featureBlock"
  | "comparisonBlock"
  | "reflectionBlock";

export interface AnnotationItem {
  text: string;
  type?: "arrow" | "circle" | "underline" | "label";
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";
}

export interface FigmaEmbedBlockItem {
  _type: "figmaEmbed";
  _key?: string;
  id?: string;
  eyebrow?: string;
  title?: string;
  figmaUrl: string;
  caption?: string;
  size?: "normal" | "wide" | "full";
  aspectRatio?: "16/9" | "16/10" | "4/3" | "1/1";
}

export interface DecisionPoint {
  title: string;
  body: string;
}

export interface DecisionCard {
  _key?: string;
  title: string;
  body: string;
  icon?: string;
}

export interface TextSectionBlock {
  _type: "textSection";
  _key?: string;
  id?: string;
  eyebrow?: string;
  heading?: string;
  body?: string | string[];
  subheading?: string;
  largeQuestion?: string;
  pipeline?: string[];
  conclusion?: string;
  cards?: DecisionCard[];
  media?: {
    image?: string;
    video?: string;
    muxVideo?: MuxVideoAsset;
    muxPlaybackId?: string;
    muxThumbTime?: number;
    alt?: string;
    caption?: string;
    placeholderTitle?: string;
  };
}

export interface MediaBlockItem {
  _type: "mediaBlock";
  _key?: string;
  id?: string;
  mediaType?: "image" | "video" | "mux" | "figma";
  image?: string;
  video?: string;
  muxVideo?: MuxVideoAsset;
  muxPlaybackId?: string;
  muxThumbTime?: number;
  figmaUrl?: string;
  alt?: string;
  caption?: string;
  placeholderTitle?: string;
  size?: "normal" | "wide" | "full";
  borderless?: boolean;
  removeBorder?: boolean;
  annotation?: AnnotationItem;
}

export interface FeatureSubItem {
  _key?: string;
  eyebrow?: string;
  number?: string;
  title: string;
  body: string;
  mediaType?: "image" | "video" | "mux";
  image?: string;
  video?: string;
  muxVideo?: MuxVideoAsset;
  muxPlaybackId?: string;
  muxThumbTime?: number;
  placeholderTitle?: string;
  caption?: string;
  borderless?: boolean;
}

export interface FeatureBlockItem {
  _type: "featureBlock";
  _key?: string;
  id?: string;
  eyebrow?: string;
  heading?: string;
  body?: string | string[];
  features?: FeatureSubItem[];
  media?: string;
  mediaType?: "image" | "video";
  caption?: string;
  placeholderTitle?: string;
}

export interface DecisionSubsection {
  _key?: string;
  title: string;
  body: string;
  media?: string;
  mediaType?: "image" | "video";
  placeholderTitle?: string;
  caption?: string;
}

export interface DecisionBlockItem {
  _type: "decisionBlock";
  _key?: string;
  id?: string;
  eyebrow?: string;
  number?: string;
  heading?: string;
  subheading?: string;
  body?: string | string[];
  context?: string | string[];
  decision?: string | string[];
  decisionPoints?: DecisionPoint[];
  why?: string | string[];
  tradeoff?: string | string[];
  cards?: DecisionCard[];
  subsections?: DecisionSubsection[];
  media?: string;
  mediaType?: "image" | "video" | "mux";
  image?: string;
  video?: string;
  muxVideo?: MuxVideoAsset;
  muxPlaybackId?: string;
  muxThumbTime?: number;
  placeholderTitle?: string;
  caption?: string;
  beforeMedia?: string;
  afterMedia?: string;
}

export interface ComparisonBlockItem {
  _type: "comparisonBlock";
  _key?: string;
  id?: string;
  eyebrow?: string;
  heading?: string;
  body?: string | string[];
  beforeMedia?: string;
  beforeLabel?: string;
  afterMedia?: string;
  afterLabel?: string;
  caption?: string;
  placeholderTitle?: string;
}

export interface ReflectionSubItem {
  _key?: string;
  number?: string;
  heading: string;
  body: string;
}

export interface ReflectionBlockItem {
  _type: "reflectionBlock";
  _key?: string;
  id?: string;
  eyebrow?: string;
  heading?: string;
  body?: string | string[];
  items?: ReflectionSubItem[];
}

export type CaseStudyBlock =
  | TextSectionBlock
  | MediaBlockItem
  | FigmaEmbedBlockItem
  | FeatureBlockItem
  | DecisionBlockItem
  | ComparisonBlockItem
  | ReflectionBlockItem;

export interface ContentBlockBase {
  _key: string;
  id?: string;
  eyebrow?: string;
  heading?: string;
  body?: string | string[];
}

export interface NarrativeBlock extends ContentBlockBase {
  _type: "narrative";
  subheading?: string;
  largeQuestion?: string;
}

export interface StatementBlock extends ContentBlockBase {
  _type: "statement";
}

export interface DesignDecisionContentBlock extends Omit<DecisionBlockItem, "_type"> {
  _type: "designDecision";
  number?: string;
  variant?: "default";
}

export interface MediaContentBlock extends Omit<MediaBlockItem, "_type" | "size"> {
  _type: "media";
  variant?: "contained" | "wide" | "fullBleed";
}

export interface FeatureContentBlock extends Omit<FeatureBlockItem, "_type" | "features"> {
  _type: "feature";
  variant?: "mediaLeft" | "mediaRight" | "mediaTop" | "fullWidth" | "sticky";
  image?: string;
  video?: string;
  muxVideo?: MuxVideoAsset;
  muxPlaybackId?: string;
  muxThumbTime?: number;
  alt?: string;
  caption?: string;
}

export interface HighlightFeatureBlock extends ContentBlockBase {
  _type: "highlightFeature";
  number?: string;
  image?: string;
  video?: string;
  muxVideo?: MuxVideoAsset;
  muxPlaybackId?: string;
  muxThumbTime?: number;
  alt?: string;
  caption?: string;
}

export interface GalleryBlock extends ContentBlockBase {
  _type: "gallery";
  variant?: "grid" | "wide";
  images: Array<{ _key: string; image?: string; alt?: string; caption?: string }>;
}

export interface ProcessBlock extends ContentBlockBase {
  _type: "process";
  steps?: Array<{ _key: string; title: string; body?: string; image?: string; alt?: string }>;
}

export interface ComparisonContentBlock extends Omit<ComparisonBlockItem, "_type" | "beforeMedia" | "afterMedia"> {
  _type: "comparison";
  beforeImage?: string;
  afterImage?: string;
  variant?: "sideBySide" | "slider";
}

export interface ResultsBlock extends ContentBlockBase {
  _type: "results";
  items?: Array<{ _key: string; value: string; label: string; detail?: string }>;
}

export interface ReflectionContentBlock extends Omit<ReflectionBlockItem, "_type"> {
  _type: "reflection";
}

export type ProjectContentBlock =
  | NarrativeBlock
  | StatementBlock
  | DesignDecisionContentBlock
  | MediaContentBlock
  | FeatureContentBlock
  | HighlightFeatureBlock
  | GalleryBlock
  | ProcessBlock
  | ComparisonContentBlock
  | ResultsBlock
  | ReflectionContentBlock;

export interface ProjectHeroMedia {
  mediaType?: "image" | "video" | "mux";
  image?: string;
  video?: string;
  muxVideo?: MuxVideoAsset;
  muxPlaybackId?: string;
  muxThumbTime?: number;
  alt?: string;
  caption?: string;
  placeholderTitle?: string;
  borderless?: boolean;
}

export interface MuxVideoAsset {
  playbackId?: string;
  assetId?: string;
  filename?: string;
  thumbTime?: number;
  status?: string;
  data?: {
    aspect_ratio?: string;
    duration?: number;
  };
}

export interface MetadataValueItem {
  text: string;
  href?: string;
}

export interface ProjectMetadataItem {
  _key?: string;
  label: string;
  value?: string | string[] | MetadataValueItem[];
  href?: string;
  items?: MetadataValueItem[];
}

export interface ProjectSnapshot {
  role?: string;
  team?: string | string[] | MetadataValueItem[];
  challenge?: string;
  concept?: string;
}

export interface Project {
  _id?: string;
  id?: string | number;
  title: string;
  slug?: string;
  tagline?: string;
  year?: string;
  description: string;
  projectType?: string;
  event?: string;
  role?: string;
  team?: string[] | MetadataValueItem[];
  skills?: string[] | MetadataValueItem[];
  metadata?: ProjectMetadataItem[];
  snapshot?: ProjectSnapshot;
  introQuestion?: string;
  introParagraphs?: string[];
  timeline?: string;
  category?: string;
  image?: string;
  navIcon?: string;
  icon?: string;
  cardThumbnail?: string;
  cardDemo?: string;
  muxVideo?: MuxVideoAsset;
  muxPlaybackId?: string;
  muxThumbTime?: number;
  heroMedia?: ProjectHeroMedia;
  gradient?: string;
  href?: string;
  externalLinkLabel?: string;
  actionText?: string;
  cursorLabel?: string;
  timelineItems?: { id: string; label: string }[];
  order?: number;
  overview?: string;
  challenge?: string;
  solution?: string;
  impact?: string;
  caseStudy?: CaseStudyBlock[];
  content?: ProjectContentBlock[];
}
