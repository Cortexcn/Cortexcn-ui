import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { BLOCK_CATEGORIES } from "@/blocks/categories";
import { COMPONENT_GROUPS, componentGroupPages } from "@/lib/component-groups";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/seo";
// Hidden until Templates comes back; see apps/cortexcn/checklist.md.
// import { SITE_TEMPLATES } from "@/lib/site-templates";
import { canonicalUrlFor, DOCS_URL, SITE_URL } from "@/lib/site-url";
import { source } from "@/lib/source";

/*
 * Plain-markdown views of the site for AI agents, following llmstxt.org:
 * /llms.txt (an index), /llms-full.txt (every docs page), /index.md (the home
 * page), and a `.md` copy of each docs page.
 */

type DocsPage = ReturnType<typeof source.getPages>[number];

const REGISTRY_URL = `${DOCS_URL}/r/{name}.json`;

/** `https://ui.cortexcn.dev/docs/installation` -> `.../docs/installation.md` */
export function markdownUrlFor(pathname: string) {
  return `${canonicalUrlFor(pathname)}.md`;
}

export function docsPages() {
  return [...source.getPages()].sort((a, b) => a.url.localeCompare(b.url));
}

/* ------------------------------------------------------------------------ */
/* MDX -> markdown                                                           */
/* ------------------------------------------------------------------------ */

const JSX_START = /^\s*<([A-Z][\w.]*)/;
const FENCE = /^\s*(`{3,}|~{3,})/;
const ESM = /^(import|export)\s/;
const ESM_END = /(;\s*$)|(\sfrom\s+["'][^"']+["']\s*;?\s*$)/;
const NAME_PROP = /\bname=["']([\w-]+)["']/;
const CATEGORY_PROP = /\bcategory=["']([^"']+)["']/;
const LOCAL_LINK = /\]\((\/[^)\s]*)\)/g;
const COMMENT_START = "{/*";
const COMMENT_END = "*/}";

/** True once the JSX element starting in `text` has fully closed. */
function elementIsComplete(text: string, name: string) {
  const start = text.indexOf(`<${name}`) + name.length + 1;
  let depth = 0;
  let quote: string | null = null;
  for (let index = start; index < text.length; index += 1) {
    const char = text[index];
    if (quote) {
      if (char === quote) {
        quote = null;
      }
      continue;
    }
    if (char === '"' || char === "'" || char === "`") {
      quote = char;
    } else if (char === "{") {
      depth += 1;
    } else if (char === "}") {
      depth -= 1;
    } else if (char === ">" && depth === 0) {
      return text[index - 1] === "/" || text.includes(`</${name}>`, index);
    }
  }
  return false;
}

/** What a docs-only JSX element becomes in markdown (most are live demos). */
function replaceElement(name: string, text: string) {
  if (name === "InstallationTabs" || name === "PackageManagerTabs") {
    const item = text.match(NAME_PROP)?.[1];
    return item
      ? `\`\`\`bash\nnpx shadcn@latest add @cortexcn/${item}\n\`\`\``
      : "";
  }
  if (name === "ComponentsList") {
    const category = text.match(CATEGORY_PROP)?.[1] ?? "";
    const urls = new Set(componentGroupPages(category).map((page) => page.url));
    return docsPages()
      .filter((page) => urls.has(page.url))
      .map(
        (page) =>
          `- [${page.data.title}](${markdownUrlFor(page.url)}): ${page.data.description ?? ""}`,
      )
      .join("\n");
  }
  return "";
}

const FRONTMATTER = /^---\r?\n[\s\S]*?\r?\n---\r?\n/;
const LINE_BREAK = /\r?\n/;

/** Index of the last line of the ESM statement starting at `index`. */
function esmEnd(lines: string[], index: number) {
  let end = index;
  while (end < lines.length - 1 && !ESM_END.test(lines[end] ?? "")) {
    end += 1;
  }
  return end;
}

/** The full text of the JSX element starting at `index`, and its last line. */
function collectElement(lines: string[], index: number, name: string) {
  let end = index;
  let text = lines[index] ?? "";
  while (!elementIsComplete(text, name) && end < lines.length - 1) {
    end += 1;
    text += `\n${lines[end] ?? ""}`;
  }
  return { text, end };
}

/** The comment opening on line `index`: its last line and the text around it. */
function skipComment(lines: string[], index: number) {
  const first = lines[index] ?? "";
  const start = first.indexOf(COMMENT_START);
  let end = index;
  let text = first.slice(start);
  while (!text.includes(COMMENT_END) && end < lines.length - 1) {
    end += 1;
    text += `\n${lines[end] ?? ""}`;
  }
  const after = text.slice(text.indexOf(COMMENT_END) + COMMENT_END.length);
  return { end, rest: `${first.slice(0, start)}${after}` };
}

/**
 * Drops MDX comments (`{/* ... *\/}`) outside code fences. Pages never render
 * them, so copies of a page's source must not show them either.
 */
export function stripMdxComments(mdx: string) {
  const lines = mdx.split(LINE_BREAK);
  const out: string[] = [];
  let fence: string | null = null;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index] ?? "";
    const marker = line.match(FENCE)?.[1];

    if (fence || marker) {
      out.push(line);
      if (!fence) {
        fence = marker ?? null;
      } else if (marker?.startsWith(fence)) {
        fence = null;
      }
      continue;
    }
    if (line.includes(COMMENT_START)) {
      const comment = skipComment(lines, index);
      index = comment.end;
      if (comment.rest.trim()) {
        out.push(comment.rest);
      }
      continue;
    }
    out.push(line);
  }

  return out.join("\n");
}

