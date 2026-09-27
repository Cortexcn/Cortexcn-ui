"use client";

import {
  type FormEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

import { ActionButton } from "@/components/landing/kit";
import { trackEvent } from "@/lib/analytics/track-client";
import { readContactPrefill } from "@/lib/contact/prefill";
import {
  CONTACT_FIELDS,
  CONTACT_LIMITS,
  CONTACT_TOPICS,
  type ContactErrors,
  type ContactField,
  contactFieldError,
} from "@/lib/contact/validation";
import { CONTACT_EMAIL } from "@/lib/contact-details";
import { cn } from "@/lib/utils";

import { TurnstileWidget } from "./turnstile-widget";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

type Values = Record<ContactField, string>;

const EMPTY_VALUES: Values = {
  firstName: "",
  lastName: "",
  email: "",
  topic: "",
  message: "",
};

type Status =
  | { state: "idle" }
  | { state: "sending" }
  | { state: "sent"; firstName: string; email: string }
  | { state: "failed"; message: string };

interface ContactResponse {
  ok?: boolean;
  error?: string;
  fieldErrors?: ContactErrors;
}

const labelClassName =
  "font-medium text-body text-xs uppercase leading-[1.3] tracking-[-0.02em]";

const controlClassName =
  "w-full border border-transparent bg-muted px-3 text-base text-foreground tracking-[-0.05em] outline-none transition-colors placeholder:text-faint hover:border-border focus-visible:border-primary aria-invalid:border-destructive";

function collectErrors(values: Values) {
  const errors: ContactErrors = {};
  for (const field of CONTACT_FIELDS) {
    const error = contactFieldError(field, values[field]);
    if (error) {
      errors[field] = error;
    }
  }
  return errors;
}

function fieldId(field: ContactField) {
  return `contact-${field}`;
}

function errorId(field: ContactField) {
  return `contact-${field}-error`;
}

function FieldError({
  field,
  message,
}: {
  field: ContactField;
  message?: string;
}) {
  if (!message) {
    return null;
  }
  return (
    <p
      className="text-destructive text-sm leading-[1.3] tracking-[-0.03em]"
      id={errorId(field)}
    >
      {message}
    </p>
  );
}

function FieldLabel({
  field,
  children,
  optional = false,
}: {
  field: ContactField;
  children: ReactNode;
  optional?: boolean;
}) {
  return (
    <label className={labelClassName} htmlFor={fieldId(field)}>
      {children}
      {optional ? (
        <span className="ml-1 text-label-weak normal-case">(optional)</span>
      ) : null}
    </label>
  );
}

export function ContactForm() {
  const [values, setValues] = useState<Values>(EMPTY_VALUES);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const [token, setToken] = useState<string | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const controlRefs = useRef<
    Partial<Record<ContactField, HTMLInputElement | HTMLTextAreaElement | null>>
  >({});
  const honeypotRef = useRef<HTMLInputElement>(null);
  const sentRef = useRef<HTMLElement>(null);

  const isSent = status.state === "sent";
  const isSending = status.state === "sending";

  useEffect(() => {
    // Links from the pricing page carry a topic and a draft message. Read after
    // hydration, so the server and the first client render match.
    const prefill = readContactPrefill(window.location.search);
    if (prefill.topic || prefill.message) {
      setValues((current) => ({
        ...current,
        topic: prefill.topic ?? current.topic,
        message: prefill.message ?? current.message,
      }));
    }
  }, []);

  useEffect(() => {
    // The form is swapped out, so move focus to the confirmation that replaces it.
    if (isSent) {
      sentRef.current?.focus();
    }
  }, [isSent]);

  const checkField = (field: ContactField, value: string) => {
    setErrors((current) => ({
      ...current,
      [field]: contactFieldError(field, value) ?? undefined,
    }));
  };

  const updateField = (field: ContactField, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    // Recheck as they type only once an error has shown, so it clears as soon as it is fixed.
    if (submitted || errors[field] || field === "topic") {
      checkField(field, value);
    }
  };

  const handleBlur = (field: ContactField) => {
    // An empty field someone tabbed past is not an error until they try to send.
    if (submitted || values[field].trim() !== "") {
      checkField(field, values[field]);
    }
  };

  const focusField = (field: ContactField) => {
    controlRefs.current[field]?.focus();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSending) {
      return;
    }

    setSubmitted(true);
    const nextErrors = collectErrors(values);
    setErrors(nextErrors);
    const firstInvalid = CONTACT_FIELDS.find((field) => nextErrors[field]);
    if (firstInvalid) {
      setStatus({ state: "failed", message: "Check the highlighted fields." });
      focusField(firstInvalid);
      return;
    }
    if (TURNSTILE_SITE_KEY && !token) {
      setStatus({
        state: "failed",
        message: "The security check is still running. Send again in a moment.",
      });
      return;
    }

    setStatus({ state: "sending" });
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          website: honeypotRef.current?.value ?? "",
          turnstileToken: token,
        }),
      });
      const data = (await response.json().catch(() => ({}))) as ContactResponse;

      if (response.ok && data.ok) {
        trackEvent("contact_form_sent", { topic: values.topic });
        setStatus({
          state: "sent",
          firstName: values.firstName.trim(),
          email: values.email.trim(),
        });
        setValues(EMPTY_VALUES);
        setErrors({});
        setSubmitted(false);
        return;
      }

      const fieldErrors = data.fieldErrors ?? {};
      setErrors((current) => ({ ...current, ...fieldErrors }));
      const firstServerError = CONTACT_FIELDS.find(
        (field) => fieldErrors[field],
      );
      if (firstServerError) {
        focusField(firstServerError);
      }
      setStatus({
        state: "failed",
        message: data.error ?? "Something went wrong. Try again.",
      });
    } catch {
      setStatus({
        state: "failed",
        message: `Could not reach the server. Check your connection, or write to ${CONTACT_EMAIL}.`,
      });
    } finally {
      // Turnstile tokens work once, so every attempt asks for a fresh one.
      setToken(null);
      setResetKey((key) => key + 1);
    }
  };

  if (status.state === "sent") {
    return (
      // Focus lands here, so screen readers read the title and the message.
      <section
        aria-describedby="contact-sent-message"
        aria-labelledby="contact-sent-title"
        className="flex h-full min-h-80 flex-col items-start justify-center gap-6 outline-none"
        ref={sentRef}
        tabIndex={-1}
      >
        <h2
          className="bg-muted px-1 py-0.5 font-medium font-mono text-body text-xs uppercase leading-[1.3] tracking-[-0.04em]"
          id="contact-sent-title"
        >
          Message sent
        </h2>
        <p
          className="max-w-md text-2xl leading-[1.3] tracking-[-0.05em]"
          id="contact-sent-message"
        >
          Thanks, {status.firstName}. Your message is in our inbox, and the
          reply will go to {status.email}.
        </p>
        <ActionButton
          label="Send another message"
          onClick={() => setStatus({ state: "idle" })}
        />
      </section>
    );
  }

  const messageLength = values.message.length;
  const describedBy = (field: ContactField) =>
    errors[field] ? errorId(field) : undefined;

  return (
    <form className="flex flex-col gap-6" noValidate onSubmit={handleSubmit}>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <FieldLabel field="firstName">First name</FieldLabel>
          <input
            aria-describedby={describedBy("firstName")}
            aria-invalid={errors.firstName ? true : undefined}
            aria-required="true"
            autoCapitalize="words"
            autoComplete="given-name"
            className={cn(controlClassName, "h-12")}
            id={fieldId("firstName")}
            maxLength={CONTACT_LIMITS.nameMax}
            name="firstName"
            onBlur={() => handleBlur("firstName")}
            onChange={(event) => updateField("firstName", event.target.value)}
            placeholder="Jane"
            ref={(element) => {
              controlRefs.current.firstName = element;
            }}
            type="text"
            value={values.firstName}
          />
          <FieldError field="firstName" message={errors.firstName} />
        </div>

        <div className="flex flex-col gap-2">
          <FieldLabel field="lastName" optional>
            Last name
          </FieldLabel>
          <input
            aria-describedby={describedBy("lastName")}
            aria-invalid={errors.lastName ? true : undefined}
            autoCapitalize="words"
            autoComplete="family-name"
            className={cn(controlClassName, "h-12")}
            id={fieldId("lastName")}
            maxLength={CONTACT_LIMITS.nameMax}
            name="lastName"
            onBlur={() => handleBlur("lastName")}
            onChange={(event) => updateField("lastName", event.target.value)}
            placeholder="Doe"
            ref={(element) => {
              controlRefs.current.lastName = element;
            }}
            type="text"
            value={values.lastName}
          />
          <FieldError field="lastName" message={errors.lastName} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <FieldLabel field="email">Email address</FieldLabel>
        <input
          aria-describedby={describedBy("email")}
          aria-invalid={errors.email ? true : undefined}
          aria-required="true"
          autoComplete="email"
          className={cn(controlClassName, "h-12")}
          id={fieldId("email")}
          inputMode="email"
          maxLength={CONTACT_LIMITS.emailMax}
          name="email"
          onBlur={() => handleBlur("email")}
          onChange={(event) => updateField("email", event.target.value)}
          placeholder="jane@company.com"
          ref={(element) => {
            controlRefs.current.email = element;
          }}
          spellCheck={false}
          type="email"
          value={values.email}
        />
        <FieldError field="email" message={errors.email} />
      </div>

      <fieldset
        aria-describedby={describedBy("topic")}
        className="flex flex-col gap-2"
      >
        <legend className={cn(labelClassName, "mb-2")}>What is it about</legend>
        <div className="flex flex-wrap gap-2">
          {CONTACT_TOPICS.map((topic, index) => {
            const checked = values.topic === topic.value;
            return (
              <label
                className={cn(
                  "inline-flex h-9 cursor-pointer items-center border px-3 font-medium font-mono text-sm uppercase tracking-[-0.04em] transition-colors has-focus-visible:border-primary has-focus-visible:ring-3 has-focus-visible:ring-ring/30",
                  checked
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-background text-foreground hover:border-primary hover:bg-primary hover:text-primary-foreground",
                  errors.topic && !checked && "border-destructive",
                )}
                key={topic.value}
              >
                <input
                  checked={checked}
                  className="sr-only"
                  name="topic"
                  onChange={() => updateField("topic", topic.value)}
                  ref={
                    index === 0
                      ? (element) => {
                          controlRefs.current.topic = element;
                        }
                      : undefined
                  }
                  type="radio"
                  value={topic.value}
                />
                {topic.label}
              </label>
            );
          })}
        </div>
        <FieldError field="topic" message={errors.topic} />
      </fieldset>

      <div className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between gap-4">
          <FieldLabel field="message">Message</FieldLabel>
          <span
            className={cn(
              "font-mono text-xs tabular-nums tracking-[-0.04em]",
              messageLength > CONTACT_LIMITS.messageMax
                ? "text-destructive"
                : "text-label-weak",
            )}
          >
            {messageLength.toLocaleString("en-US")} /{" "}
            {CONTACT_LIMITS.messageMax.toLocaleString("en-US")}
          </span>
        </div>
        <textarea
          aria-describedby={describedBy("message")}
          aria-invalid={errors.message ? true : undefined}
          aria-required="true"
          className={cn(controlClassName, "min-h-40 resize-y py-3")}
          id={fieldId("message")}
          name="message"
          onBlur={() => handleBlur("message")}
          onChange={(event) => updateField("message", event.target.value)}
          placeholder="What can we help with? Links, versions, and steps to reproduce make it faster to answer."
          ref={(element) => {
            controlRefs.current.message = element;
          }}
          value={values.message}
        />
        <FieldError field="message" message={errors.message} />
      </div>

      {/* Hidden from people; a bot that fills in every field gives itself away here. */}
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] size-px overflow-hidden"
      >
        <label htmlFor="contact-website">Website</label>
        <input
          autoComplete="off"
          id="contact-website"
          name="website"
          ref={honeypotRef}
          tabIndex={-1}
          type="text"
        />
      </div>

      {TURNSTILE_SITE_KEY ? (
        <TurnstileWidget
          onToken={setToken}
          resetKey={resetKey}
          siteKey={TURNSTILE_SITE_KEY}
        />
      ) : null}

      <div className="flex flex-col gap-3">
        <ActionButton
          block
          disabled={isSending}
          label={isSending ? "Sending" : "Submit"}
          type="submit"
        />
        <p
          aria-live="polite"
          className={cn(
            "text-sm leading-[1.3] tracking-[-0.03em]",
            status.state === "failed"
              ? "text-destructive"
              : "text-muted-foreground",
          )}
        >
          {status.state === "failed"
            ? status.message
            : "We only use your details to reply to you."}
        </p>
      </div>
    </form>
  );
}
