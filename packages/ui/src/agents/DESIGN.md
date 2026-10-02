---
version: alpha
name: Cortexcn
description: A square, quiet interface system for React and Tailwind CSS. Neutral surfaces, hairline borders, no rounded corners, and one set of tokens for light and dark mode.
colors:
  background: "oklch(0.97 0 0)"
  background-dark: "oklch(0.14 0.005 264)"
  foreground: "oklch(0.15 0.004 230)"
  foreground-dark: "oklch(0.987 0.002 197)"
  card: "oklch(1 0 0)"
  card-dark: "oklch(0.17 0.007 271)"
  card-foreground: "oklch(0.15 0.004 230)"
  card-foreground-dark: "oklch(0.987 0.002 197)"
  popover: "oklch(1 0 0)"
  popover-dark: "oklch(0.21 0.006 286)"
  popover-foreground: "oklch(0.15 0.004 230)"
  popover-foreground-dark: "oklch(0.987 0.002 197)"
  primary: "oklch(0.36 0 0)"
  primary-dark: "oklch(0.925 0.005 214)"
  primary-foreground: "oklch(0.94 0 0)"
  primary-foreground-dark: "oklch(0.22 0.008 224)"
  secondary: "oklch(0.98 0.003 286)"
  secondary-dark: "oklch(0.26 0.013 273)"
  secondary-foreground: "oklch(0.21 0.006 286)"
  secondary-foreground-dark: "oklch(0.987 0.002 197)"
  muted: "oklch(0.94 0 0)"
  muted-dark: "oklch(0.3 0.018 276)"
  muted-foreground: "oklch(0.53 0 0)"
  muted-foreground-dark: "oklch(0.62 0.022 270)"
  accent: "oklch(0.94 0 0)"
  accent-dark: "oklch(0.29 0.017 275)"
  accent-foreground: "oklch(0.25 0.04 267)"
  accent-foreground-dark: "oklch(0.987 0.002 197)"
  destructive: "oklch(0.55 0.2 17)"
  destructive-dark: "oklch(0.7 0.19 22)"
  border: "oklch(0.92 0 0)"
  border-dark: "oklch(0.56 0.02 268 / 0.2)"
  input: "oklch(0.96 0 0)"
  input-dark: "oklch(0.47 0.026 266 / 0.2)"
  ring: "oklch(0 0 0)"
  ring-dark: "oklch(0.56 0.021 214)"
  chart-1: "oklch(37.4% 0.01 67.558)"
  chart-1-dark: "oklch(27.4% 0.006 286.033)"
  chart-2: "oklch(55.3% 0.013 58.071)"
  chart-2-dark: "oklch(44.2% 0.017 285.786)"
  chart-3: "oklch(70.9% 0.01 56.259)"
  chart-3-dark: "oklch(55.2% 0.016 285.938)"
  chart-4: "oklch(86.9% 0.005 56.366)"
  chart-4-dark: "oklch(70.5% 0.015 286.067)"
  chart-5: "oklch(97% 0.001 106.424)"
  chart-5-dark: "oklch(87.1% 0.006 286.286)"
