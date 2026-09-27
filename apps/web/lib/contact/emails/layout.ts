/**
 * Building blocks for the contact emails. Everything is tables and inline
 * styles so it holds up in Gmail, Outlook, and Apple Mail, and the look
 * follows the landing page: square edges, 1px lines, mono labels, a dark grid
 * band, and the violet accent.
 */

import { SITE_URL } from "@/lib/site-url";

export const COLORS = {
  page: "#f5f5f5",
  card: "#ffffff",
  line: "#e0e0e0",
  text: "#1a1a1a",
  body: "#474747",
  muted: "#7a7a7a",
  fill: "#f5f5f5",
  primary: "#6a2bff",
  band: "#1a1a1a",
  bandLine: "#333333",
  bandTag: "#2b2b2b",
  bandText: "#ffffff",
  bandMuted: "#adadad",
} as const;

export const SANS =
  "Geist, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";
export const MONO =
  "'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace";

const LOGO_URL = `${SITE_URL}/img/cortexcn/icon-dark.png`;
const FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@500;600&display=swap";

const GRID_COLUMNS = 12;
const GRID_ROWS = 2;
/** The cell lit up in the band, like the hover cell on the site's grid. */
const LIT_CELL = { row: 1, column: 9 } as const;

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};
const HTML_ESCAPE_RE = /[&<>"']/g;
const LINE_BREAK_RE = /\n/g;

export function escapeHtml(value: string) {
  return value.replace(HTML_ESCAPE_RE, (char) => HTML_ESCAPES[char] ?? char);
}

/** Escaped text with line breaks kept; Outlook ignores `white-space: pre-wrap`. */
export function multilineHtml(value: string) {
  return escapeHtml(value).replace(LINE_BREAK_RE, "<br>");
}

export const monoLabel = (color: string = COLORS.muted) =>
  `font-family:${MONO};font-size:11px;font-weight:500;line-height:1.3;letter-spacing:-0.02em;text-transform:uppercase;color:${color};`;

export function tag(text: string, onBand = false) {
  const background = onBand ? COLORS.bandTag : COLORS.fill;
  const color = onBand ? COLORS.bandMuted : COLORS.body;
  return `<span style="display:inline-block;padding:3px 5px;background:${background};${monoLabel(color)}">${escapeHtml(text)}</span>`;
}

/** The square call to action: a dot, a mono label, and an arrow. */
export function button(label: string, href: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0">
  <tr>
    <td style="background:${COLORS.text};">
      <a href="${escapeHtml(href)}" style="display:inline-block;padding:15px 18px;font-family:${MONO};font-size:14px;font-weight:600;line-height:1;letter-spacing:-0.04em;text-transform:uppercase;color:#ffffff;text-decoration:none;"><span style="display:inline-block;width:8px;height:8px;margin-right:32px;background:#ffffff;vertical-align:middle;"></span><span style="vertical-align:middle;">${escapeHtml(label)}</span><span style="margin-left:10px;vertical-align:middle;">&rarr;</span></a>
    </td>
  </tr>
</table>`;
}

function gridStrip() {
  const rows = Array.from({ length: GRID_ROWS }, (_, row) => {
    const cells = Array.from({ length: GRID_COLUMNS }, (_, column) => {
      const lit = row === LIT_CELL.row && column === LIT_CELL.column;
      const background = lit ? `background:${COLORS.primary};` : "";
      return `<td style="height:28px;${background}border-right:1px solid ${COLORS.bandLine};border-bottom:1px solid ${COLORS.bandLine};font-size:0;line-height:0;">&nbsp;</td>`;
    }).join("");
    return `<tr>${cells}</tr>`;
  }).join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;table-layout:fixed;">${rows}</table>`;
}

/** Two small squares on the card edge, like the corners of the site's CTA card. */
export function cornerRow() {
  const square = `<td width="8" style="width:8px;height:8px;background:${COLORS.text};font-size:0;line-height:0;">&nbsp;</td>`;
  return `<tr>
  <td style="padding:8px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>${square}<td style="font-size:0;line-height:0;">&nbsp;</td>${square}</tr></table>
  </td>
</tr>`;
}

/** Label and value rows split by 1px lines, like the site's footer lists. */
export function detailRows(rows: [label: string, valueHtml: string][]) {
  const body = rows
    .map(
      ([label, valueHtml], index) =>
        `<tr>
      <td width="110" style="width:110px;padding:13px 16px 13px 0;border-top:1px solid ${COLORS.line};${index === rows.length - 1 ? `border-bottom:1px solid ${COLORS.line};` : ""}vertical-align:top;${monoLabel()}">${escapeHtml(label)}</td>
      <td style="padding:11px 0;border-top:1px solid ${COLORS.line};${index === rows.length - 1 ? `border-bottom:1px solid ${COLORS.line};` : ""}font-family:${SANS};font-size:15px;line-height:1.4;letter-spacing:-0.02em;color:${COLORS.text};">${valueHtml}</td>
    </tr>`,
    )
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">${body}</table>`;
}

export function textLink(label: string, href: string) {
  return `<a href="${escapeHtml(href)}" style="color:${COLORS.text};text-decoration:underline;text-underline-offset:3px;">${escapeHtml(label)}</a>`;
}

const TICKER =
  "[#Components] &amp; [#Agents] &nbsp;&nbsp;//&nbsp;&nbsp; [#Blocks] &amp; [#Charts] &nbsp;&nbsp;//";

/**
 * The full message: header with the brand tab, the dark grid band with the
 * title, the white body between corner squares, and the ticker footer.
 */
export function emailDocument({
  title,
  preheader,
  eyebrow,
  label,
  heading,
  subheading,
  body,
  footer,
}: {
  title: string;
  preheader: string;
  eyebrow: string;
  label: string;
  heading: string;
  subheading: string;
  body: string;
  footer: string;
}) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${escapeHtml(title)}</title>
<link href="${FONTS_URL}" rel="stylesheet">
<style>
  body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; }
  a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; }
  @media (max-width: 620px) {
    .px { padding-left: 20px !important; padding-right: 20px !important; }
    .heading { font-size: 28px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:${COLORS.page};">
<div style="display:none;max-height:0;max-width:0;overflow:hidden;opacity:0;mso-hide:all;">${escapeHtml(preheader)}&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${COLORS.page};">
  <tr>
    <td align="center" style="padding:32px 12px 40px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background:${COLORS.card};border:1px solid ${COLORS.line};">
        <tr>
          <td class="px" style="padding:16px 24px;border-bottom:1px solid ${COLORS.line};">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
              <td align="left" style="vertical-align:middle;">
                <a href="${SITE_URL}" style="display:inline-block;padding:7px 10px 7px 8px;background:${COLORS.primary};text-decoration:none;"><img src="${LOGO_URL}" width="18" height="18" alt="" style="display:inline-block;width:18px;height:18px;border:0;border-radius:4px;vertical-align:middle;"><span style="margin-left:7px;vertical-align:middle;font-family:${MONO};font-size:12px;font-weight:600;letter-spacing:-0.02em;text-transform:uppercase;color:#ffffff;">Cortexcn</span></a>
              </td>
              <td align="right" style="vertical-align:middle;${monoLabel()}">${escapeHtml(eyebrow)}</td>
            </tr></table>
          </td>
        </tr>
        <tr>
          <td style="background:${COLORS.band};">
            ${gridStrip()}
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
              <td class="px" style="padding:28px 24px 34px;">
                ${tag(label, true)}
                <h1 class="heading" style="margin:16px 0 0;font-family:${SANS};font-size:34px;font-weight:500;line-height:1.08;letter-spacing:-0.05em;color:${COLORS.bandText};">${escapeHtml(heading)}</h1>
                <p style="margin:12px 0 0;${monoLabel(COLORS.bandMuted)}">${escapeHtml(subheading)}</p>
              </td>
            </tr></table>
          </td>
        </tr>
        ${cornerRow()}
        ${body}
        ${cornerRow()}
        <tr>
          <td class="px" style="padding:14px 24px;border-top:1px solid ${COLORS.line};white-space:nowrap;overflow:hidden;${monoLabel(COLORS.primary)}">${TICKER}</td>
        </tr>
        <tr>
          <td class="px" style="padding:18px 24px 22px;border-top:1px solid ${COLORS.line};font-family:${SANS};font-size:12px;line-height:1.55;letter-spacing:-0.01em;color:${COLORS.muted};">${footer}</td>
        </tr>
      </table>
      <p style="margin:18px 0 0;${monoLabel()}">&copy; Cortexcn ${new Date().getUTCFullYear()} &nbsp;/&nbsp; ${textLink("cortexcn.dev", SITE_URL)}</p>
    </td>
  </tr>
</table>
</body>
</html>`;
}

/** "September 27, 2026, 14:32 UTC", so both sides of the team read the same time. */
export function formatReceivedAt(date: Date) {
  const day = new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    dateStyle: "long",
  }).format(date);
  const time = new Intl.DateTimeFormat("en-GB", {
    timeZone: "UTC",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
  return `${day}, ${time} UTC`;
}
