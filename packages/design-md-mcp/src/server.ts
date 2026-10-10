import { readFileSync } from "node:fs";
import { join } from "node:path";
import { McpServer, ResourceTemplate } from "@modelcontextprotocol/server";
import { z } from "zod";
import {
  rootThemeCss,
  tailwindV3Preset,
  tailwindV4Theme,
} from "../../../design-systems/_schema/css";
import {
  type LoadedSystem,
  loadSystems,
  readSystemFile,
} from "../../../design-systems/_schema/load";
import { TAGS } from "../../../design-systems/_schema/meta";
import { planApply, writePlan } from "./apply";
import { COMPONENTS, getComponent } from "./component";

const SERVER_VERSION = "0.1.0";

const INSTRUCTIONS = `Serves DESIGN.md design systems: community "inspired by" descriptions of public websites (unofficial; not affiliated with the brands), each normalized to one token schema with light and dark modes.

1. Find a system with list_design_systems (filter by tags such as dark-first, editorial, rounded).
2. Read it with get_design_system: format "md" for the original DESIGN.md, "tokens" for the normalized tokens, "css" for its theme.css, "tailwind" for Tailwind v4 and v3 setup.
3. Use get_component for one recipe (button, input, card, ...) with resolved values and a usage snippet, and compare_design_systems to see how systems differ.
4. apply_design_system writes the system into a project. Run it with dryRun true first and show the user the diff; only run with dryRun false once they agree.
Every value not stated by a DESIGN.md is listed in that system's gaps, with how it was derived.`;

interface ToolResult {
  [key: string]: unknown;
  content: { type: "text"; text: string }[];
  isError?: boolean;
}

const text = (body: string): ToolResult => ({
  content: [{ type: "text", text: body }],
});
const json = (value: unknown) => text(JSON.stringify(value, null, 2));
const failure = (message: string): ToolResult => ({
  content: [{ type: "text", text: message }],
  isError: true,
});