typography:
  display:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: 3rem
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: -0.025em
  headline:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: 1.875rem
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.025em
  title:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: 1.125rem
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: -0.01em
  body-md:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0em
  body-sm:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.43
    letterSpacing: 0em
  label:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: 0.875rem
    fontWeight: 500
    lineHeight: 1.43
    letterSpacing: 0em
  caption:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: 0.75rem
    fontWeight: 400
    lineHeight: 1.33
    letterSpacing: 0em
  code:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: 0.8125rem
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0em
rounded:
  none: 0px
  sm: 0px
  md: 0px
  lg: 0px
  xl: 0px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  2xl: 32px
  3xl: 48px
  4xl: 64px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    height: 36px
    padding: 10px
  button-primary-dark:
    backgroundColor: "{colors.primary-dark}"
    textColor: "{colors.primary-foreground-dark}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    height: 36px
    padding: 10px
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.secondary-foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    height: 36px
    padding: 10px
  button-secondary-dark:
    backgroundColor: "{colors.secondary-dark}"
    textColor: "{colors.secondary-foreground-dark}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    height: 36px
    padding: 10px
  button-outline:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    height: 36px
    padding: 10px
  button-outline-dark:
    backgroundColor: "{colors.background-dark}"
    textColor: "{colors.foreground-dark}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    height: 36px
    padding: 10px
  button-ghost:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    height: 36px
    padding: 10px
  button-ghost-dark:
    backgroundColor: "{colors.background-dark}"
    textColor: "{colors.foreground-dark}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    height: 36px
    padding: 10px
  button-destructive:
    backgroundColor: "{colors.background}"
    textColor: "{colors.destructive}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    height: 36px
    padding: 10px
  button-destructive-dark:
    backgroundColor: "{colors.background-dark}"
    textColor: "{colors.destructive-dark}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    height: 36px
    padding: 10px
  input:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    height: 36px
    padding: 10px
  input-dark:
    backgroundColor: "{colors.background-dark}"
    textColor: "{colors.foreground-dark}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    height: 36px
    padding: 10px
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.card-foreground}"
    rounded: "{rounded.lg}"
    padding: 24px
  card-dark:
    backgroundColor: "{colors.card-dark}"
    textColor: "{colors.card-foreground-dark}"
    rounded: "{rounded.lg}"
    padding: 24px
  popover:
    backgroundColor: "{colors.popover}"
    textColor: "{colors.popover-foreground}"
    rounded: "{rounded.md}"
    padding: 4px
  popover-dark:
    backgroundColor: "{colors.popover-dark}"
    textColor: "{colors.popover-foreground-dark}"
    rounded: "{rounded.md}"
    padding: 4px
  menu-item-active:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-foreground}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    padding: 6px
  menu-item-active-dark:
    backgroundColor: "{colors.accent-dark}"
    textColor: "{colors.accent-foreground-dark}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.sm}"
    padding: 6px
  caption:
    backgroundColor: "{colors.background}"
    textColor: "{colors.muted-foreground}"
    typography: "{typography.caption}"
  caption-dark:
    backgroundColor: "{colors.background-dark}"
    textColor: "{colors.muted-foreground-dark}"
    typography: "{typography.caption}"
  skeleton:
    backgroundColor: "{colors.muted}"
    rounded: "{rounded.md}"
  skeleton-dark:
    backgroundColor: "{colors.muted-dark}"
    rounded: "{rounded.md}"
  divider:
    backgroundColor: "{colors.border}"
    height: 1px
  divider-dark:
    backgroundColor: "{colors.border-dark}"
    height: 1px
  switch-track:
    backgroundColor: "{colors.input}"
    rounded: "{rounded.full}"
    height: 18px
    width: 32px
  switch-track-dark:
    backgroundColor: "{colors.input-dark}"
    rounded: "{rounded.full}"
    height: 18px
    width: 32px
  focus-ring:
    backgroundColor: "{colors.ring}"
    width: 3px
  focus-ring-dark:
    backgroundColor: "{colors.ring-dark}"
    width: 3px
  chart-series-1:
    backgroundColor: "{colors.chart-1}"
    size: 10px
  chart-series-1-dark:
    backgroundColor: "{colors.chart-1-dark}"
    size: 10px
  chart-series-2:
    backgroundColor: "{colors.chart-2}"
    size: 10px
  chart-series-2-dark:
    backgroundColor: "{colors.chart-2-dark}"
    size: 10px
  chart-series-3:
    backgroundColor: "{colors.chart-3}"
    size: 10px
  chart-series-3-dark:
    backgroundColor: "{colors.chart-3-dark}"
    size: 10px
  chart-series-4:
    backgroundColor: "{colors.chart-4}"
    size: 10px
  chart-series-4-dark:
    backgroundColor: "{colors.chart-4-dark}"
    size: 10px
  chart-series-5:
    backgroundColor: "{colors.chart-5}"
    size: 10px
  chart-series-5-dark:
    backgroundColor: "{colors.chart-5-dark}"
    size: 10px
