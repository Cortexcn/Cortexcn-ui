"use client";

import Image from "next/image";
import { type ReactNode, useEffect, useState } from "react";

import { PrimaryLink, SecondaryButton } from "@/components/ui-home/primitives";
import { authClient, isAuthEnabled } from "@/lib/auth-client";

/** Google's "G", in its four brand colors, as Google asks for sign-in buttons. */
function GoogleIcon() {
  return (
    <svg aria-hidden="true" className="size-5 shrink-0" viewBox="0 0 24 24">
      <path
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
        fill="#4285F4"
      />
      <path
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
        fill="#34A853"
      />
      <path
        d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"
        fill="#FBBC05"
      />
      <path
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
        fill="#EA4335"
      />
    </svg>
  );
}

/** Google only sends people back to the production and localhost addresses. */
function useIsPreviewHost() {
  const [isPreview, setIsPreview] = useState(false);
  useEffect(() => {
    setIsPreview(window.location.hostname.endsWith(".vercel.app"));
  }, []);
  return isPreview;
}

/** Two-tone Sentient headline, like the library home's hero. */
function Heading({
  lead,
  rest,
  body,
}: {
  lead: string;
  rest: string;
  body: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-balance font-light font-sentient text-[40px] leading-[1.05] tracking-[-0.05em] md:text-5xl">
        {lead} <span className="text-body">{rest}</span>
      </h1>
      <p className="max-w-[26rem] text-pretty text-body text-lg leading-[1.4]">
        {body}
      </p>
    </div>
  );
}

const columnClassName = "flex w-full max-w-md flex-col gap-9";

export function SignInPanel({
  next,
  failed,
}: {
  /** A path on this site to return to after signing in. */
  next: string;
  /** Google or Better Auth sent the visitor back with an error. */
  failed: boolean;
}) {
  const { data: session, isPending } = authClient.useSession();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(
    failed ? "Sign-in did not finish. Try again." : null,
  );
  const isPreview = useIsPreviewHost();

  if (!isAuthEnabled) {
    return (
      <div className={columnClassName}>
        <Heading
          body="This copy of the site has no sign-in set up. Everything else works without an account."
          lead="Sign-in"
          rest="is off here."
        />
        <PrimaryLink className="self-start" href="/">
          Back to the library
        </PrimaryLink>
      </div>
    );
  }

  if (isPending) {
    return (
      <div aria-busy="true" className={columnClassName}>
        <span className="sr-only">Checking your session</span>
        <div className="flex flex-col gap-4">
          <div className="h-11 w-4/5 animate-pulse rounded-md bg-muted motion-reduce:animate-none" />
          <div className="h-5 w-full animate-pulse rounded-md bg-muted motion-reduce:animate-none" />
        </div>
        <div className="h-11 w-full animate-pulse rounded-[10px] bg-muted motion-reduce:animate-none" />
      </div>
    );
  }

  if (session) {
    const { user } = session;
    return (
      <div className={columnClassName}>
        <Heading
          body="Your account is ready. Go back to where you were, or sign out."
          lead="You are"
          rest="signed in."
        />
        <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
          {user.image ? (
            <Image
              alt=""
              className="size-11 shrink-0 rounded-md"
              height={44}
              referrerPolicy="no-referrer"
              src={user.image}
              unoptimized
              width={44}
            />
          ) : (
            <span
              aria-hidden="true"
              className="flex size-11 shrink-0 items-center justify-center rounded-md bg-muted font-medium text-lg"
            >
              {user.name.slice(0, 1).toUpperCase()}
            </span>
          )}
          <div className="flex min-w-0 flex-col">
            <p className="truncate font-medium">{user.name}</p>
            <p className="truncate text-muted-foreground text-sm">
              {user.email}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <PrimaryLink href={next}>Continue</PrimaryLink>
          <SecondaryButton
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              await authClient.signOut();
              setBusy(false);
            }}
          >
            {busy ? "Signing out" : "Sign out"}
          </SecondaryButton>
        </div>
      </div>
    );
  }

  return (
    <div className={columnClassName}>
      <Heading
        body="Use your Google account. Free components, blocks, charts, the shadcn CLI, and the MCP server never need one."
        lead="Sign in to"
        rest="Cortexcn."
      />

      <div className="flex flex-col gap-3">
        <button
          className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-[10px] border border-border bg-background px-5 font-medium text-[15px] text-foreground shadow-[0_1px_2px_var(--shadow)] outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-wait disabled:opacity-60"
          disabled={busy || isPreview}
          onClick={async () => {
            setBusy(true);
            setError(null);
            // Absolute, so Google's round trip ends on the host and port the
            // visitor started from, not on the auth base URL.
            const here = window.location.origin;
            const result = await authClient.signIn.social({
              provider: "google",
              callbackURL: new URL(next, here).href,
              errorCallbackURL: new URL("/sign-in?error=1", here).href,
            });
            if (result.error) {
              setError(
                result.error.message ?? "Sign-in did not start. Try again.",
              );
              setBusy(false);
            }
          }}
          type="button"
        >
          <GoogleIcon />
          {busy ? "Opening Google..." : "Continue with Google"}
        </button>
        {isPreview ? (
          <p className="text-muted-foreground text-sm">
            Sign-in works on ui.cortexcn.dev. Google does not accept preview
            addresses.
          </p>
        ) : null}
        <p aria-live="polite" className="min-h-5 text-destructive text-sm">
          {error}
        </p>
      </div>
    </div>
  );
}
