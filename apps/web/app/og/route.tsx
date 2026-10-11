import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { OgCard } from "@/components/og/og-card";
import { OG_IMAGE_SIZE, parseOgImageParams } from "@/lib/og";

/*
 * Draws a page's share image from the title and description in its query.
 * pageMetadata() in lib/seo.ts writes the URL, so every page links one.
 * The Geist fonts and the mark ship with this route (next.config.mjs).
 */

const OG_FONTS_DIR = join(process.cwd(), "lib/og-fonts");

/**
 * Satori applies Geist's kerning (the GPOS table) across the spaces between
 * words, which leaves some gaps twice as wide as others. Renaming the table
 * in the font's table directory hides it, so words are set by advance widths.
 */
function withoutKerning(font: Buffer) {
  const copy = Buffer.from(font);
  const tableCount = copy.readUInt16BE(4);
  for (let index = 0; index < tableCount; index += 1) {
    const recordOffset = 12 + index * 16;
    if (copy.toString("latin1", recordOffset, recordOffset + 4) === "GPOS") {
      copy.write("XPOS", recordOffset, "latin1");
    }
  }
  return copy;
}

const [geistRegular, geistMedium, geistMono, mark] = await Promise.all([
  readFile(join(OG_FONTS_DIR, "Geist-Regular.ttf")).then(withoutKerning),
  readFile(join(OG_FONTS_DIR, "Geist-Medium.ttf")).then(withoutKerning),
  readFile(join(OG_FONTS_DIR, "GeistMono-Regular.ttf")),
  readFile(join(process.cwd(), "public/img/cortexcn/icon-dark.png")),
]);

const MARK_SRC = `data:image/png;base64,${mark.toString("base64")}`;

/**
 * Sentient Light, the library home's heading font. Its license forbids sharing
 * the files through a public repository (components/ui-home/fonts.ts), so it
 * comes from Fontshare, as it does on the site, once per server instance.
 */
const SENTIENT_STYLESHEET = "https://api.fontshare.com/v2/css?f[]=sentient@300";

const TTF_URL_RE = /url\('([^']+\.ttf)'\)/;

let sentientLight: Promise<Buffer | null> | undefined;

async function fetchSentientLight() {
  const css = await fetch(SENTIENT_STYLESHEET).then((response) =>
    response.ok ? response.text() : "",
  );
  const ttfUrl = TTF_URL_RE.exec(css)?.[1];
  if (!ttfUrl) {
    return null;
  }
  const response = await fetch(new URL(ttfUrl, SENTIENT_STYLESHEET));
  return response.ok
    ? withoutKerning(Buffer.from(await response.arrayBuffer()))
    : null;
}

/** Sentient, or null while Fontshare can't be reached; a failure is retried. */
function loadSentientLight() {
  sentientLight ??= fetchSentientLight()
    .catch(() => null)
    .then((font) => {
      if (!font) {
        sentientLight = undefined;
      }
      return font;
    });
  return sentientLight;
}

/**
 * Next sends `max-age=0` by default, which would draw the image on every
 * crawler visit. The text is in the URL, so a cached image is never stale:
 * browsers keep it a day, and Vercel's CDN until the next deployment. An
 * image drawn without Sentient is only cached for minutes.
 */
const CACHE_CONTROL =
  "public, max-age=86400, s-maxage=31536000, stale-while-revalidate=86400";
const FALLBACK_CACHE_CONTROL = "public, max-age=0, s-maxage=300";

export async function GET(request: NextRequest) {
  const image = parseOgImageParams(request.nextUrl.searchParams);
  const sentient = await loadSentientLight();
  return new ImageResponse(
    <OgCard
      image={image}
      logoSrc={MARK_SRC}
      titleFont={sentient ? "Sentient" : "Geist"}
    />,
    {
      ...OG_IMAGE_SIZE,
      headers: {
        "Cache-Control": sentient ? CACHE_CONTROL : FALLBACK_CACHE_CONTROL,
      },
      fonts: [
        { name: "Geist", data: geistRegular, weight: 400, style: "normal" },
        { name: "Geist", data: geistMedium, weight: 500, style: "normal" },
        { name: "Geist Mono", data: geistMono, weight: 400, style: "normal" },
        ...(sentient
          ? [
              {
                name: "Sentient",
                data: sentient,
                weight: 300 as const,
                style: "normal" as const,
              },
            ]
          : []),
      ],
    },
  );
}
