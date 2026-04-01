"use client";

import { useState } from "react";
import {
  Cpu,
  Palette,
  Briefcase,
  Microscope,
  BookOpen,
  ChevronDown,
  ChevronUp,
  type LucideIcon,
} from "lucide-react";

// --- Types ---
type DegreeType = "Bachelor" | "Master";
type AppStatus = "open" | "closed";
type ContentVariant = "description" | "specializations";

interface Program {
  id: string;
  categoryIcon: LucideIcon;
  categoryName: string;
  applicationStatus: AppStatus;
  title: string;
  contentVariant: ContentVariant;
  description?: string;
  specializations?: string[];
  details: {
    credits: string;
    language: string;
    degree: DegreeType;
    educationalArea: string;
  };
  tags: string[];
}

// --- Sample data ---
const programs: Program[] = [
  {
    id: "1",
    categoryIcon: Cpu,
    categoryName: "Computer Science",
    applicationStatus: "open",
    title: "Computer Science and Engineering",
    contentVariant: "description",
    description:
      "A broad and deep programme covering algorithms, systems, AI, and software engineering. Prepares you for research or industry roles across all sectors of technology.",
    details: {
      credits: "300 hp",
      language: "English",
      degree: "Master",
      educationalArea: "Technology",
    },
    tags: ["Algorithms", "AI", "Systems", "Software"],
  },
  {
    id: "2",
    categoryIcon: Palette,
    categoryName: "Design",
    applicationStatus: "open",
    title: "Industrial Design Engineering",
    contentVariant: "specializations",
    specializations: [
      "Interaction Design",
      "Product Design",
      "Service Design",
      "Sustainable Design",
      "Design Research",
      "Design Management",
    ],
    details: {
      credits: "180 hp",
      language: "Swedish / English",
      degree: "Bachelor",
      educationalArea: "Design",
    },
    tags: ["Product", "UX", "Sustainability", "Research"],
  },
  {
    id: "3",
    categoryIcon: Cpu,
    categoryName: "Computer Science",
    applicationStatus: "closed",
    title: "Data Science and AI",
    contentVariant: "specializations",
    specializations: [
      "Machine Learning",
      "Computer Vision",
      "Natural Language Processing",
      "Statistical Learning",
      "Reinforcement Learning",
      "Data Engineering",
      "Explainable AI",
      "Bioinformatics",
    ],
    details: {
      credits: "120 hp",
      language: "English",
      degree: "Master",
      educationalArea: "Technology",
    },
    tags: ["ML", "AI", "Statistics", "Python"],
  },
  {
    id: "4",
    categoryIcon: Briefcase,
    categoryName: "Business",
    applicationStatus: "closed",
    title: "Economics and Finance",
    contentVariant: "description",
    description:
      "Foundational programme in microeconomics, macroeconomics, and financial theory. Builds analytical skills applicable to public policy and private finance.",
    details: {
      credits: "180 hp",
      language: "Swedish",
      degree: "Bachelor",
      educationalArea: "Social Sciences",
    },
    tags: ["Finance", "Economics", "Policy"],
  },
  {
    id: "5",
    categoryIcon: Microscope,
    categoryName: "Natural Sciences",
    applicationStatus: "open",
    title: "Physics and Astronomy",
    contentVariant: "specializations",
    specializations: [
      "Theoretical Physics",
      "Astrophysics",
      "Condensed Matter",
    ],
    details: {
      credits: "120 hp",
      language: "English",
      degree: "Master",
      educationalArea: "Natural Sciences",
    },
    tags: ["Physics", "Research", "Mathematics"],
  },
  {
    id: "6",
    categoryIcon: BookOpen,
    categoryName: "Engineering",
    applicationStatus: "open",
    title: "Mechanical Engineering",
    contentVariant: "description",
    description:
      "Core engineering sciences with a focus on thermodynamics, mechanics, and manufacturing. Strong industry links with project-based learning throughout.",
    details: {
      credits: "180 hp",
      language: "Swedish / English",
      degree: "Bachelor",
      educationalArea: "Technology",
    },
    tags: ["Mechanics", "Manufacturing", "CAD"],
  },
];

// --- Degree config — color + text so color is never the sole indicator ---
const degreeConfig = {
  Master: {
    iconColor: "text-violet-600",
    borderLeft: "border-l-violet-600",
    badge: "bg-violet-100 text-violet-700",
    dot: "bg-violet-500",
    label: "Master",
  },
  Bachelor: {
    iconColor: "text-blue-600",
    borderLeft: "border-l-blue-500",
    badge: "bg-blue-100 text-blue-700",
    dot: "bg-blue-500",
    label: "Bachelor",
  },
} satisfies Record<DegreeType, object>;

