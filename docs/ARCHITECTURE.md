# Architecture

Reference doc for how the Design Sandbox is structured. Linked from CLAUDE.md.

---

## Project Structure

```
app/
  layout.tsx                        # Root layout — wraps everything in SandboxShell
  globals.css                       # Global styles
  page.tsx                          # Root redirect
  components/[slug]/page.tsx        # Dynamic route for component showcases
  layouts/[slug]/page.tsx           # Dynamic route for registry-based layouts
  layouts/a11y-audit/               # A11y Audit tool — static nested routes
    page.tsx                        # Projects home
    new/page.tsx                    # New project form
    [projectId]/page.tsx            # Project overview / pages manager
    [projectId]/findings/page.tsx   # Findings dashboard
    [projectId]/audit/[pageId]/page.tsx  # Audit workspace
  animations/[slug]/page.tsx        # Dynamic route for animation lessons

components/
  sandbox/                          # Shell UI
    SandboxShell.tsx                # Tab routing logic, sidebar + bottom nav
    Sidebar.tsx                     # Left sidebar — lists items for active tab
    BottomNav.tsx                   # Bottom tab bar — Components | Layouts | Animations
  showcase/                         # Component and layout showcase files
  animations/                       # Animation lesson components
  audit/                            # A11y Audit tool components
  ui/                               # shadcn/ui installed components

lib/
  registry.ts                       # Central registry — components[], layouts[], animations[]
  utils.ts                          # cn() helper
  audit-types.ts                    # TypeScript types for the audit tool
  audit-checks.ts                   # All 104 WCAG checks (A/AA/AAA)
  audit-storage.ts                  # localStorage helpers for the audit tool
```

---

## Tab System

Three tabs in `BottomNav`: Components | Layouts | Animations.

```ts
type TabType = "components" | "layouts" | "animations"  // exported from SandboxShell
```

| Tab | Sidebar | Content wrapper | Route pattern |
|-----|---------|-----------------|---------------|
| Components | ✅ Yes | Grid or showcase | `/components/[slug]` |
| Layouts | ❌ No | Full-screen | `/layouts/[slug]` |
| Animations | ✅ Yes | Showcase (full-width) | `/animations/[slug]` |

**Layout pages** (`pathname.startsWith("/layouts")`) get full-screen rendering — no sidebar, just the bottom nav. This includes all nested routes like `/layouts/a11y-audit/[projectId]/...`.

---

## Routing Rules

- Static routes take precedence over dynamic `[slug]` routes in Next.js App Router.
- The A11y Audit tool uses static nested routes under `/layouts/a11y-audit/` — these do not conflict with the dynamic `[slug]` route.
- Registry-based layouts use `generateStaticParams()` from the layouts array.
- New multi-screen tools should use the same pattern: static routes under `/layouts/[tool-name]/`.

---

## SandboxShell Behaviour

- Reads `pathname` to derive active tab on mount.
- Switching tabs navigates to the first registered item in that tab's registry array.
- Layout pages: renders `<main>` + `<BottomNav>` only — no sidebar.
- Component/Animation pages: renders `<Sidebar>` + `<main>` + `<BottomNav>`.

---

## shadcn/ui Setup

- Style: `new-york`
- Base colour: `slate`
- CSS variables: enabled
- Config: `components.json`
- Installed components live in `components/ui/`

**Currently installed:** button, input, textarea, select, badge, progress, card, tabs

Always check `components/ui/` before asking to install. If a needed component is missing, ask before running `npx shadcn@latest add`.
