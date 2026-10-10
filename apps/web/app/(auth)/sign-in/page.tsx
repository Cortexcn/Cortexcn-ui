import type { Metadata } from "next";
import Link from "next/link";

import { SignInPanel } from "@/components/auth/sign-in-panel";
import { CortexcnLogo } from "@/components/icons/cortexcn";
import { Painting } from "@/components/ui-home/painting";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Sign in",
    description: "Sign in to Cortexcn with your Google account.",
    path: "/sign-in",
  }),
  robots: { index: false, follow: false },
};

/** Only paths on this site, so the return link cannot send people elsewhere. */
function safeNext(value: string | string[] | undefined) {
  if (typeof value !== "string") {
    return "/";
  }
  return value.startsWith("/") && !value.startsWith("//") ? value : "/";
}

const quietLinkClassName =
  "underline underline-offset-4 transition-colors hover:text-foreground";

/**
 * Laid out like the library home's hero: the words on the left and a painted
 * panel on the right, with nothing else on the screen.
 */
export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;

  return (
    <main className="flex min-h-dvh">
      <section className="flex flex-1 flex-col px-6 py-6 sm:px-10 lg:px-16">
        <div className="flex items-center justify-between gap-4">
          <Link
            className="inline-flex items-center gap-2 rounded-md font-semibold text-foreground text-lg tracking-tight outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            href="/"
          >
            <CortexcnLogo size={24} theme="auto" />
            Cortexcn
          </Link>
          <Link
            className="text-muted-foreground text-sm transition-colors hover:text-foreground"
            href="/"
          >
            Back to the library
          </Link>
        </div>

        <div className="flex flex-1 items-center py-16">
          <SignInPanel
            failed={Boolean(params.error)}
            next={safeNext(params.next)}
          />
        </div>

        <p className="text-muted-foreground text-sm">
          By continuing, you agree to the{" "}
          <Link className={quietLinkClassName} href="/terms">
            Terms
          </Link>{" "}
          and the{" "}
          <Link className={quietLinkClassName} href="/privacy">
            Privacy Policy
          </Link>
          .
        </p>
      </section>

      <div className="relative hidden flex-1 p-3 lg:block">
        <div className="relative h-full overflow-hidden rounded-2xl border border-border">
          <Painting
            art="white-blossoms"
            preload
            sizes="(min-width: 1024px) 50vw, 0px"
          />
        </div>
      </div>
    </main>
  );
}
