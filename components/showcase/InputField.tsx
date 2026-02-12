"use client";

import { useState, useRef, useEffect } from "react";
import { CircleAlert, XCircle } from "lucide-react";

/* ─── Design tokens from Figma ─── */
const tokens = {
  white: {
    border: "white",
    borderFocused: "white",
    text: "white",
    textSecondary: "#5a7179",
    label: "white",
    placeholder: "rgba(255,255,255,0.5)",
    supporting: "white",
    errorBg: "#ea7088",
    errorText: "#b10e2e",
    errorIcon: "#b10e2e",
    disabledBg: "#9facb1",
    chevron: "white",
    icon: "white",
    /** Background behind the floating label to create the notch effect */
    notchBg: "#2d4a56",
  },
  black: {
    border: "#012231",
    borderFocused: "#012231",
    text: "#012231",
    textSecondary: "#012231",
    label: "#012231",
    placeholder: "rgba(1,34,49,0.4)",
    supporting: "#012231",
    errorBorder: "#b10e2e",
    errorText: "#b10e2e",
    errorIcon: "#b10e2e",
    disabledBg: "#9facb1",
    chevron: "#012231",
    icon: "#012231",
    notchBg: "#f5f5f5",
  },
};

export type InputFieldState =
  | "Default"
  | "Focused"
  | "Filled"
  | "Error"
  | "Disabled";

export type InputFieldMode = "White" | "Black";

interface InputFieldProps {
  label?: string;
  supportingText?: string;
  showSupportingText?: boolean;
  required?: boolean;
  mode?: InputFieldMode;
  /** Force a visual state for the sandbox preview */
  forcedState?: InputFieldState;
  disabled?: boolean;
  error?: string | boolean;
  placeholder?: string;
  showClearButton?: boolean;
  suffix?: string;
  className?: string;
}

export function InputField({
  label = "Label",
  supportingText = "Supporting text",
  showSupportingText = true,
  required = true,
  mode = "White",
  forcedState,
  disabled = false,
  error = false,
  placeholder = "",
  showClearButton = true,
  suffix = "Kg",
  className,
}: InputFieldProps) {
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const t = mode === "White" ? tokens.white : tokens.black;

  // Derive visual state
  const resolveState = (): InputFieldState => {
    if (forcedState) return forcedState;
    if (disabled) return "Disabled";
    if (error) return "Error";
    if (isFocused) return "Focused";
    if (value.length > 0) return "Filled";
    return "Default";
  };

  const state = resolveState();

  // Forced state: set initial values
  useEffect(() => {
    if (forcedState === "Filled" && value === "") {
      setValue("Input");
    }
  }, [forcedState]);

  const hasFloatingLabel =
    state === "Focused" ||
    state === "Filled" ||
    (state === "Disabled" && value.length > 0);

  const handleClear = () => {
    setValue("");
    inputRef.current?.focus();
  };

  const handleFocus = () => {
    if (!disabled) setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleContainerClick = () => {
    if (!disabled) inputRef.current?.focus();
  };

  // ─── Compute styles per state ───
  const borderStyle = (() => {
    if (state === "Error" && mode === "White") return "none";
    if (state === "Error" && mode === "Black")
      return `1px solid ${tokens.black.errorBorder}`;
    if (state === "Focused") return `2px solid ${t.borderFocused}`;
    if (state === "Disabled") return `1px dashed ${t.border}`;
    return `1px solid ${t.border}`;
  })();

  const bgStyle = (() => {
    if (state === "Error" && mode === "White") return tokens.white.errorBg;
    if (state === "Disabled") return t.disabledBg;
    return "transparent";
  })();

  const textColor = (() => {
    if (state === "Error")
      return mode === "White" ? t.text : tokens.black.errorText;
    if (state === "Disabled")
      return mode === "White" ? t.textSecondary : t.text;
    return t.text;
  })();

  const supportColor = (() => {
    if (state === "Error")
      return mode === "White" ? tokens.white.errorText : tokens.black.errorText;
    return t.supporting;
  })();

  const labelColor = (() => {
    if (state === "Error" && mode === "Black") return tokens.black.errorText;
    return t.label;
  })();

  const iconColor = (() => {
    if (state === "Error" && mode === "Black") return tokens.black.errorIcon;
    return t.icon;
  })();

  return (
    <div
      ref={containerRef}
      className={`relative inline-block ${className || ""}`}
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* ─── Input container ─── */}
      <div
        onClick={handleContainerClick}
        className={`relative flex h-14 w-[200px] items-center gap-2 rounded-lg px-3 py-2 transition-all cursor-text ${
          state === "Disabled" ? "cursor-not-allowed" : ""
        }`}
        style={{
          border: borderStyle,
          backgroundColor: bgStyle,
        }}
      >
        {/* Floating label — MUI notched outline style */}
        {hasFloatingLabel && (
          <span
            className="absolute left-2 -top-2.5 px-1 text-[10px] font-medium leading-[1.2] whitespace-nowrap z-10"
            style={{
              color: labelColor,
              backgroundColor: state === "Disabled"
                ? t.disabledBg
                : t.notchBg,
            }}
          >
            {label}
            {required && <span className="ml-0.5">*</span>}
          </span>
        )}

        {/* Inline label (Default / Error without value) */}
        {!hasFloatingLabel && !placeholder && (
          <span
            className="absolute left-3 flex items-center gap-1 text-base font-normal leading-[1.5] pointer-events-none"
            style={{ color: textColor }}
          >
            {label}
            {required && <span>*</span>}
          </span>
        )}

        {/* Placeholder when no inline label */}
        {!hasFloatingLabel && placeholder && (
          <span
            className="absolute left-3 flex items-center gap-1 text-base font-normal leading-[1.5] pointer-events-none"
            style={{ color: textColor }}
          >
            {label}
            {required && <span>*</span>}
          </span>
        )}

        {/* Actual text input */}
        <input
          ref={inputRef}
          type="text"
          value={forcedState === "Filled" && value === "" ? "Input" : value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={state === "Disabled"}
          placeholder={hasFloatingLabel ? placeholder : ""}
          className="flex-1 bg-transparent text-base font-normal leading-[1.2] outline-none min-w-0 disabled:cursor-not-allowed"
          style={{
            color: textColor,
            caretColor: textColor,
            ...(hasFloatingLabel ? {} : { color: "transparent" }),
          }}
          aria-label={label}
        />

        {/* Error icon */}
        {state === "Error" && (
          <CircleAlert
            className="shrink-0"
            size={20}
            style={{
              color:
                mode === "White" ? t.text : tokens.black.errorIcon,
            }}
          />
        )}

        {/* Clear button */}
        {showClearButton && state !== "Error" && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleClear();
            }}
            className="shrink-0 transition-opacity hover:opacity-70 disabled:opacity-30"
            disabled={state === "Disabled"}
            tabIndex={-1}
            aria-label="Clear input"
          >
            <XCircle size={20} style={{ color: iconColor }} />
          </button>
        )}

        {/* Suffix */}
        {suffix && (
          <span
            className="shrink-0 text-sm font-medium"
            style={{ color: textColor }}
          >
            {suffix}
          </span>
        )}
      </div>

      {/* Supporting text */}
      {showSupportingText && (
        <p
          className="mt-1.5 ml-3 text-[10px] font-medium leading-[1.2]"
          style={{ color: supportColor }}
        >
          {supportingText}
        </p>
      )}
    </div>
  );
}
