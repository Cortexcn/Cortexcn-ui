import type { OgImage } from "@/lib/og";
import { shadcnAddItem } from "@/lib/registry-links";

/*
 * The share image card for ui.cortexcn.dev, in the library home's style
 * (components/ui-home/BRIEF.md): warm paper, a Sentient Light title, and an
 * art panel with a small window floating on it. The panel is a gradient, not
 * one of the home's paintings, so no artwork leaves the site. Satori draws it,
 * so every element with children sets `display: flex`.
 */

/** The `.ui-home` tokens in app/globals.css. */
const COLORS = {
  background: "#fbfaf6",
  foreground: "#1c1a15",
  card: "#ffffff",
  muted: "#f4f2ec",
  accent: "#efece4",
  border: "#e8e5dc",
  body: "#52524e",
  headingMuted: "#8c8982",
  faint: "#c9c6bd",
} as const;

/** Lavender, cream, and sage, the tones of the home's painted panels. */
const PANEL_BACKGROUND = [
  "radial-gradient(circle at 28% 22%, rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 0) 46%)",
  "radial-gradient(circle at 82% 88%, rgba(196, 214, 182, 0.9), rgba(196, 214, 182, 0) 52%)",
  "linear-gradient(160deg, #e6e1f1 0%, #f3e9dc 50%, #dfe7d5 100%)",
].join(", ");

function titleSize(title: string) {
  if (title.length <= 18) {
    return 78;
  }
  return title.length <= 34 ? 64 : 54;
}

function WindowDots() {
  return (
    <div style={{ display: "flex" }}>
      {["close", "minimize", "zoom"].map((name) => (
        <div
          key={name}
          style={{
            width: 11,
            height: 11,
            marginRight: 7,
            borderRadius: 999,
            backgroundColor: "#e4dfd3",
          }}
        />
      ))}
    </div>
  );
}

/** Width of the terminal's text, prompt included, with a little slack. */
const TERMINAL_TEXT_WIDTH = 328;

/** Width of the `$` prompt column, in em. */
const PROMPT_WIDTH = 1.8;

/** A terminal running the page's install command, sized so the name fits. */
function TerminalBody({ item }: { item: string }) {
  const name = shadcnAddItem(item);
  // Geist Mono's characters are 0.6em wide.
  const fontSize = Math.max(
    14,
    Math.min(
      21,
      Math.floor(TERMINAL_TEXT_WIDTH / (0.6 * name.length + PROMPT_WIDTH)),
    ),
  );
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "26px 24px 30px",
        fontFamily: "Geist Mono",
        fontSize,
        lineHeight: 1.5,
        color: COLORS.foreground,
      }}
    >
      <div style={{ display: "flex" }}>
        <span style={{ color: COLORS.faint, width: `${PROMPT_WIDTH}em` }}>
          $
        </span>
        npx shadcn add
      </div>
      <div
        style={{
          display: "block",
          marginLeft: `${PROMPT_WIDTH}em`,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {name}
      </div>
      <div style={{ display: "flex", alignItems: "center", marginTop: 10 }}>
        <span style={{ color: COLORS.faint, width: `${PROMPT_WIDTH}em` }}>
          $
        </span>
        <div
          style={{
            width: "0.6em",
            height: "1.15em",
            backgroundColor: COLORS.foreground,
            opacity: 0.25,
          }}
        />
      </div>
    </div>
  );
}

/** An outline of a page, for pages that install nothing. */
function PageBody() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "24px 22px 28px",
      }}
    >
      {[62, 88, 48].map((width) => (
        <div
          key={width}
          style={{
            width: `${width}%`,
            height: 12,
            marginBottom: 12,
            borderRadius: 6,
            backgroundColor: COLORS.accent,
          }}
        />
      ))}
      <div
        style={{
          height: 96,
          marginTop: 8,
          borderRadius: 10,
          backgroundColor: COLORS.muted,
        }}
      />
    </div>
  );
}

interface LibraryOgCardProps {
  image: OgImage;
  /** The page's address without the scheme, such as "ui.cortexcn.dev/blocks". */
  address: string;
  logoSrc: string;
  /** Sentient when it loaded, Geist otherwise. */
  titleFont: string;
}

export function LibraryOgCard({
  image,
  address,
  logoSrc,
  titleFont,
}: LibraryOgCardProps) {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        padding: 48,
        backgroundColor: COLORS.background,
        color: COLORS.foreground,
        fontFamily: "Geist",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          flexShrink: 1,
          minWidth: 0,
          padding: "16px 48px 16px 16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          {/* biome-ignore lint/performance/noImgElement: Satori draws plain img elements only. */}
          <img
            alt=""
            height={44}
            src={logoSrc}
            style={{ borderRadius: 10 }}
            width={44}
          />
          <div
            style={{
              marginLeft: 14,
              fontSize: 30,
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
                marginLeft: 16,
                padding: "5px 8px",
                borderRadius: 4,
                backgroundColor: COLORS.accent,
                fontSize: 15,
                fontWeight: 500,
                textTransform: "uppercase",
              }}
            >
              {image.section}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "block",
              fontFamily: titleFont,
              fontSize: titleSize(image.title),
              fontWeight: titleFont === "Sentient" ? 300 : 500,
              letterSpacing: "-0.05em",
              lineClamp: 3,
              lineHeight: 1.05,
            }}
          >
            {image.title}
          </div>
          {image.description ? (
            <div
              style={{
                display: "block",
                marginTop: 22,
                color: COLORS.body,
                fontSize: 25,
                lineClamp: 3,
                lineHeight: 1.45,
              }}
            >
              {image.description}
            </div>
          ) : null}
        </div>

        <div style={{ display: "flex" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              maxWidth: "100%",
              height: 48,
              padding: "0 20px",
              borderRadius: 10,
              backgroundColor: COLORS.foreground,
              color: COLORS.background,
              fontSize: 18,
              fontWeight: 500,
            }}
          >
            <div
              style={{
                display: "block",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {address}
            </div>
            <div style={{ flexShrink: 0, marginLeft: 10 }}>→</div>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexShrink: 0,
          alignItems: "center",
          justifyContent: "center",
          width: 452,
          height: "100%",
          borderRadius: 24,
          backgroundImage: PANEL_BACKGROUND,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: 384,
            borderRadius: 14,
            border: `1px solid ${COLORS.border}`,
            backgroundColor: COLORS.card,
            boxShadow: "0 28px 56px -16px rgba(28, 26, 21, 0.22)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              height: 44,
              padding: "0 16px",
              borderBottom: `1px solid ${COLORS.border}`,
            }}
          >
            <WindowDots />
            <div
              style={{
                display: "block",
                flexGrow: 1,
                marginLeft: 8,
                padding: "4px 10px",
                overflow: "hidden",
                borderRadius: 6,
                backgroundColor: image.item ? COLORS.card : COLORS.muted,
                color: COLORS.headingMuted,
                fontFamily: "Geist Mono",
                fontSize: 14,
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {image.item ? "Terminal" : address}
            </div>
          </div>
          {image.item ? <TerminalBody item={image.item} /> : <PageBody />}
        </div>
      </div>
    </div>
  );
}
