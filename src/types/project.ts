export type CaseStudyBlockType =
  | "textSection"
  | "mediaBlock"
  | "decisionBlock"
  | "featureBlock"
  | "comparisonBlock"
  | "reflectionBlock";

export interface AnnotationItem {
  text: string;
  type?: "arrow" | "circle" | "underline" | "label";
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";
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
  media?: {
    image?: string;
    alt?: string;
    caption?: string;
    placeholderTitle?: string;
  };
}

export interface MediaBlockItem {
  _type: "mediaBlock";
  _key?: string;
  id?: string;
  mediaType?: "image" | "video";
  image?: string;
  video?: string;
  alt?: string;
  caption?: string;
  placeholderTitle?: string;
  size?: "normal" | "wide" | "full";
  annotation?: AnnotationItem;
}

export interface FeatureSubItem {
  _key?: string;
  eyebrow?: string;
  number?: string;
  title: string;
  body: string;
  mediaType?: "image" | "video";
  image?: string;
  video?: string;
  placeholderTitle?: string;
  caption?: string;
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
  body?: string | string[];
  subsections?: DecisionSubsection[];
  media?: string;
  mediaType?: "image" | "video";
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
  | FeatureBlockItem
  | DecisionBlockItem
  | ComparisonBlockItem
  | ReflectionBlockItem;

export interface ProjectHeroMedia {
  mediaType?: "image" | "video";
  image?: string;
  video?: string;
  alt?: string;
  caption?: string;
  placeholderTitle?: string;
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
  timeline?: string;
  category?: string;
  image?: string;
  cardThumbnail?: string;
  cardDemo?: string;
  muxVideo?: MuxVideoAsset;
  muxPlaybackId?: string;
  muxThumbTime?: number;
  heroMedia?: ProjectHeroMedia;
  gradient?: string;
  href?: string;
  actionText?: string;
  cursorLabel?: string;
  order?: number;
  overview?: string;
  challenge?: string;
  solution?: string;
  impact?: string;
  caseStudy?: CaseStudyBlock[];
}
