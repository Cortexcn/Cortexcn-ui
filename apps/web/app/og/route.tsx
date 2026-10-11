import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { OgCard } from "@/components/og/og-card";
import { OG_IMAGE_SIZE, parseOgImageParams } from "@/lib/og";

/*
 * Draws a page's share image from the title and description in its query.
 * pageMetadata() in lib/seo.ts writes the URL, so every page links one.
 * ImageResponse caches each image for a year, and new text is a new URL.
 * The fonts and the mark ship with this route (next.config.mjs).
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

export function GET(request: NextRequest) {
  const image = parseOgImageParams(request.nextUrl.searchParams);
  return new ImageResponse(<OgCard image={image} logoSrc={MARK_SRC} />, {
    ...OG_IMAGE_SIZE,
    fonts: [
      { name: "Geist", data: geistRegular, weight: 400, style: "normal" },
      { name: "Geist", data: geistMedium, weight: 500, style: "normal" },
      { name: "Geist Mono", data: geistMono, weight: 400, style: "normal" },
    ],
  });
}
