---
name: cortexcn-design
description: Apply the Cortexcn design system. Use before creating, restyling, or reviewing any UI in a project that has a DESIGN.md or uses Cortexcn, so colors, corners, type, spacing, and motion follow the system; and when theme tokens change, to update DESIGN.md.
---

# Cortexcn design

`DESIGN.md` at the project root is the source of truth for how the interface looks. Read it before you write UI, and follow it over your own taste.

If the project has no `DESIGN.md`, add the Cortexcn one:

```bash
npx shadcn@latest add https://ui.cortexcn.dev/r/design-md.json
```

Or read it from the `cortexcn` MCP server with `get_design_guide`.

## Workflow

1. Read `DESIGN.md`, then the theme CSS it points to (usually `app/globals.css`), so you know the real token names in this project.
2. Before adding anything new, look for a Cortexcn item that already does it (the `cortexcn` skill explains how to search and install).
3. Build with tokens and the scales in `DESIGN.md`: colors, radius, spacing, type, shadows, and motion.
4. Check the result against the list below, in light and dark mode.

## Rules

- **Color**: only theme tokens, as Tailwind classes such as `bg-background`, `text-foreground`, `bg-card`, `bg-muted`, `text-muted-foreground`, `border-border`, `bg-primary`, `text-primary-foreground`, `bg-destructive`, and `ring-ring`. Data uses `--chart-1` to `--chart-5`. Tints use opacity on a token (`bg-primary/10`), never a new hex value.
- **Corners**: square. The radius scale (`rounded-sm` to `rounded-4xl`) is derived from `--radius`, which is `0`. Use the scale classes so a theme can change it in one place; never hard-code a radius.
- **Borders and depth**: one-pixel `border-border` lines separate surfaces. Shadows are rare and soft (`shadow-xs`, `shadow-sm`); prefer a border or a `bg-muted` panel.
- **Type**: the project's sans font for interface text, `font-medium` for labels and buttons, `text-sm` as the default control size, `text-muted-foreground` for secondary text. Headings use tight tracking (`tracking-tight`) and `text-balance`.
- **Spacing**: Tailwind's 4 px scale. Controls are `h-9` by default (`h-8` small, `h-10` large); gaps inside controls are `gap-1.5`.
- **Focus**: every interactive element shows `focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50`. Never remove the outline without a replacement.
- **Motion**: 100 to 300 ms, easing out, on `transform` and `opacity` where possible. Respect `prefers-reduced-motion` and stop or shorten animation for it.
- **Dark mode**: the `.dark` class swaps the tokens. Do not write separate dark colors unless `DESIGN.md` lists them.
- **Components**: keep `data-slot` attributes, compose with `cn()`, and add variants with `class-variance-authority` the way existing components do.

## Before you finish

- No hex, rgb, or oklch values in components; no hard-coded radius.
- Light and dark mode both read well, with enough contrast for text.
- Keyboard focus is visible on every control.
- Reduced motion turns off or shortens every animation.

## When the tokens change

If the theme CSS changes (new colors, radius, or fonts), update the matching tables in `DESIGN.md` in the same change, so the next agent reads the truth.
