# Cortexcn landing page - brief

Read this before changing anything in `components/landing`. It describes the page
as it is built now: a Framer-template look (grid bands, pixel type, square
buttons) filled with Cortexcn's own copy and art.

## The product (what the page sells)

The www home page sells client work first. Cortexcn designs and builds landing
pages, websites, online stores, web apps, backends, and AI features on Next.js.
Every project gets a written quote before work starts, a preview link every
week, code that lives in the client's repo, and 30 days of fixes after launch.

Audience: founders, small businesses, and teams who need a site or product
built. Core promise: clear prices, visible progress, and code you own.

The component library (a shadcn/ui registry of React components, charts, and
blocks) gets exactly two sections on this page: "Our component library" and
"For developers". Everything else talks about client work. The library has its
own home on ui.cortexcn.dev.

## Voice and copy rules (strict)

- Plain, direct, concrete, short sentences. Say what it does and who it is for.
- NO em dashes anywhere. Use a period, a comma, or two sentences instead.
- NO marketing filler. Banned: seamless, robust, leverage, unlock, unleash,
  elevate, empower, supercharge, revolutionize, cutting-edge, game-changing,
  harness, effortless, boost, transformative, synergy, holistic, "in today's
  fast-paced", "whether you are", "it's not just X, it's Y".
- No emojis. No exclamation marks. Sentence case for headings.
- Only honest claims. No fake metrics, testimonials, customer logos, emails, or
  addresses. Client quotes live in `lib/testimonials.ts`, and only real ones
  with the client's permission go there; the section stays hidden while the
  list is empty. The Recent work section shows our live demo sites and says
  their brands are made up. Every price lives in `lib/service-pricing.ts` (the landing section,
  /pricing and its estimator, the FAQ, and /index.md all read it there), in US
  dollars. Component plans (Free, Pro, Ultra) are one-time payments; the paid
  ones link to an early access request until checkout exists. Client work shows
  starting prices, and every project still gets a written quote. The changelog
  uses real release dates, and the footer newsletter says signups open at
  launch.
- The contact details (email, phone, location) are real and live in
  `lib/contact-details.ts`; the footer's "Get in touch" panel, `/contact`, and
  the legal pages read them from there.

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
- `interactive-grid.tsx`: the hover grid used in the hero band and the CTA.
- Logos live in `/public/logos` (themed `-light` / `-dark` pairs where needed).
  Draw small glyphs as inline SVG with `currentColor`. No icon libraries and no
  new npm dependencies.

## Section map (page order, see `app/(site)/(landing)/page.tsx`)

1. `hero-section.tsx` -> `HeroSection` (grid band, typed headline of what I
   build, three promises read from the pricing data, "Start a project")
2. `proof-section.tsx` -> `ProofSection` (the proof line, one row of stack
   logos, and the "Trusted by" row; numbers and logos from `lib/site-config.ts`)
3. `components/services/service-grid.tsx` -> `ServiceGrid section="services"`
   (`id="services"`, dark band of every service with its starting price; also
   on /services without a number)
4. `components/services/services-process.tsx` -> `ServicesProcess
   section="process"` (`id="process"`, the four steps, the stack, and per
   project or retainer; also on /services)
5. `work-section.tsx` -> `WorkSection` ("Built with Cortexcn", `id="work"`,
   case studies from `lib/work.ts`, each linking to /work/[slug])
6. `testimonials-section.tsx` -> `TestimonialsSection` ("What clients say",
   `id="testimonials"`, quotes from `lib/testimonials.ts`)
7. `capabilities-section.tsx` -> `CapabilitiesSection` ("Our component
   library", `id="components"`, dark band with the registry diagram)
8. `installation-section.tsx` -> `InstallationSection` ("For developers",
   sticky scroll steps that connect Claude Code, Cursor, VS Code, or Codex to
   the Cortexcn MCP server; keep them in step with
   `content/docs/integration/mcp.mdx`)
9. `pricing-section.tsx` -> `PricingSection` (`id="pricing"`, projects,
   retainers, and component plans behind one toggle, projects first; the Pro
   and Ultra buttons read their checkout links from `lib/site-config.ts`;
   `PricingPlans` is shared with the /pricing page)
10. `faq-section.tsx` -> `FaqSection` (`id="faq"`, questions people ask before
    hiring me)
11. `cta-section.tsx` -> `CtaSection` (tickers and the grid band card, "Start a
    project")
12. `landing-footer.tsx` -> `LandingFooter`

## Owner-edited content and placeholders

- `lib/site-config.ts` holds the proof numbers, the Pro and Ultra checkout
  links, the "Trusted by" logos, and the /about photo. A stat set to null is
  left out.
- Placeholder content (empty logo slots, sample quotes, draft case studies)
  shows only under `bun run dev` (`SHOW_PLACEHOLDERS`), never in a production
  build. Never ship a made-up quote, logo, or result.
- The copy speaks as "I": Syed Moinuddin builds the client work. The /about
  and /work pages live next to this page in `app/(site)/(landing)`.

## Keep in sync

- `lib/home-markdown.ts` mirrors the landing copy for `/index.md` (read by AI
  agents). Update it whenever the section copy changes.
- Adding or removing a numbered section means updating `ALL_NUMBERED_SECTIONS`
  in `kit.tsx`, which renumbers every label.
- The header links live in `lib/site-nav-links.ts`.

## Per-file rules

- One section per file, exporting a named component that takes no props. Copy
  and data live in local `const`s.
- Server component by default. Add `"use client"` only for state, effects, or
  event handlers.
- Mobile first, correct in both themes, no horizontal overflow (grid children
  holding code need `min-w-0`).
- TypeScript strict, no `any`, no dead code. Comments only for a non-obvious
  "why", and they follow the copy rules too.
