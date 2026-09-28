import { CtaSection } from "@/components/ui-home/cta-section";
import { FaqSection } from "@/components/ui-home/faq-section";
import { FeaturesSection } from "@/components/ui-home/features-section";
import { HeroSection } from "@/components/ui-home/hero-section";
import { PricingSection } from "@/components/ui-home/pricing-section";
import { QualitySection } from "@/components/ui-home/quality-section";
import { StickyFeaturesSection } from "@/components/ui-home/sticky-features-section";
import { UseCasesSection } from "@/components/ui-home/use-cases-section";
import { pageMetadata } from "@/lib/seo";
import { LIBRARY_HOME_ROUTE } from "@/lib/site-url";

export const metadata = pageMetadata({
  title: "Cortexcn UI: charts, blocks, and motion components for shadcn/ui",
  description:
    "React components for shadcn/ui: charts, blocks, backgrounds, and motion. Install them with the shadcn CLI or your AI agent, and own the code.",
  path: LIBRARY_HOME_ROUTE,
  absoluteTitle: true,
});

export default function LibraryHomePage() {
  return (
    <main className="flex flex-col">
      <HeroSection />
      <FeaturesSection />
      <StickyFeaturesSection />
      <UseCasesSection />
      <QualitySection />
      <PricingSection />
      <FaqSection />
      <CtaSection />
    </main>
  );
}
