"use client";

import { useState } from "react";
import { ChevronDown, ArrowRight, ChevronRight } from "lucide-react";

// ── Chalmers brand tokens ─────────────────────────────────────
const PURPLE_DARK = "#472dbe";
const ACCENT = "#6746eb";
const BEIGE = "#f0ede6";
const PURPLE = "#755afc";

// ── Nav data ──────────────────────────────────────────────────
interface L2Item {
  label: string;
}
interface L1Item {
  label: string;
  l2: L2Item[];
}

const FORSKNING_L1: L1Item[] = [
  {
    label: "Forskningsområden i urval",
    l2: [
      { label: "Energi" },
      { label: "Hälsa och teknik" },
      { label: "IKT, digitalisering och AI" },
      { label: "Mark" },
      { label: "Materialvetenskap" },
      { label: "Nano" },
      { label: "Produktion" },
      { label: "Transport Rymd Ocean" },
      { label: "Biovetenskap" },
      { label: "Kemi och kemiteknik" },
      { label: "Arkitektur och samhällsbyggnad" },
      { label: "Elektroteknik" },
      { label: "Fysik" },
      { label: "Matematik" },
      { label: "Rymdvetenskap" },
      { label: "Havs- och vattenmiljö" },
      { label: "Klimat och miljö" },
      { label: "Industriell ekonomi" },
      { label: "Automation och mekatronik" },
      { label: "Nukleär teknik" },
    ],
  },
  {
    label: "Vi utbildar nya forskare",
    l2: [
      { label: "Forskarutbildning" },
      { label: "Forskarskolor" },
      { label: "Postdoktorer" },
      { label: "Karriärvägar inom forskning" },
    ],
  },
  {
    label: "Möt våra forskare",
    l2: [
      { label: "Professorprofiler" },
      { label: "Intervjuer" },
      { label: "Berättelser från forskning" },
      { label: "Gästforskare" },
    ],
  },
  {
    label: "Centrum",
    l2: [
      { label: "Kompetenscentrum" },
      { label: "Excellenscentrum" },
      { label: "Strategiska forskningsområden" },
      { label: "Samverkanscentrum" },
    ],
  },
  {
    label: "Forskningsinfrastrukturer",
    l2: [
      { label: "Laboratorier" },
      { label: "Testbäddar" },
      { label: "Databaser och plattformar" },
      { label: "Nationell infrastruktur" },
    ],
  },
  {
    label: "Populärvetenskap",
    l2: [
      { label: "Nyheter och artiklar" },
      { label: "Podd och video" },
      { label: "Utställningar" },
    ],
  },
];

const TOP_NAV = [
  "Institutioner",
  "Aktuellt",
  "Om oss",
  "Samarbete",
  "Forskning",
  "Utbildning",
];

