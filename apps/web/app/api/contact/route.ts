import { after, NextResponse } from "next/server";

import { emailDomainAcceptsMail } from "@/lib/contact/email-domain";
import { takeRateLimit } from "@/lib/contact/rate-limit";
import {
  sendContactConfirmation,
  sendContactEmail,
} from "@/lib/contact/send-email";
import { verifyTurnstile } from "@/lib/contact/turnstile";
import { validateContact } from "@/lib/contact/validation";
import { CONTACT_EMAIL } from "@/lib/contact-details";

const MAX_BODY_LENGTH = 16 * 1024;
const NOT_SET_UP = `The contact form is not set up yet. Write to ${CONTACT_EMAIL} instead.`;

function reply(body: object, status: number, headers?: HeadersInit) {
  return NextResponse.json(body, { status, headers });
}

/** Vercel sets these from the connecting address, so they are safe to key on. */
function clientIp(request: Request) {
  return (
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    null
  );
}

/** Browsers always send Origin on a POST, so a missing or foreign one is not our form. */
function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!(origin && host)) {
    return false;
  }
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return reply(
      { error: "This form only accepts messages from cortexcn.dev." },
      403,
    );
  }

  const ip = clientIp(request);
  const limit = takeRateLimit(ip ?? "unknown");
  if (limit.limited) {
    return reply(
      {
        error:
          "Too many messages from this network. Try again in a few minutes.",
      },
      429,
      { "Retry-After": String(limit.retryAfterSeconds) },
    );
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_LENGTH) {
    return reply({ error: "That message is too large to send." }, 413);
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return reply({ error: "The request could not be read." }, 400);
  }
  const fields =
    typeof body === "object" && body !== null
      ? (body as Record<string, unknown>)
      : {};

  // The hidden field is only ever filled in by bots, so answer as if it worked.
  if (typeof fields.website === "string" && fields.website.trim() !== "") {
    return reply({ ok: true }, 200);
  }

  const result = validateContact(fields);
  if (!result.ok) {
    return reply(
      { error: "Check the highlighted fields.", fieldErrors: result.errors },
      400,
    );
  }

  // Bots are stopped here, before the DNS lookup below costs anything.
  const token =
    typeof fields.turnstileToken === "string" ? fields.turnstileToken : null;
  const verification = await verifyTurnstile(token, ip);
  if (verification === "failed") {
    return reply({ error: "The security check did not pass. Try again." }, 400);
  }
  // Local development may run without keys; production never skips the check.
  if (
    verification === "not-configured" &&
    process.env.NODE_ENV === "production"
  ) {
    return reply({ error: NOT_SET_UP }, 503);
  }

  const domain = result.data.email.slice(result.data.email.indexOf("@") + 1);
  if (!(await emailDomainAcceptsMail(domain))) {
    return reply(
      {
        error: "Check the highlighted fields.",
        fieldErrors: {
          email: "This email domain does not accept mail. Check it for typos.",
        },
      },
      400,
    );
  }

  const sent = await sendContactEmail(result.data);
  if (sent === "not-configured") {
    return reply({ error: NOT_SET_UP }, 503);
  }
  if (sent === "failed") {
    return reply(
      {
        error: `The message could not be sent. Try again, or write to ${CONTACT_EMAIL}.`,
      },
      502,
    );
  }

  // The confirmation is a courtesy: it goes out after the response and never
  // fails a message that already reached the team.
  after(() => sendContactConfirmation(result.data));
  return reply({ ok: true }, 200);
}
