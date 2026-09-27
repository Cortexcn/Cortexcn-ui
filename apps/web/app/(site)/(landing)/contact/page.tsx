import { ContactSection } from "@/components/contact/contact-section";
import { CtaSection } from "@/components/landing/cta-section";
import { LandingFooter } from "@/components/landing/landing-footer";
import { TitleBand } from "@/components/landing/title-band";
import { JsonLd } from "@/components/seo/json-ld";
import { CONTACT_EMAIL } from "@/lib/contact-details";
import { contactJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact",
  description: `Questions, support, bug reports, or custom work. Write to ${CONTACT_EMAIL} or send a message. We work from Bangalore, India and the US.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <JsonLd data={contactJsonLd()} />
      <main className="flex flex-1 flex-col">
        <TitleBand title="Get in touch" />
        <ContactSection />
        <CtaSection />
      </main>
      <LandingFooter />
    </>
  );
}
