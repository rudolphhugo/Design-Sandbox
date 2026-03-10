# BluViu Main Layout

## Structure

```
┌──────────┬─────────────────────────────────────┐
│          │                                     │
│ SideMenu │         Content area                │
│ (fixed)  │   max-width: 1320px, centered       │
│          │   padding-x: 20px                   │
│          │                                     │
└──────────┴─────────────────────────────────────┘
```

## Background

Reusable CSS class: `.bluviu-gradient`

```css
.bluviu-gradient {
  background: linear-gradient(to right, #017158 0%, #012231 65%);
}
```

| Stop | Color     | Opacity | Position |
|------|-----------|---------|----------|
| 1    | `#017158` | 100%    | 0%       |
| 2    | `#012231` | 100%    | 65%      |

The gradient flows left-to-right from teal green into dark navy, with the dark colour filling the remaining 35% as a solid tone.

## Side Menu

- Component: `<SideMenu />`
- Position: left, full height
- Max width: **286px** (from Figma token `expandedWidth`)
- Collapses via built-in minimize toggle
- Background: `#012231` (set within the component)

## Content Area

- Fills remaining horizontal space (`flex-1`)
- Max width: **1320px**
- Centering: `margin: 0 auto` (centers when viewport exceeds 1320px + menu width)
- Side margins: **20px** (`padding-inline: 20px`)
- Scrolls independently of the side menu

## Usage

```tsx
import { BluViuMain } from "@/components/showcase/BluViuMain";

// Renders as a full-screen layout
<BluViuMain />
```

Accessed in the sandbox at `/layouts/bluviu-main`.