function absolutizeLinks(line: string) {
  return line.replace(
    LOCAL_LINK,
    (_, path: string) => `](${canonicalUrlFor(path)})`,
  );
}

/** Drop frontmatter, imports, and demo JSX; keep prose, tables, and code. */
export function mdxToMarkdown(mdx: string) {
  const lines = stripMdxComments(mdx.replace(FRONTMATTER, "")).split(
    LINE_BREAK,
  );
  const out: string[] = [];
  let fence: string | null = null;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index] ?? "";
    const marker = line.match(FENCE)?.[1];

    if (fence || marker) {
      out.push(line);
      if (!fence) {
        fence = marker ?? null;
      } else if (marker?.startsWith(fence)) {
        fence = null;
      }
      continue;
    }
    if (ESM.test(line)) {
      index = esmEnd(lines, index);
      continue;
    }
    const jsx = line.match(JSX_START)?.[1];
    if (jsx) {
      const element = collectElement(lines, index, jsx);
      index = element.end;
      const replacement = replaceElement(jsx, element.text);
      if (replacement) {
        out.push(replacement);
      }
      continue;
    }
    out.push(absolutizeLinks(line));
  }

  return out
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** One docs page as markdown, with its title and summary on top. */
export async function docsPageMarkdown(page: DocsPage) {
  const title = page.data.title ?? "Docs";
  const description = page.data.description;
  let body = "";
  try {
    body = mdxToMarkdown(
      await readFile(join(process.cwd(), "content/docs", page.path), "utf8"),
    );
  } catch {
    body = "";
  }
  return [
    `# ${title}`,
    description ? `> ${description}` : "",
    `Source: ${canonicalUrlFor(page.url)}`,
    body,
  ]
    .filter(Boolean)
    .join("\n\n");
}

/* ------------------------------------------------------------------------ */
/* Files                                                                      */
/* ------------------------------------------------------------------------ */

const INTRO = `> ${SITE_DESCRIPTION}

Cortexcn items are installed with the shadcn CLI. Add the registry to \`components.json\` once, then add any item by name. The source is copied into the project as React and Tailwind CSS, so there is no runtime package to update.

- Registry namespace: \`@cortexcn\`, served from \`${REGISTRY_URL}\`
- Registry index: ${DOCS_URL}/r/registry.json
- Install an item: \`npx shadcn@latest add @cortexcn/<name>\`
- Agents: connect the shadcn MCP server (\`npx shadcn@latest mcp init --client claude\`) and ask for an item by name
- Site: ${SITE_URL} · Docs: ${DOCS_URL}/docs`;

function linkLine(page: DocsPage) {
  const note = page.data.description ? `: ${page.data.description}` : "";
  return `- [${page.data.title}](${markdownUrlFor(page.url)})${note}`;
}

/** /llms.txt: what Cortexcn is and where every docs page lives. */
export function llmsTxt() {
  const pages = docsPages();
  const guides = pages.filter((page) => page.slugs.length <= 1);
  const utilities = pages.filter((page) => page.slugs[0] === "utility");
  const groups = COMPONENT_GROUPS.map((group) => {
    const urls = new Set(
      componentGroupPages(group.name).map((page) => page.url),
    );
    return [
      `## ${group.name}`,
      group.description,
      "",
      ...pages.filter((page) => urls.has(page.url)).map(linkLine),
    ].join("\n");
  });

  const sections = [
    `# ${SITE_NAME}`,
    INTRO,
    ["## Docs", ...guides.map(linkLine)].join("\n"),
    ...groups,
    ["## Chart utilities", ...utilities.map(linkLine)].join("\n"),
    [
      "## Blocks",
      ...BLOCK_CATEGORIES.map(
        (category) =>
          `- [${category.name}](${DOCS_URL}/blocks/${category.slug}): ${category.description}`,
      ),
    ].join("\n"),
    // Hidden until Templates comes back; see apps/cortexcn/checklist.md.
    // [
    //   "## Templates",
    //   ...SITE_TEMPLATES.map(
    //     (template) =>
    //       `- [${template.name}](${SITE_URL}/templates/${template.slug}): ${template.summary}. ${template.price}, MIT licensed.`,
    //   ),
    // ].join("\n"),
    [
      "## Optional",
      `- [Full documentation](${SITE_URL}/llms-full.txt): every docs page in one markdown file`,
      `- [Home page](${SITE_URL}/index.md): the landing page in markdown`,
      `- [Chart gallery](${DOCS_URL}/charts/area-chart): live examples of every chart`,
      `- [Pricing](${SITE_URL}/pricing): the one-time component plans, starting prices for every client service and retainer, and a project estimator, in US dollars`,
      `- [Contact](${SITE_URL}/contact): email, phone, and a contact form for questions, support, and custom work`,
      // Hidden until Studio comes back; see apps/cortexcn/checklist.md.
      // `- [Studio](${SITE_URL}/studio): interactive chart editor with code export`,
    ].join("\n"),
  ];
  return `${sections.join("\n\n")}\n`;
}

/** /llms-full.txt: the whole documentation, one page after another. */
export async function llmsFullTxt() {
  const pages = await Promise.all(docsPages().map(docsPageMarkdown));
  return `# ${SITE_NAME} documentation\n\n${INTRO}\n\n---\n\n${pages.join("\n\n---\n\n")}\n`;
}

export function markdownResponse(body: string, canonical?: string) {
  const headers: Record<string, string> = {
    "Content-Type": "text/markdown; charset=utf-8",
    "Cache-Control":
      "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
  };
  if (canonical) {
    // The HTML page is the one to index; this copy points search engines at it.
    headers.Link = `<${canonical}>; rel="canonical"`;
  }
  return new Response(body, { headers });
}
