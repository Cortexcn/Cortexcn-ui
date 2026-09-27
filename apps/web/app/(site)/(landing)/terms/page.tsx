import { LandingFooter } from "@/components/landing/landing-footer";
import { TitleBand } from "@/components/landing/title-band";
import {
  LegalDocument,
  LegalItem,
  LegalLink,
  LegalList,
  type LegalSection,
} from "@/components/legal/legal-document";
import { CONTACT_EMAIL, CONTACT_PHONE } from "@/lib/contact-details";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Terms and conditions",
  description:
    "The terms for using Cortexcn: the site, the docs, the registry, and the MIT licensed components you install.",
  path: "/terms",
});

const UPDATED = "September 27, 2026";

const SUMMARY =
  "Use the site, the docs, and the components freely. The code is MIT licensed, comes with no warranty, and is yours once you install it.";

const SECTIONS: LegalSection[] = [
  {
    id: "using-these-terms",
    title: "Using these terms",
    content: (
      <p>
        These terms apply when you use www.cortexcn.dev, the docs and registry
        at ui.cortexcn.dev, and the contact form. By using them, you agree to
        these terms. If you do not agree, please do not use the site.
      </p>
    ),
  },
  {
    id: "the-code",
    title: "The code you install",
    content: (
      <LegalList>
        <LegalItem>
          Cortexcn components, charts, blocks, and examples are released under
          the MIT License. You can use them in personal and commercial projects,
          change them, and ship them, as long as the license notice stays with
          the code.
        </LegalItem>
        <LegalItem>
          When you install an item with the shadcn CLI or an AI agent, the code
          is copied into your project. From then on, it is your code to
          maintain.
        </LegalItem>
        <LegalItem>
          Some parts of the project, such as Studio, have their own license. It
          is noted where those parts are offered.
        </LegalItem>
      </LegalList>
    ),
  },
  {
    id: "acceptable-use",
    title: "Acceptable use",
    content: (
      <LegalList>
        <LegalItem>
          Do not try to break, overload, or get around the security of the site.
        </LegalItem>
        <LegalItem>
          Do not use the contact form for spam, advertising, or anything
          unlawful.
        </LegalItem>
        <LegalItem>
          Reading the docs and the registry with scripts or AI agents is
          welcome, as long as it does not disrupt the service for others.
        </LegalItem>
      </LegalList>
    ),
  },
  {
    id: "name-and-logo",
    title: "Name and logo",
    content: (
      <p>
        The MIT License covers the code, not the Cortexcn name or logo. You can
        say your project uses Cortexcn, but do not use the name or logo in a way
        that suggests we made or endorse your product.
      </p>
    ),
  },
  {
    id: "pricing",
    title: "Pricing",
    content: (
      <p>
        Prices on the <LegalLink href="/pricing">pricing page</LegalLink> are
        starting prices for client work, in US dollars. Every project gets a
        written quote with its scope, price, and timeline, and that quote is
        what you agree to and pay. Projects are paid half up front and half
        before launch, and retainers are billed monthly in advance.
      </p>
    ),
  },
  {
    id: "other-services",
    title: "Other sites and services",
    content: (
      <p>
        The site links to and builds on tools we do not run, such as shadcn/ui,
        GitHub, Vercel, and npm. Their own terms apply when you use them.
      </p>
    ),
  },
  {
    id: "no-warranty",
    title: "No warranty",
    content: (
      <p>
        The site, the docs, and the code are provided as is, without warranties
        of any kind, including fitness for a particular purpose. Test every
        component in your own project before you rely on it.
      </p>
    ),
  },
  {
    id: "liability",
    title: "Limitation of liability",
    content: (
      <p>
        To the extent the law allows, Cortexcn and Syed Moinuddin are not liable
        for indirect, incidental, or consequential damages, or for lost profits,
        revenue, or data, that come from using the site or the code.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to these terms",
    content: (
      <p>
        When these terms change, we update this page and the date at the top.
        Using the site after a change means you accept the new terms.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    content: (
      <p>
        Questions about these terms go to{" "}
        <LegalLink href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</LegalLink>{" "}
        or{" "}
        <LegalLink href={`tel:${CONTACT_PHONE.e164}`}>
          {CONTACT_PHONE.display}
        </LegalLink>
        . You can also use the{" "}
        <LegalLink href="/contact">contact form</LegalLink>. Read how we handle
        your information in the{" "}
        <LegalLink href="/privacy">privacy policy</LegalLink>.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <>
      <main className="flex flex-1 flex-col">
        <TitleBand title="Terms and conditions" />
        <LegalDocument
          label="Terms and conditions"
          sections={SECTIONS}
          summary={SUMMARY}
          updated={UPDATED}
        />
      </main>
      <LandingFooter />
    </>
  );
}
