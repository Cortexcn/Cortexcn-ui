import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { zipSync } from "fflate";
import {
  getSiteTemplate,
  SITE_TEMPLATES,
  templateArchiveName,
} from "@/lib/site-templates";

// Zipped once per build and served as a static file.
export const dynamic = "force-static";
export const dynamicParams = false;

/** The web app builds from apps/web; the templates sit beside it. */
const TEMPLATES_DIR = join(process.cwd(), "../../templates");

/** Local installs and build output, never part of the download. */
const SKIPPED_NAMES = new Set([
  ".DS_Store",
  ".next",
  ".vercel",
  "next-env.d.ts",
  "node_modules",
  "out",
]);

/** A fixed date keeps the bytes identical until the template itself changes. */
const ARCHIVE_DATE = new Date("2026-01-01T00:00:00Z");

function isSkipped(name: string) {
  return (
    SKIPPED_NAMES.has(name) ||
    name.endsWith(".tsbuildinfo") ||
    (name.startsWith(".env") && name !== ".env.example")
  );
}

/** Every file under `dir`, keyed by its path inside the zip. */
async function collectFiles(
  dir: string,
  prefix: string,
): Promise<[string, Uint8Array][]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries
      .filter((entry) => !isSkipped(entry.name))
      .map(async (entry): Promise<[string, Uint8Array][]> => {
        const path = join(dir, entry.name);
        const name = `${prefix}/${entry.name}`;
        if (entry.isDirectory()) {
          return collectFiles(path, name);
        }
        return entry.isFile() ? [[name, await readFile(path)]] : [];
      }),
  );
  return nested.flat();
}

export function generateStaticParams() {
  return SITE_TEMPLATES.map(({ slug }) => ({ slug }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const template = getSiteTemplate((await params).slug);
  if (!template) {
    return new Response("Not found", { status: 404 });
  }

  const name = templateArchiveName(template);
  const files = await collectFiles(join(TEMPLATES_DIR, template.slug), name);
  files.sort(([a], [b]) => (a < b ? -1 : 1));
  const archive = zipSync(Object.fromEntries(files), {
    level: 9,
    mtime: ARCHIVE_DATE,
  });

  return new Response(archive, {
    headers: {
      "Content-Disposition": `attachment; filename="${name}.zip"`,
      "Content-Type": "application/zip",
    },
  });
}
