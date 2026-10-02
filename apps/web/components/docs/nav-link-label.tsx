"use client";

import { isNewNavLink } from "@/lib/is-new-nav-link";
import { CHANGELOG_URL, useChangelogUnseen } from "@/lib/use-changelog-unseen";

export function NavLinkLabel({ text, url }: { text: string; url: string }) {
  const changelogUnseen = useChangelogUnseen();
  const hasUnseenReleases = url === CHANGELOG_URL && changelogUnseen;

  if (!(isNewNavLink(url) || hasUnseenReleases)) {
    return text;
  }

  return (
    <span className="flex items-center gap-1.5">
      {text}
      <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-chart-1" />
      {hasUnseenReleases && <span className="sr-only">, new releases</span>}
    </span>
  );
}
