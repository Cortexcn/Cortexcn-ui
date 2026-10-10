/**
 * Records where each token came from: a DESIGN.md reference (mapping), or a
 * gap that says what was missing and how the value was chosen.
 */
import type { Gap } from "../../design-systems/_schema/meta";

export class Provenance {
  readonly mapping: Record<string, string> = {};
  readonly gaps: Gap[] = [];

  /** The token came from the DESIGN.md. */
  from(path: string, ref: string) {
    this.mapping[path] = ref;
  }

  /** The value comes from a sentence in the DESIGN.md's prose. */
  fromProse(path: string, quote: string) {
    const kept = this.gaps.filter((gap) => gap.path !== path);
    this.gaps.splice(0, this.gaps.length, ...kept);
    this.mapping[path] = `(prose) "${quote}"`;
  }

  /** The DESIGN.md is silent; `note` names the default used. */
  missing(path: string, note: string) {
    this.gaps.push({ path, kind: "missing", note });
  }

  /** Computed from other values; `note` says how. */
  derived(path: string, note: string) {
    this.gaps.push({ path, kind: "derived", note });
  }

  font(path: string, note: string) {
    this.gaps.push({ path, kind: "font", note });
  }

  contrast(gap: Omit<Gap, "kind">) {
    this.gaps.push({ ...gap, kind: "contrast" });
  }
}
