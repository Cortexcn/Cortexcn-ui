import { DOCS_URL } from "@/lib/site-url";

/** The shadcn namespace for `npx shadcn@latest add @cortexcn/<name>`. */
export const REGISTRY_NAMESPACE = "@cortexcn";

/** The published registry JSON for one item, served from the docs host. */
export function registryJsonUrlForName(name: string) {
  return `${DOCS_URL}/r/${name}.json`;
}

/** The `<name>-example` item: a whole demo page, which is what v0 opens. */
export function registryV0ExampleJsonUrl(name: string) {
  return registryJsonUrlForName(`${name}-example`);
}

/** How an item is named in a `shadcn add` command. */
export function shadcnAddItem(name: string) {
  return `${REGISTRY_NAMESPACE}/${name}`;
}

/** Opens a registry item in v0, as described in shadcn's "Open in v0" docs. */
export function openInV0Href(registryJsonUrl: string) {
  return `https://v0.dev/chat/api/open?url=${encodeURIComponent(registryJsonUrl)}`;
}
