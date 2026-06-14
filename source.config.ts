import { defineConfig, defineDocs } from "fumadocs-mdx/config";
import rehypePrettyCode from "rehype-pretty-code";

import { transformers } from "@/lib/highlight-code";

export const docs = defineDocs({
  dir: "content/docs",
});

export default defineConfig({
  mdxOptions: {
    // Disable Fumadocs' built-in shiki highlighter; we render fenced code with
    // rehype-pretty-code (min-light / vesper) + custom [!code …] transformers.
    rehypeCodeOptions: false,
    rehypePlugins: (plugins) => [
      ...plugins,
      [
        rehypePrettyCode,
        {
          theme: {
            light: "min-light",
            dark: "vesper",
          },
          defaultColor: false,
          transformers,
        },
      ],
    ],
  },
});
