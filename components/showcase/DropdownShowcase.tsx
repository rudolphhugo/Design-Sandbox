"use client";

import { useState } from "react";
import { Dropdown, type DropdownState, type DropdownMode } from "./Dropdown";

const STATES: DropdownState[] = [
  "Default",
  "Focused",
  "Selected item",
  "Selected multiple",
  "Error",
  "Disabled",
];

const MODES: DropdownMode[] = ["White", "Black"];

export function DropdownShowcase() {
  const [activeState, setActiveState] = useState<DropdownState | "Interactive">(
    "Interactive"
  );
  const [activeMode, setActiveMode] = useState<DropdownMode>("White");
  const [required, setRequired] = useState(true);
  const [showSupporting, setShowSupporting] = useState(true);
  const [multiSelect, setMultiSelect] = useState(false);

  const bgColor = activeMode === "White" ? "#2d4a56" : "#f5f5f5";
  const controlBg = activeMode === "White" ? "#1a2e38" : "white";
  const controlText = activeMode === "White" ? "white" : "#012231";
  const controlBorder = activeMode === "White" ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)";

  return (
    <div className="space-y-8">
      {/* ─── Controls ─── */}
      <div
        className="rounded-xl p-5 space-y-5"
        style={{ backgroundColor: controlBg, color: controlText }}
      >
        {/* Mode toggle */}
        <div>
          <p className="text-xs font-medium uppercase tracking-wider mb-2 opacity-60">
            Mode
          </p>
          <div className="flex gap-2">
            {MODES.map((m) => (
              <button
                key={m}
                onClick={() => setActiveMode(m)}
                className="rounded-lg px-4 py-2 text-sm font-medium transition-all"
                style={{
                  backgroundColor:
                    activeMode === m
                      ? activeMode === "White"
                        ? "white"
                        : "#012231"
                      : "transparent",
                  color:
                    activeMode === m
                      ? activeMode === "White"
                        ? "#012231"
                        : "white"
                      : controlText,
                  border: `1px solid ${controlBorder}`,
                }}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* State selector */}
        <div>
          <p className="text-xs font-medium uppercase tracking-wider mb-2 opacity-60">
            State
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveState("Interactive")}
              className="rounded-lg px-3 py-1.5 text-xs font-medium transition-all"
              style={{
                backgroundColor:
                  activeState === "Interactive"
                    ? activeMode === "White"
                      ? "white"
                      : "#012231"
                    : "transparent",
                color:
                  activeState === "Interactive"
                    ? activeMode === "White"
                      ? "#012231"
                      : "white"
                    : controlText,
                border: `1px solid ${controlBorder}`,
              }}
            >
              Interactive
            </button>
            {STATES.map((s) => (
              <button
                key={s}
                onClick={() => setActiveState(s)}
                className="rounded-lg px-3 py-1.5 text-xs font-medium transition-all"
                style={{
                  backgroundColor:
                    activeState === s
                      ? activeMode === "White"
                        ? "white"
                        : "#012231"
                      : "transparent",
                  color:
                    activeState === s
                      ? activeMode === "White"
                        ? "#012231"
                        : "white"
                      : controlText,
                  border: `1px solid ${controlBorder}`,
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={required}
              onChange={(e) => setRequired(e.target.checked)}
              className="rounded"
            />
            Required
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={showSupporting}
              onChange={(e) => setShowSupporting(e.target.checked)}
              className="rounded"
            />
            Supporting text
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={multiSelect}
              onChange={(e) => setMultiSelect(e.target.checked)}
              className="rounded"
            />
            Multi-select
          </label>
        </div>
      </div>

      {/* ─── Preview area ─── */}
      <div
        className="rounded-xl p-12 flex items-center justify-center min-h-[200px] transition-colors"
        style={{ backgroundColor: bgColor }}
      >
        <Dropdown
          label="Label"
          supportingText="Supporting text"
          showSupportingText={showSupporting}
          required={required}
          mode={activeMode}
          forcedState={activeState === "Interactive" ? undefined : activeState}
          multiple={multiSelect}
          disabled={activeState === "Disabled"}
          error={activeState === "Error"}
        />
      </div>

      {/* ─── All states grid ─── */}
      <div>
        <h3 className="text-lg font-semibold mb-4">All States</h3>
        <div className="grid grid-cols-1 gap-8">
          {MODES.map((m) => (
            <div key={m}>
              <p className="text-sm font-medium text-muted-foreground mb-3">
                {m} mode
              </p>
              <div
                className="rounded-xl p-8 flex flex-wrap gap-x-8 gap-y-10 transition-colors"
                style={{
                  backgroundColor: m === "White" ? "#2d4a56" : "#f5f5f5",
                }}
              >
                {STATES.map((s) => (
                  <div key={s} className="flex flex-col items-start">
                    <p
                      className="text-[10px] font-medium uppercase tracking-wider mb-3 opacity-50"
                      style={{ color: m === "White" ? "white" : "#012231" }}
                    >
                      {s}
                    </p>
                    <Dropdown
                      label="Label"
                      supportingText="Supporting text"
                      showSupportingText
                      required
                      mode={m}
                      forcedState={s}
                      disabled={s === "Disabled"}
                      error={s === "Error"}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
