# Registry

How to add new content to the Design Sandbox. Linked from CLAUDE.md.

All content is registered in `lib/registry.ts` as `RegistryItem[]` arrays.

```ts
interface RegistryItem {
  slug: string
  name: string
  component: ComponentType
  showcase?: boolean  // if true: renders full-width instead of in a grid
}
```

The sidebar, bottom nav dropdown, and all dynamic routes read from these arrays automatically.

---

## Add a Component

When the user says "add a component" or "create a new component":

1. Create `components/showcase/YourComponent.tsx`
2. Import it in `lib/registry.ts`
3. Add to the `components[]` array: `{ slug, name, component }`
4. Set `showcase: true` if it needs full-width rendering
5. Route: `/components/{slug}`

---

## Add a Layout

When the user says "add a layout" or "create a new layout":

1. Create `components/showcase/YourLayout.tsx`
2. Import it in `lib/registry.ts`
3. Add to the `layouts[]` array: `{ slug, name, component }`
4. Route: `/layouts/{slug}`

> For multi-screen tools (like the A11y Audit), use static Next.js routes under `app/layouts/[tool-name]/` instead of a single component. See `docs/ARCHITECTURE.md`.

---

## Add an Animation Lesson

When the user says "next animation" or "add an animation":

1. Create `components/animations/YourLesson.tsx`
2. Import it in `lib/registry.ts`
3. Add to the `animations[]` array: `{ slug, name, component, showcase: true }`
4. Name format: `"2. Topic Name"` — number prefix shows learning order
5. Route: `/animations/{slug}`

---

## Display Modes

| Mode | When | How |
|------|------|-----|
| Grid (default) | Small, repeatable UI elements — cards, badges, buttons | Component rendered 3× in a responsive grid |
| Showcase (`showcase: true`) | Forms, complex demos, animations, anything needing space | Component rendered once, full-width |
| Layout | Full-screen app-like experiences | No sidebar, no grid — full viewport |

---

## Conventions

- Animation components → `components/animations/`
- Showcase components → `components/showcase/`
- Multi-screen tools → `components/[tool-name]/` + static routes in `app/layouts/[tool-name]/`
- All new content must be registered in `lib/registry.ts`
- Use `"use client"` when the component needs interactivity or hooks
- Animation lessons should be interactive — include controls (sliders, buttons) and visible code snippets
