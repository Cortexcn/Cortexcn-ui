# Cortexcn landing page - build brief

> UPDATE: the landing page now follows the "Syntiq" template look, not the older
> AgentLab/monochrome direction described lower in this file. Source of truth for
> the visual system: the `.syntiq` scope in `app/globals.css` (dark navy palette,
> warm orange accent `--primary`, Manrope + IBM Plex Mono) plus `primitives.tsx`.
> The theme is scoped to the home layout wrapper (`app/(site)/(home)/layout.tsx`)
> so docs and studio keep the default theme. Accent is orange (`text-primary`,
> `bg-primary`), surfaces are `bg-card` on `bg-background`, headings are Manrope
> semibold. The section copy is original text written to match the template's
> structure. Testimonials, metrics, pricing, and contact details are marked as
> placeholders in code and must be replaced with real values before launch. The
> notes below about indigo, serif display headings, and the monochrome accent are
> superseded by the Syntiq theme.

You are building ONE section of the new Cortexcn marketing landing page. Read this
whole file before writing code. Match it exactly. Other agents are building the
other sections in parallel against this same brief, so consistency is critical.

## The product (what the page sells)

Cortexcn is a component platform that an AI coding agent can build with. Developers,
freelancers, and startups connect Cortexcn to their agent (Claude, Cursor, Codex)
over an MCP server. They pick a component, tell the agent what to build, and the
agent assembles a real website (landing pages, e-commerce, dashboards, portfolios)
instead of hallucinating UI from scratch.

Audience: freelancers, developers, and startups who ship fast.
Core promise: your agent builds from a real library, so the UI is right the first time.

## Voice and copy rules (strict)

- Write in a Y Combinator style: plain, direct, concrete, short sentences. Say what
  it does and who it is for. Lead with the benefit.
- NO em dashes (—) anywhere. Use a period, a comma, or two sentences instead.
- NO AI/marketing filler words. Banned: seamless, seamlessly, robust, leverage,
  unlock, unleash, elevate, empower, supercharge, revolutionize, revolutionary,
  cutting-edge, game-changing, harness, realm, tapestry, testament, effortless,
  effortlessly, boost, turbocharge, transformative, synergy, holistic, plethora,
  myriad, "in today's fast-paced", "ever-evolving", "whether you are", "it's not
  just X, it's Y". Write like a founder, not a brochure.
- No emojis. No exclamation marks. Sentence case for headings (not Title Case).
- Do not invent fake metrics or fake testimonials with real-sounding named people.
  If a number is illustrative, keep it plausible and generic, or use a real one
  (50+ components, works with 3+ agents, MIT licensed).

## Design system

- Dark-first, but MUST look correct in light and dark. Use the semantic tokens so
  both themes work automatically: `bg-background`, `bg-card`, `text-foreground`,
  `text-muted-foreground`, `border-border`. The `dark:` variant is enabled for the
  site (class-based), so `dark:` utilities are allowed.
- Accent is indigo. Use the shared constants (below), or `text-indigo-600
dark:text-indigo-400`, `bg-indigo-500`, etc. Use the accent sparingly, for CTAs,
  small highlights, dots, and one or two key numbers.
- Rounding: the theme sets `--radius: 0`, so `rounded-md`/`rounded-lg` render SHARP.
  Do not rely on them. Use the shared primitives for surfaces, and explicit arbitrary
  radii otherwise: cards `rounded-[14px]`, buttons `rounded-[10px]`, chips
  `rounded-[8px]`, pills `rounded-full`.
- Fonts: default is Geist Sans (already applied). Use `font-mono` for eyebrows,
  labels, code, and small uppercase text. Use `font-semibold` + `tracking-tight`
  for headings.
- Spacing rhythm: sections use `py-20 md:py-28`. Center content in a `<Container>`.
- Keep it clean and modern (think a polished SaaS template): generous whitespace,
  soft borders, subtle shadows (`shadow-sm`/`shadow-xl`), one soft indigo glow max
  per section if any. Do not add loud gradients everywhere.

## Shared primitives (import from `./primitives`)

