/**
 * Syncs blocks from apps/web/blocks into registry sources and registry.json
 * (shadcn add + Open in v0). Run from packages/ui after generate-v0-examples.mjs.
 */
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const uiRoot = join(__dirname, "..");
const webBlocksRoot = join(uiRoot, "../../apps/web/blocks");
const registryBlocksRoot = join(uiRoot, "registry/blocks");
const examplesDir = join(uiRoot, "registry/examples");
const registryPath = join(uiRoot, "registry.json");

const BLOCK_CHART_INDEX = {
  "stat-card-area-01": `export { AreaChart } from "./area-chart";
export { Area } from "./area";
export { ChartStatFlow } from "./chart-stat-flow";
export { useChart } from "./chart-context";
export { LinearGradient } from "@visx/gradient";`,
  "stat-card-line-01": `export { LineChart } from "./line-chart";
export { Line } from "./line";
export { ChartStatFlow } from "./chart-stat-flow";
export { useChart } from "./chart-context";`,
  "stat-card-choropleth-01": `export { type ChoroplethFeature, ChoroplethChart, ChoroplethFeatureComponent, ChoroplethTooltip, useChoropleth } from "./choropleth";
export { ChartStatFlow } from "./chart-stat-flow";`,
};

/** @type {Record<string, { title: string, description: string, previewMaxWidth: string, registryDependencies: string[], dependencies: string[], files: string[], extraFiles?: { path: string, target: string, content?: string }[] }>} */
const BLOCKS = {
  "feature-spotlight-grid-01": {
    title: "Feature Spotlight Grid",
    description:
      "Six icon cards under a centered intro, with one soft highlight that glides to the card you point at",
    previewMaxWidth: "max-w-6xl",
    registryDependencies: ["@cortexcn/utils"],
    dependencies: ["motion"],
    files: ["components/feature-spotlight-grid.tsx"],
  },
  "feature-media-cards-01": {
    title: "Feature Media Cards",
    description:
      "Heading and two actions above three cards that pair an image, a short explainer, and an icon tile",
    previewMaxWidth: "max-w-6xl",
    registryDependencies: ["@cortexcn/utils", "button"],
    dependencies: [],
    files: ["components/feature-media-cards.tsx"],
  },
  "feature-image-columns-01": {
    title: "Feature Image Columns",
    description:
      "Label, headline, and intro over three image columns, closed by one shared call to action",
    previewMaxWidth: "max-w-6xl",
    registryDependencies: ["@cortexcn/utils", "button"],
    dependencies: [],
    files: ["components/feature-image-columns.tsx"],
  },
  "feature-studio-grid-01": {
    title: "Feature Studio Grid",
    description:
      "Heading and one action over two compact cards and a large feature tile, for posts, case studies, or launches",
    previewMaxWidth: "max-w-6xl",
    registryDependencies: ["@cortexcn/utils", "button"],
    dependencies: [],
    files: ["components/feature-studio-grid.tsx"],
  },
  "feature-bento-grid-01": {
    title: "Feature Bento Grid",
    description:
      "A bento of photo tiles, logo tiles, and stat cards on a twelve-column grid, with one call to action",
    previewMaxWidth: "max-w-6xl",
    registryDependencies: ["@cortexcn/utils", "button"],
    dependencies: [],
    files: ["components/feature-bento-grid.tsx"],
  },
  "feature-mixed-bento-01": {
    title: "Feature Mixed Bento",
    description:
      "A mono label over four cards on a five-column grid, each setting its title, copy, and image a different way, over soft blurred glows and a faint plus pattern",
    previewMaxWidth: "max-w-6xl",
    registryDependencies: ["@cortexcn/utils", "card"],
    dependencies: [],
    files: ["components/feature-mixed-bento.tsx"],
  },
  "feature-walkthrough-01": {
    title: "Feature Walkthrough",
    description:
      "Three numbered steps beside a painted stage in a ruled frame. Each step plays out in its own window, and the steps move on by themselves",
    previewMaxWidth: "max-w-6xl",
    registryDependencies: ["@cortexcn/utils", "@cortexcn/marquee"],
    dependencies: ["motion"],
    files: ["components/feature-walkthrough.tsx"],
  },
  "services-image-grid-01": {
    title: "Services Image Grid",
    description:
      "An intro with a heading, a short pitch, and one outline action beside five image cards that fade when you point at them",
    previewMaxWidth: "max-w-6xl",
    registryDependencies: ["@cortexcn/utils", "button", "card"],
    dependencies: ["motion"],
    files: ["components/services-image-grid.tsx"],
  },
  "services-preview-list-01": {
    title: "Services Preview List",
    description:
      "A large numbered list of services beside a panel that stays in view and wipes in the image and description of the one you point at",
    previewMaxWidth: "max-w-6xl",
    registryDependencies: ["@cortexcn/utils", "button"],
    dependencies: ["motion"],
    files: ["components/services-preview-list.tsx"],
  },
  "hero-dashboard-01": {
    title: "Hero Dashboard Preview",
    description:
      "A serif headline, a short pitch, and one call to action over a framed product dashboard on a soft photo wash",
    previewMaxWidth: "max-w-6xl",
    registryDependencies: [
      "@cortexcn/utils",
      "avatar",
      "badge",
      "button",
      "card",
      "separator",
    ],
    dependencies: ["class-variance-authority", "lucide-react", "motion"],
    files: [
      "components/hero-dashboard.tsx",
      "components/hero-dashboard-demo.tsx",
      "components/hero-cta.tsx",
    ],
  },
  "hero-studio-01": {
    title: "Hero Studio",
    description:
      "A short tagline beside a serif headline and pitch, over a wide landscape photo that fades into the page",
    previewMaxWidth: "max-w-7xl",
    registryDependencies: ["@cortexcn/utils", "button"],
    dependencies: ["class-variance-authority", "motion"],
    files: ["components/hero-studio.tsx", "components/hero-cta.tsx"],
  },
  "hero-cover-01": {
    title: "Hero Cover Photo",
    description:
      "A full-bleed photo with the title, a small label, a short description, and one call to action along its bottom edge",
    previewMaxWidth: "max-w-7xl",
    registryDependencies: ["@cortexcn/utils", "button"],
    dependencies: ["class-variance-authority", "motion"],
    files: ["components/hero-cover.tsx", "components/hero-cta.tsx"],
  },
  "loader-dot-matrix-01": {
    title: "Loader Dot Matrix",
    description:
      "A grid of dots that pulses in a ripple, wave, or rain pattern, shown four ways including inside a button",
    previewMaxWidth: "max-w-3xl",
    registryDependencies: ["@cortexcn/utils", "button"],
    dependencies: [],
    files: [
      "components/loader-dot-matrix-demo.tsx",
      "components/loader-dot-matrix.tsx",
    ],
  },
  "loader-glitch-text-01": {
    title: "Loader Glitch Text",
    description:
      "Loading text that scrambles and splits into color channels, at three intensities and as a heading",
    previewMaxWidth: "max-w-3xl",
    registryDependencies: ["@cortexcn/utils"],
    dependencies: [],
    files: [
      "components/loader-glitch-text-demo.tsx",
      "components/loader-glitch-text.tsx",
    ],
  },
  "ai-reasoning-01": {
    title: "AI Reasoning Panel",
    description:
      "A reasoning panel that streams a model's thinking as markdown, folds away when it finishes, and can replay",
    previewMaxWidth: "max-w-xl",
    registryDependencies: ["@cortexcn/reasoning", "button"],
    dependencies: ["lucide-react"],
    files: ["components/reasoning-panel.tsx"],
  },
  "ai-chain-of-thought-01": {
    title: "AI Agent Steps",
    description:
      "An agent's progress one step at a time, with sources, a live current step, and a summary when the run ends",
    previewMaxWidth: "max-w-md",
    registryDependencies: ["@cortexcn/chain-of-thought", "button"],
    dependencies: ["lucide-react"],
    files: ["components/agent-steps.tsx"],
  },
  "ai-shimmer-01": {
    title: "AI Thinking Message",
    description:
      "A chat turn where the assistant's reply is a shimmering status line while it works",
    previewMaxWidth: "max-w-sm",
    registryDependencies: ["@cortexcn/shimmer", "@cortexcn/utils"],
    dependencies: [],
    files: ["components/thinking-message.tsx"],
  },
  "ai-queue-01": {
    title: "AI Agent Queue",
    description:
      "What an agent has lined up: queued messages with attachments and a remove action, above the run's todo list",
    previewMaxWidth: "max-w-md",
    registryDependencies: ["@cortexcn/queue"],
    dependencies: ["lucide-react"],
    files: ["components/agent-queue.tsx"],
  },
  "stat-card-area-01": {
    title: "Stat Card Area",
    description:
      "Revenue stat card with gradient area sparkline, NumberFlow, and trend badge",
    previewMaxWidth: "max-w-md",
    registryDependencies: [
      "@cortexcn/area-chart",
      "@cortexcn/chart-stat-flow",
      "card",
      "badge",
    ],
    dependencies: [
      "@visx/curve@4.0.1-alpha.0",
      "@visx/gradient@4.0.1-alpha.0",
      "@number-flow/react",
      "lucide-react",
    ],
    files: [
      "components/stat-card-area.tsx",
      "components/stat-card-chart.tsx",
      "components/stat-card-hover-bridge.tsx",
      "components/trend-badge.tsx",
      "data/revenue-series.ts",
    ],
  },
  "stat-card-line-01": {
    title: "Stat Card Line",
    description:
      "Sessions stat card with line sparkline, overlaid NumberFlow, and trend badge",
    previewMaxWidth: "max-w-md",
    registryDependencies: [
      "@cortexcn/line-chart",
      "@cortexcn/chart-stat-flow",
      "card",
      "badge",
    ],
    dependencies: [
      "@visx/curve@4.0.1-alpha.0",
      "@number-flow/react",
      "lucide-react",
    ],
    files: [
      "components/stat-card-line.tsx",
      "components/stat-card-chart.tsx",
      "components/stat-card-hover-bridge.tsx",
      "components/trend-badge.tsx",
      "data/sessions-series.ts",
    ],
  },
  "stat-card-choropleth-01": {
    title: "Stat Card Choropleth",
    description:
      "Visitor map stat card with choropleth sparkline, NumberFlow, and trend badge",
    previewMaxWidth: "max-w-3xl",
    registryDependencies: [
      "@cortexcn/choropleth-chart",
      "@cortexcn/chart-stat-flow",
      "card",
      "badge",
    ],
    dependencies: [
      "@number-flow/react",
      "@types/geojson",
      "@types/topojson-specification",
      "lucide-react",
      "topojson-client",
    ],
    files: [
      "components/stat-card-choropleth.tsx",
      "components/stat-card-choropleth-hover-bridge.tsx",
      "components/stat-card-chart.tsx",
      "components/trend-badge.tsx",
      "data/visitors.ts",
      "lib/use-world-data.tsx",
    ],
  },
};

