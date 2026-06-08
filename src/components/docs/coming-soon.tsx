import { Callout } from "fumadocs-ui/components/callout";

// Placeholder notice shown on component pages that are documented in the index
// but not yet implemented in the registry.
export function ComingSoon() {
  return (
    <Callout type="info" title="Coming soon">
      This component is on the roadmap but isn&apos;t available yet. Check back
      soon, or browse the components that are ready today on the{" "}
      <a href="/docs/components">components overview</a>.
    </Callout>
  );
}