```tsx
import {
  Container, // max-w-6xl centered padded wrapper
  Section, // <section> with py-20 md:py-28; prop: bordered?: boolean
  Surface, // rounded-[14px] border bg-card/60 panel
  Eyebrow, // mono uppercase pill with an indigo dot
  SectionHeading, // { eyebrow?, title, description?, align?: "center"|"start", titleId? }
  surfaceClassName, // string, same as <Surface>
  accentButtonClassName, // indigo primary CTA classes
  secondaryButtonClassName, // rounded-[10px] for outline CTA
  accentTextClassName, // indigo text
} from "./primitives";
```

## Components you may use

- `@/components/ui/button` -> `Button`. Variants: default, outline, secondary,
  ghost, white, link. Sizes: sm, default, lg, xl. It is a Base UI button: to make
  it a link, use the `render` prop, NOT `asChild`:
  `<Button size="lg" className={accentButtonClassName} render={<Link href="/docs" />}>Get started</Button>`
- `@/components/ui/badge` -> `Badge`.
- `@/components/ui/card` -> `Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter`.
- `@/components/ui/accordion` -> `Accordion` (FAQ only). Usage:
  `<Accordion items={[{ question: "...", answer: "..." }]} />`
- `@/components/ui/tabs` -> `Tabs` if you need tabs.
- `next/link` for links. `next/image` for images and logos.
- Do NOT add new npm dependencies. Do NOT import from other section files.

## Icons and logos

Brand logos are SVG files in `/public/logos` (reference as `/logos/<name>.svg`).
Local icon components live in `@/components/icons/*` (e.g. `GitHubIcon`, `DiscordIcon`,
`XIcon`, `V0Icon`). For simple UI glyphs (check, arrow, chevron), inline a small
SVG with `stroke="currentColor"` (see how `hero-section.tsx` / `accordion.tsx` do it).
Do not use a new icon library.

Logo files:

- Themed pairs (render `-light` in light mode, `-dark` in dark mode via the swap
  snippet below): `anthropic`, `openai`, `cursor`, `windsurf`, `v0`, `copilot`,
  `react`, `vercel`, `github`, `shadcn`.
- Safe single color (use as-is on any background): `claude.svg`, `tailwindcss.svg`,
  `supabase.svg`, `stripe.svg`, `typescript.svg`.
- Single dark logo, add `dark:invert` so it shows on dark: `nextjs.svg`.

Theme swap snippet for a themed pair:

```tsx
<span className="inline-flex">
  <Image
    src="/logos/cursor-light.svg"
    alt="Cursor"
    width={96}
    height={24}
    className="h-6 w-auto dark:hidden"
  />
  <Image
    src="/logos/cursor-dark.svg"
    alt=""
    aria-hidden
    width={96}
    height={24}
    className="hidden h-6 w-auto dark:block"
  />
</span>
```

## Reference implementations (read these before writing)

- `hero-section.tsx` - the visual gold standard. Match its rhythm, class style,
  and quality.
- `landing-footer.tsx` - branding, link style.
- `primitives.tsx` - the exact shared classes.

## Per-file contract

- Write exactly one file at the path you are told, exporting the named React
  component you are told (e.g. `export function ProblemSection() { ... }`).
- The component takes NO props. Put its copy and data inline as local `const`s.
- Default to a server component. Add `"use client"` ONLY if you use state, effects,
  or event handlers.
- Wrap the section content so it has the correct anchor id and width, e.g.
  `<Section id="problem"><Container>...</Container></Section>`.
- Must be fully responsive (mobile first) and correct in BOTH themes.
- Keep imports tidy (no unused). TypeScript strict. No `any`. No dead code.
- Comments only for non-obvious "why", and follow the copy rules (no em dashes).

## Section map (for context, and for anchor ids used in cross-links)

1. hero-section.tsx -> `HeroSection` (built)
2. logo-cloud.tsx -> `LogoCloud` (id: logos)
3. problem-section.tsx -> `ProblemSection` (id: problem)
4. features-section.tsx -> `FeaturesSection` (id: features)
5. how-it-works-section.tsx -> `HowItWorksSection` (id: how-it-works)
6. use-cases-section.tsx -> `UseCasesSection` (id: use-cases)
7. metrics-section.tsx -> `MetricsSection` (id: metrics)
8. trust-section.tsx -> `TrustSection` (id: trust)
9. faq-section.tsx -> `FaqSection` (id: faq)
10. cta-section.tsx -> `CtaSection` (id: cta)
11. landing-footer.tsx -> `LandingFooter` (built)

The page composition and nav wiring are handled centrally. Just build your one file.