const COMPONENT_EXPORTS = {
  "feature-spotlight-grid-01": "FeatureSpotlightGrid",
  "feature-media-cards-01": "FeatureMediaCards",
  "feature-image-columns-01": "FeatureImageColumns",
  "feature-studio-grid-01": "FeatureStudioGrid",
  "feature-bento-grid-01": "FeatureBentoGrid",
  "feature-mixed-bento-01": "FeatureMixedBento",
  "feature-walkthrough-01": "FeatureWalkthrough",
  "services-image-grid-01": "ServicesImageGrid",
  "services-preview-list-01": "ServicesPreviewList",
  "ai-reasoning-01": "ReasoningPanel",
  "ai-chain-of-thought-01": "AgentSteps",
  "ai-shimmer-01": "ThinkingMessage",
  "ai-queue-01": "AgentQueue",
  "hero-dashboard-01": "HeroDashboard",
  "hero-studio-01": "HeroStudio",
  "hero-cover-01": "HeroCover",
  "loader-dot-matrix-01": "LoaderDotMatrixDemo",
  "loader-glitch-text-01": "LoaderGlitchTextDemo",
  "stat-card-area-01": "StatCardArea",
  "stat-card-line-01": "StatCardLine",
  "stat-card-choropleth-01": "StatCardChoropleth",
};

