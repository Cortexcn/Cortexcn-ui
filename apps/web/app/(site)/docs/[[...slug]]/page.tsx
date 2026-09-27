import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { findNeighbour } from "fumadocs-core/server";
import type { TOCItemType } from "fumadocs-core/toc";
import { Accordion, Accordions } from "fumadocs-ui/components/accordion";
import defaultMdxComponents from "fumadocs-ui/mdx";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ComponentType } from "react";
import { ComponentPreview } from "@/components/docs/component-preview";
import { ComponentShowcase } from "@/components/docs/component-showcase";
import { ComponentsList } from "@/components/docs/components-list";
import { CopyPageButton } from "@/components/docs/copy-page-button";
import { InstallationTabs } from "@/components/docs/installation-tabs";
import { PackageManagerTabs } from "@/components/docs/package-manager-tabs";
import { PageFooter } from "@/components/docs/page-footer";
import { StudioEmbedPreview } from "@/components/docs/studio-embed-preview";
import { TableOfContents } from "@/components/docs/toc";
import { JsonLd } from "@/components/seo/json-ld";
import { componentGroupOf } from "@/lib/component-groups";
import {
  breadcrumbJsonLd,
  type Crumb,
  docsArticleJsonLd,
  pageMetadata,
  SITE_DESCRIPTION,
} from "@/lib/seo";
import { canonicalUrlFor } from "@/lib/site-url";
import { source } from "@/lib/source";

/** Docs home, then every parent page that exists, then this page. */
function docsCrumbs(slugs: string[], title: string, url: string): Crumb[] {
  const crumbs: Crumb[] = [{ name: "Docs", path: "/docs" }];
  for (let depth = 1; depth < slugs.length; depth += 1) {
    const parent = source.getPage(slugs.slice(0, depth));
    if (parent) {
      crumbs.push({ name: parent.data.title ?? "Docs", path: parent.url });
    }
  }
  if (slugs.length > 0) {
    crumbs.push({ name: title, path: url });
  }
  return crumbs;
}

// Extended page data types from fumadocs-mdx
interface PageData {
  title: string;
  description?: string;
  body: ComponentType<Record<string, unknown>>;
  toc: TOCItemType[];
  full?: boolean;
}

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) {
    notFound();
  }

  const data = page.data as PageData;
  const MDX = data.body;
  const neighbours = findNeighbour(source.pageTree, page.url);
  const group = componentGroupOf(page.url);

  // Read raw MDX content for copy functionality
  const slugPath = params.slug?.join("/") || "index";
  const mdxPath = join(process.cwd(), "content/docs", `${slugPath}.mdx`);
  let rawContent = "";
  try {
    rawContent = await readFile(mdxPath, "utf-8");
  } catch {
    // Fallback if file read fails
    rawContent = "";
  }

  return (
    <div className="flex w-full justify-center">
      <JsonLd
        data={breadcrumbJsonLd(
          docsCrumbs(params.slug ?? [], data.title, page.url),
        )}
      />
      <JsonLd
        data={docsArticleJsonLd({
          title: data.title,
          description: data.description,
          path: page.url,
        })}
      />
      <article className="w-full max-w-[790px] px-10 pt-24 pb-16">
        <header className="mb-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              {group ? (
                <Link
                  className="mb-3 inline-flex rounded-md border border-border px-2 py-0.5 font-medium font-mono text-muted-foreground text-xs uppercase tracking-wide transition-colors hover:text-foreground"
                  href={`/docs/components#${group.category}`}
                  title={group.description}
                >
                  {group.name}
                </Link>
              ) : null}
              <h1 className="m-0 font-bold text-3xl text-foreground leading-tight">
                {data.title}
              </h1>
              {data.description && (
                <p className="mt-2 text-lg text-muted-foreground">
                  {data.description}
                </p>
              )}
            </div>
            <CopyPageButton
              content={rawContent}
              title={data.title}
              url={page.url}
            />
          </div>
        </header>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <MDX
            components={{
              ...defaultMdxComponents,
              Accordion,
              Accordions,
              ComponentPreview,
              ComponentShowcase,
              ComponentsList,
              InstallationTabs,
              PackageManagerTabs,
              StudioEmbedPreview,
            }}
          />
        </div>
        <PageFooter next={neighbours.next} previous={neighbours.previous} />
      </article>
      <TableOfContents items={data.toc} />
    </div>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) {
    notFound();
  }

  const metadata = pageMetadata({
    title: page.data.title ?? "Docs",
    description: page.data.description ?? SITE_DESCRIPTION,
    path: page.url,
    type: "article",
  });
  return {
    ...metadata,
    alternates: {
      ...metadata.alternates,
      // A plain markdown copy of this page, for AI agents.
      types: { "text/markdown": `${canonicalUrlFor(page.url)}.md` },
    },
  };
}
