"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  X,
} from "lucide-react";
import { NAV_DATA, NavSection } from "./mega-menu-data";

// ── Brand tokens ──────────────────────────────────────────────
const PURPLE_DARK = "#1e3a8a";
const ACCENT = "#2563eb";
const BEIGE = "#f0ede6";
const PURPLE = "#60a5fa";

// ── Patterns ──────────────────────────────────────────────────
type Pattern = "drill-down" | "fixed" | "flyout" | "anchored" | "drawer" | "drop-panel" | "split" | "split-overlay" | "split-centered" | "split-centered-overlay" | "split-min8" | "split-min8-click" | "split-min8-sticky";

const PATTERNS: { id: Pattern; label: string; desc: string }[] = [
  {
    id: "drill-down",
    label: "Drill-Down",
    desc: "One panel, one level at a time · slide animation between levels · breadcrumb shows path",
  },
  {
    id: "fixed",
    label: "Fixed Panel",
    desc: "Full-width panel · both columns always visible · each column scrolls independently",
  },
  {
    id: "flyout",
    label: "Flyout Columns",
    desc: "L1 column opens first · click an item to reveal L2 alongside it · same as original design",
  },
  {
    id: "anchored",
    label: "Anchored Drop",
    desc: "Panel anchors directly below the clicked nav item · 380px wide · right-aligns near viewport edge",
  },
  {
    id: "drawer",
    label: "Side Drawer",
    desc: "Slides in from the right edge · full viewport height · backdrop overlay · drill-down inside",
  },
  {
    id: "drop-panel",
    label: "Drop Panel",
    desc: "Drops down below the nav · anchored to the right · focused like a drawer but always connected to the nav",
  },
  {
    id: "split",
    label: "Split Panel",
    desc: "Two columns always visible · left-aligned below the nav · height adapts to L1 count · first item pre-selected",
  },
  {
    id: "split-overlay",
    label: "Split + Overlay",
    desc: "Same as Split Panel · adds a transparent backdrop over the page content",
  },
  {
    id: "split-centered",
    label: "Split Centered",
    desc: "Two columns always visible · centered below the nav · height adapts to L1 count · first item pre-selected",
  },
  {
    id: "split-centered-overlay",
    label: "Split Centered + Overlay",
    desc: "Same as Split Centered · adds a transparent backdrop over the page content",
  },
  {
    id: "split-min8",
    label: "Split Min 8",
    desc: "Left column always at least 8 items tall · right column capped to same height and scrolls if needed · overlay backdrop",
  },
  {
    id: "split-min8-click",
    label: "Split Min 8 — Click",
    desc: "Same as Split Min 8 · right column only reveals on click, not hover",
  },
  {
    id: "split-min8-sticky",
    label: "Split Min 8 — Sticky",
    desc: "Hover shows L2 · click locks an item open · click same item again to unlock back to hover",
  },
];

// ── Animation variants ────────────────────────────────────────
const slideVariants = {
  enter: (dir: number) => ({ x: dir * 24, opacity: 0 }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] as const },
  },
  exit: (dir: number) => ({
    x: dir * -24,
    opacity: 0,
    transition: { duration: 0.15 },
  }),
};

const PANEL_WIDTH = 380;
const DRAWER_WIDTH = 440;
const MENU_HEIGHT = 420;