function transformForRegistry(content) {
  return content
    .replaceAll("@cortexcn/ui/charts", "@/components/charts")
    .replaceAll("@/components/docs/use-world-data", "@/lib/use-world-data")
    .replaceAll("@cortexcn/ui/components/", "@/components/");
}

function copyBlockFile(blockId, relativePath) {
  const sourcePath = join(webBlocksRoot, blockId, "files", relativePath);
  const targetPath = join(registryBlocksRoot, blockId, relativePath);

  if (relativePath === "lib/use-world-data.tsx") {
    const sharedSource = join(
      uiRoot,
      "../../apps/web/components/docs/use-world-data.tsx",
    );
    mkdirSync(dirname(targetPath), { recursive: true });
    cpSync(sharedSource, targetPath);
    return;
  }

  if (!existsSync(sourcePath)) {
    throw new Error(`Block source not found: ${sourcePath}`);
  }

  mkdirSync(dirname(targetPath), { recursive: true });
  const content = transformForRegistry(readFileSync(sourcePath, "utf8"));
  writeFileSync(targetPath, content);
}

function blockRegistryFiles(blockId, relativePaths) {
  return relativePaths.map((relativePath) => ({
    path: `registry/blocks/${blockId}/${relativePath}`,
    type: relativePath.endsWith(".ts") ? "registry:lib" : "registry:component",
    target: relativePath,
  }));
}

