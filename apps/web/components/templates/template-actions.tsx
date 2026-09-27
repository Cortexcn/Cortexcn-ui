import { Icon } from "@bklitui/icons";
import { Button } from "@/components/ui/button";
import { type SiteTemplate, templateDownloadPath } from "@/lib/site-templates";

/** Download, plus the live preview and source links once they exist. */
export function TemplateActions({ template }: { template: SiteTemplate }) {
  return (
    <div className="flex flex-wrap gap-2">
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
        Download {template.price.toLowerCase()}
      </Button>
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