export function NavPatterns() {
  const [pattern, setPattern] = useState<Pattern>("drill-down");
  const [pageType, setPageType] = useState<"hero" | "article">("hero");

  // ── Shared menu state ─────────────────────────────────────
  const [openId, setOpenId] = useState<string | null>(null);
  const [activeL1, setActiveL1] = useState<number | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [panelPos, setPanelPos] = useState<{ left: number; top: number } | null>(null);
  const [dropPanelMaxHeight, setDropPanelMaxHeight] = useState<number>(600);

  const [navEdges, setNavEdges] = useState<{ left: number; right: number } | null>(null);
  const [lockedL1, setLockedL1] = useState<number | null>(null);

  const navBtnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const navRef = useRef<HTMLElement | null>(null);
  const navHeaderRef = useRef<HTMLElement | null>(null);
  const anchoredPanelRef = useRef<HTMLDivElement | null>(null);
  const dropPanelRef = useRef<HTMLDivElement | null>(null);
  const splitPanelRef = useRef<HTMLDivElement | null>(null);

  const switchPattern = (p: Pattern) => {
    setPattern(p);
    setOpenId(null);
    setActiveL1(null);
    setLockedL1(null);
    setPanelPos(null);
  };

  const openSection = (sectionId: string, idx: number) => {
    if (openId === sectionId) {
      setOpenId(null);
      return;
    }
    setOpenId(sectionId);
    setActiveL1(pattern === "split" || pattern === "split-overlay" || pattern === "split-centered" || pattern === "split-centered-overlay" || pattern === "split-min8" || pattern === "split-min8-sticky" ? 0 : null);
    setLockedL1(null);
    setDirection(1);

    if (pattern === "anchored") {
      const btn = navBtnRefs.current[idx];
      if (btn) {
        const rect = btn.getBoundingClientRect();
        let left = rect.left;
        if (left + PANEL_WIDTH + 8 > window.innerWidth) {
          left = rect.right - PANEL_WIDTH;
        }
        setPanelPos({ left, top: rect.bottom + 1 });
      }
    }

    if (pattern === "drop-panel" && navHeaderRef.current) {
      const headerRect = navHeaderRef.current.getBoundingClientRect();
      setDropPanelMaxHeight(window.innerHeight - headerRect.bottom - 20);
    }

    if ((pattern === "split" || pattern === "split-overlay" || pattern === "split-min8" || pattern === "split-min8-click" || pattern === "split-min8-sticky") && navRef.current && navHeaderRef.current) {
      const nav = navRef.current.getBoundingClientRect();
      const header = navHeaderRef.current.getBoundingClientRect();
      setNavEdges({ left: nav.left - header.left, right: header.right - nav.right });
    }
  };

  const drillIn = (i: number) => {
    setDirection(1);
    setActiveL1(i);
  };

  const drillOut = () => {
    setDirection(-1);
    setActiveL1(null);
  };

  const closeMenu = () => {
    setOpenId(null);
    setActiveL1(null);
    setLockedL1(null);
  };

  // Click-outside for anchored + drop-panel + split
  useEffect(() => {
    if (!openId) return;
    if (pattern !== "anchored" && pattern !== "drop-panel" && pattern !== "split" && pattern !== "split-overlay" && pattern !== "split-centered" && pattern !== "split-centered-overlay" && pattern !== "split-min8" && pattern !== "split-min8-click" && pattern !== "split-min8-sticky") return;
    const handle = (e: MouseEvent) => {
      const t = e.target as Node;
      if (anchoredPanelRef.current?.contains(t)) return;
      if (dropPanelRef.current?.contains(t)) return;
      if (splitPanelRef.current?.contains(t)) return;
      if (navBtnRefs.current.some((ref) => ref?.contains(t))) return;
      setOpenId(null);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [pattern, openId]);

  const activeSection = NAV_DATA.find((s) => s.id === openId) ?? null;
  const currentL1 =
    activeSection && activeL1 !== null ? activeSection.l1[activeL1] : null;
  const isL2 = activeL1 !== null;

  return (
    <div className="min-h-screen bg-white font-sans text-black">
      {/* ── Tab switcher ───────────────────────────────────── */}
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

      {/* ── Nav header ─────────────────────────────────────── */}
      <header
        ref={navHeaderRef}
        className="relative bg-white"
        style={{
          borderBottom: `1px solid ${BEIGE}`,
          zIndex: undefined,
        }}
      >
        <div className="mx-auto flex h-[68px] max-w-screen-xl items-center justify-between px-16">
          <div className="h-8 w-28 rounded" style={{ backgroundColor: BEIGE }} />

          <nav ref={navRef} className="flex items-center gap-8">
            {NAV_DATA.map((section, i) => {
              const isOpen = openId === section.id;
              return (
                <button
                  key={section.id}
                  ref={(el) => { navBtnRefs.current[i] = el; }}
                  onClick={() => openSection(section.id, i)}
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

        {/* ── DRILL-DOWN panel ─────────────────────────────── */}
        {pattern === "drill-down" && openId && activeSection && (
          <div
            className="absolute inset-x-0 top-full z-50 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.1)]"
            style={{
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
                className={isL2 ? "cursor-pointer hover:underline" : ""}
                onClick={isL2 ? drillOut : undefined}
                style={{ color: isL2 ? PURPLE_DARK : "#aaa" }}
              >
                {activeSection.label}
              </span>
              {isL2 && (
                <>
                  <span style={{ color: "#ddd" }}>/</span>
                  <span style={{ color: "#aaa" }}>{currentL1?.label}</span>
                </>
              )}
            </div>

            {/* Sliding content */}
            <div
              className="relative mx-auto max-w-screen-xl overflow-hidden"
              style={{ height: MENU_HEIGHT }}
            >
              <AnimatePresence mode="wait" custom={direction} initial={false}>
                {!isL2 ? (
                  <motion.div
                    key="l1"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="absolute inset-0 flex flex-col overflow-y-auto py-2"
                  >
                    <GoTo label={activeSection.goTo} />
                    {activeSection.l1.map((item, i) => (
                      <button
                        key={item.label}
                        onClick={() => drillIn(i)}
                        className="flex w-full items-center justify-between gap-3 px-8 py-[10px] text-left text-[15px] font-medium transition-colors hover:bg-stone-50"
                      >
                        {item.label}
                        <ChevronRight size={13} style={{ color: ACCENT, flexShrink: 0 }} />
                      </button>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key={`l2-${activeL1}`}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="absolute inset-0 flex flex-col overflow-y-auto py-2"
                  >
                    <BackButton label={activeSection.label} onClick={drillOut} />
                    <Divider />
                    <GoTo label={`Gå till ${currentL1?.label}`} />
                    {currentL1?.l2.map((item) => (
                      <L2Link key={item.label} label={item.label} />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* ── FIXED PANEL ──────────────────────────────────── */}
        {pattern === "fixed" && openId && activeSection && (
          <div
            className="absolute inset-x-0 top-full z-50 flex bg-white shadow-[0_4px_20px_rgba(0,0,0,0.1)]"
            style={{ borderTop: `1px solid ${BEIGE}`, borderBottom: `1px solid ${BEIGE}` }}
          >
            <div className="mx-auto flex w-full max-w-screen-xl">
              {/* L1 column */}
              <div
                className="flex shrink-0 flex-col overflow-y-auto py-2"
                style={{ width: 340, maxHeight: MENU_HEIGHT, borderLeft: `2px solid ${ACCENT}` }}
              >
                <GoTo label={activeSection.goTo} />
                {activeSection.l1.map((item, i) => {
                  const isActive = i === activeL1;
                  return (
                    <button
                      key={item.label}
                      onClick={() => setActiveL1(isActive ? null : i)}
                      className="flex w-full items-center justify-between gap-3 text-left text-[15px] font-medium transition-colors hover:bg-stone-50"
                      style={{
                        padding: "10px 20px",
                        paddingLeft: isActive ? "24px" : "30px",
                        backgroundColor: isActive ? BEIGE : undefined,
                        borderLeft: isActive ? `8px solid ${ACCENT}` : undefined,
                      }}
                    >
                      <span>{item.label}</span>
                      <ChevronRight size={13} style={{ color: ACCENT, flexShrink: 0 }} />
                    </button>
                  );
                })}
              </div>

              {/* L2 column */}
              <div
                className="flex flex-1 flex-col overflow-y-auto py-2"
                style={{ maxHeight: MENU_HEIGHT, borderLeft: `1px solid ${BEIGE}` }}
              >
                {activeL1 !== null && currentL1 ? (
                  <>
                    <GoTo label={`Gå till ${currentL1.label}`} />
                    {currentL1.l2.map((item) => (
                      <L2Link key={item.label} label={item.label} />
                    ))}
                  </>
                ) : (
                  <p className="px-8 py-4 text-sm" style={{ color: "#bbb" }}>
                    ← Select a category to see sub-items
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── FLYOUT COLUMNS ───────────────────────────────── */}
        {pattern === "flyout" && openId && activeSection && (
          <div
            className="absolute inset-x-0 top-full z-50 flex bg-white shadow-[0_4px_20px_rgba(0,0,0,0.1)]"
            style={{ borderTop: `1px solid ${BEIGE}`, borderBottom: `1px solid ${BEIGE}` }}
          >
            <div className="mx-auto flex w-full max-w-screen-xl">
              {/* L1 column */}
              <div
                className="flex shrink-0 flex-col py-2"
                style={{ width: 340, borderLeft: `2px solid ${ACCENT}` }}
              >
                <GoTo label={activeSection.goTo} />
                {activeSection.l1.map((item, i) => {
                  const isActive = i === activeL1;
                  return (
                    <button
                      key={item.label}
                      onClick={() => drillIn(i)}
                      className="flex w-full items-center justify-between gap-3 text-left text-[15px] font-medium transition-colors hover:bg-stone-50"
                      style={{
                        padding: "10px 20px",
                        paddingLeft: isActive ? "24px" : "30px",
                        backgroundColor: isActive ? BEIGE : undefined,
                        borderLeft: isActive ? `8px solid ${ACCENT}` : undefined,
                      }}
                    >
                      <span>{item.label}</span>
                      <ChevronRight size={13} style={{ color: ACCENT, flexShrink: 0 }} />
                    </button>
                  );
                })}
              </div>

              {/* L2 column — appears when L1 selected */}
              {activeL1 !== null && currentL1 && (
                <div
                  className="flex flex-col overflow-y-auto py-2"
                  style={{ width: 340, maxHeight: MENU_HEIGHT, borderLeft: `1px solid ${BEIGE}` }}
                >
                  <GoTo label={`Gå till ${currentL1.label}`} />
                  {currentL1.l2.map((item) => (
                    <L2Link key={item.label} label={item.label} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        {/* ── DROP PANEL ───────────────────────────────────── */}
        {pattern === "drop-panel" && openId && activeSection && (
          <motion.div
            ref={dropPanelRef}
            key={openId}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute right-16 top-full z-50 flex flex-col bg-white shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
            style={{
              width: 420,
              height: dropPanelMaxHeight,
              borderLeft: `2px solid ${ACCENT}`,
              borderBottom: `1px solid #e8e8e8`,
              borderRight: `1px solid #e8e8e8`,
            }}
          >
            {/* Breadcrumb */}
            <div
              className="flex shrink-0 items-center gap-2 px-6 text-xs font-medium"
              style={{ borderBottom: `1px solid ${BEIGE}`, minHeight: 36 }}
            >
              <span
                className={isL2 ? "cursor-pointer hover:underline" : ""}
                onClick={isL2 ? drillOut : undefined}
                style={{ color: isL2 ? PURPLE_DARK : "#aaa" }}
              >
                {activeSection.label}
              </span>
              {isL2 && (
                <>
                  <span style={{ color: "#e0e0e0" }}>/</span>
                  <span style={{ color: "#aaa" }}>{currentL1?.label}</span>
                </>
              )}
            </div>

            {/* Sliding content */}
            <div className="relative flex-1 overflow-hidden">
              <AnimatePresence mode="wait" custom={direction} initial={false}>
                {!isL2 ? (
                  <motion.div
                    key="l1"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="absolute inset-0 flex flex-col overflow-y-auto py-1"
                  >
                    <GoTo label={activeSection.goTo} small />
                    {activeSection.l1.map((item, i) => (
                      <button
                        key={item.label}
                        onClick={() => drillIn(i)}
                        className="flex w-full items-center justify-between gap-2 px-6 py-2.5 text-left text-[14px] font-medium transition-colors hover:bg-stone-50"
                      >
                        {item.label}
                        <ChevronRight size={13} style={{ color: ACCENT, flexShrink: 0 }} />
                      </button>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key={`l2-${activeL1}`}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="absolute inset-0 flex flex-col overflow-y-auto py-1"
                  >
                    <BackButton label={activeSection.label} onClick={drillOut} small />
                    <Divider small />
                    {currentL1?.l2.map((item) => (
                      <a
                        key={item.label}
                        href="#"
                        className="flex items-center px-6 py-2.5 text-[14px] font-medium transition-colors hover:bg-stone-50"
                        onClick={(e) => e.preventDefault()}
                      >
                        {item.label}
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* ── SPLIT PANEL ──────────────────────────────────── */}
        {pattern === "split" && openId && activeSection && (
          <div
            ref={splitPanelRef}
            className="absolute top-full z-50 flex bg-white shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
            style={{
              left: navEdges?.left ?? 0,
              right: navEdges?.right ?? 0,
              borderLeft: `2px solid ${ACCENT}`,
              borderBottom: `1px solid #e8e8e8`,
              borderRight: `1px solid #e8e8e8`,
            }}
          >
            {/* L1 column */}
            <div className="flex w-[35%] shrink-0 flex-col py-2">
              <GoTo label={activeSection.goTo} small />
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

            {/* L2 column */}
            <div
              className="flex w-[65%] flex-col py-2"
              style={{ borderLeft: `1px solid #e8e8e8`, backgroundColor: "#FAF9F7" }}
            >
              {activeL1 !== null && currentL1 && (
                <>
                  <GoTo label={`Gå till ${currentL1.label}`} small />
                  <div className="flex flex-col">
                    {currentL1.l2.map((item) => (
                      <L2Link key={item.label} label={item.label} />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* ── SPLIT CENTERED ───────────────────────────────── */}
        {pattern === "split-centered" && openId && activeSection && (
          <div
            ref={splitPanelRef}
            className="absolute top-full z-50 flex bg-white shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
            style={{
              left: "50%",
              transform: "translateX(-50%)",
              borderLeft: `2px solid ${ACCENT}`,
              borderBottom: `1px solid #e8e8e8`,
              borderRight: `1px solid #e8e8e8`,
            }}
          >
            {/* L1 column */}
            <div className="flex shrink-0 flex-col py-2" style={{ width: 260 }}>
              <GoTo label={activeSection.goTo} small />
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

            {/* L2 column */}
            <div
              className="flex flex-col py-2"
              style={{ width: 300, borderLeft: `1px solid #e8e8e8`, backgroundColor: "#FAF9F7" }}
            >
              {activeL1 !== null && currentL1 && (
                <>
                  <GoTo label={`Gå till ${currentL1.label}`} small />
                  <div className="flex flex-col">
                    {currentL1.l2.map((item) => (
                      <L2Link key={item.label} label={item.label} />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* ── SPLIT CENTERED + OVERLAY ─────────────────────── */}
        {pattern === "split-centered-overlay" && openId && activeSection && (
          <>
            {/* Backdrop */}
            <div
              className="absolute left-0 right-0 top-full z-40"
              style={{ height: "100vh", backgroundColor: "rgba(0,0,0,0.25)" }}
              onClick={closeMenu}
            />
            {/* Panel */}
            <div
              ref={splitPanelRef}
              className="absolute top-full z-50 flex bg-white shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
              style={{
                left: "50%",
                transform: "translateX(-50%)",
                borderLeft: `2px solid ${ACCENT}`,
                borderBottom: `1px solid ${BEIGE}`,
                borderRight: `1px solid ${BEIGE}`,
              }}
            >
              {/* L1 column */}
              <div className="flex shrink-0 flex-col py-2" style={{ width: 260 }}>
                <GoTo label={activeSection.goTo} small />
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
                        backgroundColor: isActive ? BEIGE : undefined,
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

              {/* L2 column */}
              <div
                className="flex flex-col py-2"
                style={{ width: 300, borderLeft: `1px solid #e8e8e8`, backgroundColor: "#FAF9F7" }}
              >
                {activeL1 !== null && currentL1 && (
                  <>
                    <GoTo label={`Gå till ${currentL1.label}`} small />
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

        {/* ── SPLIT + OVERLAY ──────────────────────────────── */}
        {pattern === "split-overlay" && openId && activeSection && (
          <>
            {/* Backdrop — starts below the nav, leaves nav fully visible */}
            <div
              className="absolute left-0 right-0 top-full z-40"
              style={{ height: "100vh", backgroundColor: "rgba(0,0,0,0.25)" }}
              onClick={closeMenu}
            />
            {/* Panel */}
            <div
              ref={splitPanelRef}
              className="absolute top-full z-50 flex bg-white shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
              style={{
                left: (navEdges?.left ?? 0) - 16,
                right: (navEdges?.right ?? 0) - 16,
                borderLeft: `2px solid ${ACCENT}`,
                borderBottom: `1px solid #e8e8e8`,
                borderRight: `1px solid #e8e8e8`,
              }}
            >
              {/* L1 column */}
              <div className="flex w-[35%] shrink-0 flex-col py-2">
                <GoTo label={activeSection.goTo} small />
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

              {/* L2 column */}
              <div
                className="flex w-[65%] flex-col py-2"
                style={{ borderLeft: `1px solid #e8e8e8`, backgroundColor: "#FAF9F7" }}
              >
                {activeL1 !== null && currentL1 && (
                  <>
                    <GoTo label={`Gå till ${currentL1.label}`} small />
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

        {/* ── SPLIT MIN 8 ──────────────────────────────────── */}
        {/* Left col: min-height = GoTo(40) + 8 items(40ea) + py-2(16) = 376px  */}
        {/* Right col: same max-height, overflows with scroll                    */}
        {pattern === "split-min8" && openId && activeSection && (
          <>
            {/* Backdrop */}
            <div
              className="absolute left-0 right-0 top-full z-40"
              style={{ height: "100vh", backgroundColor: "rgba(0,0,0,0.25)" }}
              onClick={closeMenu}
            />
            {/* Panel */}
            <div
              ref={splitPanelRef}
              className="absolute top-full z-50 flex bg-white shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
              style={{
                left: (navEdges?.left ?? 0) - 16,
                right: (navEdges?.right ?? 0) - 16,
                borderLeft: `2px solid ${ACCENT}`,
                borderBottom: `1px solid #e8e8e8`,
                borderRight: `1px solid #e8e8e8`,
              }}
            >
              {/* L1 column — always at least 8 items tall */}
              <div
                className="flex w-[35%] shrink-0 flex-col py-2"
                style={{ minHeight: 376 }}
              >
                <GoTo label={activeSection.goTo} small />
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

              {/* L2 column — capped to same height, scrolls when content overflows */}
              <div
                className="flex w-[65%] flex-col overflow-y-auto py-2"
                style={{
                  maxHeight: 376,
                  borderLeft: `1px solid #e8e8e8`,
                  backgroundColor: "#FAF9F7",
                }}
              >
                {activeL1 !== null && currentL1 && (
                  <>
                    <GoTo label={`Gå till ${currentL1.label}`} small />
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
            {/* Backdrop */}
            <div
              className="absolute left-0 right-0 top-full z-40"
              style={{ height: "100vh", backgroundColor: "rgba(0,0,0,0.25)" }}
              onClick={closeMenu}
            />
            {/* Panel */}
            <div
              ref={splitPanelRef}
              className="absolute top-full z-50 flex bg-white shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
              style={{
                left: (navEdges?.left ?? 0) - 16,
                right: (navEdges?.right ?? 0) - 16,
                borderLeft: `2px solid ${ACCENT}`,
                borderBottom: `1px solid #e8e8e8`,
                borderRight: `1px solid #e8e8e8`,
              }}
            >
              {/* L1 column — click only, no hover */}
              <div
                className="flex w-[35%] shrink-0 flex-col py-2"
                style={{ minHeight: 376 }}
              >
                <GoTo label={activeSection.goTo} small />
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

              {/* L2 column — only populated after a click */}
              <div
                className="flex w-[65%] flex-col overflow-y-auto py-2"
                style={{
                  maxHeight: 376,
                  borderLeft: `1px solid #e8e8e8`,
                  backgroundColor: "#FAF9F7",
                }}
              >
                {activeL1 !== null && currentL1 && (
                  <>
                    <GoTo label={`Gå till ${currentL1.label}`} small />
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
        {/* Hover → shows L2. Click → locks. Click same → unlocks back to hover. */}
        {pattern === "split-min8-sticky" && openId && activeSection && (() => {
          const displayL1 = lockedL1 !== null ? lockedL1 : activeL1;
          const displayCurrentL1 = displayL1 !== null ? activeSection.l1[displayL1] : null;
          return (
            <>
              {/* Backdrop */}
              <div
                className="absolute left-0 right-0 top-full z-40"
                style={{ height: "100vh", backgroundColor: "rgba(0,0,0,0.25)" }}
                onClick={closeMenu}
              />
              {/* Panel */}
              <div
                ref={splitPanelRef}
                className="absolute top-full z-50 flex bg-white shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
                style={{
                  left: (navEdges?.left ?? 0) - 16,
                  right: (navEdges?.right ?? 0) - 16,
                  borderLeft: `2px solid ${ACCENT}`,
                  borderBottom: `1px solid #e8e8e8`,
                  borderRight: `1px solid #e8e8e8`,
                }}
              >
                {/* L1 column */}
                <div
                  className="flex w-[35%] shrink-0 flex-col py-2"
                  style={{ minHeight: 376 }}
                >
                  <GoTo label={activeSection.goTo} small />
                  {activeSection.l1.map((item, i) => {
                    const isLocked = lockedL1 === i;
                    const isActive = i === activeL1;
                    return (
                      <button
                        key={item.label}
                        onMouseEnter={() => {
                          if (lockedL1 === null) setActiveL1(i);
                        }}
                        onClick={() => {
                          if (lockedL1 === i) {
                            setLockedL1(null); // unlock → back to hover
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

                {/* L2 column — follows lock, falls back to hover */}
                <div
                  className="flex w-[65%] flex-col overflow-y-auto py-2"
                  style={{
                    maxHeight: 376,
                    borderLeft: `1px solid #e8e8e8`,
                    backgroundColor: "#FAF9F7",
                  }}
                >
                  {displayCurrentL1 && (
                    <>
                      <GoTo label={`Gå till ${displayCurrentL1.label}`} small />
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

      {/* ── ANCHORED panel (fixed position) ──────────────── */}
      <AnimatePresence>
        {pattern === "anchored" && openId && activeSection && panelPos && (
          <motion.div
            ref={anchoredPanelRef}
            key={openId}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="fixed z-50 flex flex-col bg-white shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
            style={{
              left: panelPos.left,
              top: panelPos.top,
              width: PANEL_WIDTH,
              height: MENU_HEIGHT,
              borderLeft: `2px solid ${ACCENT}`,
              borderBottom: `1px solid #e8e8e8`,
              borderRight: `1px solid #e8e8e8`,
            }}
          >
            {/* Breadcrumb */}
            <div
              className="flex shrink-0 items-center gap-2 px-6 py-2 text-xs font-medium"
              style={{ borderBottom: `1px solid ${BEIGE}`, minHeight: 36 }}
            >
              <span
                className={isL2 ? "cursor-pointer hover:underline" : ""}
                onClick={isL2 ? drillOut : undefined}
                style={{ color: isL2 ? PURPLE_DARK : "#aaa" }}
              >
                {activeSection.label}
              </span>
              {isL2 && (
                <>
                  <span style={{ color: "#e0e0e0" }}>/</span>
                  <span style={{ color: "#aaa" }}>{currentL1?.label}</span>
                </>
              )}
            </div>

            {/* Sliding content */}
            <div className="relative flex-1 overflow-hidden">
              <AnimatePresence mode="wait" custom={direction} initial={false}>
                {!isL2 ? (
                  <motion.div
                    key="l1"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="absolute inset-0 flex flex-col overflow-y-auto py-1"
                  >
                    <GoTo label={activeSection.goTo} small />
                    {activeSection.l1.map((item, i) => (
                      <button
                        key={item.label}
                        onClick={() => drillIn(i)}
                        className="flex w-full items-center justify-between gap-2 px-6 py-2.5 text-left text-[14px] font-medium transition-colors hover:bg-stone-50"
                      >
                        {item.label}
                        <ChevronRight size={13} style={{ color: ACCENT, flexShrink: 0 }} />
                      </button>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key={`l2-${activeL1}`}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="absolute inset-0 flex flex-col overflow-y-auto py-1"
                  >
                    <BackButton label={activeSection.label} onClick={drillOut} small />
                    <Divider small />
                    {currentL1?.l2.map((item) => (
                      <a
                        key={item.label}
                        href="#"
                        className="flex items-center px-6 py-2.5 text-[14px] font-medium transition-colors hover:bg-stone-50"
                        onClick={(e) => e.preventDefault()}
                      >
                        {item.label}
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SIDE DRAWER ──────────────────────────────────── */}
      <AnimatePresence>
        {pattern === "drawer" && openId && activeSection && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0"
              style={{
                backgroundColor: "rgba(0,0,0,0.25)",
                zIndex: 40,
              }}
              onClick={closeMenu}
            />

            {/* Drawer */}
            <motion.div
              key="drawer"
              initial={{ x: DRAWER_WIDTH }}
              animate={{ x: 0 }}
              exit={{ x: DRAWER_WIDTH }}
              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] as const }}
              className="fixed right-0 top-0 z-50 flex flex-col bg-white shadow-[-8px_0_32px_rgba(0,0,0,0.1)]"
              style={{
                width: DRAWER_WIDTH,
                height: "100vh",
                borderLeft: `2px solid ${ACCENT}`,
              }}
            >
              {/* Drawer header */}
              <div
                className="flex shrink-0 items-center justify-between px-8 py-4"
                style={{ borderBottom: `1px solid ${BEIGE}` }}
              >
                <span className="text-[16px] font-semibold" style={{ color: PURPLE_DARK }}>
                  {activeSection.label}
                </span>
                <button
                  onClick={closeMenu}
                  className="flex items-center justify-center rounded p-1.5 transition-colors hover:bg-stone-100"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Breadcrumb (L2 only) */}
              <AnimatePresence>
                {isL2 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 40, opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="flex shrink-0 items-center gap-2 overflow-hidden px-8 text-xs font-medium"
                    style={{ borderBottom: `1px solid ${BEIGE}` }}
                  >
                    <button
                      onClick={drillOut}
                      className="flex items-center gap-1 hover:underline"
                      style={{ color: PURPLE_DARK }}
                    >
                      <ChevronLeft size={12} />
                      {activeSection.label}
                    </button>
                    <span style={{ color: "#ddd" }}>/</span>
                    <span style={{ color: "#aaa" }}>{currentL1?.label}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Drawer body */}
              <div className="relative flex-1 overflow-hidden">
                <AnimatePresence mode="wait" custom={direction} initial={false}>
                  {!isL2 ? (
                    <motion.div
                      key="l1"
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      className="absolute inset-0 flex flex-col overflow-y-auto py-2"
                    >
                      <GoTo label={activeSection.goTo} />
                      {activeSection.l1.map((item, i) => (
                        <button
                          key={item.label}
                          onClick={() => drillIn(i)}
                          className="flex w-full items-center justify-between gap-3 px-8 py-3 text-left text-[15px] font-medium transition-colors hover:bg-stone-50"
                          style={{ borderBottom: `1px solid ${BEIGE}` }}
                        >
                          {item.label}
                          <ChevronRight size={13} style={{ color: ACCENT, flexShrink: 0 }} />
                        </button>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      key={`l2-${activeL1}`}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      className="absolute inset-0 flex flex-col overflow-y-auto py-2"
                    >
                      <GoTo label={`Gå till ${currentL1?.label}`} />
                      {currentL1?.l2.map((item) => (
                        <a
                          key={item.label}
                          href="#"
                          className="flex items-center px-8 py-3 text-[15px] font-medium transition-colors hover:bg-stone-50"
                          style={{ borderBottom: `1px solid ${BEIGE}` }}
                          onClick={(e) => e.preventDefault()}
                        >
                          {item.label}
                        </a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Page content ─────────────────────────────────── */}
      {pageType === "hero" ? (
        <main>
          {/* Hero image */}
          <div
            className="relative flex w-full items-end"
            style={{ height: "62vh", backgroundColor: "#2d3a5e" }}
          >
            {/* Gradient overlay */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(20,28,58,0.15) 0%, rgba(20,28,58,0.75) 100%)",
              }}
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

          {/* Content below hero */}
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
            {/* Article body */}
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

              {/* Lead image */}
              <div className="mb-8 h-72 w-full rounded-sm" style={{ backgroundColor: "#d4dce8" }} />

              <p className="mb-5 text-[17px] font-medium leading-relaxed" style={{ color: "#222" }}>
                En ny rapport från universitetet visar att industrins utsläpp kan halveras till 2035 om rätt teknikinvesteringar görs nu. Forskargruppen bakom studien har kartlagt 400 processer i 12 länder.
              </p>
              <p className="mb-5 text-[16px] leading-relaxed" style={{ color: "#444" }}>
                Industrins koldioxidutsläpp utgör idag drygt 30 procent av de globala utsläppen. Stål, cement och kemi är de tyngsta sektorerna — och de svåraste att ställa om. Men enligt forskarnas beräkningar finns det en tydlig teknisk väg framåt om politiska och ekonomiska incitament samordnas.
              </p>
              <p className="mb-5 text-[16px] leading-relaxed" style={{ color: "#444" }}>
                — Det handlar inte om att uppfinna nya tekniker, utan om att skala upp det vi redan vet fungerar, säger professor Erik Magnusson som leder projektet. Vätgas, elektrifiering av processvärme och koldioxidavskiljning är nycklarna.
              </p>
              <div className="my-8 border-l-4 py-1 pl-6" style={{ borderColor: ACCENT }}>
                <p className="text-[18px] font-medium italic leading-snug" style={{ color: PURPLE }}>
                  "Rätt investeringar nu kan halvera industriutsläppen på ett decennium."
                </p>
                <p className="mt-2 text-[13px]" style={{ color: "#888" }}>Erik Magnusson, professor i industriell energiteknik</p>
              </div>
              <p className="mb-5 text-[16px] leading-relaxed" style={{ color: "#444" }}>
                Rapporten presenterades vid en konferens i Göteborg och har fått genomslag i internationell press. EU-kommissionen har visat intresse för att använda metodiken i sitt industriomställningsprogram.
              </p>
            </article>

            {/* Sidebar */}
            <aside className="flex flex-col gap-6 pt-16">
              <div className="rounded-sm p-5" style={{ backgroundColor: BEIGE }}>
                <h3 className="mb-3 text-[14px] font-semibold uppercase tracking-wide" style={{ color: "#666" }}>Relaterat</h3>
                {["Hållbarhetsrapport 2025", "Industriell energiteknik", "Klimat och miljö"].map((t) => (
                  <a key={t} href="#" onClick={(e) => e.preventDefault()} className="mb-2 flex items-start gap-2 text-[14px] font-medium hover:underline" style={{ color: ACCENT }}>
                    → {t}
                  </a>
                ))}
              </div>
              <div className="rounded-sm p-5" style={{ border: `1px solid ${BEIGE}` }}>
                <h3 className="mb-2 text-[14px] font-semibold" style={{ color: "#333" }}>Kontakt</h3>
                <p className="text-[13px] leading-relaxed" style={{ color: "#666" }}>Anna Lindström<br />kommunikation@universitetet.se<br />031-100 10 00</p>
              </div>
            </aside>
          </div>
        </main>
      )}
    </div>
  );
}

// ── Shared sub-elements ───────────────────────────────────────

function GoTo({ label, small }: { label: string; small?: boolean }) {
  const px = small ? "px-6" : "px-8";
  const py = small ? "py-2.5" : "py-[10px]";
  const text = small ? "text-[14px]" : "text-[15px]";
  return (
    <a
      href="#"
      className={`flex items-center gap-2 ${px} ${py} ${text} font-medium hover:underline`}
      style={{ color: PURPLE_DARK }}
      onClick={(e) => e.preventDefault()}
    >
      <ArrowRight size={small ? 14 : 15} />
      {label}
    </a>
  );
}

function BackButton({
  label,
  onClick,
  small,
}: {
  label: string;
  onClick: () => void;
  small?: boolean;
}) {
  const px = small ? "px-6" : "px-8";
  const py = small ? "py-2.5" : "py-[10px]";
  const text = small ? "text-[14px]" : "text-[15px]";
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 ${px} ${py} ${text} font-semibold transition-colors hover:underline`}
      style={{ color: PURPLE_DARK }}
    >
      <ChevronLeft size={small ? 14 : 15} />
      {label}
    </button>
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

function Divider({ small }: { small?: boolean }) {
  const mx = small ? "mx-6" : "mx-8";
  return <div className={`${mx} my-1`} style={{ height: 1, backgroundColor: BEIGE }} />;
}
