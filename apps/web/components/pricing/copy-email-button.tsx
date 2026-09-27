"use client";

import { useEffect, useState } from "react";

import { CONTACT_EMAIL } from "@/lib/contact-details";

const RESET_MS = 2000;

/** Copies the studio address, for people who would rather email than fill in a form. */
export function CopyEmailButton() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) {
      return;
    }
    const timer = window.setTimeout(() => setCopied(false), RESET_MS);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
    } catch {
      // Clipboard access can be blocked; the address is in the footer too.
      window.location.href = `mailto:${CONTACT_EMAIL}`;
    }
  };

  return (
    <button
      className="text-primary underline decoration-1 decoration-dotted underline-offset-4 transition-colors hover:decoration-solid"
      onClick={copy}
      type="button"
    >
      {copied ? "email address copied" : "copy our email address"}
      <span aria-live="polite" className="sr-only">
        {copied ? `${CONTACT_EMAIL} copied to the clipboard` : ""}
      </span>
    </button>
  );
}
