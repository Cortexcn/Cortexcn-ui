import { resolve4, resolve6, resolveMx } from "node:dns/promises";

const LOOKUP_TIMEOUT_MS = 3000;
const CACHE_TTL_MS = 60 * 60 * 1000;
const CACHE_MAX_ENTRIES = 1000;
/** Answers that mean the name has no records, as opposed to a DNS failure. */
const NO_RECORD_CODES = new Set(["ENOTFOUND", "ENODATA", "NXDOMAIN"]);

const cache = new Map<string, { acceptsMail: boolean; expiresAt: number }>();

function withTimeout<T>(promise: Promise<T>) {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error("DNS lookup timed out")),
      LOOKUP_TIMEOUT_MS,
    );
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error: unknown) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

function isNoRecordError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string" &&
    NO_RECORD_CODES.has(error.code)
  );
}

async function hasAddressRecord(domain: string) {
  const results = await Promise.allSettled([
    withTimeout(resolve4(domain)),
    withTimeout(resolve6(domain)),
  ]);
  if (
    results.some(
      (result) => result.status === "fulfilled" && result.value.length > 0,
    )
  ) {
    return true;
  }
  // Only a clean "no such records" answer counts against the address.
  return !results.every(
    (result) => result.status === "rejected" && isNoRecordError(result.reason),
  );
}

async function lookUp(domain: string) {
  try {
    const records = await withTimeout(resolveMx(domain));
    // A lone "." exchange is a null MX (RFC 7505): the domain takes no mail.
    if (records.some((record) => record.exchange && record.exchange !== ".")) {
      return true;
    }
    if (records.length > 0) {
      return false;
    }
  } catch (error) {
    if (!isNoRecordError(error)) {
      // DNS trouble on our side should not turn a real person away.
      return true;
    }
  }
  // Without MX records, mail goes to the domain's own address (RFC 5321).
  return await hasAddressRecord(domain);
}

/**
 * Whether a domain can receive email, so a typo such as "gmial.con" is caught
 * before the reply bounces. Results are cached per server instance.
 */
export async function emailDomainAcceptsMail(domain: string) {
  const now = Date.now();
  const cached = cache.get(domain);
  if (cached && cached.expiresAt > now) {
    return cached.acceptsMail;
  }

  const acceptsMail = await lookUp(domain);
  if (cache.size >= CACHE_MAX_ENTRIES) {
    cache.clear();
  }
  cache.set(domain, { acceptsMail, expiresAt: now + CACHE_TTL_MS });
  return acceptsMail;
}
