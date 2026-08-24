"use client";

import React from "react";
import { SmartLinkPreview } from "./smart-link-preview";

export interface LinkPreviewData {
  title: string;
  url: string;
  category?: string;
  description?: string;
  image?: string;
  icon?: React.ReactNode;
}

export interface ToonLinkPreviewProps {
  preview: LinkPreviewData;
  children: React.ReactNode;
  className?: string;
}

export function ToonLinkPreview({ preview, children, className }: ToonLinkPreviewProps) {
  return (
    <SmartLinkPreview
      url={preview.url}
      fallbackTitle={preview.title}
      fallbackCategory={preview.category}
      fallbackDescription={preview.description}
      fallbackImage={preview.image}
      className={className}
    >
      {children}
    </SmartLinkPreview>
  );
}
