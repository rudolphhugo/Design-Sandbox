"use client";

import { useState } from "react";
import { ChevronRight, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

type SectionId = "about" | "experience" | "education" | "skills" | "contact";

interface Section {
  id: SectionId;
  title: string;
  content: React.ReactNode;
}

// ─── Content ──────────────────────────────────────────────────────────────────

const sections: Section[] = [
  {
    id: "about",
    title: "About",
    content: (
      <div className="space-y-4 text-[15px] leading-relaxed text-[#4a4742]">
        <p>
          I am Tobias Wiklund, a frontend developer based in Gothenburg with a
          strong focus on building fast, usable, and maintainable web
          experiences. I enjoy working close to product and design to turn ideas
          into features that create clear value for users.
        </p>
        <p>
          My background combines modern frontend development with many years of
          work in media production, sound, and storytelling. That mix has shaped
          how I approach interfaces: with strong attention to detail, clear
          communication, and a practical mindset from concept to release.
        </p>
      </div>
    ),
  },
  {
    id: "experience",
    title: "Work Experience",
    content: (
      <div className="space-y-8 text-[15px]">
        <div>
          <div className="flex items-start justify-between gap-4 mb-1">
            <h3 className="font-semibold text-[#1a180e]">
              Frontend Developer — Intersport
            </h3>
            <span className="text-sm text-[#9a958e] shrink-0">
              Oct 2025 – Present
            </span>
          </div>
          <p className="text-sm text-[#9a958e] mb-3">Gothenburg</p>
          <p className="leading-relaxed text-[#4a4742]">
            Worked as a Frontend Developer in Intersport Sweden&apos;s
            e-commerce team, building and maintaining a multi-brand storefront
            platform with React and Next.js. Built reusable UI components in a
            shared design system and delivered features across key customer
            journeys such as landing pages, product listing, and product detail
            experiences. Integrated and maintained CMS-driven content in Sanity,
            enabling editors to publish campaigns and page content efficiently.
            Collaborated closely with product, design, and backend teams in an
            agile workflow with focus on performance, accessibility, SEO, code
            quality, and continuous improvement.
          </p>
        </div>
        <div>
          <div className="flex items-start justify-between gap-4 mb-1">
            <h3 className="font-semibold text-[#1a180e]">
              Frontend Developer — Stampen Media
            </h3>
            <span className="text-sm text-[#9a958e] shrink-0">
              Oct 2022 – Oct 2025
            </span>
          </div>
          <p className="text-sm text-[#9a958e] mb-3">Gothenburg</p>
          <p className="leading-relaxed text-[#4a4742]">
            Maintained and further developed Stampen Media&apos;s news sites in
            Västra Götaland (including Göteborgs-Posten) using React and
            Next.js. Delivered new features and improvements across the
            publishing platform, working in a cross-functional team with focus
            on reader experience, performance, accessibility, and continuous
            delivery.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "education",
    title: "Education",
    content: (
      <div className="space-y-5 text-[15px]">
        {[
          {
            degree: "Web Development CMS",
            school: "IT-högskolan, Gothenburg",
            year: "Graduated 2018",
          },
          {
            degree: "Media Design in Converging Media",
            school: "Högskolan på Gotland",
            year: "Bachelor's Degree, 2005",
          },
          {
            degree: "Media Program",
            school: "Rodengymnasiet, Norrtälje",
            year: "Graduated 2002",
          },
        ].map((item) => (
          <div key={item.degree}>
            <div className="flex items-start justify-between gap-4">
              <p className="font-semibold text-[#1a180e]">{item.degree}</p>
              <span className="text-sm text-[#9a958e] shrink-0">
                {item.year}
              </span>
            </div>
            <p className="text-sm text-[#9a958e] mt-0.5">{item.school}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "skills",
    title: "Tech Skills",
    content: (
      <div className="grid grid-cols-2 gap-x-12 gap-y-6 text-[15px]">
        {[
          {
            category: "Frontend",
            skills: [
              "React",
              "Next.js",
              "TypeScript",
              "JavaScript (ES6+)",
              "HTML",
              "CSS",
              "Responsive Design",
              "Component Design Systems",
            ],
          },
          {
            category: "CMS & Platforms",
            skills: ["Sanity", "WordPress", "E-commerce Frontends"],
          },
          {
            category: "Tooling & Workflow",
            skills: [
              "Git",
              "npm / pnpm",
              "Figma",
              "REST APIs",
              "Agile Collaboration",
              "Code Reviews",
              "Troubleshooting",
            ],
          },
          {
            category: "Quality Focus",
            skills: [
              "Core Web Vitals",
              "Accessibility",
              "WCAG",
              "SEO",
              "Performance Optimization",
              "Structured Root-Cause Analysis",
            ],
          },
        ].map((group) => (
          <div key={group.category}>
            <h3 className="font-semibold text-[#1a180e] mb-2">
              {group.category}
            </h3>
            <ul className="space-y-1">
              {group.skills.map((skill) => (
                <li key={skill} className="text-[#4a4742]">
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    content: (
      <div className="space-y-3 text-[15px] text-[#4a4742]">
        <p>Nils Dahlbecks gata 11, 41249 Göteborg</p>
        <p>0702203342</p>
        <div className="flex gap-4 pt-1">
          <a
            href="https://linkedin.com/in/yourname"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#2c7a48] underline underline-offset-2"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/yourname"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#2c7a48] underline underline-offset-2"
          >
            GitHub
          </a>
        </div>
      </div>
    ),
  },
];

// ─── Icons ────────────────────────────────────────────────────────────────────

function CheckIconActive() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="10" cy="10" r="10" fill="#2c7a48" />
      <path
        d="M6 10.5l2.5 2.5 5.5-6"
        stroke="white"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIconDefault() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="10" cy="10" r="9" stroke="#c4bfb8" strokeWidth="1.5" />
      <path
        d="M6 10.5l2.5 2.5 5.5-6"
        stroke="#c4bfb8"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Section Card ─────────────────────────────────────────────────────────────

function SectionCard({
  section,
  isSoundsGood,
  isExpanded,
  isLocked,
  onToggleSoundsGood,
  onToggleExpand,
}: {
  section: Section;
  isSoundsGood: boolean;
  isExpanded: boolean;
  isLocked: boolean;
  onToggleSoundsGood: () => void;
  onToggleExpand: () => void;
}) {
  return (
    <div className="bg-white rounded-xl overflow-hidden">
      <div className="flex items-center px-6 py-[18px] gap-3">
        {/* Title */}
        <span
          className={cn(
            "flex-1 font-semibold text-[17px] leading-none",
            isLocked ? "text-[#b8b3ad]" : "text-[#1a180e]"
          )}
        >
          {section.title}
        </span>

        {/* Sounds good badge / lock icon */}
        {isLocked ? (
          <Lock className="w-[18px] h-[18px] text-[#b8b3ad]" />
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSoundsGood();
            }}
            className={cn(
              "flex items-center gap-1.5 rounded-full transition-colors",
              isSoundsGood ? "px-2.5 py-1 bg-[#e6f5ed]" : "p-0"
            )}
            aria-label={
              isSoundsGood
                ? "Remove sounds good"
                : "Mark as sounds good"
            }
          >
            {isSoundsGood ? (
              <>
                <CheckIconActive />
                <span className="text-sm font-medium text-[#2c7a48] pr-0.5">
                  Sounds good!
                </span>
              </>
            ) : (
              <CheckIconDefault />
            )}
          </button>
        )}

        {/* Chevron */}
        <button
          onClick={onToggleExpand}
          disabled={isLocked}
          className={cn(
            "transition-transform duration-200 text-[#9a958e]",
            isExpanded && "rotate-90",
            isLocked && "opacity-40 cursor-default"
          )}
          aria-label={isExpanded ? "Collapse section" : "Expand section"}
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-6 pb-7 pt-1 border-t border-[#f0ede8]">
          {section.content}
        </div>
      )}
    </div>
  );
}

// ─── Main Layout ──────────────────────────────────────────────────────────────

export function TobiasCV() {
  const [soundsGood, setSoundsGood] = useState<Set<SectionId>>(new Set());
  const [expanded, setExpanded] = useState<Set<SectionId>>(new Set());

  const count = soundsGood.size;
  const contactUnlocked = count >= 4;

  const toggleSoundsGood = (id: SectionId) => {
    setSoundsGood((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleExpanded = (id: SectionId) => {
    if (id === "contact" && !contactUnlocked) return;
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "#ECEADF",
        fontFamily: "var(--font-dm-sans), sans-serif",
      }}
    >
      <div className="max-w-[980px] mx-auto px-10 py-14">
        <div className="flex gap-16">
          {/* ── Left sidebar ──────────────────────────────────── */}
          <aside className="w-[220px] shrink-0">
            {/* Profile photo */}
            <div className="mb-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://tobywi.github.io/lit-project/img/profile-pic.jpeg"
                alt="Tobias Wiklund"
                width={130}
                height={130}
                className="rounded-[14px] object-cover border border-[#d8d4cc]"
                style={{ width: 130, height: 130 }}
              />
            </div>

            {/* Name & title */}
            <h1 className="text-[19px] font-bold text-[#1a180e] leading-tight mb-1">
              Tobias Wiklund
            </h1>
            <p className="text-[14px] text-[#7a756e] mb-4">
              Frontend Developer
            </p>

            {/* Bio */}
            <p className="text-[13.5px] leading-relaxed text-[#6a6560]">
              I like to see the progress from a seed to a full-grown tree. I
              have a passion for building things that are both beautiful and
              functional, and I thrive in environments where I can learn and
              grow.
            </p>
          </aside>

          {/* ── Right content ─────────────────────────────────── */}
          <main className="flex-1 min-w-0">
            {/* Meter header */}
            <div className="flex items-start justify-between mb-2">
              <h2 className="text-[40px] font-bold text-[#1a180e] leading-none tracking-tight">
                Sounds Goodie-Meter
              </h2>
              <span className="text-[18px] font-medium text-[#9a958e] mt-1 ml-4 shrink-0">
                {count}/4
              </span>
            </div>

            {/* Description */}
            <p className="text-[14.5px] text-[#7a756e] leading-relaxed mb-6 max-w-[540px]">
              Explore the sections below and click Sounds Good on the ones you
              like. Once the Sounds Goodie-Meter reaches 4, the Contact section
              unlocks.
            </p>

            {/* Section cards */}
            <div className="space-y-[5px]">
              {sections.map((section) => {
                const isLocked =
                  section.id === "contact" && !contactUnlocked;
                return (
                  <SectionCard
                    key={section.id}
                    section={section}
                    isSoundsGood={soundsGood.has(section.id)}
                    isExpanded={expanded.has(section.id)}
                    isLocked={isLocked}
                    onToggleSoundsGood={() =>
                      toggleSoundsGood(section.id)
                    }
                    onToggleExpand={() => toggleExpanded(section.id)}
                  />
                );
              })}
            </div>

            {/* Unlock celebration */}
            {contactUnlocked && (
              <p className="mt-4 text-[13.5px] text-[#2c7a48] font-medium">
                Contact unlocked — reach out anytime!
              </p>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
