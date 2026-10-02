"use client";

import { isNewNavLink } from "@/lib/is-new-nav-link";
import { CHANGELOG_URL, useChangelogUnseen } from "@/lib/use-changelog-unseen";

export function NavLinkLabel({ text, url }: { text: string; url: string }) {
  const changelogUnseen = useChangelogUnseen();
  const isNew = isNewNavLink(url) || (url === CHANGELOG_URL && changelogUnseen);

  if (!isNew) {
    return text;
  }

  return (
    <span className="flex items-start gap-1">
      {text}
      <NewMark />
    </span>
  );
}

/**
 * A raised "New" in violet with a light sweeping across it, and a small
 * spark, so a fresh section reads as news rather than as another badge.
 */
function NewMark() {
  return (
    <span className="inline-flex -translate-y-1.5 items-center gap-0.5 font-mono font-semibold text-[9px] normal-case leading-none tracking-wider">
      <svg
        aria-hidden="true"
        className="size-2 text-violet-500 dark:text-violet-300"
        fill="currentColor"
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M8 0c.5 4.2 3.8 7.5 8 8-4.2.5-7.5 3.8-8 8-.5-4.2-3.8-7.5-8-8 4.2-.5 7.5-3.8 8-8Z" />
      </svg>
      <span className="animate-new-sheen bg-[linear-gradient(110deg,var(--color-violet-600)_40%,var(--color-fuchsia-300)_50%,var(--color-violet-600)_60%)] bg-size-[250%_100%] bg-clip-text text-transparent motion-reduce:animate-none dark:bg-[linear-gradient(110deg,var(--color-violet-300)_40%,var(--color-white)_50%,var(--color-violet-300)_60%)]">
        New
      </span>
    </span>
  );
}