export function createServer(root: string): McpServer {
  let cache: LoadedSystem[] | undefined;
  const systems = () => {
    cache ??= loadSystems(root);
    return cache;
  };
  const find = (id: string) => systems().find((system) => system.id === id);
  const unknown = (id: string) =>
    failure(
      `No design system "${id}". Known ids: ${systems()
        .map((system) => system.id)
        .join(", ")}.`,
    );

  const server = new McpServer(
    {
      name: "design-md",
      title: "DESIGN.md design systems",
      version: SERVER_VERSION,
    },
    { instructions: INSTRUCTIONS },
  );

  server.registerTool(
    "list_design_systems",
    {
      title: "List design systems",
      description:
        "List the available design systems with their id, name, tags, and a one-line description of the look. Filter with tags; a system must have every tag given.",
      inputSchema: z.object({
        tags: z
          .array(z.enum(TAGS))
          .optional()
          .describe("Only systems that have all of these tags."),
      }),
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    ({ tags }) => {
      const matches = systems().filter((system) =>
        (tags ?? []).every((tag) => system.meta.tags.includes(tag)),
      );
      return json(
        matches.map(({ id, meta }) => ({
          id,
          name: meta.name,
          tags: meta.tags,
          description: meta.description,
          documentedMode: meta.sourceMode,
        })),
      );
    },
  );

  server.registerTool(
    "get_design_system",
    {
      title: "Get a design system",
      description:
        'Get one design system. format "md": the original DESIGN.md; "tokens": the normalized tokens.json with meta (fonts, provenance, gaps); "css": its theme.css, scoped to [data-theme="<id>"]; "tailwind": the CSS and Tailwind v4 @theme mapping, plus a Tailwind v3 preset.',
      inputSchema: z.object({
        id: z.string().describe("The system id from list_design_systems."),
        format: z.enum(["md", "tokens", "css", "tailwind"]),
      }),
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    ({ id, format }) => {
      const system = find(id);
      if (!system) {
        return unknown(id);
      }
      if (format === "md") {
        return text(readSystemFile(root, id, "DESIGN.md"));
      }
      if (format === "css") {
        return text(readSystemFile(root, id, "theme.css"));
      }
      if (format === "tokens") {
        return json({ tokens: system.tokens, meta: system.meta });
      }
      const options = {
        name: system.meta.name,
        disclaimer: system.meta.source.disclaimer,
      };
      return text(
        [
          "## Tailwind CSS v4",
          'Add to your global CSS after `@import "tailwindcss";` (or let apply_design_system do it):',
          "```css",
          rootThemeCss(system.tokens, options).trimEnd(),
          "",
          tailwindV4Theme(),
          "```",
          "",
          "## Tailwind CSS v3",
          'Put the :root and .dark blocks above in your global CSS, save this as tailwind.design-system.cjs, and add `presets: [require("./tailwind.design-system.cjs")]` to tailwind.config:',
          "```js",
          tailwindV3Preset(system.tokens).trimEnd(),
          "```",
        ].join("\n"),
      );
    },
  );

  server.registerTool(
    "get_component",
    {
      title: "Get a component recipe",
      description:
        "Get one component recipe from a design system (button, input, card, badge, tabs, accordion, dialog, menu, control, tooltip, alert): its token references, the resolved values, the CSS variables it sets, light and dark colors, and a usage snippet styled for that system.",
      inputSchema: z.object({
        id: z.string().describe("The system id."),
        component: z.enum(COMPONENTS),
      }),
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    ({ id, component }) => {
      const system = find(id);
      return system ? json(getComponent(system, component)) : unknown(id);
    },
  );

  server.registerTool(
    "compare_design_systems",
    {
      title: "Compare design systems",
      description:
        "Compare two or more design systems side by side: a markdown table of the tokens that differ (colors in both modes, fonts, radius, sizing, elevation, motion).",
      inputSchema: z.object({
        ids: z.array(z.string()).min(2).max(6),
      }),
      annotations: { readOnlyHint: true, openWorldHint: false },
    },
    ({ ids }) => {
      const picked = ids.map(find);
      const missing = ids.filter((_, index) => !picked[index]);
      if (missing.length > 0) {
        return unknown(missing.join(", "));
      }
      const list = picked as LoadedSystem[];
      const rows: [string, (system: LoadedSystem) => string][] = [
        ["documented mode", (s) => s.meta.sourceMode],
        ["background (light)", (s) => s.tokens.modes.light.background],
        ["background (dark)", (s) => s.tokens.modes.dark.background],
        ["foreground (light)", (s) => s.tokens.modes.light.foreground],
        ["primary (light)", (s) => s.tokens.modes.light.primary],
        ["primary (dark)", (s) => s.tokens.modes.dark.primary],
        ["border (light)", (s) => s.tokens.modes.light.border],
        [
          "display font",
          (s) =>
            `${s.tokens.typography.display.family} (${s.tokens.typography.display.fallback})`,
        ],
        [
          "body font",
          (s) =>
            `${s.tokens.typography.body.family} (${s.tokens.typography.body.fallback})`,
        ],
        ["display weight", (s) => String(s.tokens.typography.weights.bold)],
        ["display tracking", (s) => s.tokens.typography.tracking.display],
        [
          "radius sm / md / lg",
          (s) =>
            `${s.tokens.radius.sm} / ${s.tokens.radius.md} / ${s.tokens.radius.lg}`,
        ],
        [
          "button radius",
          (s) => s.tokens.radius[s.tokens.components.button.radius],
        ],
        ["button height", (s) => `${s.tokens.components.button.height.md}px`],
        ["input height", (s) => `${s.tokens.components.input.height}px`],
        [
          "card radius",
          (s) => s.tokens.radius[s.tokens.components.card.radius],
        ],
        ["tabs", (s) => s.tokens.components.tabs.style],
        ["density", (s) => s.tokens.spacing.density],
        ["elevation 2", (s) => s.tokens.elevation["2"]],
        [
          "motion base",
          (s) => `${s.tokens.motion.base} ${s.tokens.motion.easing}`,
        ],
        ["tags", (s) => s.meta.tags.join(", ")],
      ];
      const differing = rows.filter(
        ([, read]) => new Set(list.map(read)).size > 1,
      );
      const cell = (value: string) => value.replaceAll("|", "\\|");
      const table = [
        `| token | ${list.map((s) => s.meta.name).join(" | ")} |`,
        `| --- | ${list.map(() => "---").join(" | ")} |`,
        ...differing.map(
          ([label, read]) =>
            `| ${label} | ${list.map((s) => cell(read(s))).join(" | ")} |`,
        ),
      ].join("\n");
      const same = rows.length - differing.length;
      return text(
        `${table}\n\n${differing.length} of ${rows.length} compared tokens differ${same ? `; ${same} are the same in every system` : ""}.`,
      );
    },
  );

  server.registerTool(
    "apply_design_system",
    {
      title: "Apply a design system to a project",
      description:
        "Make a project render in a design system. Detects Tailwind v3 or v4, then adds the theme CSS (:root and .dark variables, a Tailwind mapping), font loading (next/font in Next.js, Google Fonts otherwise), and a DESIGN.md copy. Returns the exact unified diff. Writes files only when dryRun is false; run a dry run first and show the user the diff.",
      inputSchema: z.object({
        id: z.string().describe("The system id."),
        projectPath: z
          .string()
          .describe(
            "Absolute path to the project root (where package.json is).",
          ),
        dryRun: z
          .boolean()
          .default(true)
          .describe("When true (the default), only return the diff."),
      }),
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    ({ id, projectPath, dryRun }) => {
      const system = find(id);
      if (!system) {
        return unknown(id);
      }
      try {
        const plan = planApply(
          system,
          readSystemFile(root, id, "DESIGN.md"),
          projectPath,
        );
        if (!dryRun) {
          writePlan(plan);
        }
        const summary = [
          `${dryRun ? "Dry run: nothing written." : "Written."} ${system.meta.name} into ${plan.projectPath}`,
          `Tailwind v${plan.tailwind}, ${plan.framework === "next" ? "Next.js" : "not Next.js"}, global CSS ${plan.globalCss}.`,
          `${plan.changes.length} file(s): ${plan.changes.map((c) => `${c.path}${c.created ? " (new)" : ""}`).join(", ") || "none, already applied"}.`,
          ...plan.notes.map((note) => `- ${note}`),
        ].join("\n");
        return text(
          `${summary}\n\n\`\`\`diff\n${plan.changes.map((c) => c.diff).join("\n")}\n\`\`\``,
        );
      } catch (error) {
        return failure((error as Error).message);
      }
    },
  );

  server.registerResource(
    "design-md",
    new ResourceTemplate("design-system://{id}/DESIGN.md", {
      list: () => ({
        resources: systems().map((system) => ({
          uri: `design-system://${system.id}/DESIGN.md`,
          name: `${system.meta.name} DESIGN.md`,
          mimeType: "text/markdown",
          description: system.meta.description,
        })),
      }),
    }),
    {
      title: "DESIGN.md",
      description: "The original DESIGN.md of a design system.",
      mimeType: "text/markdown",
    },
    (uri, variables) => {
      const id = String(variables.id ?? "");
      if (!find(id)) {
        throw new Error(`No design system "${id}"`);
      }
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "text/markdown",
            text: readFileSync(join(root, id, "DESIGN.md"), "utf8"),
          },
        ],
      };
    },
  );

  return server;
}
