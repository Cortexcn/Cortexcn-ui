"use client";

import { ArrowRightIcon, CheckIcon, MailIcon } from "lucide-react";
import { type FormEvent, useState } from "react";

import { site } from "@/config/site";

import { Reveal } from "./reveal";
import { SocialIcon } from "./social-icon";

type Status = "idle" | "sending" | "sent" | "error";

const FIELD =
  "w-full rounded-2xl border border-border bg-background px-4 py-3 text-base outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground";

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    // Without an endpoint, hand the message to the visitor's email app.
    if (!site.contact.formEndpoint) {
      const subject = encodeURIComponent(`Hello from ${data.get("name")}`);
      const body = encodeURIComponent(
        `${data.get("message")}\n\n${data.get("name")} <${data.get("email")}>`,
      );
      window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch(site.contact.formEndpoint, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (!response.ok) {
        throw new Error(`Form endpoint answered ${response.status}`);
      }
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="px-6 py-24 md:py-32" id="contact">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2 md:gap-16">
        <Reveal className="flex flex-col gap-8">
          <h2 className="font-semibold text-6xl tracking-tight md:text-8xl">
            {site.contact.heading}
          </h2>
          <p className="max-w-md text-lg text-muted-foreground">
            {site.contact.description}
          </p>
          <a
            className="inline-flex items-center gap-2 font-medium text-lg underline-offset-4 hover:underline"
            href={`mailto:${site.email}`}
          >
            <MailIcon className="size-5" />
            {site.email}
          </a>
          <ul className="flex items-center gap-2">
            {site.socials.map((social) => (
              <li key={social.label}>
                <a
                  aria-label={social.label}
                  className="flex size-11 items-center justify-center rounded-xl bg-muted transition-colors hover:bg-foreground hover:text-background"
                  href={social.href}
                  rel="noopener"
                  target="_blank"
                >
                  <SocialIcon className="size-4" name={social.icon} />
                </a>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          <form
            className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-6 md:p-8"
            onSubmit={handleSubmit}
          >
            <label className="flex flex-col gap-2">
              <span className="font-medium text-sm">Name</span>
              <input
                autoComplete="name"
                className={FIELD}
                name="name"
                placeholder="Your name"
                required
                type="text"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="font-medium text-sm">Email</span>
              <input
                autoComplete="email"
                className={FIELD}
                name="email"
                placeholder="you@example.com"
                required
                type="email"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="font-medium text-sm">Message</span>
              <textarea
                className={`${FIELD} min-h-36 resize-y`}
                name="message"
                placeholder="Tell me a little about your project"
                required
              />
            </label>
            <button
              className="mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-6 font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-60"
              disabled={status === "sending"}
              type="submit"
            >
              {status === "sent" ? (
                <>
                  Message sent <CheckIcon className="size-4" />
                </>
              ) : (
                <>
                  {status === "sending" ? "Sending..." : "Send message"}
                  <ArrowRightIcon className="size-4" />
                </>
              )}
            </button>
            {/* Stays mounted so screen readers announce the status; the negative margin cancels the gap while empty. */}
            <p aria-live="polite" className="text-sm empty:-mt-4">
              {status === "sent" ? "Thanks! I'll get back to you soon." : null}
              {status === "error" ? (
                <span className="text-red-600 dark:text-red-400">
                  Something went wrong. Email me at {site.email} instead.
                </span>
              ) : null}
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
