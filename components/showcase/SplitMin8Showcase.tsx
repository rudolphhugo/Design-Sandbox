"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronRight, ArrowRight } from "lucide-react";
import { NAV_DATA } from "./mega-menu-data";

// ── Brand tokens ──────────────────────────────────────────────
const PURPLE_DARK = "#3b1fa8";
const ACCENT = "#6746EB";
const BEIGE = "#f0ede6";
const PURPLE = "#8b6ef7";

// ── Patterns ──────────────────────────────────────────────────
type Pattern = "split-min8" | "split-min8-click" | "split-min8-sticky";

const PATTERNS: { id: Pattern; label: string; desc: string }[] = [
  {
    id: "split-min8",
    label: "Split Min 8",
    desc: "Left col always at least 8 items tall · right col capped to same height and scrolls · hover opens L2",
  },
  {
    id: "split-min8-click",
    label: "Split Min 8 — Click",
    desc: "Same height constraints · right col only reveals on click, not hover",
  },
  {
    id: "split-min8-sticky",
    label: "Split Min 8 — Sticky",
    desc: "Hover shows L2 · click locks an item open · click same item again to unlock back to hover",
  },
];

export function SplitMin8Showcase() {
  const [pattern, setPattern] = useState<Pattern>("split-min8");
  const [pageType, setPageType] = useState<"hero" | "article">("hero");

  const [openId, setOpenId] = useState<string | null>(null);
  const [activeL1, setActiveL1] = useState<number | null>(null);
  const [lockedL1, setLockedL1] = useState<number | null>(null);
  const [navEdges, setNavEdges] = useState<{ left: number; right: number } | null>(null);

  const navBtnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const navRef = useRef<HTMLElement | null>(null);
  const navHeaderRef = useRef<HTMLElement | null>(null);
  const splitPanelRef = useRef<HTMLDivElement | null>(null);

  const switchPattern = (p: Pattern) => {
    setPattern(p);
    setOpenId(null);
    setActiveL1(null);
    setLockedL1(null);
  };

  const openSection = (sectionId: string) => {
    if (openId === sectionId) {
      setOpenId(null);
      return;
    }
    setOpenId(sectionId);
    setActiveL1(pattern === "split-min8" || pattern === "split-min8-sticky" ? 0 : null);
    setLockedL1(null);

    if (navRef.current && navHeaderRef.current) {
      const nav = navRef.current.getBoundingClientRect();
      const header = navHeaderRef.current.getBoundingClientRect();
      setNavEdges({ left: nav.left - header.left, right: header.right - nav.right });
    }
  };

  const closeMenu = () => {
    setOpenId(null);
    setActiveL1(null);
    setLockedL1(null);
  };

  // Click-outside
  useEffect(() => {
    if (!openId) return;
    const handle = (e: MouseEvent) => {
      const t = e.target as Node;
      if (splitPanelRef.current?.contains(t)) return;
      if (navBtnRefs.current.some((ref) => ref?.contains(t))) return;
      setOpenId(null);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [openId]);

  const activeSection = NAV_DATA.find((s) => s.id === openId) ?? null;
  const currentL1 = activeSection && activeL1 !== null ? activeSection.l1[activeL1] : null;

  const panelStyle = {
    left: (navEdges?.left ?? 0) - 16,
    right: (navEdges?.right ?? 0) - 16,
    borderLeft: `2px solid ${ACCENT}`,
    borderBottom: `1px solid #e8e8e8`,
    borderRight: `1px solid #e8e8e8`,
  };

  return (
    <div className="min-h-screen bg-white font-sans text-black">

      {/* ── Tab switcher ─────────────────────────────────────── */}
      <div
        className="flex flex-wrap items-center gap-1 px-8 py-3"
        style={{ borderBottom: `1px solid ${BEIGE}`, backgroundColor: "#fafafa" }}
      >
        {PATTERNS.map((p) => (
          <button
            key={p.id}
            onClick={() => switchPattern(p.id)}
            className="rounded-full px-4 py-1.5 text-[13px] font-semibold transition-colors"
            style={{
              backgroundColor: pattern === p.id ? ACCENT : "#fff",
              color: pattern === p.id ? "#fff" : "#555",
              border: `1px solid ${pattern === p.id ? ACCENT : "#e5e5e5"}`,
            }}
          >
            {p.label}
          </button>
        ))}
        <span className="ml-4 text-xs" style={{ color: "#aaa" }}>
          {PATTERNS.find((p) => p.id === pattern)?.desc}
        </span>

        {/* Page type toggle */}
        <div className="ml-auto flex items-center gap-1 rounded-full p-1" style={{ backgroundColor: "#e8e8e8" }}>
          {(["hero", "article"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setPageType(t)}
              className="rounded-full px-3 py-1 text-[12px] font-semibold capitalize transition-colors"
              style={{
                backgroundColor: pageType === t ? "#fff" : "transparent",
                color: pageType === t ? "#111" : "#888",
                boxShadow: pageType === t ? "0 1px 3px rgba(0,0,0,0.12)" : "none",
              }}
            >
              {t === "hero" ? "Hero" : "Article"}
            </button>
          ))}
        </div>
      </div>

      {/* ── Nav header ───────────────────────────────────────── */}
      <header ref={navHeaderRef} className="relative bg-white" style={{ borderBottom: `1px solid ${BEIGE}` }}>
        <div className="mx-auto flex h-[68px] max-w-screen-xl items-center justify-between px-16">
          <div className="h-8 w-28 rounded" style={{ backgroundColor: BEIGE }} />

          <nav ref={navRef} className="flex items-center gap-8">
            {NAV_DATA.map((section, i) => {
              const isOpen = openId === section.id;
              return (
                <button
                  key={section.id}
                  ref={(el) => { navBtnRefs.current[i] = el; }}
                  onClick={() => openSection(section.id)}
                  className="flex items-center gap-1 py-3 text-[15px] font-medium transition-colors"
                  style={{ color: isOpen ? PURPLE_DARK : "#000" }}
                >
                  {section.label}
                  <ChevronDown
                    size={13}
                    className="mt-px transition-transform duration-200"
                    style={{
                      transform: isOpen ? "rotate(180deg)" : undefined,
                      color: isOpen ? PURPLE_DARK : "#555",
                    }}
                  />
                </button>
              );
            })}
          </nav>
        </div>

        {/* ── SPLIT MIN 8 ──────────────────────────────────── */}
        {pattern === "split-min8" && openId && activeSection && (
          <>
            <div
              className="absolute left-0 right-0 top-full z-40"
              style={{ height: "100vh", backgroundColor: "rgba(0,0,0,0.25)" }}
              onClick={closeMenu}
            />
            <div
              ref={splitPanelRef}
              className="absolute top-full z-50 flex bg-white shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
              style={panelStyle}
            >
              {/* L1 */}
              <div className="flex w-[35%] shrink-0 flex-col py-2" style={{ minHeight: 376 }}>
                <GoTo label={activeSection.goTo} />
                {activeSection.l1.map((item, i) => {
                  const isActive = i === activeL1;
                  return (
                    <button
                      key={item.label}
                      onMouseEnter={() => setActiveL1(i)}
                      onClick={() => setActiveL1(i)}
                      className="flex w-full items-center justify-between gap-3 text-left text-[14px] font-medium transition-colors"
                      style={{
                        padding: "10px 16px",
                        paddingLeft: isActive ? "12px" : "18px",
                        backgroundColor: isActive ? "#FAF9F7" : undefined,
                        borderLeft: isActive ? `6px solid ${ACCENT}` : undefined,
                        color: isActive ? PURPLE_DARK : "#111",
                      }}
                    >
                      <span>{item.label}</span>
                      <ChevronRight size={13} style={{ color: isActive ? ACCENT : "#ccc", flexShrink: 0 }} />
                    </button>
                  );
                })}
              </div>

              {/* L2 */}
              <div
                className="flex w-[65%] flex-col overflow-y-auto py-2"
                style={{ maxHeight: 376, borderLeft: `1px solid #e8e8e8`, backgroundColor: "#FAF9F7" }}
              >
                {activeL1 !== null && currentL1 && (
                  <>
                    <GoTo label={`Gå till ${currentL1.label}`} />
                    <div className="flex flex-col">
                      {currentL1.l2.map((item) => (
                        <L2Link key={item.label} label={item.label} />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        )}

        {/* ── SPLIT MIN 8 — CLICK ──────────────────────────── */}
        {pattern === "split-min8-click" && openId && activeSection && (
          <>
            <div
              className="absolute left-0 right-0 top-full z-40"
              style={{ height: "100vh", backgroundColor: "rgba(0,0,0,0.25)" }}
              onClick={closeMenu}
            />
            <div
              ref={splitPanelRef}
              className="absolute top-full z-50 flex bg-white shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
              style={panelStyle}
            >
              {/* L1 — click only */}
              <div className="flex w-[35%] shrink-0 flex-col py-2" style={{ minHeight: 376 }}>
                <GoTo label={activeSection.goTo} />
                {activeSection.l1.map((item, i) => {
                  const isActive = i === activeL1;
                  return (
                    <button
                      key={item.label}
                      onClick={() => setActiveL1(isActive ? null : i)}
                      className="flex w-full items-center justify-between gap-3 text-left text-[14px] font-medium transition-colors"
                      style={{
                        padding: "10px 16px",
                        paddingLeft: isActive ? "12px" : "18px",
                        backgroundColor: isActive ? "#FAF9F7" : undefined,
                        borderLeft: isActive ? `6px solid ${ACCENT}` : undefined,
                        color: isActive ? PURPLE_DARK : "#111",
                      }}
                    >
                      <span>{item.label}</span>
                      <ChevronRight size={13} style={{ color: isActive ? ACCENT : "#ccc", flexShrink: 0 }} />
                    </button>
                  );
                })}
              </div>

              {/* L2 — only after click */}
              <div
                className="flex w-[65%] flex-col overflow-y-auto py-2"
                style={{ maxHeight: 376, borderLeft: `1px solid #e8e8e8`, backgroundColor: "#FAF9F7" }}
              >
                {activeL1 !== null && currentL1 && (
                  <>
                    <GoTo label={`Gå till ${currentL1.label}`} />
                    <div className="flex flex-col">
                      {currentL1.l2.map((item) => (
                        <L2Link key={item.label} label={item.label} />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        )}

        {/* ── SPLIT MIN 8 — STICKY ─────────────────────────── */}
        {pattern === "split-min8-sticky" && openId && activeSection && (() => {
          const displayL1 = lockedL1 !== null ? lockedL1 : activeL1;
          const displayCurrentL1 = displayL1 !== null ? activeSection.l1[displayL1] : null;
          return (
            <>
              <div
                className="absolute left-0 right-0 top-full z-40"
                style={{ height: "100vh", backgroundColor: "rgba(0,0,0,0.25)" }}
                onClick={closeMenu}
              />
              <div
                ref={splitPanelRef}
                className="absolute top-full z-50 flex bg-white shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
                style={panelStyle}
              >
                {/* L1 */}
                <div className="flex w-[35%] shrink-0 flex-col py-2" style={{ minHeight: 376 }}>
                  <GoTo label={activeSection.goTo} />
                  {activeSection.l1.map((item, i) => {
                    const isLocked = lockedL1 === i;
                    const isActive = i === activeL1;
                    return (
                      <button
                        key={item.label}
                        onMouseEnter={() => { if (lockedL1 === null) setActiveL1(i); }}
                        onClick={() => {
                          if (lockedL1 === i) {
                            setLockedL1(null);
                          } else {
                            setLockedL1(i);
                            setActiveL1(i);
                          }
                        }}
                        className="flex w-full items-center justify-between gap-3 text-left transition-colors"
                        style={{
                          padding: "10px 16px",
                          paddingLeft: isLocked ? "8px" : isActive ? "12px" : "18px",
                          backgroundColor: isActive ? "#FAF9F7" : undefined,
                          borderLeft: isLocked
                            ? `10px solid ${PURPLE_DARK}`
                            : isActive
                            ? `6px solid ${ACCENT}`
                            : undefined,
                          color: isActive ? PURPLE_DARK : "#111",
                          fontWeight: isLocked ? 700 : 500,
                          fontSize: 14,
                        }}
                      >
                        <span>{item.label}</span>
                        <ChevronRight size={13} style={{ color: isActive ? ACCENT : "#ccc", flexShrink: 0 }} />
                      </button>
                    );
                  })}
                </div>

                {/* L2 — follows lock, falls back to hover */}
                <div
                  className="flex w-[65%] flex-col overflow-y-auto py-2"
                  style={{ maxHeight: 376, borderLeft: `1px solid #e8e8e8`, backgroundColor: "#FAF9F7" }}
                >
                  {displayCurrentL1 && (
                    <>
                      <GoTo label={`Gå till ${displayCurrentL1.label}`} />
                      <div className="flex flex-col">
                        {displayCurrentL1.l2.map((item) => (
                          <L2Link key={item.label} label={item.label} />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </>
          );
        })()}
      </header>

      {/* ── Page content ─────────────────────────────────────── */}
      {pageType === "hero" ? (
        <main>
          <div
            className="relative flex w-full items-end"
            style={{ height: "62vh", backgroundColor: "#2d3a5e" }}
          >
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to bottom, rgba(20,28,58,0.15) 0%, rgba(20,28,58,0.75) 100%)" }}
            />
            <div className="relative z-10 mx-auto w-full max-w-screen-xl px-16 pb-12">
              <p className="mb-3 text-sm font-medium uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.7)" }}>
                Utbildning
              </p>
              <h1 className="text-5xl font-bold leading-tight text-white" style={{ maxWidth: 640 }}>
                Anmälan öppen till<br />höstens program
              </h1>
              <p className="mt-4 text-lg" style={{ color: "rgba(255,255,255,0.85)", maxWidth: 520 }}>
                Sök till ett av universitetets civilingenjörsprogram, masterprogram eller arkitektprogram.
              </p>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="mt-6 inline-flex items-center gap-2 rounded-sm px-6 py-3 text-[15px] font-semibold transition-opacity hover:opacity-80"
                style={{ backgroundColor: ACCENT, color: "#fff" }}
              >
                Läs mer om antagning
              </a>
            </div>
          </div>

          <div className="mx-auto max-w-screen-xl px-16 py-14">
            <div className="grid grid-cols-3 gap-8">
              {[
                { title: "Civilingenjörsprogram", desc: "Fem år. 180+ specialiserade kurser. Välj bland 13 program." },
                { title: "Masterprogram", desc: "Fördjupa dig. 42 engelskspråkiga masterprogram med spets." },
                { title: "Arkitektprogram", desc: "Formgivning, hållbarhet och teknik i ett sammanhållet program." },
              ].map(({ title, desc }) => (
                <div key={title} className="flex flex-col gap-3">
                  <div className="h-40 rounded-sm" style={{ backgroundColor: BEIGE }} />
                  <h3 className="text-lg font-semibold" style={{ color: PURPLE }}>{title}</h3>
                  <p className="text-[15px] leading-relaxed" style={{ color: "#555" }}>{desc}</p>
                  <a href="#" onClick={(e) => e.preventDefault()} className="text-[14px] font-medium hover:underline" style={{ color: ACCENT }}>
                    Läs mer →
                  </a>
                </div>
              ))}
            </div>
          </div>
        </main>
      ) : (
        <main className="mx-auto max-w-screen-xl px-16 py-14">
          <div className="grid grid-cols-[1fr_300px] gap-16">
            <article>
              <p className="mb-3 text-sm font-medium uppercase tracking-widest" style={{ color: ACCENT }}>
                Nyheter · 24 april 2026
              </p>
              <h1 className="mb-4 text-4xl font-bold leading-tight" style={{ color: PURPLE, maxWidth: 640 }}>
                Forskningen leder vägen mot klimatneutrala industrier
              </h1>
              <div className="mb-8 flex items-center gap-3">
                <div className="h-8 w-8 rounded-full" style={{ backgroundColor: BEIGE }} />
                <div>
                  <p className="text-[14px] font-medium" style={{ color: "#111" }}>Anna Lindström</p>
                  <p className="text-[13px]" style={{ color: "#888" }}>Kommunikationsavdelningen</p>
                </div>
              </div>
              <div className="mb-8 h-72 w-full rounded-sm" style={{ backgroundColor: "#d4dce8" }} />
              <p className="mb-5 text-[17px] font-medium leading-relaxed" style={{ color: "#222" }}>
                En ny rapport från universitetet visar att industrins utsläpp kan halveras till 2035 om rätt teknikinvesteringar görs nu.
              </p>
              <p className="mb-5 text-[16px] leading-relaxed" style={{ color: "#444" }}>
                Industrins koldioxidutsläpp utgör idag drygt 30 procent av de globala utsläppen. Stål, cement och kemi är de tyngsta sektorerna — och de svåraste att ställa om. Men enligt forskarnas beräkningar finns det en tydlig teknisk väg framåt.
              </p>
              <div className="my-8 border-l-4 py-1 pl-6" style={{ borderColor: ACCENT }}>
                <p className="text-[18px] font-medium italic leading-snug" style={{ color: PURPLE }}>
                  "Rätt investeringar nu kan halvera industriutsläppen på ett decennium."
                </p>
                <p className="mt-2 text-[13px]" style={{ color: "#888" }}>Erik Magnusson, professor i industriell energiteknik</p>
              </div>
            </article>

            <aside className="flex flex-col gap-6 pt-16">
              <div className="rounded-sm p-5" style={{ backgroundColor: BEIGE }}>
                <h3 className="mb-3 text-[14px] font-semibold uppercase tracking-wide" style={{ color: "#666" }}>Relaterat</h3>
                {["Hållbarhetsrapport 2025", "Industriell energiteknik", "Klimat och miljö"].map((t) => (
                  <a key={t} href="#" onClick={(e) => e.preventDefault()} className="mb-2 flex items-start gap-2 text-[14px] font-medium hover:underline" style={{ color: ACCENT }}>
                    → {t}
                  </a>
                ))}
              </div>
            </aside>
          </div>
        </main>
      )}
    </div>
  );
}

// ── Sub-elements ──────────────────────────────────────────────

function GoTo({ label }: { label: string }) {
  return (
    <a
      href="#"
      className="flex items-center gap-2 px-6 py-2.5 text-[14px] font-medium hover:underline"
      style={{ color: PURPLE_DARK }}
      onClick={(e) => e.preventDefault()}
    >
      <ArrowRight size={14} />
      {label}
    </a>
  );
}

function L2Link({ label }: { label: string }) {
  return (
    <a
      href="#"
      className="flex items-center px-8 py-[10px] text-[15px] font-medium transition-colors hover:bg-stone-50"
      style={{ borderLeft: `1px solid ${BEIGE}` }}
      onClick={(e) => e.preventDefault()}
    >
      {label}
    </a>
  );
}
