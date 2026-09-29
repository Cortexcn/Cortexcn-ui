# Cortexcn UI home - brief

Read this before changing anything in `components/ui-home`. It describes the
component library home: the page ui.cortexcn.dev opens on. It is a second site
next to the services landing (`components/landing`), and it only describes the
components. No services or client work; the only prices here are the component
plans, read from `lib/service-pricing.ts`.

## Where it lives

- It is the root of its own host: https://ui.cortexcn.dev/ in production and
  http://ui.localhost:3000/ in dev (browsers resolve `*.localhost` to this
  machine). http://localhost:3000/ stays the services landing.
- Route: `app/(ui-home)/ui-home/page.tsx`, with its own layout
  (`app/(ui-home)/layout.tsx`) that sets the theme scope and fonts, the header
  (plain variant, library nav from `lib/library-nav-links.ts`), and
  `LibraryFooter`.
  `/ui-home` is internal: `proxy.ts` rewrites `/` on the library host to it,
  and redirects direct visits to `/ui-home` (or `/components`) to the library
  host root, so it never shows in the address bar.
- `lib/site-url.ts` owns `LIBRARY_HOME_ROUTE`, `DEV_DOCS_HOSTNAME`, and the
  canonical URL (`https://ui.cortexcn.dev/`).

## The product

Cortexcn is a shadcn/ui registry of React components, charts, and blocks.
People add the `@cortexcn` registry to `components.json` once, then install
items with `npx shadcn@latest add @cortexcn/<name>`, or let an AI agent (Claude
Code, Cursor, Codex) install them through the shadcn MCP server. The source is
copied into their repo, so they own it and can change it.

## Voice and copy rules (strict)

- Plain, direct, concrete, short sentences. Sentence case headings.
- NO em dashes anywhere. No emojis, no exclamation marks.
- Banned: seamless, robust, leverage, unlock, unleash, elevate, empower,
  supercharge, revolutionize, cutting-edge, game-changing, harness,
  effortless, boost, transformative, synergy, holistic, "in today's
  fast-paced", "whether you are", "it's not just X, it's Y".
