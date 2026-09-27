# Cortexcn landing page - brief

Read this before changing anything in `components/landing`. It describes the page
as it is built now: a Framer-template look (grid bands, pixel type, square
buttons) filled with Cortexcn's own copy and art.

## The product (what the page sells)

Cortexcn is a shadcn/ui registry of React components, charts, and blocks. People
install items with the shadcn CLI (`npx shadcn@latest add @cortexcn/<name>`), or
let an AI agent (Claude Code, Cursor, Codex) pull them in through the shadcn MCP
server. The code is copied into their repo, so they own it.

Audience: freelancers, developers, and startups who ship fast.
Core promise: your agent builds from real, tested components instead of making up UI.

## Voice and copy rules (strict)

- Plain, direct, concrete, short sentences. Say what it does and who it is for.
- NO em dashes anywhere. Use a period, a comma, or two sentences instead.
- NO marketing filler. Banned: seamless, robust, leverage, unlock, unleash,
  elevate, empower, supercharge, revolutionize, cutting-edge, game-changing,
  harness, effortless, boost, transformative, synergy, holistic, "in today's
  fast-paced", "whether you are", "it's not just X, it's Y".
- No emojis. No exclamation marks. Sentence case for headings.
- Only honest claims. No fake metrics, testimonials, customer logos, emails, or
  addresses. Pricing is labelled a preview until paid plans exist, the changelog
  uses real release dates, and the footer newsletter says signups open at launch.
- The infrastructure row in the footer lists only what the site really runs on
  (Vercel for hosting, firewall, and DDoS protection; Cloudflare for DNS and the
  contact form's Turnstile check). Do not add providers that are not in the
  request path.
- The contact details (email, phone, location) are real and live in
  `lib/contact-details.ts`; the footer, `/contact`, and the legal pages read them
  from there.

## Design system

- Theme scope: `.syntiq` in `app/globals.css`, applied by the landing layout
  (`app/(site)/(landing)/layout.tsx`), so docs and studio keep the default theme.
  It follows light and dark mode (`:is(.dark .syntiq, .syntiq.dark)`).
- Tokens: `bg-background`, `text-foreground`, `bg-card`, `bg-muted`,
  `border-border`, `text-primary` (violet accent), plus landing-only
  `text-body` (paragraphs), `text-label-strong` / `text-label-weak` (mono
  labels), and `text-faint` (glyph punctuation). Grid bands use `--band` and
  `--band-line`.
- Dark bands: put `band-dark dark` on the section (see the capabilities
  section). `.syntiq .band-dark` restates every token, because the site's own
  `.dark` tokens would otherwise win on that element.
- Fonts: Geist (body and headings), Geist Mono (labels, buttons, code), and Geist
  Pixel Square via `font-pixel` for the typed accent words. Sans and Mono come
  from the `geist` package; Pixel Square loads through `next/font/local` in
  `app/layout.tsx` (one cut only, because `geist/font/pixel` preloads all five).
- Shape: square corners (`--radius: 0.25rem`), 1px borders, tight tracking
  (`tracking-[-0.05em]` on text). Sections use `py-20` inside `<Container>`
  (`max-w-[1264px]`).
- Motion: type-in text and scrambles start when the element scrolls into view and
  never reflow the layout (untyped letters are rendered `invisible`).

## Shared pieces

- `primitives.tsx`: `Container`.
- `kit.tsx` (client): `SectionLabel` (the "[N.01/06]" row, driven by
  `NUMBERED_SECTIONS`), `TypeHeading`, `useTypeInOnView`, `typedCount`,
  `TypedText`, `scrambleChar`, `useScrambleText`, `ActionLink` (the square CTA),
  `IndexMark` ("//001"), `MonoTag`, `DotTexture`, `PixelArt`, `ArrowRightIcon`,
  `ArrowUpRightIcon`.
- `extruded-icon.tsx`: line-art 3D icons that turn into pixel art on hover
  (`COMPONENT_SHAPE`, `TERMINAL_SHAPE`, `CURSOR_SHAPE`).
- `interactive-grid.tsx`: the hover grid used in the hero band and the CTA.
- Logos live in `/public/logos` (themed `-light` / `-dark` pairs where needed).
  Draw small glyphs as inline SVG with `currentColor`. No icon libraries and no
  new npm dependencies.

## Section map (page order, see `app/(site)/(landing)/page.tsx`)

1. `hero-section.tsx` -> `HeroSection` (grid band, typed headline, CTAs)
2. `stack-section.tsx` -> `StackSection` (logo cells and the typed tagline panel)
3. `benefits-section.tsx` -> `BenefitsSection` (N.01, "Why Cortexcn")
4. `capabilities-section.tsx` -> `CapabilitiesSection` (N.02, dark band with the
   registry diagram, sticky scroll steps like the installation section)
5. `installation-section.tsx` -> `InstallationSection` (N.03, sticky scroll steps)
6. `services-section.tsx` -> `ServicesSection` (N.04, `id="services"`, dark band
   of client services that link to /contact)
7. `pricing-section.tsx` -> `PricingSection` (N.05, `id="pricing"`, preview only)
8. `changelog-section.tsx` -> `ChangelogSection` (N.06)
9. `faq-section.tsx` -> `FaqSection` (N.07, `id="faq"`)
10. `cta-section.tsx` -> `CtaSection` (tickers and the grid band card)
11. `landing-footer.tsx` -> `LandingFooter`

## Keep in sync

- `lib/home-markdown.ts` mirrors the landing copy for `/index.md` (read by AI
  agents). Update it whenever the section copy changes.
- Adding or removing a numbered section means updating `NUMBERED_SECTIONS` in
  `kit.tsx`, which renumbers every label.

## Per-file rules

- One section per file, exporting a named component that takes no props. Copy
  and data live in local `const`s.
- Server component by default. Add `"use client"` only for state, effects, or
  event handlers.
- Mobile first, correct in both themes, no horizontal overflow (grid children
  holding code need `min-w-0`).
- TypeScript strict, no `any`, no dead code. Comments only for a non-obvious
  "why", and they follow the copy rules too.