---

# Cortexcn

## Overview

Cortexcn is a set of React components, page blocks, and charts built with Tailwind CSS and shadcn conventions. The look is square and quiet: neutral surfaces, one-pixel borders, no rounded corners, and color used for meaning rather than decoration. Everything is driven by CSS custom properties, so the same components work in light and dark mode and follow a project's own theme.

This file is generated from `cortexcn-tokens.css`. The front matter holds the tokens; the sections below explain how to use them. When a request conflicts with these rules, follow the rules and say so.

## Colors

Use colors only through the theme tokens, as Tailwind classes: `bg-background`, `text-foreground`, `bg-card`, `bg-muted`, `text-muted-foreground`, `border-border`, `bg-primary`, `text-primary-foreground`, `bg-destructive`, `ring-ring`, and `fill-chart-1` to `fill-chart-5` for data. Tints are opacity on a token (`bg-primary/10`, `border-border/60`), never a new color.

Dark mode is the `.dark` class on an ancestor, usually `<html>`. It swaps every token at once, so components never need their own dark colors. The `-dark` keys in the front matter are the values under `.dark`.

| Token                  | Light                       | Dark                          | Use for                                          |
| ---------------------- | --------------------------- | ----------------------------- | ------------------------------------------------ |
| `background`           | `oklch(0.97 0 0)`           | `oklch(0.14 0.005 264)`       | The page.                                        |
| `foreground`           | `oklch(0.15 0.004 230)`     | `oklch(0.987 0.002 197)`      | Body text and icons on the page.                 |
| `card`                 | `oklch(1 0 0)`              | `oklch(0.17 0.007 271)`       | Raised surfaces: cards, panels, and code blocks. |
| `card-foreground`      | `oklch(0.15 0.004 230)`     | `oklch(0.987 0.002 197)`      | Text on cards.                                   |
| `popover`              | `oklch(1 0 0)`              | `oklch(0.21 0.006 286)`       | Menus, popovers, and tooltips.                   |
| `popover-foreground`   | `oklch(0.15 0.004 230)`     | `oklch(0.987 0.002 197)`      | Text in menus and popovers.                      |
| `primary`              | `oklch(0.36 0 0)`           | `oklch(0.925 0.005 214)`      | The main action: primary buttons, active states. |
| `primary-foreground`   | `oklch(0.94 0 0)`           | `oklch(0.22 0.008 224)`       | Text and icons on primary.                       |
| `secondary`            | `oklch(0.98 0.003 286)`     | `oklch(0.26 0.013 273)`       | Secondary buttons and quiet fills.               |
| `secondary-foreground` | `oklch(0.21 0.006 286)`     | `oklch(0.987 0.002 197)`      | Text on secondary.                               |
| `muted`                | `oklch(0.94 0 0)`           | `oklch(0.3 0.018 276)`        | Subtle fills: hover rows, tracks, skeletons.     |
| `muted-foreground`     | `oklch(0.53 0 0)`           | `oklch(0.62 0.022 270)`       | Secondary text, captions, placeholders.          |
| `accent`               | `oklch(0.94 0 0)`           | `oklch(0.29 0.017 275)`       | Hovered and selected items in menus and lists.   |
| `accent-foreground`    | `oklch(0.25 0.04 267)`      | `oklch(0.987 0.002 197)`      | Text on accent.                                  |
| `destructive`          | `oklch(0.55 0.2 17)`        | `oklch(0.7 0.19 22)`          | Errors and destructive actions.                  |
| `border`               | `oklch(0.92 0 0)`           | `oklch(0.56 0.02 268 / 0.2)`  | Hairlines between surfaces, and outlines.        |
| `input`                | `oklch(0.96 0 0)`           | `oklch(0.47 0.026 266 / 0.2)` | Form control borders and fills.                  |
| `ring`                 | `oklch(0 0 0)`              | `oklch(0.56 0.021 214)`       | Focus rings.                                     |
| `chart-1`              | `oklch(37.4% 0.01 67.558)`  | `oklch(27.4% 0.006 286.033)`  | First data series.                               |
| `chart-2`              | `oklch(55.3% 0.013 58.071)` | `oklch(44.2% 0.017 285.786)`  | Second data series.                              |
| `chart-3`              | `oklch(70.9% 0.01 56.259)`  | `oklch(55.2% 0.016 285.938)`  | Third data series.                               |
| `chart-4`              | `oklch(86.9% 0.005 56.366)` | `oklch(70.5% 0.015 286.067)`  | Fourth data series.                              |
| `chart-5`              | `oklch(97% 0.001 106.424)`  | `oklch(87.1% 0.006 286.286)`  | Fifth data series.                               |

