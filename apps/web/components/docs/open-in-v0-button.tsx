"use client";

import { V0Icon } from "@/components/icons/v0";
import { Button } from "@/components/ui/button";
import { getAnalyticsUrl, trackEvent } from "@/lib/analytics/track-client";
import { openInV0Href } from "@/lib/registry-links";

/**
 * Opens a public registry item JSON in v0.
 * @see https://ui.shadcn.com/docs/registry/open-in-v0
 */
export function OpenInV0Button({
  registryJsonUrl,
  chart,
}: {
  registryJsonUrl: string;
  chart?: string;
}) {
  const handleClick = () => {
    trackEvent("docs_open_v0", {
      chart,
      url: getAnalyticsUrl(),
      registry_json_url: registryJsonUrl,
    });
  };

  return (
    <Button
      aria-label="Open in v0"
      className="h-8 gap-1 px-3 text-xs"
      nativeButton={false}
      render={
        // biome-ignore lint/a11y/useAnchorContent: Base UI merges Button children into this anchor
        <a
          aria-label="Open in v0"
          href={openInV0Href(registryJsonUrl)}
          onClick={handleClick}
          rel="noreferrer"
          target="_blank"
        />
      }
      variant="white"
    >
      Open in <V0Icon className="h-5 w-5" />
    </Button>
  );
}
