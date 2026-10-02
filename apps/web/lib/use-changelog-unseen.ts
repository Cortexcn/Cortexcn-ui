"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CHANGELOG } from "@/lib/changelog";

export const CHANGELOG_URL = "/changelog";

const STORAGE_KEY = "cortexcn-changelog-seen";

/** Releases this recent count as new for someone who has never opened the changelog. */
const FRESH_FOR_DAYS = 14;

const DAY_MS = 24 * 60 * 60 * 1000;

/** The newest release date, `YYYY-MM-DD`, so plain string order is date order. */
const latestRelease = CHANGELOG.reduce(
  (latest, release) => (release.date > latest ? release.date : latest),
  "",
);

/**
 * True while the changelog has a release this visitor has not seen. Opening
 * the changelog marks everything up to the newest release as seen.
 */
export function useChangelogUnseen() {
  const pathname = usePathname();
  const [unseen, setUnseen] = useState(false);

  useEffect(() => {
    try {
      if (pathname === CHANGELOG_URL) {
        window.localStorage.setItem(STORAGE_KEY, latestRelease);
        setUnseen(false);
        return;
      }

      const seen = window.localStorage.getItem(STORAGE_KEY);
      if (seen) {
        setUnseen(seen < latestRelease);
        return;
      }

      const age = Date.now() - new Date(latestRelease).getTime();
      setUnseen(age < FRESH_FOR_DAYS * DAY_MS);
    } catch {
      // Storage can be blocked, for example in private windows.
      setUnseen(false);
    }
  }, [pathname]);

  return unseen;
}
