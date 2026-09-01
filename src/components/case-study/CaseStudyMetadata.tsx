import React from "react";

interface CaseStudyMetadataProps {
  role?: string;
  event?: string;
  projectType?: string;
  team?: string[];
  skills?: string[];
  year?: string;
  className?: string;
}

export function CaseStudyMetadata({
  role = "Product Designer",
  event,
  projectType,
  team = [],
  skills = [],
  year,
  className = "",
}: CaseStudyMetadataProps) {
  const displayEvent = event || projectType || (year ? `Year ${year}` : "Project");

  return (
    <div
      className={`grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 py-6 sm:py-8 border-y border-black/5 ${className}`}
    >
      {/* Role */}
      <div className="space-y-1">
        <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-400 font-medium">
          ROLE
        </p>
        <p className="font-sans text-xs sm:text-sm font-medium text-zinc-800">
          {role}
        </p>
      </div>

      {/* Event / Type */}
      <div className="space-y-1">
        <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-400 font-medium">
          EVENT
        </p>
        <p className="font-sans text-xs sm:text-sm font-medium text-zinc-800">
          {displayEvent}
        </p>
      </div>

      {/* Team */}
      <div className="space-y-1">
        <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-400 font-medium">
          TEAM
        </p>
        {team.length > 0 ? (
          <div className="font-sans text-xs sm:text-sm font-medium text-zinc-800 space-y-0.5">
            {team.map((member, i) => (
              <p key={i} className="leading-snug">{member}</p>
            ))}
          </div>
        ) : (
          <p className="font-sans text-xs sm:text-sm font-medium text-zinc-800">Solo</p>
        )}
      </div>

      {/* Skills */}
      <div className="space-y-1">
        <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-400 font-medium">
          SKILLS
        </p>
        {skills.length > 0 ? (
          <div className="font-sans text-xs sm:text-sm font-medium text-zinc-800 space-y-0.5">
            {skills.map((skill, i) => (
              <p key={i} className="leading-snug">{skill}</p>
            ))}
          </div>
        ) : (
          <p className="font-sans text-xs sm:text-sm font-medium text-zinc-800">Product Design</p>
        )}
      </div>
    </div>
  );
}
