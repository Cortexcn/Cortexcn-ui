/**
 * `design-systems/<id>/meta.json`: what a system is, where it came from, and
 * every place its tokens go beyond what its DESIGN.md states.
 */
import { z } from "zod";

export const TAGS = [
  "dark-first",
  "light-first",
  "dense",
  "airy",
  "sharp",
  "rounded",
  "pill",
  "editorial",
  "playful",
  "enterprise",
  "developer",
  "consumer",
  "minimal",
  "warm",
  "monochrome",
  "colorful",
  "serif",
  "mono",
] as const;

export const GAP_KINDS = [
  /** The DESIGN.md says nothing about it; the value is a stated default. */
  "missing",
  /** Computed from other source values; `note` says how. */
  "derived",
  /** A text pair below WCAG AA (4.5:1); the source value is kept. */
  "contrast",
  /** The named font is proprietary; an open-licensed one stands in. */
  "font",
] as const;

export const gapSchema = z.object({
  /**
   * The token path the gap covers, such as `modes.dark.primary`. A trailing
   * `.*` covers everything under a prefix, such as `motion.*`.
   */
  path: z.string().min(1),
  kind: z.enum(GAP_KINDS),
  note: z.string().min(1),
  /** For contrast gaps: the pair's ratio and a value that passes AA. */
  ratio: z.number().optional(),
  against: z.string().optional(),
  suggested: z.string().optional(),
});

export const fontChoiceSchema = z.object({
  role: z.enum(["display", "body", "mono"]),
  /** The family the DESIGN.md names. */
  referenced: z.string().min(1),
  /** The open-licensed family used instead (or the same, when it is open). */
  fallback: z.string().min(1),
  license: z.string().min(1),
  /** Where the fallback loads from. */
  provider: z.enum(["google-fonts", "next-font-geist", "system"]),
});

export const metaSchema = z.object({
  $schema: z.string().optional(),
  id: z.string().min(1),
  name: z.string().min(1),
  /** One line about the look, for pickers and list_design_systems. */
  description: z.string().min(1).max(200),
  tags: z.array(z.enum(TAGS)).min(1),
  /** Which mode the DESIGN.md documents. The other one is derived. */
  sourceMode: z.enum(["light", "dark", "both"]),
  source: z.object({
    /** The getdesign slug, such as linear.app. */
    slug: z.string().min(1),
    url: z.url(),
    fetchedWith: z.string().min(1),
    fetchedAt: z.iso.date(),
    license: z.string().min(1),
    disclaimer: z.string().min(1),
  }),
  fonts: z.array(fontChoiceSchema).length(3),
  /**
   * Provenance: token path to the DESIGN.md reference it came from, such as
   * `"modes.light.background": "{colors.canvas}"`. Paths not listed here must
   * be covered by a gap.
   */
  mapping: z.record(z.string(), z.string()),
  gaps: z.array(gapSchema),
});

export type DesignMeta = z.infer<typeof metaSchema>;
export type Gap = z.infer<typeof gapSchema>;
export type FontChoice = z.infer<typeof fontChoiceSchema>;
