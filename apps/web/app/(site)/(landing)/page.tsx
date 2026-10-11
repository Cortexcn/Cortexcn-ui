import { CapabilitiesSection } from "@/components/landing/capabilities-section";
import { CtaSection } from "@/components/landing/cta-section";
import { FaqSection } from "@/components/landing/faq-section";
import { HeroSection } from "@/components/landing/hero-section";
import { InstallationSection } from "@/components/landing/installation-section";
import { LandingFooter } from "@/components/landing/landing-footer";
import { PricingSection } from "@/components/landing/pricing-section";
import { ProofSection } from "@/components/landing/proof-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { WorkSection } from "@/components/landing/work-section";
import { JsonLd } from "@/components/seo/json-ld";
import { ServiceGrid } from "@/components/services/service-grid";
import { ServicesProcess } from "@/components/services/services-process";
import {
  HOME_DESCRIPTION,
  HOME_TITLE,
  homeJsonLd,
  pageMetadata,
} from "@/lib/seo";

export const metadata = pageMetadata({
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  path: "/",
  absoluteTitle: true,
  // The card already shows the Cortexcn name.
  image: { title: "Websites and web apps by Syed Moinuddin" },
});

/**
 * The www home page sells client work: proof, what I build, how I work, the
 * work itself, and what clients say. The component library gets two sections.
 */
export default function HomePage() {
  return (
    <>
      <JsonLd data={homeJsonLd()} />
      <main className="flex flex-1 flex-col">
        <HeroSection />
        <ProofSection />
        <ServiceGrid section="services" />
        <ServicesProcess section="process" />
        <WorkSection />
        <TestimonialsSection />
        <CapabilitiesSection />
        <InstallationSection />
        <PricingSection />
        <FaqSection />
        <CtaSection />
      </main>
      <LandingFooter />
    </>
  );
}
