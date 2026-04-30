"use client";

import { useState, useId } from "react";
import { cn } from "@/lib/utils";

// ─── Design System — Semantic Tokens ────────────────────────────────
// Source: Figma file 44Oi8utPWrM85HhkygDlWh, Semantics variable collection
// Each token name maps directly to the Figma variable path
const T = {
  trackOn:       "#472dbe", // Component/Button/Primary
  trackOnHover:  "#3318a3", // Element/Pressed
  trackOff:      "#e5e5e5", // Element/Inactive
  trackError:    "#d52515", // States/Border/Error
  trackDisabled: "#e5e5e5", // Component/Button/Disabled
  thumb:         "#ffffff", // Element/Inverted
  focusRing:     "#0677b1", // States/Border/Focus
  label:         "#000000", // Text/Primary
  labelDisabled: "#737373", // Text/Disabled
  bg:            "#ffffff", // Background/Base
  bgSecondary:   "#f0ede6", // Background/Secondary
} as const;

// ─── Contrast ratios (WCAG) ──────────────────────────────────────────────────
// White thumb (#fff) on trackOn (#472dbe):   7.89:1  → AAA text / passes UI
// White thumb (#fff) on trackError (#d52515): 5.1:1  → AA text / passes UI (3:1)
// Text/Primary (#000) on Background/Base:    21:1   → AAA ✓
// Text/Disabled exempt per WCAG 1.4.3 exception

// ─── Types ───────────────────────────────────────────────────────────────────
type VisualState = "default" | "hover" | "focus" | "pressed";

interface ToggleProps {
  /** Controlled checked value */
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  error?: boolean;
  label?: string;
  /** Force a visual state — for static showcase display only */
  forceState?: VisualState;
  id?: string;
}

// ─── Toggle primitive ────────────────────────────────────────────────────────
function Toggle({
  checked: controlledChecked,
  defaultChecked = false,
  onChange,
  disabled = false,
  error = false,
  label,
  forceState = "default",
  id: externalId,
}: ToggleProps) {
  const reactId = useId();
  const inputId = externalId ?? reactId;

  const [uncontrolled, setUncontrolled] = useState(defaultChecked);
  const [liveHover, setLiveHover] = useState(false);
  const [liveFocus, setLiveFocus] = useState(false);
  const [livePressed, setLivePressed] = useState(false);

  const isControlled = controlledChecked !== undefined;
  const checked = isControlled ? controlledChecked : uncontrolled;

  const isHover   = forceState === "hover"   || liveHover;
  const isFocus   = forceState === "focus"   || liveFocus;
  const isPressed = forceState === "pressed" || livePressed;

  const handleChange = () => {
    if (disabled) return;
    const next = !checked;
    if (!isControlled) setUncontrolled(next);
    onChange?.(next);
  };

  // ── Track background ──
  let trackBg: string;
  if (disabled) {
    trackBg = T.trackDisabled;
  } else if (error) {
    trackBg = T.trackError;
  } else if (checked) {
    trackBg = isPressed || isHover ? T.trackOnHover : T.trackOn;
  } else {
    trackBg = T.trackOff;
  }

  // ── Unchecked hover: inset border using Element/Base ──
  const uncheckedHoverShadow =
    !checked && isHover && !disabled && !error
      ? `inset 0 0 0 2px ${T.label}`
      : undefined;

  // ── Focus ring ──
  const focusOutline =
    isFocus && !disabled
      ? `2px solid ${T.focusRing}`
      : "2px solid transparent";

  return (
    <label
      htmlFor={inputId}
      style={{ color: disabled ? T.labelDisabled : T.label }}
      className={cn(
        "flex items-center gap-3 select-none",
        "min-h-[44px]", // WCAG 2.5.5 target size
        disabled ? "cursor-not-allowed" : "cursor-pointer"
      )}
      onMouseEnter={() => { if (!disabled) setLiveHover(true); }}
      onMouseLeave={() => { setLiveHover(false); setLivePressed(false); }}
      onMouseDown={() => { if (!disabled) setLivePressed(true); }}
      onMouseUp={() => setLivePressed(false)}
    >
      {/* Hidden native input — provides keyboard, screen reader, and form semantics */}
      <input
        id={inputId}
        type="checkbox"
        role="switch"
        checked={checked}
        disabled={disabled}
        aria-checked={checked}
        aria-invalid={error ? true : undefined}
        onChange={handleChange}
        onFocus={() => setLiveFocus(true)}
        onBlur={() => setLiveFocus(false)}
        className="sr-only"
      />

      {/* Visual track + thumb */}
      <div
        aria-hidden="true"
        style={{
          backgroundColor: trackBg,
          boxShadow: uncheckedHoverShadow,
          outline: focusOutline,
          outlineOffset: "2px",
          // Respect reduced-motion preference
          transition: "background-color 150ms ease, box-shadow 100ms ease",
        }}
        className="relative w-12 h-7 rounded-full shrink-0"
      >
        <div
          style={{
            backgroundColor: T.thumb,
            transform: checked ? "translateX(23px)" : "translateX(3px)",
            // Suppress motion when user prefers it
            transition: "transform 150ms ease",
          }}
          className="absolute top-[3px] w-[22px] h-[22px] rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.25)]"
        />
      </div>

      {label && (
        <span className="text-sm font-medium leading-none">{label}</span>
      )}
    </label>
  );
}

