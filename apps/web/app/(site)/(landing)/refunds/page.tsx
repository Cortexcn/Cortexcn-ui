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
import { PLAN_REFUND_DAYS } from "@/lib/service-pricing";

export const metadata = pageMetadata({
  title: "Refund policy",
  description:
    "When Cortexcn refunds a component plan, a project deposit, or a monthly retainer, and how to ask for one.",
  path: "/refunds",
});

const UPDATED = "September 27, 2026";

const SUMMARY = `Component plans are refunded in full within ${PLAN_REFUND_DAYS} days. Project deposits are refunded in full until work starts, and after that for the work not yet done. Monthly plans stop when you cancel.`;

const SECTIONS: LegalSection[] = [
  {
    id: "component-plans",
    title: "Component plans",
    content: (
      <LegalList>
        <LegalItem>
          Pro and Ultra are one-time payments. If a plan is not right for you,
          ask within {PLAN_REFUND_DAYS} days of buying it and we refund the full
          price. You do not need a reason, though it helps us to hear one.
        </LegalItem>
        <LegalItem>
          A refund ends the license: the plan&apos;s key stops working, and the
          paid components and templates should come out of your projects.
        </LegalItem>
        <LegalItem>
          After {PLAN_REFUND_DAYS} days, plans are not refundable, except where
          the law says otherwise. A double charge or a charge made by mistake is
          refunded at any time.
        </LegalItem>
        <LegalItem>
          The Free plan costs nothing, so there is nothing to refund.
        </LegalItem>
      </LegalList>
    ),
  },
  {
    id: "projects",
    title: "Client projects",
    content: (
      <LegalList>
        <LegalItem>
          Projects are paid in two parts, as your written quote sets out: 50% to
          start and 50% before launch.
        </LegalItem>
        <LegalItem>
          Cancel before work starts, and we refund the deposit in full.
        </LegalItem>
        <LegalItem>
          Cancel after work starts, and we keep the part of the deposit that
          covers the time already spent, refund the rest, and hand over
          everything built up to that point.
        </LegalItem>
        <LegalItem>
          The second payment is due once you approve the finished work. After a
          project launches, its payments are not refundable, and the 30 days of
          fixes after launch still apply.
        </LegalItem>
        <LegalItem>
          If we cannot deliver something the quote describes, we refund what you
          paid for that part.
        </LegalItem>
      </LegalList>
    ),
  },
  {
    id: "retainers",
    title: "Retainers and care plans",
    content: (
      <LegalList>
        <LegalItem>
          Retainers and the care plan are billed monthly, in advance.
        </LegalItem>
        <LegalItem>
          Cancel at least 2 weeks before your next billing date, and you are not
          billed again. A month that has already started is not refunded, and
          its hours stay yours to use until it ends.
        </LegalItem>
        <LegalItem>
          If we cannot give you the hours agreed for a month, we refund the
          missing hours or add them to the next month, whichever you prefer.
        </LegalItem>
      </LegalList>
    ),
  },
  {
    id: "not-refundable",
    title: "What we cannot refund",
    content: (
      <LegalList>
        <LegalItem>
          Money already paid to others for your project, such as domains,
          hosting, paid APIs, fonts, or stock images.
        </LegalItem>
        <LegalItem>
          Fees your bank or card provider charges, and differences in exchange
          rates when your bank converted the payment from another currency.
        </LegalItem>
      </LegalList>
    ),
  },
  {
    id: "how-to-ask",
    title: "How to ask for a refund",
    content: (
      <>
        <p>
          Write to{" "}
          <LegalLink href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </LegalLink>{" "}
          from the address you paid with. Include your order or invoice number
          and a line about what went wrong.
        </p>
        <p>
          We reply within 2 business days. An approved refund goes back to the
          way you paid, in US dollars, and usually arrives within 5 to 10
          business days, depending on your bank.
        </p>
      </>
    ),
  },
  {
    id: "disputes",
    title: "Disputes",
    content: (
      <p>
        Please write to us before you open a dispute with your bank or card
        provider. Most problems are faster to sort out directly, and we would
        rather fix it with you.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    content: (
      <p>
        When this policy changes, we update this page and the date at the top.
        The policy in place on the day you paid applies to that payment.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    content: (
      <p>
        Questions about a refund go to{" "}
        <LegalLink href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</LegalLink>{" "}
        or{" "}
        <LegalLink href={`tel:${CONTACT_PHONE.e164}`}>
          {CONTACT_PHONE.display}
        </LegalLink>
        . The <LegalLink href="/terms">terms and conditions</LegalLink> cover
        the rest of how plans and client work are sold.
      </p>
    ),
  },
];

export default function RefundsPage() {
  return (
    <>
      <main className="flex flex-1 flex-col">
        <TitleBand title="Refund policy" />
        <LegalDocument
          label="Refund policy"
          sections={SECTIONS}
          summary={SUMMARY}
          updated={UPDATED}
        />
      </main>
      <LandingFooter />
    </>
  );
}
