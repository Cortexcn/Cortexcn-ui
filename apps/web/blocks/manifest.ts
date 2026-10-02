export const statCardArea01Files = [
  "components/stat-card-area.tsx",
  "components/stat-card-chart.tsx",
  "components/stat-card-hover-bridge.tsx",
  "components/trend-badge.tsx",
  "data/revenue-series.ts",
] as const;

export const statCardLine01Files = [
  "components/stat-card-line.tsx",
  "components/stat-card-chart.tsx",
  "components/stat-card-hover-bridge.tsx",
  "components/trend-badge.tsx",
  "data/sessions-series.ts",
] as const;

export const statCardChoropleth01Files = [
  "components/stat-card-choropleth.tsx",
  "components/stat-card-choropleth-hover-bridge.tsx",
  "components/stat-card-chart.tsx",
  "components/trend-badge.tsx",
  "data/visitors.ts",
] as const;

export const featureSpotlightGrid01Files = [
  "components/feature-spotlight-grid.tsx",
] as const;

export const featureMediaCards01Files = [
  "components/feature-media-cards.tsx",
] as const;

export const featureImageColumns01Files = [
  "components/feature-image-columns.tsx",
] as const;

export const featureStudioGrid01Files = [
  "components/feature-studio-grid.tsx",
] as const;

export const featureBentoGrid01Files = [
  "components/feature-bento-grid.tsx",
] as const;

export const aiReasoning01Files = ["components/reasoning-panel.tsx"] as const;

export const aiChainOfThought01Files = ["components/agent-steps.tsx"] as const;

export const aiShimmer01Files = ["components/thinking-message.tsx"] as const;

export const heroDashboard01Files = [
  "components/hero-dashboard.tsx",
  "components/hero-dashboard-demo.tsx",
  "components/hero-cta.tsx",
] as const;

export const heroStudio01Files = [
  "components/hero-studio.tsx",
  "components/hero-cta.tsx",
] as const;

export const heroCover01Files = [
  "components/hero-cover.tsx",
  "components/hero-cta.tsx",
] as const;

export const loaderDotMatrix01Files = [
  "components/loader-dot-matrix-demo.tsx",
  "components/loader-dot-matrix.tsx",
] as const;

export const loaderGlitchText01Files = [
  "components/loader-glitch-text-demo.tsx",
  "components/loader-glitch-text.tsx",
] as const;

export const blockFileManifests = {
  "feature-spotlight-grid-01": featureSpotlightGrid01Files,
  "feature-media-cards-01": featureMediaCards01Files,
  "feature-image-columns-01": featureImageColumns01Files,
  "feature-studio-grid-01": featureStudioGrid01Files,
  "feature-bento-grid-01": featureBentoGrid01Files,
  "stat-card-area-01": statCardArea01Files,
  "stat-card-line-01": statCardLine01Files,
  "stat-card-choropleth-01": statCardChoropleth01Files,
  "ai-reasoning-01": aiReasoning01Files,
  "ai-chain-of-thought-01": aiChainOfThought01Files,
  "ai-shimmer-01": aiShimmer01Files,
  "hero-dashboard-01": heroDashboard01Files,
  "hero-studio-01": heroStudio01Files,
  "hero-cover-01": heroCover01Files,
  "loader-dot-matrix-01": loaderDotMatrix01Files,
  "loader-glitch-text-01": loaderGlitchText01Files,
} as const;

export type BlockSlug = keyof typeof blockFileManifests;

export const blockSlugs = Object.keys(blockFileManifests) as BlockSlug[];
