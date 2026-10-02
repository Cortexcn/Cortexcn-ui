import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import { mdxToMarkdown } from "@/lib/llms";
import {
  type CatalogItem,
  categoryCounts,
  findItem,
  getCatalog,
  REGISTRY_ITEM_URL,
} from "@/lib/mcp/catalog";
import { searchItems } from "@/lib/mcp/search";
import { DOCS_URL } from "@/lib/site-url";

const SERVER_VERSION = "1.0.0";

const KINDS = ["component", "block", "chart", "hook", "lib"] as const;
const PACKAGE_MANAGERS = ["pnpm", "npm", "yarn", "bun"] as const;
type PackageManager = (typeof PACKAGE_MANAGERS)[number];

const SHADCN: Record<PackageManager, string> = {
  pnpm: "pnpm dlx shadcn@latest add",
  npm: "npx shadcn@latest add",
  yarn: "npx shadcn@latest add",
  bun: "bunx --bun shadcn@latest add",
};

const INSTRUCTIONS = `Cortexcn is a registry of React and Tailwind CSS components, page blocks, and charts, installed with the shadcn CLI. The code is copied into the user's project, so there is no runtime package.

How to work with it:
1. Find what fits with search_items, or browse with list_items and list_categories.
2. Read get_item before using an item: it has the install command, the files it adds, its dependencies, and its docs with usage and props.
3. Install by running the command from get_item or get_install_command in the user's project root. The project needs shadcn set up first; get_setup_guide explains how.
4. Before writing new UI around Cortexcn pieces, read get_design_guide so the result matches the Cortexcn look.
Never invent props or item names: read them from get_item.`;

interface ToolResult {
  [key: string]: unknown;
  content: { type: "text"; text: string }[];
  isError?: boolean;
}

function text(body: string): ToolResult {
  return { content: [{ type: "text", text: body }] };
}

function failure(message: string): ToolResult {
  return { content: [{ type: "text", text: message }], isError: true };
}

function itemUrl(name: string) {
  return REGISTRY_ITEM_URL.replace("{name}", name);
}

export function installCommand(names: string[], manager: PackageManager) {
  return `${SHADCN[manager]} ${names.map(itemUrl).join(" ")}`;
}

function summary(item: CatalogItem) {
  return {
    name: item.name,
    title: item.title,
    kind: item.kind,
    category: item.category,
    description: item.description,
    url: item.url,
  };
}

function notFound(name: string) {
  const suggestions = searchItems(getCatalog(), name, 5).map(
    ({ item }) => item.name,
  );
  return failure(
    suggestions.length > 0
      ? `No Cortexcn item is called "${name}". Close matches: ${suggestions.join(", ")}.`
      : `No Cortexcn item is called "${name}". Use search_items to find one.`,
  );
}

async function docsMarkdown(item: CatalogItem) {
  if (!item.docsPath) {
    return "";
  }
  try {
    const mdx = await readFile(
      join(process.cwd(), "content/docs", item.docsPath),
      "utf8",
    );
    return mdxToMarkdown(mdx);
  } catch {
    return "";
  }
}

interface RegistryItemFile {
  path: string;
  target?: string;
  content?: string;
}

async function registryItemFiles(name: string): Promise<RegistryItemFile[]> {
  const raw = await readFile(
    join(process.cwd(), "public/r", `${name}.json`),
    "utf8",
  );
  const parsed = JSON.parse(raw) as { files?: RegistryItemFile[] };
  return parsed.files ?? [];
}