function blockChartIndexFile(blockId) {
  if (!BLOCK_CHART_INDEX[blockId]) {
    return null;
  }

  return {
    path: `registry/examples/${blockId}-index.ts`,
    type: "registry:lib",
    target: "components/charts/index.ts",
  };
}

const chartStatFlowItem = {
  name: "chart-stat-flow",
  type: "registry:component",
  title: "Chart Stat Flow",
  description: "Animated stat value and label for chart overlays",
  registryDependencies: ["@cortexcn/utils"],
  dependencies: ["@number-flow/react", "motion"],
  files: [
    {
      path: "src/charts/chart-stat-flow.tsx",
      type: "registry:component",
      target: "components/charts/chart-stat-flow.tsx",
    },
  ],
};

mkdirSync(examplesDir, { recursive: true });
mkdirSync(registryBlocksRoot, { recursive: true });

for (const [blockId, spec] of Object.entries(BLOCKS)) {
  for (const relativePath of spec.files) {
    copyBlockFile(blockId, relativePath);
  }

  const exportName = COMPONENT_EXPORTS[blockId];
  // The first component listed is the block entry point.
  const mainComponentPath = spec.files.find((file) =>
    file.startsWith("components/"),
  );
  const importPath = `@/components/${mainComponentPath
    ?.replace("components/", "")
    .replace(".tsx", "")}`;

  const exampleContent = `"use client";

import { ${exportName} } from "${importPath}";

export default function Component() {
  return (
    <main className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full ${spec.previewMaxWidth}">
        <${exportName} />
      </div>
    </main>
  );
}
`;

  writeFileSync(join(examplesDir, `${blockId}.tsx`), exampleContent);

  const chartIndex = BLOCK_CHART_INDEX[blockId];
  if (chartIndex) {
    writeFileSync(
      join(examplesDir, `${blockId}-index.ts`),
      `/** biome-ignore-all lint/performance/noBarrelFile: v0 registry example barrel for shadcn install */\n${chartIndex}\n`,
    );
  }
}

const registry = JSON.parse(readFileSync(registryPath, "utf8"));

const blockItemNames = new Set(
  Object.keys(BLOCKS).flatMap((blockId) => [blockId, `${blockId}-example`]),
);

registry.items = registry.items.filter(
  (item) => item.name !== "chart-stat-flow" && !blockItemNames.has(item.name),
);

registry.items.push(chartStatFlowItem);

for (const [blockId, spec] of Object.entries(BLOCKS)) {
  const blockFiles = blockRegistryFiles(blockId, spec.files);
  const chartIndexFile = blockChartIndexFile(blockId);
  if (chartIndexFile) {
    blockFiles.push(chartIndexFile);
  }

  registry.items.push({
    name: blockId,
    type: "registry:block",
    title: spec.title,
    description: spec.description,
    registryDependencies: spec.registryDependencies,
    dependencies: spec.dependencies,
    files: blockFiles,
  });

  const exampleFiles = [
    {
      path: `registry/examples/${blockId}.tsx`,
      type: "registry:page",
      target: "app/page.tsx",
    },
  ];

  if (chartIndexFile) {
    exampleFiles.push(chartIndexFile);
  }

  registry.items.push({
    name: `${blockId}-example`,
    type: "registry:example",
    title: `${spec.title} Example`,
    description: `${spec.description} — demo for Open in v0`,
    registryDependencies: [`@cortexcn/${blockId}`],
    dependencies: spec.dependencies,
    files: exampleFiles,
  });
}

writeFileSync(registryPath, `${JSON.stringify(registry, null, 2)}\n`);
console.log(
  `Synced ${Object.keys(BLOCKS).length} blocks into registry (${Object.keys(BLOCKS).length * 2 + 1} items).`,
);