// --- Shared sub-components ---
function TopRow({ program }: { program: Program }) {
  const Icon = program.categoryIcon;
  const d = degreeConfig[program.details.degree];
  return (
    <div className="flex items-start justify-between gap-2">
      <div className="flex items-center gap-1.5">
        <Icon className={`size-4 shrink-0 ${d.iconColor}`} />
        <span className="text-xs font-medium text-muted-foreground">
          {program.categoryName}
        </span>
      </div>
      <span
        className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${
          program.applicationStatus === "open"
            ? "bg-green-100 text-green-700"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {program.applicationStatus === "open"
          ? "● Application open"
          : "○ Application closed"}
      </span>
    </div>
  );
}

function DegreeBadge({ degree }: { degree: DegreeType }) {
  const d = degreeConfig[degree];
  return (
    <span
      className={`text-xs font-semibold px-2 py-0.5 rounded-full w-fit ${d.badge}`}
    >
      {d.label}
    </span>
  );
}

function Details({ program }: { program: Program }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground border-t border-border pt-3">
      <span>
        <span className="font-medium text-foreground">Credits</span>
        {" · "}
        {program.details.credits}
      </span>
      <span>
        <span className="font-medium text-foreground">Language</span>
        {" · "}
        {program.details.language}
      </span>
      <span className="col-span-2">
        <span className="font-medium text-foreground">Area</span>
        {" · "}
        {program.details.educationalArea}
      </span>
    </div>
  );
}

function Tags({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <span
          key={tag}
          className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

function SpecializationsList({ program }: { program: Program }) {
  const d = degreeConfig[program.details.degree];
  return (
    <ul className="flex flex-col gap-1.5">
      {program.specializations?.map((s, i) => (
        <li key={i} className="flex items-center gap-2 text-sm text-foreground">
          <span className={`size-1.5 rounded-full shrink-0 ${d.dot}`} />
          {s}
        </li>
      ))}
    </ul>
  );
}

// --- Option C: Stretch rows ---
// Cards use h-full + flex-col so the middle content fills and footers align.
function CardStretch({ program }: { program: Program }) {
  const d = degreeConfig[program.details.degree];
  return (
    <div
      className={`flex flex-col h-full rounded-lg border border-border border-l-4 ${d.borderLeft} bg-card p-5 gap-4`}
    >
      <TopRow program={program} />

      <div className="flex flex-col gap-2">
        <DegreeBadge degree={program.details.degree} />
        <h3 className="font-semibold text-base text-foreground leading-snug">
          {program.title}
        </h3>
      </div>

      {/* flex-1: absorbs height difference so footer sticks to bottom */}
      <div className="flex-1">
        {program.contentVariant === "description" && program.description && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {program.description}
          </p>
        )}
        {program.contentVariant === "specializations" && (
          <SpecializationsList program={program} />
        )}
      </div>

      <Details program={program} />
      <Tags tags={program.tags} />
    </div>
  );
}

// --- Option D: Expandable ---
// Cards are uniform height. Description/specialisations expand on demand.
function CardExpandable({ program }: { program: Program }) {
  const [expanded, setExpanded] = useState(false);
  const d = degreeConfig[program.details.degree];

  const contentCount =
    program.contentVariant === "specializations"
      ? program.specializations?.length ?? 0
      : null;

  const toggleLabel =
    program.contentVariant === "description"
      ? "Read description"
      : `${contentCount} specialisation${contentCount !== 1 ? "s" : ""}`;

  return (
    <div
      className={`rounded-lg border border-border border-l-4 ${d.borderLeft} bg-card overflow-hidden`}
    >
      <div className="p-5 flex flex-col gap-4">
        <TopRow program={program} />

        <div className="flex flex-col gap-2">
          <DegreeBadge degree={program.details.degree} />
          <h3 className="font-semibold text-base text-foreground leading-snug">
            {program.title}
          </h3>
        </div>

        <Details program={program} />
        <Tags tags={program.tags} />

        <button
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          className={`flex items-center gap-1.5 text-xs font-medium ${d.iconColor} hover:underline w-fit`}
        >
          {expanded ? (
            <ChevronUp className="size-3.5" aria-hidden />
          ) : (
            <ChevronDown className="size-3.5" aria-hidden />
          )}
          {expanded ? "Collapse" : toggleLabel}
        </button>
      </div>

      {expanded && (
        <div className="px-5 pb-5 border-t border-border pt-4 bg-muted/30">
          {program.contentVariant === "description" && program.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {program.description}
            </p>
          )}
          {program.contentVariant === "specializations" && (
            <SpecializationsList program={program} />
          )}
        </div>
      )}
    </div>
  );
}

// --- Showcase: both options side by side ---
export function EducationCard() {
  return (
    <div className="flex flex-col gap-16 py-8">
      {/* Option C */}
      <section className="flex flex-col gap-6">
        <div>
          <h2 className="text-lg font-semibold">Option C — Stretch rows</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Cards in the same row match the tallest. Content fills naturally,
            footer always aligns to the bottom.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
          {programs.map((p) => (
            <CardStretch key={p.id} program={p} />
          ))}
        </div>
      </section>

      {/* Option D */}
      <section className="flex flex-col gap-6">
        <div>
          <h2 className="text-lg font-semibold">Option D — Expandable</h2>
          <p className="text-sm text-muted-foreground mt-1">
            All cards same height. Description and specialisations expand on
            demand.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {programs.map((p) => (
            <CardExpandable key={p.id} program={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
