/**
 * Contact form rules, shared by the form (instant feedback) and the API route
 * (the check that counts). Pure functions only, so both sides can import them.
 */

/** Sent with the Turnstile widget and checked on the server, so a token from another form fails. */
export const CONTACT_TURNSTILE_ACTION = "contact";

export const CONTACT_TOPICS = [
  { value: "question", label: "Question" },
  { value: "support", label: "Support" },
  { value: "bug", label: "Bug report" },
  { value: "custom-work", label: "Custom work" },
  { value: "partnership", label: "Partnership" },
  { value: "other", label: "Other" },
] as const;

export type ContactTopic = (typeof CONTACT_TOPICS)[number]["value"];

export const CONTACT_LIMITS = {
  nameMax: 50,
  emailMax: 254,
  emailLocalMax: 64,
  messageMin: 20,
  messageMax: 3000,
  messageMinWords: 4,
  messageMaxLinks: 3,
} as const;

/** Every field the form sends, in the order the form shows them. */
export const CONTACT_FIELDS = [
  "firstName",
  "lastName",
  "email",
  "topic",
  "message",
] as const;

export type ContactField = (typeof CONTACT_FIELDS)[number];

export interface ContactInput {
  firstName: string;
  lastName: string;
  email: string;
  topic: ContactTopic;
  message: string;
}

export type ContactErrors = Partial<Record<ContactField, string>>;

interface ContactValid {
  ok: true;
  data: ContactInput;
}

interface ContactInvalid {
  ok: false;
  errors: ContactErrors;
}

export type ContactValidation = ContactValid | ContactInvalid;

/** Throwaway inbox providers. People who write in from these rarely read the reply. */
const DISPOSABLE_DOMAINS = new Set([
  "10minutemail.com",
  "burnermail.io",
  "discard.email",
  "dispostable.com",
  "emailondeck.com",
  "fakeinbox.com",
  "getnada.com",
  "guerrillamail.com",
  "guerrillamail.net",
  "maildrop.cc",
  "mailinator.com",
  "mailnesia.com",
  "mintemail.com",
  "mohmal.com",
  "sharklasers.com",
  "spamgourmet.com",
  "temp-mail.org",
  "tempmail.com",
  "tempmailo.com",
  "throwawaymail.com",
  "trashmail.com",
  "yopmail.com",
]);

const LINE_BREAK_RE = /\r\n?/g;
const WHITESPACE_RUN_RE = /\s+/g;
const TRAILING_SPACE_RE = /[ \t]+$/gm;
const EXTRA_BLANK_LINES_RE = /\n{3,}/g;

