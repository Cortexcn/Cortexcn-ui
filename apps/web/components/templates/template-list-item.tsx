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
import { TemplateScreenshot } from "./template-screenshot";

/** One template on /templates: its first screen beside what it includes. */
export function TemplateListItem({ template }: { template: SiteTemplate }) {
  const href = `/templates/${template.slug}`;
  const free = isFreeTemplate(template);
  const buyHref = templateBuyHref(template);

  return (
    <article className="grid items-center gap-6 rounded-2xl bg-muted/50 p-4 lg:grid-cols-[3fr_2fr] lg:gap-10 lg:p-6">
      <Link
        className="block overflow-hidden rounded-xl border bg-background shadow-xs transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2"
        href={href}
      >
        <TemplateScreenshot
          alt=""
          image={template.screenshots.card}
          sizes="(min-width: 1024px) 60vw, 100vw"
        />
        <span className="sr-only">View the {template.name} template</span>
      </Link>

      <div className="flex flex-col gap-5 px-2 pb-2 lg:px-0 lg:pb-0">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="font-semibold text-3xl tracking-tight">
              {template.name}
            </h2>
            <span className="rounded-full border border-border px-2.5 py-0.5 font-mono text-xs uppercase">
              {templatePriceLabel(template)}
            </span>
          </div>
          <p className="text-lg text-muted-foreground">{template.summary}.</p>
        </div>

        <ul className="flex flex-wrap gap-2">
          {template.stack.map((item) => (
            <li
              className="rounded-md bg-background px-2 py-1 font-mono text-muted-foreground text-xs"
              key={item}
            >
              {item}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-2">
          <Button
            nativeButton={false}
            render={<Link href={href} />}
            size="lg"
            variant="white"
          >
            View template
          </Button>
          {free ? (
            <Button
              nativeButton={false}
              render={
                // biome-ignore lint/a11y/useAnchorContent: Base UI merges Button children into this anchor
                <a download href={templateDownloadPath(template)} />
              }
              size="lg"
              variant="outline"
            >
              <Icon data-icon="inline-start" name="IconFileDownload" />
              Download
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
              variant="outline"
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
              variant="ghost"
            >
              <Icon data-icon="inline-start" name="IconArrowUpRight" />
              Live preview
            </Button>
          ) : null}
        </div>
      </div>
    </article>
  );
}