async function itemDetails(item: CatalogItem, includeDocs: boolean) {
  const lines = [
    `# ${item.title} (\`${item.name}\`)`,
    item.description,
    "",
    `- Kind: ${item.kind}, in ${item.category}`,
    `- Page: ${item.url}`,
  ];
  if (item.livePreviewUrl) {
    lines.push(`- Live preview: ${item.livePreviewUrl}`);
  }
  if (item.markdownUrl) {
    lines.push(`- Docs as markdown: ${item.markdownUrl}`);
  }
  lines.push(`- Registry JSON: ${itemUrl(item.name)}`);
  lines.push(
    `- Files it adds: ${item.files.length > 0 ? item.files.map((file) => `\`${file}\``).join(", ") : "none"}`,
  );
  lines.push(
    `- npm dependencies (installed for you): ${item.dependencies.length > 0 ? item.dependencies.join(", ") : "none"}`,
  );
  if (item.registryDependencies.length > 0) {
    lines.push(
      `- Registry dependencies (installed for you): ${item.registryDependencies.join(", ")}`,
    );
  }
  lines.push(
    "",
    "## Install",
    "",
    "Run in the project root:",
    "",
    "```bash",
    installCommand([item.name], "pnpm"),
    "```",
    "",
    `With npm: \`${installCommand([item.name], "npm")}\``,
  );
  if (includeDocs) {
    const docs = await docsMarkdown(item);
    if (docs) {
      lines.push("", "## Docs", "", docs);
    }
  }
  return lines.join("\n");
}

async function registryFileText(name: string) {
  const files = await registryItemFiles(name);
  return files.map((file) => file.content ?? "").join("\n\n");
}

const kindField = z
  .enum(KINDS)
  .optional()
  .describe(
    "Only this kind: component, block (a page section), chart, hook, or lib.",
  );