Charts read their own tokens as well (`--chart-grid`, `--chart-crosshair`, `--chart-tooltip-background`, `--legend`, and the `--chart-scale-01` to `--chart-scale-05` sequential scale). They come with the chart registry items and follow the palette above.

## Typography

Interface text uses the project's sans font. Cortexcn's own site sets Geist; any neutral sans works.

- Default control and body size in components is `text-sm` (14px). Long-form text is `text-base` (16px).
- Labels, buttons, and table headers are `font-medium`. Headings are `font-semibold` with `tracking-tight` and `text-balance`.
- Secondary text is `text-muted-foreground`, not a lighter weight.
- Numbers that line up or change, such as stats, prices, and tables, use `tabular-nums`.
- Code and keyboard keys use the mono font at `text-xs` or `text-sm`.

## Layout

Spacing follows Tailwind's 4px scale. Inside controls the gap is `gap-1.5` (6px); between related items `gap-2` to `gap-4`; between sections `gap-12` to `gap-24`.

- Controls are `h-9` (36px) by default, `h-8` small, `h-10` large, with `px-2.5` padding.
- Cards and panels use `p-6` (24px), or `p-4` when dense.
- Page content sits in a centered container with `px-4` on phones and `px-6` or more on wider screens.
- Lay out with flex and grid gaps, not margins between siblings.

## Elevation & Depth

Depth comes from borders and surface color first. A card is `bg-card` with `border-border` on a `bg-background` page. Shadows are rare and soft (`shadow-xs` on outline buttons, `shadow-sm` on floating elements), and in dark mode the shadow token is transparent, so borders carry the separation.

## Shapes

Corners are square. `--radius` is `0`, and every `rounded-*` utility (`rounded-sm` to `rounded-4xl`) is derived from it, so components written with the radius scale come out square. Use the scale classes, never a hard-coded radius such as `rounded-[12px]`, so a theme can change the radius in one place. `rounded-full` stays round and is for avatars, status dots, and switches.

## Components

- Build from the existing Cortexcn and shadcn components before writing new ones. Keep their `data-slot` attributes; styles and tests rely on them.
- Compose classes with `cn()` and add variants with `class-variance-authority`, the way `Button` does.
- Buttons: `default` (primary), `outline`, `secondary`, `ghost`, `destructive` (a tinted fill, not solid red), and `link`. One primary action per view.
- Inputs: a one-pixel `border-input`, transparent fill, and a visible focus ring.
- Focus: every interactive element shows `focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50`. Never remove the outline without that replacement.
- Motion: 100 to 300 ms, easing out, on `transform` and `opacity` where possible. Respect `prefers-reduced-motion` by turning motion off or shortening it.
- Icons are 16px (`size-4`) in controls and inherit `currentColor`.

## Do's and Don'ts

Do:

- Use the token classes for every color and the radius scale for every corner.
- Check light and dark mode, keyboard focus, and reduced motion before you finish.
- Keep one primary action per view and let the rest be `outline` or `ghost`.
- Separate surfaces with `border-border` and `bg-card` before reaching for a shadow.

Don't:

- Don't write hex, rgb, or oklch values in components, or add per-component dark colors.
- Don't round corners by hand or mix rounded and square elements.
- Don't use color alone to carry meaning; pair it with text or an icon.
- Don't animate layout properties such as width and height when a transform does the job.
