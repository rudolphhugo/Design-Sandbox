"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

// ─── Chalmers Design System Tokens ───────────────────────────────────────────
// Source: Figma file 44Oi8utPWrM85HhkygDlWh, node 3922
// Token paths match the Figma Semantics variable collection
const T = {
  blue:        "#0677b1",  // States/Border/Focus  → selected day & action links
  textPrimary: "#000000",  // Text/Primary
  textMuted:   "#aaaaaa",  // prev / next month days (lighter than Text/Disabled)
  bg:          "#ffffff",  // Background/Base
  border:      "#e8e8e8",  // light rule between header / grid / footer
} as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DAYS   = ["M", "T", "W", "T", "F", "S", "S"] as const;
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth()    === b.getMonth()    &&
    a.getDate()     === b.getDate()
  );
}

/** Monday-first start of the calendar grid for a given year/month */
function gridStart(year: number, month: number): Date {
  const first     = new Date(year, month, 1);
  const dayOfWeek = first.getDay(); // 0 = Sunday
  const offset    = (dayOfWeek + 6) % 7; // days since Monday
  return new Date(year, month, 1 - offset);
}

/** Build 42-cell (6 × 7) grid for a given view month */
function buildGrid(year: number, month: number): Date[] {
  const start = gridStart(year, month);
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function NavArrow({ up, onClick }: { up: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={up ? "Previous month" : "Next month"}
      className="flex h-8 w-8 items-center justify-center rounded transition-colors hover:bg-stone-100"
    >
      {up ? (
        // ↑ arrow
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 12V4M4 8l4-4 4 4" stroke={T.textPrimary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        // ↓ arrow
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 4v8M4 8l4 4 4-4" stroke={T.textPrimary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ChalmersDatePicker() {
  const today = new Date();

  const [selected,   setSelected]   = useState<Date | null>(today);
  const [viewYear,   setViewYear]   = useState(today.getFullYear());
  const [viewMonth,  setViewMonth]  = useState(today.getMonth());

  const cells = buildGrid(viewYear, viewMonth);

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }
  function goToday() {
    setSelected(today);
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-100">
      <div
        className="flex flex-col rounded-sm bg-white"
        style={{
          width: 320,
          boxShadow: "0 4px 24px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)",
        }}
      >
        {/* ── Header ─────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-5 py-4">
          {/* Month / year label */}
          <button
            className="flex items-center gap-1 text-[15px] font-bold leading-none"
            style={{ color: T.textPrimary }}
            aria-label="Select month and year"
          >
            {MONTHS[viewMonth]} {viewYear}
            <ChevronDown size={14} strokeWidth={2.5} className="mt-px" />
          </button>

          {/* Prev / next arrows */}
          <div className="flex items-center gap-0.5">
            <NavArrow up onClick={prevMonth} />
            <NavArrow up={false} onClick={nextMonth} />
          </div>
        </div>

        {/* ── Day-of-week headers ─────────────────────────────── */}
        <div
          className="grid grid-cols-7 border-t px-3 py-2"
          style={{ borderColor: T.border }}
        >
          {DAYS.map((d, i) => (
            <div
              key={i}
              className="text-center text-[13px] font-medium"
              style={{ color: T.textPrimary }}
            >
              {d}
            </div>
          ))}
        </div>

        {/* ── Date grid ──────────────────────────────────────── */}
        <div className="grid grid-cols-7 px-3 pb-3">
          {cells.map((date, i) => {
            const isCurrentMonth = date.getMonth() === viewMonth;
            const isSelected     = selected ? isSameDay(date, selected) : false;
            const isToday        = isSameDay(date, today);

            return (
              <button
                key={i}
                onClick={() => setSelected(date)}
                className="flex items-center justify-center rounded-sm text-[14px] font-medium transition-colors"
                style={{
                  height: 36,
                  color: isSelected
                    ? "#ffffff"
                    : isCurrentMonth
                    ? T.textPrimary
                    : T.textMuted,
                  backgroundColor: isSelected ? T.blue : "transparent",
                  fontWeight: isToday && !isSelected ? 700 : undefined,
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#f1f5f9";
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                }}
                aria-label={date.toLocaleDateString("en-SE", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                aria-pressed={isSelected}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>

        {/* ── Footer ─────────────────────────────────────────── */}
        <div
          className="flex items-center justify-between border-t px-5 py-3"
          style={{ borderColor: T.border }}
        >
          <button
            onClick={() => setSelected(null)}
            className="text-[14px] font-medium transition-opacity hover:opacity-70"
            style={{ color: T.blue }}
          >
            Clear
          </button>
          <button
            onClick={goToday}
            className="text-[14px] font-medium transition-opacity hover:opacity-70"
            style={{ color: T.blue }}
          >
            Today
          </button>
        </div>
      </div>
    </div>
  );
}
