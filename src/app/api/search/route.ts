import { createFromSource } from "fumadocs-core/search/server";

import { source } from "@/lib/source";

// Static search index built from the docs source, queried by the command menu
// via `useDocsSearch({ type: "fetch" })` at /api/search.
export const { GET } = createFromSource(source);
