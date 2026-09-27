import { SITE_URL } from "@/lib/site-url";

import { type ContactInput, contactTopicLabel } from "../validation";
import {
  button,
  COLORS,
  detailRows,
  emailDocument,
  escapeHtml,
  formatReceivedAt,
  MONO,
  monoLabel,
  multilineHtml,
  SANS,
  textLink,
} from "./layout";

const PREHEADER_LENGTH = 110;
const WHITESPACE_RUN_RE = /\s+/g;

function fullName(input: ContactInput) {
  return [input.firstName, input.lastName].filter(Boolean).join(" ");
}

/** A mailto link that opens a reply with the subject already filled in. */
function replyHref(email: string, subject: string) {
  const at = email.lastIndexOf("@");
  const address = `${encodeURIComponent(email.slice(0, at))}@${email.slice(at + 1)}`;
  return `mailto:${address}?subject=${encodeURIComponent(`Re: ${subject}`)}`;
}

/** What lands in the team inbox when someone sends the contact form. */
export function teamNotificationEmail(input: ContactInput, receivedAt: Date) {
  const name = fullName(input);
  const topic = contactTopicLabel(input.topic);
  const subject = `${topic} from ${name}`;
  const received = formatReceivedAt(receivedAt);
  const preheader = input.message
    .replace(WHITESPACE_RUN_RE, " ")
    .slice(0, PREHEADER_LENGTH);

  const body = `<tr>
  <td class="px" style="padding:20px 24px 8px;">
    ${detailRows([
      ["From", escapeHtml(name)],
      ["Email", textLink(input.email, replyHref(input.email, subject))],
      [
        "Topic",
        `<span style="display:inline-block;width:7px;height:7px;margin-right:8px;background:${COLORS.primary};vertical-align:middle;"></span><span style="vertical-align:middle;">${escapeHtml(topic)}</span>`,
      ],
      ["Received", escapeHtml(received)],
    ])}
  </td>
</tr>
<tr>
  <td class="px" style="padding:28px 24px 0;">
    <p style="margin:0 0 10px;${monoLabel()}">Message</p>
    <div style="padding:18px 20px;background:${COLORS.fill};border-left:2px solid ${COLORS.primary};font-family:${SANS};font-size:15px;line-height:1.6;letter-spacing:-0.01em;color:${COLORS.text};">${multilineHtml(input.message)}</div>
  </td>
</tr>
<tr>
  <td class="px" style="padding:28px 24px 12px;">
    ${button(`Reply to ${input.firstName}`, replyHref(input.email, subject))}
    <p style="margin:14px 0 0;font-family:${SANS};font-size:13px;line-height:1.5;color:${COLORS.muted};">Or hit reply. It goes straight to <span style="font-family:${MONO};font-size:12px;color:${COLORS.text};">${escapeHtml(input.email)}</span>.</p>
  </td>
</tr>`;

  const footer = `Sent by the contact form on ${textLink("www.cortexcn.dev/contact", `${SITE_URL}/contact`)}. Hit reply to answer ${escapeHtml(input.firstName)} directly.`;

  const html = emailDocument({
    title: subject,
    preheader,
    eyebrow: "Contact form",
    label: "New message",
    heading: subject,
    subheading: received,
    body,
    footer,
  });

  const text = [
    "New message from the Cortexcn contact form",
    "",
    `From: ${name}`,
    `Email: ${input.email}`,
    `Topic: ${topic}`,
    `Received: ${received}`,
    "",
    input.message,
    "",
    `Reply to this email to answer ${input.firstName} directly.`,
  ].join("\n");

  return { subject, html, text };
}
