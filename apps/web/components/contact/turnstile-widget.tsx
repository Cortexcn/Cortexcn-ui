"use client";

import Script from "next/script";
import { useTheme } from "next-themes";
import { useEffect, useEffectEvent, useRef, useState } from "react";

import { CONTACT_TURNSTILE_ACTION } from "@/lib/contact/validation";

const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

interface TurnstileApi {
  render: (container: HTMLElement, options: Record<string, unknown>) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

/**
 * Cloudflare Turnstile, rendered explicitly so it can follow the site theme.
 * Bumping `resetKey` asks for a fresh token, since each one works only once.
 */
export function TurnstileWidget({
  siteKey,
  resetKey,
  onToken,
}: {
  siteKey: string;
  resetKey: number;
  onToken: (token: string | null) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "dark" ? "dark" : "light";
  const reportToken = useEffectEvent((token: string | null) => onToken(token));

  useEffect(() => {
    const container = containerRef.current;
    const turnstile = window.turnstile;
    if (!(scriptReady && container && turnstile)) {
      return;
    }

    const widgetId = turnstile.render(container, {
      sitekey: siteKey,
      action: CONTACT_TURNSTILE_ACTION,
      theme,
      size: "flexible",
      callback: (token: string) => reportToken(token),
      "expired-callback": () => reportToken(null),
      "timeout-callback": () => reportToken(null),
      "error-callback": () => reportToken(null),
    });
    widgetIdRef.current = widgetId;

    return () => {
      turnstile.remove(widgetId);
      widgetIdRef.current = null;
      reportToken(null);
    };
  }, [scriptReady, siteKey, theme]);

  useEffect(() => {
    const widgetId = widgetIdRef.current;
    if (resetKey > 0 && widgetId) {
      window.turnstile?.reset(widgetId);
    }
  }, [resetKey]);

  return (
    <>
      <Script
        onReady={() => setScriptReady(true)}
        src={SCRIPT_SRC}
        strategy="afterInteractive"
      />
      {/* Holds the widget's height so the button does not jump when it loads. */}
      <div className="min-h-[65px]" ref={containerRef} />
    </>
  );
}
