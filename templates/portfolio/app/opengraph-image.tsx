import { ImageResponse } from "next/og";

import { site } from "@/config/site";

// Generated once at build time, which also lets `NEXT_OUTPUT=export` work.
export const dynamic = "force-static";

export const alt = `${site.name}, ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "#fafaf9",
        color: "#121212",
      }}
    >
      <div style={{ display: "flex", fontSize: 32, fontWeight: 600 }}>
        {site.name}
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 132,
          fontWeight: 800,
          letterSpacing: "-0.05em",
          lineHeight: 0.9,
          textTransform: "uppercase",
        }}
      >
        {site.role}
      </div>
      <div style={{ display: "flex" }}>
        <div
          style={{
            display: "flex",
            background: "#d6ff3d",
            padding: "8px 16px",
            fontSize: 28,
          }}
        >
          /{site.hero.tagline} {site.since}
        </div>
      </div>
    </div>,
    size,
  );
}
