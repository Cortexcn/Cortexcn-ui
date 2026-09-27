import { CONTACT_EMAIL } from "@/lib/contact-details";

import { senderConfirmationEmail } from "./emails/sender-confirmation";
import { teamNotificationEmail } from "./emails/team-notification";
import type { ContactInput } from "./validation";

const RESEND_URL = "https://api.resend.com/emails";
const TIMEOUT_MS = 10_000;
/** Resend's shared test sender; set CONTACT_FROM_EMAIL to an address on a verified domain. */
const DEFAULT_FROM = "Cortexcn <onboarding@resend.dev>";

export type SendResult = "sent" | "failed" | "not-configured";

interface EmailPayload {
  to: string;
  replyTo: string;
  subject: string;
  html: string;
  text: string;
}

/** One email through the Resend API. */
export async function sendEmail(payload: EmailPayload): Promise<SendResult> {
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
        to: [payload.to],
        reply_to: payload.replyTo,
        subject: payload.subject,
        html: payload.html,
        text: payload.text,
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!response.ok) {
      console.error(
        "Email was rejected",
        response.status,
        await response.text().catch(() => ""),
      );
      return "failed";
    }
    return "sent";
  } catch (error) {
    console.error("Email could not be sent", error);
    return "failed";
  }
}

/** The message itself, to the team inbox; replies go straight to the sender. */
export function sendContactEmail(input: ContactInput, receivedAt = new Date()) {
  return sendEmail({
    ...teamNotificationEmail(input, receivedAt),
    to: process.env.CONTACT_TO_EMAIL || CONTACT_EMAIL,
    replyTo: input.email,
  });
}

/** A short "we got it" note back to the sender; replies come to the team inbox. */
export function sendContactConfirmation(
  input: ContactInput,
  sentAt = new Date(),
) {
  return sendEmail({
    ...senderConfirmationEmail(input, sentAt),
    to: input.email,
    replyTo: CONTACT_EMAIL,
  });
}
