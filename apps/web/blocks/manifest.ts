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

export const blockFileManifests = {
  "feature-spotlight-grid-01": featureSpotlightGrid01Files,
  "feature-media-cards-01": featureMediaCards01Files,
  "feature-image-columns-01": featureImageColumns01Files,
  "stat-card-area-01": statCardArea01Files,
  "stat-card-line-01": statCardLine01Files,
  "stat-card-choropleth-01": statCardChoropleth01Files,
} as const;

export type BlockSlug = keyof typeof blockFileManifests;

export const blockSlugs = Object.keys(blockFileManifests) as BlockSlug[];
