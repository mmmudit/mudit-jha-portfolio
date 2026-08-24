"use client";

import React from "react";
import { SmartLinkPreview } from "./smart-link-preview";

interface EmailPreviewBadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function EmailPreviewBadge({ children, className }: EmailPreviewBadgeProps) {
  return (
    <SmartLinkPreview
      url="mailto:hello@muditjha.me"
      fallbackTitle="Mudit Jha"
      fallbackDescription="Available for design engineering & creative tech collaborations."
      className={className}
    >
      {children}
    </SmartLinkPreview>
  );
}
