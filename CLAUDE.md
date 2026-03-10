# Design Sandbox

## Purpose
Personal design playground for prototyping UI components, layouts, and animations. Used by a designer learning web development with React. Also serves as a pilot tool for client work at a tech consultancy (Figma → prototype → dev handover).

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16.1.6 — App Router, Turbopack |
| UI components | shadcn/ui + Radix UI |
| Styling | Tailwind CSS v4, tw-animate-css |
| Animations | Motion (Framer Motion) + GSAP |
| Icons | Lucide React |
| Fonts | Geist, Geist Mono, DM Sans |
| Language | TypeScript |
| Dev port | localhost:3000 |

---

## Rules

### 1. Plan before coding
Always present a plan and wait for explicit confirmation before writing any code.
- Outline what files will be touched, what will be created, and why.
- Ask clarifying questions upfront. Offer a "Skip for now" option when context may already be clear.
- **"Plan means stop."** Presenting a plan is not permission to start. Wait for approval.
- Once confirmed, do not deviate without flagging it.

### 2. Always use the existing stack
- **shadcn/ui first** — always reach for shadcn components before building anything custom.
- If needed components are not yet installed, ask before installing:
  `"These components are needed: [list]. Should I install them with npx shadcn@latest add?"`
- Only offer "build from scratch" as a named fallback option — never default to it.
- **Lucide React** for all icons unless told otherwise.
- **Tailwind v4 utility classes** for all styling — no inline styles, no CSS modules unless explicitly requested.
- See `docs/ARCHITECTURE.md` for how the sandbox shell, registry, and routing work.
- See `docs/REGISTRY.md` for how to add components, layouts, and animations.

### 3. Conserve tokens — ask before exploring
- Never run broad codebase searches without checking context first.
- If a sweep is needed, ask: `"I'd need to scan [scope]. Should I proceed, or can you point me to the relevant file?"`
- If the answer is likely in the current conversation or a file already read, use that — don't re-fetch.
- Prefer targeted, specific reads over broad sweeps.

### 4. Capture new context
- If something important is learned during a session — a pattern, decision, constraint, or convention — flag it:
  `"I've learned [X] about this project. Should I add it to CLAUDE.md?"`
- Keep additions concise. One rule or note per thing learned.

---

## Feature Log

### Layouts
| Feature | Status | Notes |
|---------|--------|-------|
| A11y Audit tool | ✅ Live | Full accessibility audit app. 104 checks (WCAG 2.1+2.2, A/AA/AAA). 5 phases, localStorage persistence, VoiceOver guidance. See `app/layouts/a11y-audit/` and `components/audit/`. |
| Tobias CV | ✅ Live | Full-page CV layout. `components/showcase/TobiasCV.tsx` |
| ToDo App | ✅ Live | Task manager layout. `components/showcase/TodoApp.tsx` |
| Test Layout 2 | ✅ Live | Placeholder |
| Test Layout 3 | ✅ Live | Placeholder |

### Components
| Feature | Status | Notes |
|---------|--------|-------|
| Project Hero Card | ✅ Live | Card component shown in grid mode. `components/showcase/ProjectHeroCard.tsx` |

### Animation Learning Path
Sequential lessons teaching Motion (Framer Motion) and GSAP:

| # | Lesson | Status |
|---|--------|--------|
| 1 | Fade In Basics (Motion) — initial/animate/exit, AnimatePresence | ✅ Done |
| 2 | Easing & Springs | ⬜ Next |
| 3 | Stagger Effects | ⬜ |
| 4 | Scroll Animations | ⬜ |
| 5 | Hover & Tap | ⬜ |
| 6 | Layout Animations | ⬜ |
| 7 | GSAP Basics | ⬜ |
| 8 | GSAP ScrollTrigger | ⬜ |
| 9 | GSAP vs Motion comparison | ⬜ |

---

## Reference Docs
- `docs/ARCHITECTURE.md` — project structure, tab system, routing, shell behaviour
- `docs/REGISTRY.md` — how to add components, layouts, animations; display modes; conventions
