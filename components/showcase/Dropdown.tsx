"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp, CircleAlert } from "lucide-react";

/* ─── Design tokens from Figma ─── */
const tokens = {
  white: {
    border: "white",
    borderFocused: "white",
    text: "white",
    textSecondary: "#5a7179",
    label: "white",
    supporting: "white",
    errorBg: "#ea7088",
    errorText: "#b10e2e",
    errorIcon: "#b10e2e",
    disabledBg: "#9facb1",
    chevron: "white",
    icon: "white",
  },
  black: {
    border: "#012231",
    borderFocused: "#012231",
    text: "#012231",
    textSecondary: "#012231",
    label: "#012231",
    supporting: "#012231",
    errorBorder: "#b10e2e",
    errorText: "#b10e2e",
    errorIcon: "#b10e2e",
    disabledBg: "#9facb1",
    chevron: "#012231",
    icon: "#012231",
  },
};

export type DropdownState =
  | "Default"
  | "Focused"
  | "Selected item"
  | "Selected multiple"
  | "Error"
  | "Disabled";

export type DropdownMode = "White" | "Black";

interface DropdownProps {
  label?: string;
  supportingText?: string;
  showSupportingText?: boolean;
  required?: boolean;
  mode?: DropdownMode;
  /** Force a visual state for the sandbox preview */
  forcedState?: DropdownState;
  options?: string[];
  multiple?: boolean;
  disabled?: boolean;
  error?: string | boolean;
  className?: string;
}

