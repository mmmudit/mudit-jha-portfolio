import React from "react";
import { ArrowUpRight } from "lucide-react";
import { ProjectMetadataItem, MetadataValueItem } from "@/types/project";

interface CaseStudyMetadataProps {
  metadata?: ProjectMetadataItem[];
  role?: string;
  event?: string;
  projectType?: string;
  team?: string[] | MetadataValueItem[];
  skills?: string[] | MetadataValueItem[];
  year?: string;
  href?: string;
  className?: string;
}

export function CaseStudyMetadata({
  metadata,
  role = "Product Designer",
  event,
  projectType,
  team = [],
  skills = [],
  year,
  href,
  className = "",
}: CaseStudyMetadataProps) {
  // If custom metadata array is provided, use it directly (flexible 1-6 columns, default 4-grid)
  // Otherwise, construct standard 4-column metadata structure
  const fields: ProjectMetadataItem[] = metadata && metadata.length > 0
    ? metadata
    : [
        {
          label: "ROLE",
          value: role,
        },
        {
          label: "EVENT",
          value: event || projectType || (year ? `Year ${year}` : "Project"),
          href: href && href !== "#" ? href : undefined,
        },
        {
          label: "TEAM",
          value: team.length > 0 ? team : "Solo",
        },
        {
          label: "SKILLS",
          value: skills.length > 0 ? skills : "Product Design",
        },
      ];

  const renderValueItem = (item: string | MetadataValueItem, index: number) => {
    const text = typeof item === "string" ? item : item.text;
    const itemHref = typeof item === "object" ? item.href : undefined;

    if (itemHref) {
      const isExternal = itemHref.startsWith("http") || itemHref.startsWith("//");
      return (
        <a
          key={index}
          href={itemHref}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          data-cuelume-hover="tick"
          className="group/link inline-flex items-center gap-1 text-zinc-800 hover:text-zinc-950 font-medium underline underline-offset-4 decoration-zinc-300 hover:decoration-zinc-950 transition-colors leading-snug cursor-pointer"
        >
          <span>{text}</span>
          <ArrowUpRight className="size-3 text-zinc-400 group-hover/link:text-zinc-900 transition-transform duration-150 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
        </a>
      );
    }

    return (
      <p key={index} className="leading-snug text-zinc-800 font-medium">
        {text}
      </p>
    );
  };

  const renderFieldContent = (field: ProjectMetadataItem) => {
    // 1. If field has an explicit items list from Sanity (e.g. list of team members with individual links)
    if (field.items && field.items.length > 0) {
      return (
        <div className="font-sans text-xs sm:text-sm space-y-0.5">
          {field.items.map((item, i) => renderValueItem(item, i))}
        </div>
      );
    }

    // 2. If field has a top-level href and a simple string value
    if (field.href && typeof field.value === "string") {
      return renderValueItem({ text: field.value, href: field.href }, 0);
    }

    // 3. If field value is an array of items (strings or linked items)
    if (Array.isArray(field.value)) {
      return (
        <div className="font-sans text-xs sm:text-sm space-y-0.5">
          {field.value.map((val, i) => renderValueItem(val, i))}
        </div>
      );
    }

    // 4. Single item or string
    if (typeof field.value === "string") {
      return renderValueItem(field.value, 0);
    }

    return (
      <p className="font-sans text-xs sm:text-sm text-zinc-400 font-normal">
        —
      </p>
    );
  };

  // Determine grid column count (defaulting to 2 on mobile, 4 on tablet/desktop)
  const gridColsClass = fields.length === 2
    ? "grid-cols-2"
    : fields.length === 3
      ? "grid-cols-2 sm:grid-cols-3"
      : "grid-cols-2 sm:grid-cols-4";

  return (
    <div
      className={`grid ${gridColsClass} gap-4 sm:gap-6 py-6 sm:py-8 border-y border-black/5 ${className}`}
    >
      {fields.map((field, idx) => (
        <div key={field._key || field.label || idx} className="space-y-1 min-w-0">
          <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-400 font-medium truncate">
            {field.label}
          </p>
          <div className="font-sans text-xs sm:text-sm">
            {renderFieldContent(field)}
          </div>
        </div>
      ))}
    </div>
  );
}
