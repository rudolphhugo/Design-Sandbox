"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Menu,
  X,
  Monitor,
  Smartphone,
} from "lucide-react";

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

type Mode = "desktop" | "mobile";

export function MegaMenuHybrid() {
  const [mode, setMode] = useState<Mode>("desktop");

  // Desktop state
  const [desktopOpen, setDesktopOpen] = useState(false);
  const [desktopL1, setDesktopL1] = useState<number | null>(null);

  // Mobile state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const [mobileL1, setMobileL1] = useState<number | null>(null);

  const toggleDesktop = () => {
    setDesktopOpen((v) => !v);
    setDesktopL1(null);
  };

  const selectDesktopL1 = (i: number) => {
    setDesktopL1((prev) => (prev === i ? null : i));
  };

  const toggleMobileSection = (section: string) => {
    setMobileSection((prev) => (prev === section ? null : section));
    setMobileL1(null);
  };

  const toggleMobileL1 = (i: number) => {
    setMobileL1((prev) => (prev === i ? null : i));
  };

  return (
    <div className="min-h-screen bg-white font-sans text-black">
      {/* ── Demo controls ────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-6 py-2"
        style={{ backgroundColor: ACCENT }}
      >
        <span className="text-xs font-semibold tracking-wider text-white">
          OPTION 5 — Responsive Hybrid
        </span>
        <div className="flex items-center gap-1 rounded-full p-0.5" style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
          <button
            onClick={() => {
              setMode("desktop");
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-colors"
            style={{
              backgroundColor: mode === "desktop" ? "#fff" : "transparent",
              color: mode === "desktop" ? ACCENT : "rgba(255,255,255,0.8)",
            }}
          >
            <Monitor size={12} />
            Desktop
          </button>
          <button
            onClick={() => {
              setMode("mobile");
              setDesktopOpen(false);
              setDesktopL1(null);
            }}
            className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-colors"
            style={{
              backgroundColor: mode === "mobile" ? "#fff" : "transparent",
              color: mode === "mobile" ? ACCENT : "rgba(255,255,255,0.8)",
            }}
          >
            <Smartphone size={12} />
            Mobile
          </button>
        </div>
      </div>

      {/* ── Simulated viewport ───────────────────────────────── */}
      <div
        className="mx-auto transition-all duration-300"
        style={{ maxWidth: mode === "mobile" ? 390 : "100%" }}
      >
        {/* ── Header ─────────────────────────────────────────── */}
        <header
          className="relative bg-white"
          style={{ borderBottom: `1px solid ${BEIGE}` }}
        >
          <div
            className="flex items-center justify-between px-6 transition-all duration-300"
            style={{
              height: 68,
              paddingLeft: mode === "desktop" ? 64 : 24,
              paddingRight: mode === "desktop" ? 64 : 24,
            }}
          >
            {/* Logo placeholder */}
            <div
              className="h-7 w-24 rounded"
              style={{ backgroundColor: BEIGE }}
            />

            {/* Desktop nav */}
            {mode === "desktop" && (
              <nav className="flex items-center gap-8">
                {TOP_NAV.map((item) => {
                  const isForskning = item === "Forskning";
                  return (
                    <button
                      key={item}
                      onClick={() => isForskning && toggleDesktop()}
                      className="flex items-center gap-1 py-3 text-[15px] font-medium transition-colors"
                      style={{
                        color: isForskning && desktopOpen ? PURPLE_DARK : "#000",
                      }}
                    >
                      {item}
                      <ChevronDown
                        size={13}
                        className="mt-px transition-transform duration-200"
                        style={{
                          transform:
                            isForskning && desktopOpen
                              ? "rotate(180deg)"
                              : undefined,
                          color: isForskning ? PURPLE_DARK : "#555",
                        }}
                      />
                    </button>
                  );
                })}
              </nav>
            )}

            {/* Mobile hamburger */}
            {mode === "mobile" && (
              <button
                className="flex items-center justify-center rounded p-1.5 transition-colors hover:bg-gray-100"
                onClick={() => setMobileMenuOpen((v) => !v)}
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            )}
          </div>

          {/* ── Desktop flyout — same pattern as current design ─ */}
          {mode === "desktop" && desktopOpen && (
            <div
              className="absolute inset-x-0 top-full z-50 flex bg-white shadow-[0_4px_20px_rgba(0,0,0,0.1)]"
              style={{
                borderTop: `1px solid ${BEIGE}`,
                borderBottom: `1px solid ${BEIGE}`,
              }}
            >
              <div className="mx-auto flex w-full max-w-screen-xl">
                {/* L1 column */}
                <div
                  className="flex shrink-0 flex-col py-2"
                  style={{
                    width: 340,
                    borderLeft: `2px solid ${ACCENT}`,
                  }}
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

                  {FORSKNING_L1.map((item, i) => {
                    const isActive = i === desktopL1;
                    return (
                      <button
                        key={item.label}
                        onClick={() => selectDesktopL1(i)}
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

                {/* L2 column — appears when L1 item is selected */}
                {desktopL1 !== null && (
                  <div
                    className="flex flex-col overflow-y-auto py-2"
                    style={{
                      width: 340,
                      maxHeight: 420,
                      borderLeft: `1px solid ${BEIGE}`,
                    }}
                  >
                    <a
                      href="#"
                      className="flex items-center gap-2 px-8 py-[10px] text-[15px] font-medium hover:underline"
                      style={{ color: PURPLE_DARK }}
                      onClick={(e) => e.preventDefault()}
                    >
                      <ArrowRight size={15} />
                      Gå till {FORSKNING_L1[desktopL1].label}
                    </a>

                    {FORSKNING_L1[desktopL1].l2.map((item) => (
                      <a
                        key={item.label}
                        href="#"
                        className="flex items-center px-8 py-[10px] text-[15px] font-medium transition-colors hover:bg-stone-50"
                        style={{
                          borderLeft: `1px solid ${BEIGE}`,
                        }}
                        onClick={(e) => e.preventDefault()}
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </header>

        {/* ── Mobile accordion — inline below header ───────── */}
        {mode === "mobile" && mobileMenuOpen && (
          <div
            className="overflow-y-auto bg-white"
            style={{
              borderTop: `1px solid ${BEIGE}`,
              maxHeight: "calc(100vh - 132px)",
            }}
          >
            {TOP_NAV.map((item) => {
              const isForskning = item === "Forskning";
              const isExpanded = mobileSection === item;

              return (
                <div key={item} style={{ borderBottom: `1px solid ${BEIGE}` }}>
                  {/* L0 — top nav row */}
                  <button
                    onClick={() =>
                      isForskning && toggleMobileSection(item)
                    }
                    className="flex w-full items-center justify-between px-6 py-4 text-left text-[16px] font-semibold transition-colors"
                    style={{
                      color: isExpanded ? PURPLE_DARK : "#000",
                    }}
                  >
                    {item}
                    {isForskning && (
                      <ChevronDown
                        size={16}
                        className="transition-transform duration-200"
                        style={{
                          transform: isExpanded ? "rotate(180deg)" : undefined,
                          color: PURPLE_DARK,
                        }}
                      />
                    )}
                  </button>

                  {/* L1 — expanded section (accordion) */}
                  {isForskning && isExpanded && (
                    <div style={{ borderTop: `1px solid ${BEIGE}` }}>
                      {/* Gå till */}
                      <a
                        href="#"
                        className="flex items-center gap-2 px-6 py-3 text-[15px] font-medium hover:underline"
                        style={{
                          color: PURPLE_DARK,
                          backgroundColor: "#fafafa",
                        }}
                        onClick={(e) => e.preventDefault()}
                      >
                        <ArrowRight size={14} />
                        Gå till Forskning
                      </a>

                      {FORSKNING_L1.map((l1Item, i) => {
                        const isL1Active = mobileL1 === i;
                        return (
                          <div
                            key={l1Item.label}
                            style={{ borderTop: `1px solid ${BEIGE}` }}
                          >
                            {/* L1 row */}
                            <button
                              onClick={() => toggleMobileL1(i)}
                              className="flex w-full items-center justify-between px-6 py-3 text-left text-[15px] font-medium transition-colors"
                              style={{
                                paddingLeft: isL1Active ? "20px" : "24px",
                                backgroundColor: isL1Active ? BEIGE : "#fafafa",
                                borderLeft: isL1Active
                                  ? `4px solid ${ACCENT}`
                                  : undefined,
                                color: "#000",
                              }}
                            >
                              {l1Item.label}
                              <ChevronDown
                                size={14}
                                className="transition-transform duration-200"
                                style={{
                                  transform: isL1Active
                                    ? "rotate(180deg)"
                                    : undefined,
                                  color: ACCENT,
                                  flexShrink: 0,
                                }}
                              />
                            </button>

                            {/* L2 items — expanded inline */}
                            {isL1Active && (
                              <div
                                style={{
                                  borderTop: `1px solid ${BEIGE}`,
                                  backgroundColor: "#fff",
                                }}
                              >
                                {/* Gå till L1 */}
                                <a
                                  href="#"
                                  className="flex items-center gap-2 px-8 py-2.5 text-[14px] font-medium hover:underline"
                                  style={{ color: PURPLE_DARK }}
                                  onClick={(e) => e.preventDefault()}
                                >
                                  <ArrowRight size={13} />
                                  Gå till {l1Item.label}
                                </a>

                                {l1Item.l2.map((l2Item, j) => (
                                  <a
                                    key={l2Item.label}
                                    href="#"
                                    className="flex items-center px-8 py-2.5 text-[14px] font-medium transition-colors hover:bg-stone-50"
                                    style={{
                                      borderTop:
                                        j === 0
                                          ? `1px solid ${BEIGE}`
                                          : `1px solid ${BEIGE}`,
                                      borderLeft: `3px solid ${BEIGE}`,
                                      color: "#000",
                                    }}
                                    onClick={(e) => e.preventDefault()}
                                  >
                                    {l2Item.label}
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── Hero content ─────────────────────────────────── */}
        <main
          className="bg-white py-16 transition-all duration-300"
          style={{
            padding: mode === "mobile" ? "48px 24px" : "64px",
          }}
        >
          <p
            className="mb-3 text-xs font-semibold uppercase tracking-widest"
            style={{ color: ACCENT }}
          >
            {mode === "desktop"
              ? desktopOpen
                ? "Click an L1 item to reveal L2 alongside it"
                : "Click Forskning to see the flyout columns"
              : mobileMenuOpen
              ? "Tap Forskning → tap a sub-item to expand L2"
              : "Tap the menu icon to open the accordion"}
          </p>
          <h1
            className="mb-8 font-semibold leading-tight"
            style={{
              fontSize: mode === "mobile" ? "2rem" : "3rem",
              color: PURPLE,
            }}
          >
            Anmälan öppen till
            <br />
            höstens program
          </h1>
          <div
            className="rounded-lg"
            style={{
              backgroundColor: BEIGE,
              height: mode === "mobile" ? 180 : 256,
            }}
          />
        </main>
      </div>
    </div>
  );
}