const NAME_RE = /^\p{L}[\p{L}\p{M}' ’.-]*$/u;
const EMAIL_LOCAL_RE = /^[\p{L}\p{N}!#$%&'*+/=?^_`{|}~.-]+$/u;
const DOMAIN_LABEL_RE = /^[\p{L}\p{N}](?:[\p{L}\p{N}-]*[\p{L}\p{N}])?$/u;
const TLD_RE = /^(?:\p{L}{2,}|xn--[a-z0-9-]+)$/iu;

const URL_RE = /\b(?:https?:\/\/|www\.)\S+/giu;
const WORD_RE = /[\p{L}\p{M}\p{N}'’-]+/gu;
const HAS_LETTER_RE = /\p{L}/u;
const LETTER_RE = /[\p{L}\p{M}]/gu;
// Letters only, so code indentation, separators, and big numbers still pass.
const REPEATED_LETTER_RE = /(\p{L})\1{7,}/u;
/** Scripts written without spaces, where word counts mean nothing. */
const UNSPACED_SCRIPT_RE =
  /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Thai}\p{Script=Lao}\p{Script=Khmer}\p{Script=Myanmar}]/u;

const MIN_LETTER_SHARE = 0.5;
const MAX_WORD_LENGTH = 45;
const MIN_UNIQUE_WORD_SHARE = 0.35;
const UNIQUE_CHECK_MIN_WORDS = 8;

const INVALID_EMAIL = "Enter a valid email address, like jane@company.com.";
const RANDOM_TEXT =
  "This looks like random text. Tell us what you need in a sentence or two.";

function isHiddenCodePoint(code: number) {
  const isControl = code < 32 || (code >= 127 && code < 160);
  // Zero-width space, direction marks and overrides, word joiners, and the BOM.
  // Zero-width (non-)joiners stay, since Indic scripts and emoji need them.
  const isInvisible =
    code === 0x20_0b ||
    code === 0x20_0e ||
    code === 0x20_0f ||
    (code >= 0x20_2a && code <= 0x20_2e) ||
    (code >= 0x20_60 && code <= 0x20_6f) ||
    code === 0xfe_ff;
  return isControl || isInvisible;
}

/** Drops control and invisible characters, a common way to sneak spam past filters. */
function stripHidden(value: string, keepLineBreaks: boolean) {
  let result = "";
  for (const char of value) {
    const code = char.codePointAt(0) ?? 0;
    const isKeptBreak = keepLineBreaks && (char === "\n" || char === "\t");
    if (isKeptBreak || !isHiddenCodePoint(code)) {
      result += char;
    }
  }
  return result;
}

function normalizeName(value: string) {
  // Whitespace becomes a plain space first, so a pasted line break still splits words.
  return stripHidden(value.replace(WHITESPACE_RUN_RE, " "), false)
    .normalize("NFC")
    .replace(WHITESPACE_RUN_RE, " ")
    .trim();
}

function normalizeEmail(value: string) {
  const email = stripHidden(value, false).trim();
  const at = email.lastIndexOf("@");
  // Mailbox names can be case-sensitive; domains never are.
  return at === -1
    ? email
    : `${email.slice(0, at)}@${email.slice(at + 1).toLowerCase()}`;
}

function normalizeMessage(value: string) {
  return stripHidden(value.replace(LINE_BREAK_RE, "\n"), true)
    .normalize("NFC")
    .replace(TRAILING_SPACE_RE, "")
    .replace(EXTRA_BLANK_LINES_RE, "\n\n")
    .trim();
}

/** The value as the API route will see it: trimmed and free of hidden characters. */
export function normalizeContactField(field: ContactField, value: string) {
  switch (field) {
    case "firstName":
    case "lastName":
      return normalizeName(value);
    case "email":
      return normalizeEmail(value);
    case "message":
      return normalizeMessage(value);
    default:
      return value.trim();
  }
}

function nameError(value: string, required: boolean) {
  if (!value) {
    return required ? "Enter your first name." : null;
  }
  if (value.length > CONTACT_LIMITS.nameMax) {
    return `Keep it under ${CONTACT_LIMITS.nameMax} characters.`;
  }
  if (!NAME_RE.test(value)) {
    return "Use letters only. Spaces, hyphens, and apostrophes are fine.";
  }
  return null;
}

function isValidDomain(domain: string) {
  const labels = domain.split(".");
  const tld = labels.at(-1) ?? "";
  return (
    labels.length >= 2 &&
    labels.every(
      (label) => label.length <= 63 && DOMAIN_LABEL_RE.test(label),
    ) &&
    TLD_RE.test(tld)
  );
}

function isDisposableDomain(domain: string) {
  for (const disposable of DISPOSABLE_DOMAINS) {
    if (domain === disposable || domain.endsWith(`.${disposable}`)) {
      return true;
    }
  }
  return false;
}

function emailError(value: string) {
  if (!value) {
    return "Enter your email address.";
  }
  if (value.length > CONTACT_LIMITS.emailMax) {
    return "That email address is too long.";
  }
  const at = value.indexOf("@");
  if (at < 1 || at !== value.lastIndexOf("@")) {
    return INVALID_EMAIL;
  }
  const local = value.slice(0, at);
  const domain = value.slice(at + 1);
  const isValidLocal =
    local.length <= CONTACT_LIMITS.emailLocalMax &&
    EMAIL_LOCAL_RE.test(local) &&
    !local.startsWith(".") &&
    !local.endsWith(".") &&
    !local.includes("..");
  if (!(isValidLocal && isValidDomain(domain))) {
    return INVALID_EMAIL;
  }
  if (isDisposableDomain(domain)) {
    return "Use an email address you check. Temporary inboxes are not accepted.";
  }
  return null;
}

function topicError(value: string) {
  return CONTACT_TOPICS.some((topic) => topic.value === value)
    ? null
    : "Choose what your message is about.";
}

/**
 * Length and link limits, plus a few cheap signals of keyboard mashing or
 * copy-paste spam. Code snippets and every language still get through.
 */
function messageError(value: string) {
  if (!value) {
    return "Write your message.";
  }
  if (value.length < CONTACT_LIMITS.messageMin) {
    return `Add a little more detail. At least ${CONTACT_LIMITS.messageMin} characters.`;
  }
  if (value.length > CONTACT_LIMITS.messageMax) {
    return `Keep it under ${CONTACT_LIMITS.messageMax.toLocaleString("en-US")} characters.`;
  }
  const links = value.match(URL_RE) ?? [];
  if (links.length > CONTACT_LIMITS.messageMaxLinks) {
    return `Keep links to ${CONTACT_LIMITS.messageMaxLinks} or fewer.`;
  }
  if (REPEATED_LETTER_RE.test(value)) {
    return "Remove the repeated letters.";
  }

  const text = value.replace(URL_RE, " ");
  const visible = text.replace(WHITESPACE_RUN_RE, "");
  const letterCount = visible.match(LETTER_RE)?.length ?? 0;
  if (letterCount / Math.max(visible.length, 1) < MIN_LETTER_SHARE) {
    return RANDOM_TEXT;
  }
  if (UNSPACED_SCRIPT_RE.test(text)) {
    return null;
  }

  const words = (text.match(WORD_RE) ?? []).filter((word) =>
    HAS_LETTER_RE.test(word),
  );
  if (words.length < CONTACT_LIMITS.messageMinWords) {
    return "Write a few more words so we know how to help.";
  }
  if (words.some((word) => word.length > MAX_WORD_LENGTH)) {
    return RANDOM_TEXT;
  }
  const uniqueWords = new Set(words.map((word) => word.toLocaleLowerCase()));
  if (
    words.length >= UNIQUE_CHECK_MIN_WORDS &&
    uniqueWords.size / words.length < MIN_UNIQUE_WORD_SHARE
  ) {
    return RANDOM_TEXT;
  }
  return null;
}

/** The error for one field, or null when it passes. Normalizes first. */
export function contactFieldError(field: ContactField, value: string) {
  const normalized = normalizeContactField(field, value);
  switch (field) {
    case "firstName":
      return nameError(normalized, true);
    case "lastName":
      return nameError(normalized, false);
    case "email":
      return emailError(normalized);
    case "topic":
      return topicError(normalized);
    case "message":
      return messageError(normalized);
    default:
      return null;
  }
}

/** Checks a whole submission. Anything that is not a string counts as empty. */
export function validateContact(input: unknown): ContactValidation {
  const source =
    typeof input === "object" && input !== null
      ? (input as Record<string, unknown>)
      : {};
  const values = {} as Record<ContactField, string>;
  const errors: ContactErrors = {};

  for (const field of CONTACT_FIELDS) {
    const raw = source[field];
    values[field] = normalizeContactField(
      field,
      typeof raw === "string" ? raw : "",
    );
    const error = contactFieldError(field, values[field]);
    if (error) {
      errors[field] = error;
    }
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }
  return {
    ok: true,
    data: { ...values, topic: values.topic as ContactTopic },
  };
}

export function contactTopicLabel(topic: ContactTopic) {
  return (
    CONTACT_TOPICS.find((option) => option.value === topic)?.label ?? topic
  );
}
