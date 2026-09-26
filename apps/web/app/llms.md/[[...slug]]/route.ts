import { notFound } from "next/navigation";

import { docsPageMarkdown, markdownResponse } from "@/lib/llms";
import { canonicalUrlFor } from "@/lib/site-url";
import { source } from "@/lib/source";

/*
 * Markdown copy of a docs page. next.config rewrites `/docs/<page>.md` (and
 * `/docs.md`) here, so agents can append `.md` to any docs URL.
 */
export const dynamic = "force-static";

export function generateStaticParams() {
  return source.generateParams();
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug?: string[] }> },
) {
  const { slug } = await params;
  const page = source.getPage(slug);
  if (!page) {
    notFound();
  }
  return markdownResponse(
    await docsPageMarkdown(page),
    canonicalUrlFor(page.url),
  );
}