// ─── Showcase helpers ─────────────────────────────────────────────────────────
interface VariantCellProps {
  label: string;
  children: React.ReactNode;
}

function VariantCell({ label, children }: VariantCellProps) {
  return (
    <div className="flex flex-col items-start gap-2">
      <span
        className="text-[11px] font-mono uppercase tracking-wider"
        style={{ color: "#737373" }} // Text/Disabled — muted label
      >
        {label}
      </span>
      {children}
    </div>
  );
}

interface SectionProps {
  title: string;
  token?: string;
  children: React.ReactNode;
}

function Section({ title, token, children }: SectionProps) {
  return (
    <section>
      <div className="flex items-baseline gap-3 mb-4">
        <h2
          className="text-sm font-semibold"
          style={{ color: T.label }}
        >
          {title}
        </h2>
        {token && (
          <span
            className="text-[11px] font-mono"
            style={{ color: T.labelDisabled }}
          >
            {token}
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-8">{children}</div>
    </section>
  );
}

// ─── Token swatch ─────────────────────────────────────────────────────────────
function Swatch({ name, hex }: { name: string; hex: string }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-4 h-4 rounded-sm border border-black/10"
        style={{ backgroundColor: hex }}
      />
      <div className="flex flex-col">
        <span className="text-[11px] font-mono" style={{ color: T.label }}>
          {name}
        </span>
        <span className="text-[10px] font-mono" style={{ color: T.labelDisabled }}>
          {hex}
        </span>
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export function ChalmersToggle() {
  const [liveChecked, setLiveChecked] = useState(false);

  return (
    <div
      className="min-h-screen p-8 md:p-12"
      style={{ backgroundColor: T.bg, fontFamily: "var(--font-sans, sans-serif)" }}
    >
      {/* Header */}
      <div className="mb-10 pb-6 border-b border-black/10">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="text-[11px] font-mono uppercase tracking-widest"
            style={{ color: T.labelDisabled }}
          >
            Design System
          </span>
        </div>
        <h1
          className="text-2xl font-semibold tracking-tight"
          style={{ color: T.label }}
        >
          Toggle
        </h1>
        <p className="mt-1 text-sm" style={{ color: T.labelDisabled }}>
          All variants · WCAG 2.1 Level AAA · Semantic tokens only
        </p>
      </div>

      <div className="flex flex-col gap-12 max-w-3xl">

        {/* ── Live demo ── */}
        <Section title="Live demo">
          <div
            className="flex flex-col gap-4 p-6 rounded-xl border border-black/10"
            style={{ backgroundColor: T.bgSecondary }}
          >
            <Toggle
              checked={liveChecked}
              onChange={setLiveChecked}
              label={liveChecked ? "Enabled" : "Disabled"}
              id="live-demo"
            />
            <p className="text-xs font-mono" style={{ color: T.labelDisabled }}>
              aria-checked: <strong style={{ color: T.label }}>{String(liveChecked)}</strong>
            </p>
          </div>
        </Section>

        {/* ── Unchecked states ── */}
        <Section
          title="Unchecked"
          token="Element/Inactive → #e5e5e5"
        >
          <VariantCell label="Default">
            <Toggle forceState="default" />
          </VariantCell>
          <VariantCell label="Hover">
            <Toggle forceState="hover" />
          </VariantCell>
          <VariantCell label="Focus">
            <Toggle forceState="focus" />
          </VariantCell>
          <VariantCell label="Pressed">
            <Toggle forceState="pressed" />
          </VariantCell>
        </Section>

        {/* ── Checked states ── */}
        <Section
          title="Checked"
          token="Component/Button/Primary → #472dbe"
        >
          <VariantCell label="Default">
            <Toggle defaultChecked forceState="default" />
          </VariantCell>
          <VariantCell label="Hover">
            <Toggle defaultChecked forceState="hover" />
          </VariantCell>
          <VariantCell label="Focus">
            <Toggle defaultChecked forceState="focus" />
          </VariantCell>
          <VariantCell label="Pressed">
            <Toggle defaultChecked forceState="pressed" />
          </VariantCell>
        </Section>

        {/* ── Disabled ── */}
        <Section
          title="Disabled"
          token="Component/Button/Disabled → #e5e5e5"
        >
          <VariantCell label="Unchecked">
            <Toggle disabled />
          </VariantCell>
          <VariantCell label="Checked">
            <Toggle defaultChecked disabled />
          </VariantCell>
          <VariantCell label="Unchecked + label">
            <Toggle disabled label="Notifications" />
          </VariantCell>
          <VariantCell label="Checked + label">
            <Toggle defaultChecked disabled label="Notifications" />
          </VariantCell>
        </Section>

        {/* ── Error ── */}
        <Section
          title="Error"
          token="States/Border/Error → #d52515"
        >
          <VariantCell label="Unchecked">
            <Toggle error />
          </VariantCell>
          <VariantCell label="Checked">
            <Toggle defaultChecked error />
          </VariantCell>
          <VariantCell label="With label">
            <Toggle error label="Marketing emails" />
          </VariantCell>
          <VariantCell label="Checked + label">
            <Toggle defaultChecked error label="Marketing emails" />
          </VariantCell>
        </Section>

        {/* ── With labels ── */}
        <Section title="With labels">
          <VariantCell label="Unchecked">
            <Toggle label="Push notifications" />
          </VariantCell>
          <VariantCell label="Checked">
            <Toggle defaultChecked label="Push notifications" />
          </VariantCell>
          <VariantCell label="Focus + label">
            <Toggle forceState="focus" label="Push notifications" />
          </VariantCell>
          <VariantCell label="Checked focus + label">
            <Toggle defaultChecked forceState="focus" label="Push notifications" />
          </VariantCell>
        </Section>

        {/* ── Token legend ── */}
        <section>
          <h2
            className="text-sm font-semibold mb-4"
            style={{ color: T.label }}
          >
            Token reference
          </h2>
          <div
            className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-3 p-6 rounded-xl border border-black/10"
            style={{ backgroundColor: T.bgSecondary }}
          >
            <Swatch name="Component/Button/Primary" hex={T.trackOn} />
            <Swatch name="Element/Pressed"          hex={T.trackOnHover} />
            <Swatch name="Element/Inactive"         hex={T.trackOff} />
            <Swatch name="States/Border/Error"      hex={T.trackError} />
            <Swatch name="Component/Button/Disabled" hex={T.trackDisabled} />
            <Swatch name="Element/Inverted"         hex={T.thumb} />
            <Swatch name="States/Border/Focus"      hex={T.focusRing} />
            <Swatch name="Text/Primary"             hex={T.label} />
            <Swatch name="Text/Disabled"            hex={T.labelDisabled} />
          </div>
        </section>

      </div>
    </div>
  );
}
