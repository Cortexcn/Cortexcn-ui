import { LandingFooter } from "@/components/landing/landing-footer";
import { TitleBand } from "@/components/landing/title-band";
import {
  LegalDocument,
  LegalItem,
  LegalLink,
  LegalList,
  type LegalSection,
} from "@/components/legal/legal-document";
import {
  CONTACT_EMAIL,
  CONTACT_LOCATION,
  CONTACT_PHONE,
} from "@/lib/contact-details";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy policy",
  description:
    "What Cortexcn collects when you use the site, the docs, and the contact form, why, and how to have it deleted.",
  path: "/privacy",
});

const UPDATED = "September 27, 2026";

const SUMMARY =
  "We collect as little as we can: what you send through the contact form, usage numbers, and the preferences your browser keeps. We never sell any of it.";

const SECTIONS: LegalSection[] = [
  {
    id: "who-we-are",
    title: "Who we are",
    content: (
      <p>
        Cortexcn is a shadcn/ui registry of React components, charts, and
        blocks, built by Syed Moinuddin and the Cortexcn team from{" "}
        {CONTACT_LOCATION}. This policy covers www.cortexcn.dev, the docs and
        registry at ui.cortexcn.dev, and the contact form. When it says
        &quot;we&quot;, it means Cortexcn.
      </p>
    ),
  },
  {
    id: "what-we-collect",
    title: "What we collect",
    content: (
      <>
        <LegalList>
          <LegalItem>
            Contact form: your first name, your last name if you give it, your
            email address, the topic you pick, and your message.
          </LegalItem>
          <LegalItem>
            Usage data: the pages you view, links you follow to other sites, and
            searches in the docs, along with your browser, device type, country,
            and the site that sent you. OpenPanel and Cloudflare Web Analytics
            collect this for us, and neither sets cookies.
          </LegalItem>
          <LegalItem>
            Security data: your IP address and browser signals, which Cloudflare
            Turnstile uses to tell people from bots on the contact form. Our
            server also holds your IP address in memory for a few minutes to
            limit how often the form can be sent.
          </LegalItem>
          <LegalItem>
            Server logs: Vercel, which hosts the site, records requests (IP
            address, browser, and the page asked for) to run and protect the
            service.
          </LegalItem>
          <LegalItem>
            Preferences in your browser: your light or dark theme, your chart
            theme (a cookie named bklit-chart-theme), and the code tab and
            package manager you picked last. They only change how the site looks
            for you.
          </LegalItem>
        </LegalList>
        <p>
          We do not ask for payment details, government IDs, or health
          information. Please leave them out of your messages.
        </p>
      </>
    ),
  },
  {
    id: "how-we-use-it",
    title: "How we use it",
    content: (
      <>
        <LegalList>
          <LegalItem>
            To read and answer your message, and to follow up on it.
          </LegalItem>
          <LegalItem>
            To see which pages and components people use, so we know what to
            improve.
          </LegalItem>
          <LegalItem>
            To keep the site and the contact form secure, and to stop spam and
            abuse.
          </LegalItem>
        </LegalList>
        <p>We do not sell your information or share it for advertising.</p>
      </>
    ),
  },
  {
    id: "services",
    title: "Services we use",
    content: (
      <>
        <p>
          A few providers handle data for us, each under its own privacy policy:
        </p>
        <LegalList>
          <LegalItem>
            <LegalLink href="https://vercel.com/legal/privacy-policy">
              Vercel
            </LegalLink>{" "}
            hosts the site and keeps its server logs.
          </LegalItem>
          <LegalItem>
            <LegalLink href="https://www.cloudflare.com/privacypolicy/">
              Cloudflare
            </LegalLink>{" "}
            runs our DNS, the Turnstile check on the contact form, and Web
            Analytics.
          </LegalItem>
          <LegalItem>
            <LegalLink href="https://resend.com/legal/privacy-policy">
              Resend
            </LegalLink>{" "}
            delivers contact form messages to our inbox.
          </LegalItem>
          <LegalItem>
            <LegalLink href="https://openpanel.dev">OpenPanel</LegalLink>{" "}
            measures how the site is used.
          </LegalItem>
          <LegalItem>
            The email service behind {CONTACT_EMAIL} stores the messages we
            receive.
          </LegalItem>
        </LegalList>
        <p>
          Some of these providers work from the United States, so your
          information may be processed there.
        </p>
      </>
    ),
  },
  {
    id: "how-long-we-keep-it",
    title: "How long we keep it",
    content: (
      <LegalList>
        <LegalItem>
          Messages stay in our inbox for as long as we need them to help you.
          Ask, and we will delete them.
        </LegalItem>
        <LegalItem>
          Usage data follows the retention settings of OpenPanel and Cloudflare,
          and we only look at it in totals.
        </LegalItem>
        <LegalItem>
          The counters that limit form sends live in server memory and clear
          within minutes.
        </LegalItem>
        <LegalItem>Vercel keeps server logs for a limited time.</LegalItem>
      </LegalList>
    ),
  },
  {
    id: "your-choices",
    title: "Your choices",
    content: (
      <LegalList>
        <LegalItem>
          Email{" "}
          <LegalLink href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </LegalLink>{" "}
          to get a copy of your information, correct it, or have it deleted.
        </LegalItem>
        <LegalItem>
          Block analytics with your browser settings or a content blocker. The
          site works the same without it.
        </LegalItem>
        <LegalItem>
          Clear the saved preferences at any time in your browser settings.
        </LegalItem>
        <LegalItem>
          Depending on where you live, local law may give you more rights. Email
          us and we will help.
        </LegalItem>
      </LegalList>
    ),
  },
  {
    id: "children",
    title: "Children",
    content: (
      <p>
        Cortexcn is made for developers. It is not meant for children, and we do
        not knowingly collect information from them.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    content: (
      <p>
        When this policy changes, we update this page and the date at the top.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    content: (
      <p>
        Privacy questions go to{" "}
        <LegalLink href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</LegalLink>{" "}
        or{" "}
        <LegalLink href={`tel:${CONTACT_PHONE.e164}`}>
          {CONTACT_PHONE.display}
        </LegalLink>
        . You can also use the{" "}
        <LegalLink href="/contact">contact form</LegalLink>.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <>
      <main className="flex flex-1 flex-col">
        <TitleBand title="Privacy policy" />
        <LegalDocument
          label="Privacy policy"
          sections={SECTIONS}
          summary={SUMMARY}
          updated={UPDATED}
        />
      </main>
      <LandingFooter />
    </>
  );
}
