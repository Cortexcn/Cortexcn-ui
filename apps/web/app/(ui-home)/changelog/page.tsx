import { ChangelogHero } from "@/components/ui-home/changelog-hero";
import { ChangelogTimeline } from "@/components/ui-home/changelog-timeline";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Changelog",
  description:
    "Every Cortexcn release, newest first: new components, blocks, and fixes, with a link to everything that shipped.",
  path: "/changelog",
});

export default function ChangelogPage() {
  return (
    <main className="flex flex-col">
      <ChangelogHero />
      <ChangelogTimeline />
    </main>
  );
}
