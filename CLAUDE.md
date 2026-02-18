# Design Sandbox

## Purpose
Personal design playground for prototyping UI components, layouts, and animations. Used by a designer learning web development with React. Also serves as a potential pilot tool for client work at a tech consultancy (Figma → prototype → dev handover).

## Tech Stack
- **Framework:** Next.js 16.1.6 (App Router, Turbopack)
- **UI:** shadcn/ui + Radix UI
- **Styling:** Tailwind CSS v4, tw-animate-css
- **Animations:** Motion (Framer Motion) + GSAP
- **Fonts:** Geist, Geist Mono, DM Sans
- **Language:** TypeScript
- **Port:** localhost:3000

## Project Structure

```
app/
  layout.tsx              # Root layout, wraps everything in SandboxShell
  globals.css             # Global styles
  components/[slug]/      # Dynamic route for component showcases
  layouts/[slug]/         # Dynamic route for layout showcases
  animations/[slug]/      # Dynamic route for animation lessons

components/
  sandbox/                # Shell UI (navigation, sidebar, layout)
    SandboxShell.tsx      # Main shell — tab routing logic, sidebar + bottom nav
    Sidebar.tsx           # Left sidebar — lists items for active tab
    BottomNav.tsx         # Bottom tab bar — Components | Layouts | Animations
  showcase/               # Component showcase files (e.g. ProjectHeroCard)
  animations/             # Animation lesson components (e.g. FadeInBasics)

lib/
  registry.ts             # Central registry — components[], layouts[], animations[]
  utils.ts                # cn() helper
```

## How the Registry Works
All content is registered in `lib/registry.ts` as `RegistryItem[]` arrays:
- `components` — component showcases
- `layouts` — full-page layout demos
- `animations` — animation learning modules

Each item has: `slug`, `name`, `component`, optional `showcase` boolean.
The sidebar, routes, and bottom nav all read from these arrays.

## Tab System
Three tabs in `BottomNav`: Components, Layouts, Animations.
Type: `TabType = "components" | "layouts" | "animations"` (exported from SandboxShell).
- Components/Animations: sidebar + content area
- Layouts: full-screen, no sidebar

## Animation Learning Path (in progress)
Sequential lessons teaching Motion and GSAP:
1. ✅ Fade In Basics (Motion) — initial/animate/exit, AnimatePresence
2. ⬜ Easing & Springs
3. ⬜ Stagger Effects
4. ⬜ Scroll Animations
5. ⬜ Hover & Tap
6. ⬜ Layout Animations
7. ⬜ GSAP Basics
8. ⬜ GSAP ScrollTrigger
9. ⬜ GSAP vs Motion comparison

## How to Add Things

### Add a Component
When the user says "add a component page" or "create a new component":
1. Create the component file in `components/showcase/YourComponent.tsx`
2. Import it in `lib/registry.ts`
3. Add an entry to the `components[]` array with `slug`, `name`, `component`
4. Set `showcase: true` if it should render full-width (not in a 3-column grid)
5. It will automatically appear in the sidebar under the Components tab
6. Route: `/components/{slug}`

### Add a Layout
When the user says "add a layout" or "create a new layout":
1. Create the component file in `components/showcase/YourLayout.tsx`
2. Import it in `lib/registry.ts`
3. Add an entry to the `layouts[]` array with `slug`, `name`, `component`
4. It will automatically appear in the Layouts dropdown in the bottom nav
5. Layouts render full-screen (no sidebar, no grid wrapper)
6. Route: `/layouts/{slug}`

### Add an Animation Lesson
When the user says "next animation" or "add an animation":
1. Create the component file in `components/animations/YourLesson.tsx`
2. Import it in `lib/registry.ts`
3. Add an entry to the `animations[]` array with `slug`, `name`, `component`, `showcase: true`
4. Name should be numbered: "2. Topic Name" to show learning order
5. It will appear in the sidebar under the Animations tab
6. Route: `/animations/{slug}`

### Display Modes
- **Grid mode** (default for components): Renders the component 3x in a responsive grid. Good for cards, badges, small UI elements.
- **Showcase mode** (`showcase: true`): Renders the component once, full-width. Good for forms, complex demos, animations, anything that needs space.
- **Layout mode** (layouts tab): Full-screen, no sidebar, no padding wrapper.

## Conventions
- Animation components go in `components/animations/`
- Showcase components go in `components/showcase/`
- All new content must be registered in `lib/registry.ts`
- Components use `"use client"` when they need interactivity
- Keep lessons interactive with controls (sliders, buttons) + code snippets

## Figma MCP — Code to Canvas (set up 2026-02-18)

Figma launched "Code to Canvas" (Feb 17 2026) — capture a live localhost URL and push it into Figma as an editable frame.

**MCP config in `~/.claude/settings.json`:**
```json
"Figma Desktop": {
  "type": "sse",
  "url": "http://127.0.0.1:3845/sse"
}
```

**Status:** Configured and SSE endpoint confirmed live. The Figma Desktop app must be open with its Dev Mode MCP Server enabled (Figma → Preferences → Enable Dev Mode MCP Server). Requires Figma Dev or Full seat.

**What it enables:** Two-way flow — push localhost layouts to Figma canvas as editable frames, or pull Figma design tokens/components into code.

**To push a layout to Figma:** Make sure `localhost:3000` is running, the target layout is visible in browser, and a Figma file is open in the Desktop app. Then ask: "push `/layouts/tobias-cv` to Figma".

**Reference:** https://www.figma.com/blog/introducing-claude-code-to-figma/

## Token Saving Rule
DO NOT do broad codebase sweeps without asking first. Read CLAUDE.md, then target specific files. Ask before exploring.
