import { CONTACT_TURNSTILE_ACTION } from "./validation";

const SITEVERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const TIMEOUT_MS = 8000;
/** Cloudflare caps tokens at 2048 characters. */
const MAX_TOKEN_LENGTH = 2048;

export type TurnstileResult = "passed" | "failed" | "not-configured";

interface SiteverifyResponse {
  success?: boolean;
  action?: string;
}

/** Checks a Cloudflare Turnstile token on the server. Each token works once. */
export async function verifyTurnstile(
  token: string | null,
  ip: string | null,
): Promise<TurnstileResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    return "not-configured";
  }
  if (!token || token.length > MAX_TOKEN_LENGTH) {
    return "failed";
  }

  const body = new URLSearchParams({ secret, response: token });
  if (ip) {
    body.set("remoteip", ip);
  }

  try {
    const response = await fetch(SITEVERIFY_URL, {
      method: "POST",
      body,
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const data = (await response.json()) as SiteverifyResponse;
    const isContactToken =
      data.action === undefined || data.action === CONTACT_TURNSTILE_ACTION;
    return data.success === true && isContactToken ? "passed" : "failed";
  } catch (error) {
    // If Cloudflare cannot be reached, the message waits rather than skipping the check.
    console.error("Turnstile verification failed", error);
    return "failed";
  }
}
