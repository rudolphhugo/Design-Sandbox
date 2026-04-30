"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

// ── Brand tokens ─────────────────────────────────────
const PURPLE_DARK = "#472dbe";
const ACCENT = "#6746eb";
const BEIGE = "#f0ede6";
const PURPLE = "#755afc";

// ── Nav data ──────────────────────────────────────────────────
interface L2Item { label: string }
interface L1Item { label: string; l2: L2Item[] }

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

// ── Slide animation ───────────────────────────────────────────
const slideVariants = {
  enter: (dir: number) => ({
    x: dir * 28,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] as const },
  },
  exit: (dir: number) => ({
    x: dir * -28,
    opacity: 0,
    transition: { duration: 0.15, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
};

export function MegaMenuDrillDown() {
  const [open, setOpen] = useState(false);
  const [activeL1, setActiveL1] = useState<number | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);

  const drillIn = (i: number) => {
    setDirection(1);
    setActiveL1(i);
  };

  const drillOut = () => {
    setDirection(-1);
    setActiveL1(null);
  };

  const toggleOpen = () => {
    setOpen((v) => !v);
    if (open) setActiveL1(null);
  };

  const isL2 = activeL1 !== null;
  const currentL1 = activeL1 !== null ? FORSKNING_L1[activeL1] : null;

  return (
    <div className="min-h-screen bg-white font-sans text-black">
      {/* Demo badge */}
      <div
        className="py-2 text-center text-xs font-semibold tracking-wider text-white"
        style={{ backgroundColor: ACCENT }}
      >
        OPTION 1 — Drill-Down Panel · one level at a time, slide to go deeper
      </div>

      {/* ── Header ─────────────────────────────────────────── */}
      <header
        className="relative"
        style={{ borderBottom: `1px solid ${BEIGE}` }}
      >
        <div className="mx-auto flex h-[68px] max-w-screen-xl items-center justify-between px-16">
          <div className="h-8 w-28 rounded" style={{ backgroundColor: BEIGE }} />

          <nav className="flex items-center gap-8">
            {TOP_NAV.map((item) => {
              const isForskning = item === "Forskning";
              return (
                <button
                  key={item}
                  onClick={() => isForskning && toggleOpen()}
                  className="flex items-center gap-1 py-3 text-[15px] font-medium"
                  style={{ color: isForskning && open ? PURPLE_DARK : "#000" }}
                >
                  {item}
                  <ChevronDown
                    size={13}
                    className="mt-px transition-transform duration-200"
                    style={{
                      transform: isForskning && open ? "rotate(180deg)" : undefined,
                      color: isForskning ? PURPLE_DARK : "#555",
                    }}
                  />
                </button>
              );
            })}
          </nav>
        </div>

        {/* ── Drill-down panel ─────────────────────────────── */}
        {open && (
          <div
            className="absolute top-full z-50 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.1)]"
            style={{
              left: 0,
              right: 0,
              borderTop: `1px solid ${BEIGE}`,
              borderBottom: `1px solid ${BEIGE}`,
              borderLeft: `2px solid ${ACCENT}`,
            }}
          >
            {/* Breadcrumb bar */}
            <div
              className="mx-auto flex h-9 max-w-screen-xl items-center gap-2 px-8 text-xs font-medium"
              style={{ borderBottom: `1px solid ${BEIGE}` }}
            >
              <span
                className="cursor-pointer hover:underline"
                onClick={isL2 ? drillOut : undefined}
                style={{ color: isL2 ? PURPLE_DARK : "#999" }}
              >
                Forskning
              </span>
              {isL2 && (
                <>
                  <span style={{ color: "#ccc" }}>/</span>
                  <span style={{ color: "#999" }}>{currentL1?.label}</span>
                </>
              )}
            </div>

            {/* Sliding content */}
            <div
              className="mx-auto max-w-screen-xl overflow-hidden"
              style={{ height: 380 }}
            >
              <AnimatePresence mode="wait" custom={direction} initial={false}>
                {!isL2 ? (
                  /* ── L1 view ─────────────────────────────── */
                  <motion.div
                    key="l1"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="flex h-full flex-col overflow-y-auto py-2"
                  >
                    <a
                      href="#"
                      className="flex items-center gap-2 px-8 py-[10px] text-[15px] font-medium hover:underline"
                      style={{ color: PURPLE_DARK }}
                      onClick={(e) => e.preventDefault()}
                    >
                      <ArrowRight size={15} />
                      Gå till Forskning
                    </a>

                    {FORSKNING_L1.map((item, i) => (
                      <button
                        key={item.label}
                        onClick={() => drillIn(i)}
                        className="flex w-full items-center justify-between gap-3 px-8 py-[10px] text-left text-[15px] font-medium transition-colors hover:bg-stone-50"
                      >
                        <span>{item.label}</span>
                        <ChevronRight
                          size={13}
                          style={{ color: ACCENT, flexShrink: 0 }}
                        />
                      </button>
                    ))}
                  </motion.div>
                ) : (
                  /* ── L2 view ─────────────────────────────── */
                  <motion.div
                    key={`l2-${activeL1}`}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="flex h-full flex-col overflow-y-auto py-2"
                  >
                    {/* Back button */}
                    <button
                      onClick={drillOut}
                      className="flex items-center gap-2 px-8 py-[10px] text-[15px] font-semibold transition-colors hover:underline"
                      style={{ color: PURPLE_DARK }}
                    >
                      <ChevronLeft size={15} />
                      Forskning
                    </button>

                    <div
                      className="mx-8 my-1"
                      style={{ height: 1, backgroundColor: BEIGE }}
                    />

                    <a
                      href="#"
                      className="flex items-center gap-2 px-8 py-[10px] text-[15px] font-medium hover:underline"
                      style={{ color: PURPLE_DARK }}
                      onClick={(e) => e.preventDefault()}
                    >
                      <ArrowRight size={15} />
                      Gå till {currentL1?.label}
                    </a>

                    {currentL1?.l2.map((item) => (
                      <a
                        key={item.label}
                        href="#"
                        className="flex items-center px-8 py-[10px] text-[15px] font-medium transition-colors hover:bg-stone-50"
                        style={{ color: "#000" }}
                        onClick={(e) => e.preventDefault()}
                      >
                        {item.label}
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
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
          {!open
            ? "Click Forskning to open the panel"
            : !isL2
            ? "Click any item to drill into its sub-items"
            : "Click ← Forskning to go back"}
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