export function MegaMenuFixed() {
  const [open, setOpen] = useState(true);
  const [activeL1, setActiveL1] = useState(0);

  const activeItem = FORSKNING_L1[activeL1];

  return (
    <div className="min-h-screen bg-white font-sans text-black">
      {/* Demo badge */}
      <div
        className="py-2 text-center text-xs font-semibold tracking-wider text-white"
        style={{ backgroundColor: ACCENT }}
      >
        OPTION 3 — Fixed-Height Mega Menu · each column scrolls independently
      </div>

      {/* ── Header ─────────────────────────────────────────── */}
      <header
        className="relative"
        style={{ borderBottom: `1px solid ${BEIGE}` }}
      >
        <div className="mx-auto flex h-[68px] max-w-screen-xl items-center justify-between px-16">
          {/* Logo placeholder */}
          <div
            className="h-8 w-28 rounded"
            style={{ backgroundColor: BEIGE }}
          />

          {/* Nav links */}
          <nav className="flex items-center gap-8">
            {TOP_NAV.map((item) => {
              const isForskning = item === "Forskning";
              return (
                <button
                  key={item}
                  onClick={() => isForskning && setOpen((v) => !v)}
                  className="flex items-center gap-1 py-3 text-[15px] font-medium transition-colors"
                  style={{ color: isForskning ? PURPLE_DARK : "#000" }}
                >
                  {item}
                  <ChevronDown
                    size={13}
                    className="mt-px transition-transform duration-200"
                    style={{
                      transform:
                        isForskning && open ? "rotate(180deg)" : undefined,
                      color: isForskning ? PURPLE_DARK : "#555",
                    }}
                  />
                </button>
              );
            })}
          </nav>
        </div>

        {/* ── Fixed-height mega menu panel ─────────────────── */}
        {open && (
          <div
            className="absolute inset-x-0 top-full z-50 flex bg-white shadow-[0_4px_20px_rgba(0,0,0,0.1)]"
            style={{
              borderTop: `1px solid ${BEIGE}`,
              borderBottom: `1px solid ${BEIGE}`,
            }}
          >
            <div className="mx-auto flex w-full max-w-screen-xl">
              {/* ── Column 1 — L1 items ──────────────────────── */}
              <div
                className="flex shrink-0 flex-col overflow-y-auto py-2"
                style={{
                  width: 340,
                  maxHeight: 420,
                  borderLeft: `2px solid ${ACCENT}`,
                }}
              >
                {/* Gå till Forskning */}
                <a
                  href="#"
                  className="flex items-center gap-2 px-8 py-[10px] text-[15px] font-medium hover:underline"
                  style={{ color: PURPLE_DARK }}
                  onClick={(e) => e.preventDefault()}
                >
                  <ArrowRight size={15} />
                  Gå till Forskning
                </a>

                {/* L1 items */}
                {FORSKNING_L1.map((item, i) => {
                  const isActive = i === activeL1;
                  return (
                    <button
                      key={item.label}
                      onClick={() => setActiveL1(i)}
                      className="flex w-full items-center justify-between gap-3 text-left text-[15px] font-medium transition-colors hover:bg-stone-50"
                      style={{
                        padding: "10px 20px",
                        paddingLeft: isActive ? "24px" : "30px",
                        backgroundColor: isActive ? BEIGE : undefined,
                        borderLeft: isActive
                          ? `8px solid ${ACCENT}`
                          : undefined,
                      }}
                    >
                      <span>{item.label}</span>
                      <ChevronRight
                        size={13}
                        style={{ color: ACCENT, flexShrink: 0 }}
                      />
                    </button>
                  );
                })}
              </div>

              {/* ── Column 2 — L2 items ──────────────────────── */}
              <div
                className="flex flex-1 flex-col overflow-y-auto py-2"
                style={{
                  maxHeight: 420,
                  borderLeft: `1px solid ${BEIGE}`,
                }}
              >
                {/* Gå till [active L1] */}
                <a
                  href="#"
                  className="flex items-center gap-2 px-8 py-[10px] text-[15px] font-medium hover:underline"
                  style={{ color: PURPLE_DARK }}
                  onClick={(e) => e.preventDefault()}
                >
                  <ArrowRight size={15} />
                  Gå till {activeItem.label}
                </a>

                {/* L2 items */}
                {activeItem.l2.map((item) => (
                  <a
                    key={item.label}
                    href="#"
                    className="flex items-center px-8 py-[10px] text-[15px] font-medium transition-colors hover:bg-stone-50"
                    style={{
                      borderLeft: `1px solid ${BEIGE}`,
                      color: "#000",
                    }}
                    onClick={(e) => e.preventDefault()}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ── Hero content ─────────────────────────────────────── */}
      <main className="mx-auto max-w-screen-xl px-16 py-16">
        <p
          className="mb-3 text-xs font-semibold uppercase tracking-widest"
          style={{ color: ACCENT }}
        >
          {open
            ? "Click any item in the left column to update the right column"
            : "Click Forskning in the nav to open the menu"}
        </p>
        <h1
          className="mb-8 text-5xl font-semibold leading-tight"
          style={{ color: PURPLE }}
        >
          Anmälan öppen till
          <br />
          höstens program
        </h1>
        <div className="h-64 rounded-lg" style={{ backgroundColor: BEIGE }} />
      </main>
    </div>
  );
}
