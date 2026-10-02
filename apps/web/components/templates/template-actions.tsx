import { Icon } from "@cortexcn/icons";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  isFreeTemplate,
  type SiteTemplate,
  templateBuyHref,
  templateDownloadPath,
  templatePriceLabel,
} from "@/lib/site-templates";

/**
 * Download for a free template or Buy for a paid one, plus the live preview
 * and the source repository once they exist.
 */
export function TemplateActions({ template }: { template: SiteTemplate }) {
  const free = isFreeTemplate(template);
  const buyHref = templateBuyHref(template);

  return (
    <div className="flex flex-wrap gap-2">
      {free ? (
        <Button
          nativeButton={false}
          render={
            // A plain anchor: the zip is a file, not a page to navigate to.
            // biome-ignore lint/a11y/useAnchorContent: Base UI merges Button children into this anchor
            <a download href={templateDownloadPath(template)} />
          }
          size="lg"
          variant="white"
        >
          <Icon data-icon="inline-start" name="IconFileDownload" />
          Download free
        </Button>
      ) : (
        <Button
          nativeButton={false}
          render={
            buyHref.startsWith("/") ? (
              <Link href={buyHref} />
            ) : (
              // biome-ignore lint/a11y/useAnchorContent: Base UI merges Button children into this anchor
              <a href={buyHref} rel="noopener" target="_blank" />
            )
          }
          size="lg"
          variant="white"
        >
          <Icon data-icon="inline-start" name="IconShoppingBag1" />
          Buy for {templatePriceLabel(template)}
        </Button>
      )}
      {template.previewUrl ? (
        <Button
          nativeButton={false}
          render={
            // biome-ignore lint/a11y/useAnchorContent: Base UI merges Button children into this anchor
            <a href={template.previewUrl} rel="noopener" target="_blank" />
          }
          size="lg"
          variant="outline"
        >
          <Icon data-icon="inline-start" name="IconArrowUpRight" />
          Live preview
        </Button>
      ) : null}
      {template.repoUrl ? (
        <Button
          nativeButton={false}
          render={
            // biome-ignore lint/a11y/useAnchorContent: Base UI merges Button children into this anchor
            <a href={template.repoUrl} rel="noopener" target="_blank" />
          }
          size="lg"
          variant="outline"
        >
          <Icon data-icon="inline-start" name="IconGithub" />
          Source
        </Button>
      ) : null}
    </div>
  );
}
