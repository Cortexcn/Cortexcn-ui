import { canonicalUrlFor, LIBRARY_HOME_ROUTE } from "@/lib/site-url";

/*
 * Share images (Open Graph and X cards). app/og/route.tsx draws each one on
 * request from the page's own title and description, the way shadcn/ui's /og
 * route does, so a new page, component, block, or template gets one with no
 * extra step. Pages ask for it through pageMetadata() in lib/seo.ts.
 */

/** The size Open Graph and X large cards expect. */
export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const;

/** Served on both hosts (proxy.ts); each page links the one on its own host. */
const OG_ROUTE = "/og";

/** Longest text the card fits; longer text is cut at a word. */
const MAX_LENGTH = { title: 80, description: 160, section: 32 } as const;

const MAX_PATH_LENGTH = 120;

const MAX_ITEM_LENGTH = 48;

/** A registry item name, as in `npx shadcn add @cortexcn/<name>`. */
const ITEM_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** A site path: letters, digits, dashes, and slashes. */
const PATH_RE = /^\/[a-z0-9/-]*$/i;

const TRAILING_PUNCTUATION_RE = /[\s,.;:]+$/;

export interface OgImage {
  title: string;
  description?: string;
  /** The label at the top, such as "Docs / Cortex". */
  section?: string;
  /** The page's path, such as "/docs/cortex/lanyard-badge". */
  path: string;
  /** The registry item the page installs; the card shows its install command. */
  item?: string;
}

/** Labels for top-level routes that don't read well title-cased. */
const SECTION_LABELS: Record<string, string> = {
  "design-systems": "Design systems",
  privacy: "Legal",
  refunds: "Legal",
  "sign-in": "Account",
  terms: "Legal",
};

/** The label for a path's section: "Pricing" for /pricing, none for a home page. */
export function ogSectionFor(path: string) {
  const first = path.split("/").find(Boolean);
  if (!first || path === LIBRARY_HOME_ROUTE) {
    return;
  }
  const label = first.replaceAll("-", " ");
  return (
    SECTION_LABELS[first] ?? label.charAt(0).toUpperCase() + label.slice(1)
  );
}

/** Collapses whitespace and cuts text to `max` characters at a word, with an ellipsis. */
function clamp(text: string, max: number) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) {
    return clean;
  }
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  const words = lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut;
  return `${words.replace(TRAILING_PUNCTUATION_RE, "")}…`;
}

/**
 * Absolute URL of a page's share image, on the page's own host: docs pages
 * get ui.cortexcn.dev/og, and the www pages get www.cortexcn.dev/og.
 */
export function ogImageUrl({
  title,
  description,
  section,
  path,
  item,
}: OgImage) {
  const params = new URLSearchParams({ title: clamp(title, MAX_LENGTH.title) });
  if (description) {
    params.set("description", clamp(description, MAX_LENGTH.description));
  }
  if (section) {
    params.set("section", clamp(section, MAX_LENGTH.section));
  }
  params.set("path", path);
  if (item) {
    params.set("item", item);
  }
  return `${new URL(OG_ROUTE, canonicalUrlFor(path)).href}?${params}`;
}

/**
 * Reads a share image request. The route is public, so every value is held
 * to what the card shows: text is cut to length, and a path or item name that
 * doesn't look like one is dropped.
 */
export function parseOgImageParams(params: URLSearchParams): OgImage {
  const description = params.get("description");
  const section = params.get("section");
  const path = params.get("path") ?? "/";
  const item = params.get("item") ?? "";
  return {
    title: clamp(params.get("title") || "Cortexcn", MAX_LENGTH.title),
    description: description
      ? clamp(description, MAX_LENGTH.description)
      : undefined,
    section: section ? clamp(section, MAX_LENGTH.section) : undefined,
    path: path.length <= MAX_PATH_LENGTH && PATH_RE.test(path) ? path : "/",
    item:
      item.length <= MAX_ITEM_LENGTH && ITEM_RE.test(item) ? item : undefined,
  };
}
