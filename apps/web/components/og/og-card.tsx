import { LibraryOgCard } from "@/components/og/library-og-card";
import type { OgImage } from "@/lib/og";
import { shadcnAddItem } from "@/lib/registry-links";
import { canonicalUrlFor, DOCS_URL } from "@/lib/site-url";

/*
 * Share image cards, drawn by Satori through next/og. Satori supports flexbox
 * and a subset of CSS, so every element with children sets `display: flex`.
 * Each host has its own card: ui.cortexcn.dev pages get the library card
 * (library-og-card.tsx), and www.cortexcn.dev pages get the one below, which
 * follows the services home's dark grid band (components/landing/hero-section.tsx).
 */

const COLORS = {
  band: "#1a1a1a",
  gridLine: "#333333",
  chip: "#474747",
  bandText: "#f5f5f5",
  bandMuted: "#adadad",
  page: "#ffffff",
  title: "#1a1a1a",
  description: "#525252",
  muted: "#6b6b6b",
  accent: "#6a2bff",
  cells: ["#3e2a8a", "#2e2358", "#272041"],
} as const;

const CELL = 48;
const COLUMNS = 25;
const BAND_ROWS = 4;
const BAND_HEIGHT = CELL * BAND_ROWS;
const GUTTER = 72;

const LIBRARY_HOST = new URL(DOCS_URL).host;

/** A small string hash, so the same page always lights the same cells. */
function hash(text: string) {
  let value = 0;
  for (const char of text) {
    value = (value * 31 + (char.codePointAt(0) ?? 0)) % 1_000_000_007;
  }
  return value;
}

/** Three lit cells in the band's top and bottom rows, about eight columns apart. */
function litCells(seed: string) {
  const value = hash(seed);
  return COLORS.cells.map((color, index) => {
    const nudge = Math.floor(value / 4 ** (index + 1)) % 4;
    const isTopRow = Math.floor(value / 2 ** (20 + index)) % 2 === 0;
    return {
      color,
      column: ((value % COLUMNS) + index * 8 + nudge) % COLUMNS,
      row: isTopRow ? 0 : BAND_ROWS - 1,
    };
  });
}

const VERTICAL_LINES = Array.from(
  { length: COLUMNS - 1 },
  (_, index) => (index + 1) * CELL,
);
const HORIZONTAL_LINES = Array.from(
  { length: BAND_ROWS - 1 },
  (_, index) => (index + 1) * CELL,
);

function BandGrid({ seed }: { seed: string }) {
  return (
    <div
      style={{
        display: "flex",
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
    >
      {litCells(seed).map((cell) => (
        <div
          key={cell.color}
          style={{
            position: "absolute",
            left: cell.column * CELL + 1,
            top: cell.row * CELL + 1,
            width: CELL - 1,
            height: CELL - 1,
            backgroundColor: cell.color,
          }}
        />
      ))}
      {VERTICAL_LINES.map((x) => (
        <div
          key={`x${x}`}
          style={{
            position: "absolute",
            left: x,
            top: 0,
            width: 1,
            height: BAND_HEIGHT,
            backgroundColor: COLORS.gridLine,
          }}
        />
      ))}
      {HORIZONTAL_LINES.map((y) => (
        <div
          key={`y${y}`}
          style={{
            position: "absolute",
            left: 0,
            top: y,
            width: "100%",
            height: 1,
            backgroundColor: COLORS.gridLine,
          }}
        />
      ))}
    </div>
  );
}

interface OgCardProps {
  image: OgImage;
  /** The Cortexcn mark as a data URL; Satori can't read files itself. */
  logoSrc: string;
  /** The library card's title font: Sentient when it loaded, Geist otherwise. */
  titleFont?: string;
}

/** A page's share image, in the style of the site that serves the page. */
export function OgCard({ image, logoSrc, titleFont = "Geist" }: OgCardProps) {
  const url = new URL(canonicalUrlFor(image.path));
  const address = `${url.host}${url.pathname === "/" ? "" : url.pathname}`;
  if (url.host === LIBRARY_HOST) {
    return (
      <LibraryOgCard
        address={address}
        image={image}
        logoSrc={logoSrc}
        titleFont={titleFont}
      />
    );
  }

  const footer = image.item
    ? `npx shadcn add ${shadcnAddItem(image.item)}`
    : address;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        backgroundColor: COLORS.page,
        fontFamily: "Geist",
      }}
    >
      <div
        style={{
          display: "flex",
          position: "relative",
          alignItems: "center",
          height: BAND_HEIGHT,
          padding: `0 ${GUTTER}px`,
          backgroundColor: COLORS.band,
        }}
      >
        <BandGrid seed={`${image.path} ${image.title}`} />
        {/* biome-ignore lint/performance/noImgElement: Satori draws plain img elements only. */}
        <img
          alt=""
          height={64}
          src={logoSrc}
          style={{ borderRadius: 10 }}
          width={64}
        />
        <div
          style={{
            marginLeft: 20,
            color: COLORS.bandText,
            fontSize: 52,
            fontWeight: 500,
            letterSpacing: "-0.03em",
          }}
        >
          Cortexcn
        </div>
        {image.section ? (
          <div
            style={{
              display: "flex",
              marginLeft: 24,
              padding: "6px 10px",
              backgroundColor: COLORS.chip,
              color: COLORS.bandText,
              fontFamily: "Geist Mono",
              fontSize: 20,
              textTransform: "uppercase",
            }}
          >
            {image.section}
          </div>
        ) : null}
        <div
          style={{
            marginLeft: "auto",
            paddingLeft: 32,
            color: COLORS.bandMuted,
            fontFamily: "Geist Mono",
            fontSize: 20,
            letterSpacing: "0.02em",
            textTransform: "uppercase",
          }}
        >
          {url.host}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          padding: `52px ${GUTTER}px 48px`,
        }}
      >
        <div
          style={{
            display: "block",
            color: COLORS.title,
            fontSize: image.title.length > 36 ? 60 : 72,
            fontWeight: 500,
            letterSpacing: "-0.035em",
            lineClamp: 2,
            lineHeight: 1.08,
          }}
        >
          {image.title}
        </div>
        {image.description ? (
          <div
            style={{
              display: "block",
              marginTop: 22,
              color: COLORS.description,
              fontSize: 30,
              lineClamp: 2,
              lineHeight: 1.4,
            }}
          >
            {image.description}
          </div>
        ) : null}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: "auto",
            fontFamily: "Geist Mono",
            fontSize: 22,
          }}
        >
          <div
            style={{
              flexShrink: 0,
              width: 14,
              height: 14,
              backgroundColor: COLORS.accent,
            }}
          />
          <div
            style={{
              display: "block",
              flexShrink: 1,
              marginLeft: 14,
              overflow: "hidden",
              color: COLORS.title,
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {footer}
          </div>
          <div
            style={{
              flexShrink: 0,
              marginLeft: "auto",
              paddingLeft: 32,
              color: COLORS.muted,
              textTransform: "uppercase",
            }}
          >
            Built by Syed Moinuddin
          </div>
        </div>
      </div>
    </div>
  );
}
