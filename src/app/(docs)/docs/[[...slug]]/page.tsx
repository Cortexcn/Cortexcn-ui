import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { findNeighbour } from "fumadocs-core/page-tree";

import { source } from "@/lib/source";
import { getMDXComponents } from "@/mdx-components";
import { DocsTableOfContents } from "@/components/docs/mdx/table-of-content";
import { MDXNavigation } from "@/components/docs/mdx/navigation";

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug);

  if (!page) notFound();

  const doc = page.data;
  const MDX = doc.body;
  const neighbours = findNeighbour(source.pageTree, page.url);

  return (
    <div className="relative mt-14 flex sm:mt-0">
      <div className="mx-auto flex w-full max-w-2xl flex-col px-4 py-12 pb-32">
        <div className="flex flex-col gap-1">
          <h1 className="scroll-m-20 text-3xl font-semibold tracking-tight text-foreground xl:text-4xl">
            {doc.title}
          </h1>
          {doc.description ? (
            <p className="text-[15px] text-muted-foreground">
              {doc.description}
            </p>
          ) : null}
        </div>

        <div className="mt-8 w-full flex-1 text-[14px] text-primary/80 *:data-[slot=alert]:first:mt-0">
          <MDX components={getMDXComponents()} />
        </div>

        <div className="mt-24 grid grid-cols-2 gap-4 sm:gap-8">
          <div>
            {neighbours.previous ? (
              <MDXNavigation
                type="previous"
                title={neighbours.previous.name}
                url={neighbours.previous.url}
              />
            ) : (
              <div className="h-full min-h-16 rounded-md border border-dashed" />
            )}
          </div>
          <div>
            {neighbours.next ? (
              <MDXNavigation
                type="next"
                title={neighbours.next.name}
                url={neighbours.next.url}
              />
            ) : (
              <div className="h-full min-h-16 rounded-md border border-dashed" />
            )}
          </div>
        </div>
      </div>

      <div className="sticky top-12 hidden h-[calc(100vh-3rem)] self-start xl:flex">
        {doc.toc?.length ? (
          <div className="no-scrollbar w-72 overflow-y-auto px-8 py-12">
            <DocsTableOfContents toc={doc.toc} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);

  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
