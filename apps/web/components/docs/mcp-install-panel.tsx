"use client";

import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import Link from "next/link";
import { CopyButton } from "@/components/copy-button";
import { codeThemes } from "@/lib/code-theme";

export const MCP_SERVER_URL = "https://ui.cortexcn.dev/mcp";
export const CLAUDE_CODE_MCP_COMMAND = `claude mcp add --transport http cortexcn ${MCP_SERVER_URL}`;

function CopyableBlock({ code, lang }: { code: string; lang: string }) {
  return (
    <figure className="not-prose relative my-3 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="overflow-x-auto pr-12">
        <DynamicCodeBlock
          code={code}
          codeblock={{
            allowCopy: false,
            className:
              "my-0 rounded-none border-0 bg-transparent [&_pre]:bg-transparent [&_pre]:whitespace-pre-wrap",
          }}
          lang={lang}
          options={{ themes: codeThemes }}
        />
      </div>
      <CopyButton className="absolute top-2 right-2 z-10" text={code} />
    </figure>
  );
}

/** Installs an item by asking an AI assistant connected to the Cortexcn MCP server. */
export function McpInstallPanel({ name }: { name: string }) {
  const prompt = `Add the Cortexcn ${name} item to this project.`;

  return (
    <div className="mt-4 flex flex-col gap-1 text-sm">
      <p className="font-medium">
        Connect the Cortexcn MCP server once. In Claude Code:
      </p>
      <CopyableBlock code={CLAUDE_CODE_MCP_COMMAND} lang="bash" />
      <p className="text-muted-foreground">
        Using Cursor, VS Code, Windsurf, or another assistant? See{" "}
        <Link
          className="font-medium text-foreground underline underline-offset-4"
          href="/docs/integration/mcp"
        >
          MCP server setup
        </Link>
        .
      </p>
      <p className="mt-4 font-medium">Then ask your assistant:</p>
      <CopyableBlock code={prompt} lang="text" />
    </div>
  );
}