export function createServer(): McpServer {
  const server = new McpServer(
    { name: "cortexcn", title: "Cortexcn", version: SERVER_VERSION },
    { instructions: INSTRUCTIONS },
  );

  server.registerTool(
    "search_items",
    {
      title: "Search Cortexcn",
      description:
        "Find Cortexcn components, blocks, and charts by keyword or by what you need, like 'pricing hero', 'animated badge', or 'line chart with tooltip'. Results are ranked by relevance.",
      inputSchema: z.object({
        query: z.string().min(1).describe("Keywords or a short description."),
        kind: kindField,
        limit: z
          .number()
          .int()
          .min(1)
          .max(25)
          .optional()
          .describe("How many results to return. Defaults to 8."),
      }),
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    ({ query, kind, limit }) => {
      const pool = getCatalog().filter((item) => !kind || item.kind === kind);
      const results = searchItems(pool, query, limit ?? 8);
      if (results.length === 0) {
        return text(
          `Nothing in Cortexcn matches "${query}". Try fewer or broader words, or list_items to browse.`,
        );
      }
      return text(
        JSON.stringify(
          results.map(({ item }) => summary(item)),
          null,
          2,
        ),
      );
    },
  );

  server.registerTool(
    "list_items",
    {
      title: "List Cortexcn items",
      description:
        "Every Cortexcn component, block, and chart, optionally filtered by kind or category. Use list_categories to see the category names.",
      inputSchema: z.object({
        kind: kindField,
        category: z
          .string()
          .optional()
          .describe(
            "A category name from list_categories, like Hero or Cortex.",
          ),
      }),
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    ({ kind, category }) => {
      const wanted = category?.trim().toLowerCase();
      const items = getCatalog().filter(
        (item) =>
          (!kind || item.kind === kind) &&
          (!wanted || item.category.toLowerCase() === wanted),
      );
      if (items.length === 0) {
        return text("No items match. Use list_categories to see what exists.");
      }
      return text(JSON.stringify(items.map(summary), null, 2));
    },
  );

  server.registerTool(
    "list_categories",
    {
      title: "List categories",
      description:
        "The groups Cortexcn items are organized in, with how many items each has.",
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    () => text(JSON.stringify(categoryCounts(), null, 2)),
  );

  server.registerTool(
    "get_item",
    {
      title: "Get an item",
      description:
        "Everything about one Cortexcn item: what it is, the install command, the files and dependencies it adds, links to its page and live preview, and its docs with usage, examples, and props.",
      inputSchema: z.object({
        name: z
          .string()
          .min(1)
          .describe("The item's name, like lanyard-3d or hero-studio-01."),
        include_docs: z
          .boolean()
          .optional()
          .describe("Include the full docs page. Defaults to true."),
      }),
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async ({ name, include_docs }) => {
      const item = findItem(name);
      if (!item) {
        return notFound(name);
      }
      return text(await itemDetails(item, include_docs ?? true));
    },
  );

  server.registerTool(
    "get_item_source",
    {
      title: "Get an item's source",
      description:
        "The source code of one item's files, as the CLI would write them. Use it to read or adapt the code; to add it to a project, run the install command instead.",
      inputSchema: z.object({
        name: z.string().min(1).describe("The item's name."),
      }),
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async ({ name }) => {
      const item = findItem(name);
      if (!item) {
        return notFound(name);
      }
      const files = await registryItemFiles(item.name);
      return text(
        files
          .map(
            (file) =>
              `// ${file.target ?? file.path}\n${file.content ?? "(no content)"}`,
          )
          .join("\n\n"),
      );
    },
  );

  server.registerTool(
    "get_install_command",
    {
      title: "Get the install command",
      description:
        "One shadcn CLI command that installs one or more Cortexcn items into the current project, for the package manager you name. Run it in the project root.",
      inputSchema: z.object({
        names: z
          .array(z.string().min(1))
          .min(1)
          .max(20)
          .describe("Item names, like ['lanyard-3d', 'hero-studio-01']."),
        package_manager: z
          .enum(PACKAGE_MANAGERS)
          .optional()
          .describe("Defaults to pnpm."),
      }),
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    ({ names, package_manager }) => {
      const found: string[] = [];
      const missing: string[] = [];
      for (const name of names) {
        const item = findItem(name);
        if (item) {
          found.push(item.name);
        } else {
          missing.push(name);
        }
      }
      if (found.length === 0) {
        return notFound(names.join(", "));
      }
      const lines = [installCommand(found, package_manager ?? "pnpm")];
      if (missing.length > 0) {
        lines.push(
          "",
          `Not found, left out: ${missing.join(", ")}. Use search_items to find the right names.`,
        );
      }
      return text(lines.join("\n"));
    },
  );

  server.registerTool(
    "get_setup_guide",
    {
      title: "Get the setup guide",
      description:
        "How to prepare a project for Cortexcn: setting up shadcn, adding the @cortexcn registry to components.json, and the theme.",
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async () => {
      const install = await readFile(
        join(process.cwd(), "content/docs/installation.mdx"),
        "utf8",
      ).catch(() => "");
      const lines = [
        "# Setting up a project for Cortexcn",
        "",
        "Items install with the shadcn CLI, so the project needs shadcn first (`npx shadcn@latest init`).",
        "",
        "Any item installs from its URL with no further setup:",
        "",
        "```bash",
        installCommand(["lanyard-3d"], "npm"),
        "```",
        "",
        "To install by name (`npx shadcn@latest add @cortexcn/lanyard-3d`), add the registry to components.json once:",
        "",
        "```json",
        JSON.stringify(
          { registries: { "@cortexcn": REGISTRY_ITEM_URL } },
          null,
          2,
        ),
        "```",
      ];
      lines.push(
        "",
        "Most items depend on `utils` (the `cn` helper), which the CLI installs for you.",
      );
      if (install) {
        lines.push("", "## The installation page", "", mdxToMarkdown(install));
      }
      return text(lines.join("\n"));
    },
  );

  server.registerTool(
    "get_design_guide",
    {
      title: "Get the design guide",
      description:
        "Cortexcn's DESIGN.md: the colors, type, radius, spacing, motion, and component rules to follow when building or changing UI, so new screens match Cortexcn.",
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    async () => {
      try {
        return text(await registryFileText("design-md"));
      } catch {
        return failure(
          `The design guide could not be read. It is also published at ${DOCS_URL}/r/design-md.json.`,
        );
      }
    },
  );

  return server;
}
