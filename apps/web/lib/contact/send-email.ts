import { CONTACT_EMAIL } from "@/lib/contact-details";
import { SITE_URL } from "@/lib/site-url";

import { type ContactInput, contactTopicLabel } from "./validation";

const RESEND_URL = "https://api.resend.com/emails";
const TIMEOUT_MS = 10_000;
/** Resend's shared test sender; set CONTACT_FROM_EMAIL to an address on a verified domain. */
const DEFAULT_FROM = "Cortexcn <onboarding@resend.dev>";

export type SendResult = "sent" | "failed" | "not-configured";

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};
const HTML_ESCAPE_RE = /[&<>"']/g;

function escapeHtml(value: string) {
  return value.replace(HTML_ESCAPE_RE, (char) => HTML_ESCAPES[char] ?? char);
}

function fullName(input: ContactInput) {
  return [input.firstName, input.lastName].filter(Boolean).join(" ");
}

function htmlBody(input: ContactInput) {
  const rows: [string, string][] = [
    ["From", `${fullName(input)} <${input.email}>`],
    ["Topic", contactTopicLabel(input.topic)],
  ];
  const cell = "padding: 4px 16px 4px 0; vertical-align: top;";
  return `<div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; color: #1a1a1a;">
  <h2 style="margin: 0 0 16px; font-size: 18px;">New message from the Cortexcn contact form</h2>
  <table style="border-collapse: collapse; margin-bottom: 16px; font-size: 14px;">
    ${rows
      .map(
        ([label, value]) =>
          `<tr><td style="${cell} color: #7a7a7a;">${label}</td><td style="${cell}">${escapeHtml(value)}</td></tr>`,
      )
      .join("\n    ")}
  </table>
  <div style="white-space: pre-wrap; padding: 16px; background: #f5f5f5; font-size: 14px; line-height: 1.5;">${escapeHtml(input.message)}</div>
  <p style="margin: 16px 0 0; color: #7a7a7a; font-size: 12px;">Reply to this email to answer ${escapeHtml(input.firstName)} directly. Sent from ${SITE_URL}/contact.</p>
</div>`;
}

function textBody(input: ContactInput) {
  return [
    "New message from the Cortexcn contact form",
    "",
    `From: ${fullName(input)} <${input.email}>`,
    `Topic: ${contactTopicLabel(input.topic)}`,
    "",
    input.message,
    "",
    `Reply to this email to answer ${input.firstName} directly. Sent from ${SITE_URL}/contact.`,
  ].join("\n");
}

/** Delivers a validated message to the team inbox through the Resend API. */
export async function sendContactEmail(
  input: ContactInput,
): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return "not-configured";
  }

  try {
    const response = await fetch(RESEND_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || DEFAULT_FROM,
        to: [process.env.CONTACT_TO_EMAIL || CONTACT_EMAIL],
        reply_to: input.email,
        subject: `${contactTopicLabel(input.topic)} from ${fullName(input)}`,
        html: htmlBody(input),
        text: textBody(input),
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!response.ok) {
      console.error(
        "Contact email was rejected",
        response.status,
        await response.text().catch(() => ""),
      );
      return "failed";
    }
    return "sent";
  } catch (error) {
    console.error("Contact email could not be sent", error);
    return "failed";
  }
}
