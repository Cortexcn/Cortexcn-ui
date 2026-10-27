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
import { TableOfContents } from "@/components/docs/toc";
import { JsonLd } from "@/components/seo/json-ld";
import { componentGroupOf } from "@/lib/component-groups";
import { sidebarTreeFor } from "@/lib/docs-sidebar";
import { stripMdxComments } from "@/lib/llms";
import { templatesPromo } from "@/lib/nav-menus";
import {
  breadcrumbJsonLd,
  type Crumb,
  docsArticleJsonLd,
  pageMetadata,
  SITE_DESCRIPTION,
  shareImageUrl,
} from "@/lib/seo";
import { canonicalUrlFor } from "@/lib/site-url";
import { source } from "@/lib/source";
import { cn } from "@/lib/utils";

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

/**
 * What a docs page is shared with. The card is labeled with the page's
 * folder, such as "Docs / Cortex", and a component page shows its install
 * command, since each one is named after the registry item it installs.
 */
function docsShare(
  slugs: string[],
  page: { url: string; data: { title?: string; description?: string } },
) {
  const [folder = ""] = slugs;
  const section =
    slugs.length > 1
      ? `Docs / ${folder.charAt(0).toUpperCase()}${folder.slice(1)}`
      : "Docs";
  return {
    title: page.data.title ?? "Docs",
    description: page.data.description ?? SITE_DESCRIPTION,
    path: page.url,
    image: {
      section,
      item: componentGroupOf(page.url) ? slugs.at(-1) : undefined,
    },
  };
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
  // Previous and next stay inside the section the sidebar shows.
  const neighbours = findNeighbour(
    sidebarTreeFor(source.pageTree, page.url),
    page.url,
  );
  const crumbs = docsCrumbs(params.slug ?? [], data.title, page.url);

  // Read raw MDX content for copy functionality
  const slugPath = params.slug?.join("/") || "index";
  const mdxPath = join(process.cwd(), "content/docs", `${slugPath}.mdx`);
  let rawContent = "";
  try {
    rawContent = stripMdxComments(await readFile(mdxPath, "utf-8"));
  } catch {
    // Fallback if file read fails
    rawContent = "";
  }

  return (
    <div className="relative flex w-full justify-center">
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <JsonLd
        data={docsArticleJsonLd({
          title: data.title,
          description: data.description,
          path: page.url,
          image: shareImageUrl(docsShare(params.slug ?? [], page)),
        })}
      />
      <div
        aria-hidden="true"
        className="docs-hero-dots pointer-events-none absolute inset-x-0 top-0 h-72"
      />
      <article className="relative w-full max-w-[50rem] px-5 pt-8 pb-16 sm:px-8 lg:pt-12">
        <header className="mb-10">
          <div className="mb-8 flex min-h-9 items-center justify-between gap-4">
            <nav aria-label="Breadcrumb" className="min-w-0">
              <ol className="m-0 flex list-none flex-wrap items-center gap-1.5 p-0 text-muted-foreground text-sm">
                {crumbs.map((crumb, index) => {
                  const last = index === crumbs.length - 1;
                  return (
                    <li className="flex items-center gap-1.5" key={crumb.path}>
                      {last ? (
                        <span aria-current="page" className="text-foreground">
                          {crumb.name}
                        </span>
                      ) : (
                        <>
                          <Link
                            className="no-underline transition-colors hover:text-foreground"
                            href={crumb.path}
                          >
                            {crumb.name}
                          </Link>
                          <span aria-hidden="true" className="text-border">
                            /
                          </span>
                        </>
                      )}
                    </li>
                  );
                })}
              </ol>
            </nav>
            <CopyPageButton
              content={rawContent}
              title={data.title}
              url={page.url}
            />
          </div>
          <div
            className={cn(
              "grid gap-3",
              data.description && "md:grid-cols-2 md:gap-10",
            )}
          >
            <h1 className="m-0 text-balance font-semibold text-3xl text-foreground leading-tight tracking-tight sm:text-[2.125rem]">
              {data.title}
            </h1>
            {data.description && (
              <p className="m-0 text-pretty text-base text-muted-foreground leading-relaxed md:pt-1">
                {data.description}
              </p>
            )}
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
            }}
          />
        </div>
        <PageFooter next={neighbours.next} previous={neighbours.previous} />
      </article>
      <TableOfContents items={data.toc} promo={templatesPromo()} />
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
    ...docsShare(params.slug ?? [], page),
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