export function Dropdown({
  label = "Label",
  supportingText = "Supporting text",
  showSupportingText = true,
  required = true,
  mode = "White",
  forcedState,
  options = ["Option 1", "Option 2", "Option 3", "Option 4"],
  multiple = false,
  disabled = false,
  error = false,
  className,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const t = mode === "White" ? tokens.white : tokens.black;

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Derive visual state
  const resolveState = (): DropdownState => {
    if (forcedState) return forcedState;
    if (disabled) return "Disabled";
    if (error) return "Error";
    if (isFocused && isOpen) return "Focused";
    if (selected.length > 1) return "Selected multiple";
    if (selected.length === 1) return "Selected item";
    return "Default";
  };

  const state = resolveState();

  const hasFloatingLabel =
    state === "Focused" ||
    state === "Selected item" ||
    state === "Selected multiple" ||
    state === "Disabled";

  const handleToggle = () => {
    if (state === "Disabled") return;
    setIsOpen(!isOpen);
    setIsFocused(true);
  };

  const handleSelect = (option: string) => {
    if (multiple) {
      setSelected((prev) =>
        prev.includes(option)
          ? prev.filter((s) => s !== option)
          : [...prev, option]
      );
    } else {
      setSelected([option]);
      setIsOpen(false);
      setIsFocused(false);
    }
  };

  // ─── Compute styles per state ───
  const inputText = (() => {
    if (state === "Selected item") return selected[0] || "Input";
    if (state === "Selected multiple")
      return selected.join(", ") || "Input 1, Input 2, Input 3";
    if (state === "Disabled") return selected[0] || "Input";
    return "";
  })();

  const borderStyle = (() => {
    if (state === "Error" && mode === "White") return "none";
    if (state === "Error" && mode === "Black")
      return `1px solid ${tokens.black.errorBorder}`;
    if (state === "Focused") return `2px solid ${t.borderFocused}`;
    if (state === "Disabled") return `1px solid ${t.border}`;
    return `1px solid ${t.border}`;
  })();

  const bgStyle = (() => {
    if (state === "Error" && mode === "White") return tokens.white.errorBg;
    if (state === "Disabled") return t.disabledBg;
    return "transparent";
  })();

  const textColor = (() => {
    if (state === "Error") return mode === "White" ? t.text : tokens.black.errorText;
    if (state === "Disabled") return mode === "White" ? t.textSecondary : t.text;
    return t.text;
  })();

  const supportColor = (() => {
    if (state === "Error") return mode === "White" ? tokens.white.errorText : tokens.black.errorText;
    return t.supporting;
  })();

  const chevronColor = (() => {
    if (state === "Error" && mode === "Black") return tokens.black.errorText;
    return t.chevron;
  })();

  return (
    <div ref={ref} className={`relative inline-block ${className || ""}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* ─── Dropdown trigger ─── */}
      <button
        type="button"
        onClick={handleToggle}
        onFocus={() => !disabled && setIsFocused(true)}
        onBlur={() => { if (!isOpen) setIsFocused(false); }}
        disabled={state === "Disabled"}
        className="relative flex h-14 w-[200px] items-center gap-2 rounded-lg px-3 py-2 transition-all outline-none cursor-pointer disabled:cursor-not-allowed"
        style={{
          border: borderStyle,
          backgroundColor: bgStyle,
        }}
      >
        {/* Floating label */}
        {hasFloatingLabel && (
          <span
            className="absolute left-2 -top-2.5 px-1 text-[10px] font-medium leading-[1.2] whitespace-nowrap"
            style={{
              color: t.label,
              backgroundColor: mode === "Black" ? "white" : undefined,
              backdropFilter: mode === "White" ? "blur(5px)" : undefined,
              WebkitBackdropFilter: mode === "White" ? "blur(5px)" : undefined,
            }}
          >
            {label}
            {required && <span className="ml-0.5">*</span>}
          </span>
        )}

        {/* Inline label (Default / Error) */}
        {!hasFloatingLabel && (
          <span
            className="flex flex-1 items-center gap-1 text-base font-normal leading-[1.5] min-w-0"
            style={{ color: textColor }}
          >
            {state === "Error" ? (
              <>
                <span>{label}</span>
                {required && <span>*</span>}
              </>
            ) : (
              <>
                <span>{label}</span>
                {required && <span>*</span>}
              </>
            )}
          </span>
        )}

        {/* Selected text */}
        {hasFloatingLabel && (
          <span
            className="flex-1 text-left text-base font-normal leading-[1.2] min-w-0 truncate"
            style={{ color: textColor }}
          >
            {inputText}
          </span>
        )}

        {/* Error icon */}
        {state === "Error" && (
          <CircleAlert
            className="shrink-0"
            size={20}
            style={{ color: mode === "White" ? t.text : tokens.black.errorIcon }}
          />
        )}

        {/* Chevron */}
        {state === "Focused" && isOpen ? (
          <ChevronUp className="shrink-0" size={24} style={{ color: chevronColor }} />
        ) : (
          <ChevronDown className="shrink-0" size={24} style={{ color: chevronColor }} />
        )}
      </button>

      {/* Supporting text */}
      {showSupportingText && (
        <p
          className="mt-1.5 ml-3 text-[10px] font-medium leading-[1.2]"
          style={{ color: supportColor }}
        >
          {supportingText}
        </p>
      )}

      {/* ─── Dropdown menu ─── */}
      {isOpen && state !== "Disabled" && state !== "Error" && (
        <div
          className="absolute left-0 top-[60px] z-50 w-[200px] rounded-lg py-1 shadow-lg"
          style={{
            backgroundColor: mode === "White" ? "#1a2e38" : "white",
            border: `1px solid ${t.border}`,
          }}
        >
          {options.map((option) => {
            const isSelected = selected.includes(option);
            return (
              <button
                key={option}
                type="button"
                onClick={() => handleSelect(option)}
                className="flex w-full items-center gap-2 px-3 py-2.5 text-sm transition-colors text-left"
                style={{
                  color: mode === "White" ? "white" : "#012231",
                  backgroundColor: isSelected
                    ? mode === "White"
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(1,34,49,0.08)"
                    : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected)
                    e.currentTarget.style.backgroundColor =
                      mode === "White"
                        ? "rgba(255,255,255,0.06)"
                        : "rgba(1,34,49,0.04)";
                }}
                onMouseLeave={(e) => {
                  if (!isSelected)
                    e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                {multiple && (
                  <span
                    className="flex h-4 w-4 shrink-0 items-center justify-center rounded border"
                    style={{
                      borderColor: mode === "White" ? "white" : "#012231",
                      backgroundColor: isSelected
                        ? mode === "White"
                          ? "white"
                          : "#012231"
                        : "transparent",
                    }}
                  >
                    {isSelected && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path
                          d="M1 4L3.5 6.5L9 1"
                          stroke={mode === "White" ? "#012231" : "white"}
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                )}
                {option}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
