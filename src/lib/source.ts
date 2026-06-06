import { loader } from "fumadocs-core/source";

// `.source` is generated at the app root by `fumadocs-mdx` (postinstall).
// `@/*` maps to `src`, so reach the generated server entry via a relative path.
import { docs } from "../../.source/server";

export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
});
