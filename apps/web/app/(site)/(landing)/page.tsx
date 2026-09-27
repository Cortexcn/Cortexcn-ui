import { BenefitsSection } from "@/components/landing/benefits-section";
import { CapabilitiesSection } from "@/components/landing/capabilities-section";
import { ChangelogSection } from "@/components/landing/changelog-section";
import { CtaSection } from "@/components/landing/cta-section";
import { FaqSection } from "@/components/landing/faq-section";
import { HeroSection } from "@/components/landing/hero-section";
import { InstallationSection } from "@/components/landing/installation-section";
import { LandingFooter } from "@/components/landing/landing-footer";
import { PricingSection } from "@/components/landing/pricing-section";
import { ServicesSection } from "@/components/landing/services-section";
import { StackSection } from "@/components/landing/stack-section";
import { JsonLd } from "@/components/seo/json-ld";
import {
  homeJsonLd,
  pageMetadata,
  SITE_DESCRIPTION,
  SITE_TITLE,
} from "@/lib/seo";

export const metadata = pageMetadata({
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  path: "/",
  absoluteTitle: true,
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={homeJsonLd()} />
      <main className="flex flex-1 flex-col">
        <HeroSection />
        <StackSection />
        <BenefitsSection />
        <CapabilitiesSection />
        <InstallationSection />
        <ServicesSection />
        <PricingSection />
        <ChangelogSection />
        <FaqSection />
        <CtaSection />
      </main>
      <LandingFooter />
    </>
  );
}