- Honest claims only. No fake customers, logos, testimonials, or metrics about
  Cortexcn. Sample numbers inside a UI mock (a dashboard's revenue) are fine.
  Do not call the library "free" or "open source" (paid plans exist).
- Only name components that exist in the registry (see the docs sidebar,
  `content/docs/components/meta.json`, and `blocks/manifest.ts`).

## Design system

- Based on the Solva Framer template (solva-template.framer.website), which
  the user chose: warm paper neutrals, big two-tone serif headings, rounded
  shapes, and painted art panels with a live UI "screenshot" floating on them.
- Theme scope: `.ui-home` in `app/globals.css`, light and dark
  (`:is(.dark .ui-home, .ui-home.dark)`). Tokens: `bg-background`,
  `text-foreground`, `bg-card`, `bg-muted`, `border-border`, `bg-primary`
  (near black in light, paper in dark), plus `text-body` (paragraphs),
  `text-(--heading-muted)` (the quiet half of headings), `bg-(--surface)` and
  `bg-(--surface-strong)` (raised panels), `bg-(--faint)`.
- Type, as in the template: headings in Sentient Light (`font-sentient
font-light`, tracking `-0.05em`, leading 1.05 to 1.25), everything else in
  Onest (the scope's default font). Hero h1 46/48/56px, section h2 via
  `SectionHeader` 38/40/48px, large card titles 32/40px, tab titles 26/30px,
  small card titles Onest 20px with `-0.02em`. Body `text-body` 16px with
  1.45 leading, 18px in the hero; buttons 14px medium; badges 15px.
- Fonts: Onest comes from `next/font/google` (`components/ui-home/fonts.ts`).
  Sentient (ITF Free Font License) is loaded from Fontshare's CSS API by the
  layout: the license allows it on our site but forbids sharing the font files
  through a public repository, so never commit them.
- Shape: buttons `rounded-[10px]` (h-11), art panels `rounded-2xl`, tiles and
  windows `rounded-xl`, tags `rounded-[4px]`. 1px `border-border` lines.
- Layout: `Container` (1200px content, 24px gutters). Sections use
  `py-20 md:py-28`. Section headings are left aligned.
- Motion: headings reveal word by word (`RevealHeading`, or `HeadingWords`
  with `enterOnLoad` in the hero); blocks rise in with `Reveal` (optionally
  staggered with `delay`). Hidden states are CSS in globals.css, reduced motion
  shows everything at once, and a `<noscript>` rule in the layout keeps content
  visible without JS. Never leave meaningful content hidden behind a timer.

## Shared pieces

- `primitives.tsx`: `Container`, `SectionBadge`, `PrimaryLink`,
  `SecondaryLink` (labels roll up on hover), `ChevronRightIcon`.
- `section-header.tsx`: `SectionHeader` (badge plus two-tone heading).
- `reveal.tsx` (client): `Reveal`, `RevealHeading`, `HeadingWords`.
- `painting.tsx`: `Painting` fills its positioned parent with one of the
  template's paintings (`art`, see `ARTWORKS`; files in
  `public/images/ui-home`) plus its 5% noise layer, and dims it in dark mode.
  The user asked for the template's own art; confirm the Solva license covers
  it before publishing. Pass `sizes` for the panel's real width, and `preload`
  only above the fold.
- `app-window.tsx`: `AppWindow` (desktop app frame with a title bar) and
  `RegistryTag` (mono `@cortexcn/<name>` label for a piece of live UI).
- Live UI comes from the real registry: `@bklitui/ui/components/*`,
  `@bklitui/ui/charts`, the block sources in `blocks/*/files/components`, and
  the docs demos in `components/docs/*-demo.tsx`.

## Section map (page order)

1. `hero-section.tsx`: announcement link, two-tone h1, CTAs, meadow panel with
   `HeroDashboard` (stat card blocks and a number ticker), then `StackTicker`.
2. `features-section.tsx` (`id="features"`): three cards, each a painted
   panel with a small live tile and a title and line below.
3. `sticky-features-section.tsx` (`id="why"`): three large cards that stack
   as you scroll (sticky), each with a painted panel, a live tile, copy, and a
   CTA.
4. `use-cases-section.tsx` (`id="use-cases"`): a tabbed panel. Each tab has a
   title, three features, a CTA, and a painted panel with a live window.
5. `quality-section.tsx` (`id="quality"`): the template's security section,
   retold as four things every component ships with.
6. `pricing-section.tsx` (`id="pricing"`): the component plans from
   `COMPONENT_PLANS`, the recommended one on a painting.
7. `faq-section.tsx` (`id="faq"`): questions in the registry `Accordion`.
8. `cta-section.tsx` (`id="get-started"`): the closing call to action.
9. `library-footer.tsx` (in the layout): brand, link columns, and credit.
10. The `/changelog` page (`app/(ui-home)/changelog`) uses `changelog-hero.tsx`
    (live counts per family) and `changelog-timeline.tsx`. Releases live in
    `lib/changelog.ts`, newest first, and the services landing shows the
    latest three, so add a release there and both update.
    The template's client results and testimonials sections are left out until
    there are real customers to quote.

## Per-file rules

- One section per file, exporting a named component that takes no props. Copy
  and data live in local `const`s.
- Server component by default. Add `"use client"` only for state, effects, or
  event handlers (split a small client part out instead of marking a whole
  section).
- Mobile first, correct in both themes, no horizontal overflow (grid children
  holding wide content need `min-w-0`).
- No new npm dependencies, no icon libraries: draw small glyphs as inline SVG
  with `currentColor`.
- TypeScript strict, no `any`, no dead code. Comments only for a non-obvious
  "why", and they follow the copy rules too.
