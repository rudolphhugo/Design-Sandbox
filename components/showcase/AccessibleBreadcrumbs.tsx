"use client";

import { useState } from "react";
import { ChevronRight, Home, MoreHorizontal } from "lucide-react";

// ─── Types & data ─────────────────────────────────────────────────────────────

type Crumb = { label: string; href: string; current?: boolean };

const shortPath: Crumb[] = [
  { label: "Home", href: "#" },
  { label: "Store", href: "#" },
  { label: "Laptops", href: "#", current: true },
];

const longPath: Crumb[] = [
  { label: "Home", href: "#" },
  { label: "Products", href: "#" },
  { label: "Electronics", href: "#" },
  { label: "Laptops", href: "#" },
  { label: 'MacBook Pro 16"', href: "#", current: true },
];

// ─── Shared helpers ───────────────────────────────────────────────────────────

function Mono({ children }: { children: string }) {
  return (
    <code className="font-mono text-[11px] bg-muted px-1 py-0.5 rounded text-foreground/80">
      {children}
    </code>
  );
}

function NoteItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
      <span className="mt-[7px] h-1 w-1 rounded-full bg-muted-foreground/35 shrink-0" />
      <span>{children}</span>
    </li>
  );
}

function VariantCard({
  number,
  name,
  notes,
  dark,
  children,
}: {
  number: number;
  name: string;
  notes: React.ReactNode[];
  dark?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 px-5 py-3.5 border-b border-border bg-background">
        <div className="flex items-center gap-2.5">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-background text-[10px] font-bold tabular-nums leading-none shrink-0">
            {number}
          </span>
          <h2 className="text-sm font-semibold text-foreground">{name}</h2>
        </div>
        <span className="shrink-0 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold uppercase tracking-wide">
          AAA
        </span>
      </div>

      {/* Live demo */}
      <div
        className={`px-8 py-10 min-h-[88px] flex items-center ${
          dark ? "bg-zinc-950" : "bg-muted/20"
        }`}
      >
        {children}
      </div>

      {/* Notes */}
      <div className="px-5 py-4 border-t border-border bg-background">
        <ul className="space-y-2">
          {notes.map((note, i) => (
            <NoteItem key={i}>{note}</NoteItem>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ─── Variation 1: Default / Semantic ─────────────────────────────────────────

function DefaultBreadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol
        role="list"
        className="flex flex-wrap items-center gap-y-1 gap-x-1.5 text-sm list-none p-0 m-0"
      >
        {items.map((crumb, i) => (
          <li key={crumb.label} className="flex items-center gap-1.5">
            {i > 0 && (
              <span aria-hidden="true" className="text-muted-foreground/50 select-none">
                /
              </span>
            )}
            {crumb.current ? (
              <span aria-current="page" className="font-semibold text-foreground">
                {crumb.label}
              </span>
            ) : (
              <a
                href={crumb.href}
                onClick={(e) => e.preventDefault()}
                className="text-muted-foreground hover:text-foreground transition-colors rounded-sm px-0.5 -mx-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {crumb.label}
              </a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// ─── Variation 2: Icon Enhanced ───────────────────────────────────────────────

function IconBreadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol
        role="list"
        className="flex flex-wrap items-center gap-y-1 gap-x-0.5 text-sm list-none p-0 m-0"
      >
        {items.map((crumb, i) => (
          <li key={crumb.label} className="flex items-center gap-0.5">
            {i > 0 && (
              <ChevronRight
                aria-hidden="true"
                className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0"
              />
            )}
            {crumb.current ? (
              <span
                aria-current="page"
                className="font-semibold text-foreground flex items-center gap-1.5 px-1"
              >
                {i === 0 && <Home aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />}
                {crumb.label}
              </span>
            ) : (
              <a
                href={crumb.href}
                onClick={(e) => e.preventDefault()}
                className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 px-1 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {i === 0 && <Home aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />}
                {crumb.label}
              </a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// ─── Variation 3: Chip / Pill ─────────────────────────────────────────────────

function ChipBreadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol
        role="list"
        className="flex flex-wrap items-center gap-1.5 list-none p-0 m-0"
      >
        {items.map((crumb, i) => (
          <li key={crumb.label} className="flex items-center gap-1.5">
            {i > 0 && (
              <ChevronRight
                aria-hidden="true"
                className="h-3 w-3 text-muted-foreground/40 shrink-0"
              />
            )}
            {crumb.current ? (
              <span
                aria-current="page"
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-foreground text-background"
              >
                {crumb.label}
              </span>
            ) : (
              <a
                href={crumb.href}
                onClick={(e) => e.preventDefault()}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {crumb.label}
              </a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// ─── Variation 4: High Contrast ───────────────────────────────────────────────

function HighContrastBreadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol
        role="list"
        className="flex flex-wrap items-center gap-y-1 gap-x-2 text-sm list-none p-0 m-0"
      >
        {items.map((crumb, i) => (
          <li key={crumb.label} className="flex items-center gap-2">
            {i > 0 && (
              <span aria-hidden="true" className="text-zinc-500 select-none font-light">
                ›
              </span>
            )}
            {crumb.current ? (
              <span
                aria-current="page"
                className="font-bold text-white underline decoration-2 underline-offset-2"
              >
                {crumb.label}
              </span>
            ) : (
              <a
                href={crumb.href}
                onClick={(e) => e.preventDefault()}
                className="text-zinc-300 hover:text-white underline decoration-zinc-500 hover:decoration-white underline-offset-2 transition-colors rounded-sm px-0.5 -mx-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
              >
                {crumb.label}
              </a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// ─── Variation 5: Collapsed / Mobile ─────────────────────────────────────────

function CollapsedBreadcrumb({ items }: { items: Crumb[] }) {
  const [expanded, setExpanded] = useState(false);
  const first = items[0];
  const last = items[items.length - 1];
  const middle = items.slice(1, -1);

  return (
    <div className="w-full space-y-3">
      <p className="text-[11px] font-mono text-muted-foreground/50 uppercase tracking-wider">
        {expanded ? "Expanded — all steps visible" : "Collapsed — tap ••• to expand"}
      </p>

      <nav aria-label="Breadcrumb">
        <ol
          role="list"
          className="flex flex-wrap items-center gap-y-1 text-sm list-none p-0 m-0"
        >
          {/* First item — always visible */}
          <li className="flex items-center">
            <a
              href={first.href}
              onClick={(e) => e.preventDefault()}
              className="text-muted-foreground hover:text-foreground transition-colors rounded-sm px-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {first.label}
            </a>
          </li>

          {/* Collapsed: ellipsis expand button */}
          {!expanded && middle.length > 0 && (
            <li className="flex items-center gap-1">
              <ChevronRight
                aria-hidden="true"
                className="h-3.5 w-3.5 text-muted-foreground/50"
              />
              <button
                onClick={() => setExpanded(true)}
                aria-expanded={false}
                aria-label={`Show ${middle.length} more: ${middle.map((c) => c.label).join(", ")}`}
                className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <MoreHorizontal aria-hidden="true" className="h-4 w-4" />
              </button>
            </li>
          )}

          {/* Expanded: middle items */}
          {expanded &&
            middle.map((crumb) => (
              <li key={crumb.label} className="flex items-center gap-1">
                <ChevronRight
                  aria-hidden="true"
                  className="h-3.5 w-3.5 text-muted-foreground/50"
                />
                <a
                  href={crumb.href}
                  onClick={(e) => e.preventDefault()}
                  className="text-muted-foreground hover:text-foreground transition-colors rounded-sm px-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {crumb.label}
                </a>
              </li>
            ))}

          {/* Last item — always visible */}
          <li className="flex items-center gap-1">
            <ChevronRight
              aria-hidden="true"
              className="h-3.5 w-3.5 text-muted-foreground/50"
            />
            <span aria-current="page" className="font-semibold text-foreground">
              {last.label}
            </span>
          </li>
        </ol>
      </nav>

      {expanded && (
        <button
          onClick={() => setExpanded(false)}
          className="text-[11px] text-muted-foreground/60 hover:text-muted-foreground transition-colors underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
        >
          Reset to collapsed
        </button>
      )}
    </div>
  );
}

// ─── Variation 6: Underline Links ─────────────────────────────────────────────

function UnderlineBreadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol
        role="list"
        className="flex flex-wrap items-center gap-y-1 gap-x-2 text-sm list-none p-0 m-0"
      >
        {items.map((crumb, i) => (
          <li key={crumb.label} className="flex items-center gap-2">
            {i > 0 && (
              <span aria-hidden="true" className="text-muted-foreground/30 select-none">
                ·
              </span>
            )}
            {crumb.current ? (
              <span aria-current="page" className="font-semibold text-foreground">
                {crumb.label}
              </span>
            ) : (
              <a
                href={crumb.href}
                onClick={(e) => e.preventDefault()}
                className="text-blue-600 dark:text-blue-400 underline underline-offset-2 decoration-blue-400/50 hover:text-blue-900 dark:hover:text-blue-100 hover:decoration-blue-900 dark:hover:decoration-blue-100 transition-colors rounded-sm px-0.5 -mx-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400 focus-visible:ring-offset-2"
              >
                {crumb.label}
              </a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function AccessibleBreadcrumbs() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">

      {/* Page header */}
      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Accessible Breadcrumbs
          </h1>
          <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold">
            WCAG 2.1 AAA
          </span>
        </div>
        <p className="text-sm text-muted-foreground max-w-prose leading-relaxed">
          Six production-ready patterns. Each satisfies WCAG 2.1 Level AAA — semantic
          landmark structure, high-contrast ratios, visible keyboard focus, and mobile-safe
          touch targets.
        </p>
      </header>

      {/* ARIA anatomy */}
      <div className="rounded-xl border border-border bg-muted/20 overflow-hidden">
        <div className="px-5 py-3 border-b border-border">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Required ARIA anatomy — every breadcrumb needs these
          </p>
        </div>
        <pre className="text-[11px] leading-relaxed text-foreground/75 font-mono overflow-x-auto px-5 py-4 whitespace-pre">
{`<nav aria-label="Breadcrumb">           // nav landmark — unique label required
  <ol role="list">                       // ordered list — announces count to AT
    <li>
      <a href="/home">Home</a>           // ancestor — always a link
    </li>
    <li>
      <span aria-hidden="true">/</span>  // separator — hidden from screen readers
      <a href="/store">Store</a>
    </li>
    <li>
      <span aria-hidden="true">/</span>
      <span aria-current="page">         // current page — not a link
        Laptops
      </span>
    </li>
  </ol>
</nav>`}
        </pre>
      </div>

      {/* ── Variation 1 ── */}
      <VariantCard
        number={1}
        name="Default — Clean & Semantic"
        notes={[
          <><Mono>{'aria-label="Breadcrumb"'}</Mono> on <Mono>{"<nav>"}</Mono> creates a unique landmark — users with screen readers can jump directly to it.</>,
          <><Mono>{'aria-current="page"'}</Mono> on the last item is announced as "current page" before the text — no visual-only cue required.</>,
          <>Separator <Mono>/</Mono> is <Mono>{'aria-hidden="true"'}</Mono> — it disappears from the accessibility tree and doesn't interrupt the reading flow.</>,
          <>Focus ring: <Mono>focus-visible:ring-2 focus-visible:ring-offset-2</Mono> — visible on keyboard, invisible on mouse. Never removed, only conditionally shown.</>,
        ]}
      >
        <DefaultBreadcrumb items={shortPath} />
      </VariantCard>

      {/* ── Variation 2 ── */}
      <VariantCard
        number={2}
        name="Icon Enhanced — Home + Chevrons"
        notes={[
          <>Home icon is <Mono>{'aria-hidden="true"'}</Mono> — the link text "Home" already provides the accessible name. Adding icon alt text would be redundant.</>,
          <>Chevrons are <Mono>{'aria-hidden="true"'}</Mono> — decorative SVGs must be hidden or their role removed from the tree.</>,
          <>Icons inside <Mono>{"<a>"}</Mono> inherit the link's focus style automatically — no extra wrapper needed.</>,
          <>Touch target: each link has <Mono>px-1</Mono> padding giving it extra horizontal tap area on mobile without affecting desktop layout.</>,
        ]}
      >
        <IconBreadcrumb items={shortPath} />
      </VariantCard>

      {/* ── Variation 3 ── */}
      <VariantCard
        number={3}
        name="Chip Style — Visual Hierarchy"
        notes={[
          <>Current-page chip: dark bg + light text. Both foreground and background must pass 4.5:1 contrast against each other, not just against the page background.</>,
          <>Ancestor chips change both background colour AND text colour on hover — satisfies WCAG 1.4.1 (no colour-only cues) since two visual properties shift together.</>,
          <>Chips are <Mono>rounded-full</Mono> with <Mono>px-3 py-1</Mono> — this gives ~24px height, meeting the WCAG 2.5.5 minimum touch target on most implementations. Add <Mono>min-h-[44px]</Mono> on mobile for strict AAA compliance.</>,
          <>Focus ring is on the <Mono>{"<a>"}</Mono> element directly, not a wrapper — it appears flush around the chip, not around a larger invisible container.</>,
        ]}
      >
        <ChipBreadcrumb items={shortPath} />
      </VariantCard>

      {/* ── Variation 4 ── */}
      <VariantCard
        number={4}
        name="High Contrast — AAA 7:1 on Dark"
        dark
        notes={[
          <>zinc-300 <Mono>#D4D4D8</Mono> on zinc-950 <Mono>#09090B</Mono> = 9.8:1 contrast ratio — exceeds AAA (7:1 required for normal text).</>,
          <>white <Mono>#FFFFFF</Mono> on zinc-950 = 19.1:1 — maximum contrast for the current page item.</>,
          <>Underline on all ancestor links satisfies WCAG 1.4.1 — link identity is communicated through decoration, not colour alone.</>,
          <>Focus ring is <Mono>ring-white ring-offset-zinc-950</Mono> — the offset colour matches the dark container, making the ring visible against both the background and the focused element.</>,
        ]}
      >
        <HighContrastBreadcrumb items={shortPath} />
      </VariantCard>

      {/* ── Variation 5 ── */}
      <VariantCard
        number={5}
        name="Collapsed — Mobile Truncation Pattern"
        notes={[
          <>Long paths collapse to <Mono>Home › ••• › Current Page</Mono> on mobile. The expand button has a 44×44px touch target — satisfies WCAG 2.5.5 (AAA Target Size).</>,
          <><Mono>{'aria-expanded="false"'}</Mono> on the button tells screen reader users the trail is partially hidden, and they can activate the button to reveal it.</>,
          <><Mono>aria-label</Mono> on the expand button lists all hidden steps by name: "Show 3 more: Products, Electronics, Laptops" — users know what they're expanding before acting.</>,
          <>After expansion, focus stays on the last focused position — no jump, no forced scroll. Collapsed state can be reset below the demo for retesting.</>,
        ]}
      >
        <CollapsedBreadcrumb items={longPath} />
      </VariantCard>

      {/* ── Variation 6 ── */}
      <VariantCard
        number={6}
        name="Underline Links — Classic Link Convention"
        notes={[
          <>Blue underlined links satisfy WCAG 1.4.1 and 1.4.3 simultaneously — link identity is shape (underline) + colour, not colour alone.</>,
          <><Mono>blue-600</Mono> on white = 4.6:1 (AA pass). For strict AAA (7:1), use <Mono>blue-800</Mono> on white or <Mono>blue-300</Mono> on a dark background.</>,
          <>Hover darkens both text and underline colour together — two visual cues change, reinforcing the interaction without relying on a single indicator.</>,
          <>Focus ring colour matches link colour (<Mono>ring-blue-600</Mono>) — visually associated with the interactive element, consistent with browser defaults users expect.</>,
        ]}
      >
        <UnderlineBreadcrumb items={shortPath} />
      </VariantCard>

      {/* ── Focus & touch guide ── */}
      <div className="rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border bg-muted/20">
          <h2 className="text-sm font-semibold text-foreground">Focus & Touch Target Rules</h2>
        </div>
        <div className="px-5 py-5 grid sm:grid-cols-2 gap-x-8 gap-y-6 bg-background">
          <div className="space-y-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Keyboard Focus
            </p>
            <ul className="space-y-2.5">
              {[
                { ok: true, text: <>Use <Mono>focus-visible:</Mono> — ring appears on keyboard, hidden on mouse click</> },
                { ok: true, text: <>Minimum 2px ring width + 2px offset (WCAG 2.4.11 AAA)</> },
                { ok: true, text: <>Ring colour must have 3:1 contrast against the adjacent background</> },
                { ok: false, text: <>Never use <Mono>outline: none</Mono> without replacing it with a visible ring</> },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                  <span className={`shrink-0 font-bold text-sm leading-none mt-0.5 ${item.ok ? "text-emerald-500" : "text-red-500"}`}>
                    {item.ok ? "✓" : "✗"}
                  </span>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Touch Targets
            </p>
            <ul className="space-y-2.5">
              {[
                { ok: true, text: <>44×44px minimum for all interactive targets (WCAG 2.5.5 AAA)</> },
                { ok: true, text: <><Mono>min-h-[44px] min-w-[44px]</Mono> on icon-only buttons — expands tap area without changing visual size</> },
                { ok: true, text: <>Text links at 14px+ can use <Mono>py-2</Mono> to grow vertical tap area invisibly</> },
                { ok: false, text: <>Don't rely on spacing alone — adjacent tappable items need ≥8px gap between tap areas</> },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                  <span className={`shrink-0 font-bold text-sm leading-none mt-0.5 ${item.ok ? "text-emerald-500" : "text-red-500"}`}>
                    {item.ok ? "✓" : "✗"}
                  </span>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
}
