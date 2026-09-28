import {
  CONTACT_EMAIL,
  CONTACT_LOCATION,
  CONTACT_PHONE,
} from "@/lib/contact-details";
import { DOCS_URL, SITE_URL } from "@/lib/site-url";

import { type ContactInput, contactTopicLabel } from "../validation";
import {
  button,
  COLORS,
  detailRows,
  emailDocument,
  escapeHtml,
  formatReceivedAt,
  MONO,
  monoLabel,
  SANS,
  textLink,
} from "./layout";

const NEXT_STEPS = [
  { label: "Documentation", href: `${DOCS_URL}/docs` },
  { label: "Components", href: `${DOCS_URL}/docs/components` },
  { label: "Blocks", href: `${DOCS_URL}/blocks` },
];

function nextStepRows() {
  return NEXT_STEPS.map(
    (step, index) => `<tr>
    <td width="28" style="width:28px;padding:9px 0;${monoLabel()}">${String(index + 1).padStart(2, "0")}</td>
    <td style="padding:9px 0;font-family:${SANS};font-size:15px;line-height:1.3;letter-spacing:-0.02em;"><a href="${escapeHtml(step.href)}" style="color:${COLORS.text};text-decoration:none;">${escapeHtml(step.label)}</a></td>
    <td align="right" style="padding:9px 0;font-family:${MONO};font-size:13px;color:${COLORS.primary};"><a href="${escapeHtml(step.href)}" style="color:${COLORS.primary};text-decoration:none;">&#8599;</a></td>
  </tr>`,
  ).join("");
}

/**
 * The note that goes back to whoever sent the form. It repeats only the
 * topic, never the message, so the form cannot be used to mail spam to others.
 */
export function senderConfirmationEmail(input: ContactInput, sentAt: Date) {
  const topic = contactTopicLabel(input.topic);
  const subject = "We got your message";
  const sent = formatReceivedAt(sentAt);

  const body = `<tr>
  <td class="px" style="padding:20px 24px 0;">
    <p style="margin:0;font-family:${SANS};font-size:18px;line-height:1.45;letter-spacing:-0.03em;color:${COLORS.text};">Thanks for writing to Cortexcn. A person reads every message, and the reply will come from <span style="font-family:${MONO};font-size:15px;">${CONTACT_EMAIL}</span> to this address.</p>
  </td>
</tr>
<tr>
  <td class="px" style="padding:24px 24px 8px;">
    ${detailRows([
      [
        "Topic",
        `<span style="display:inline-block;width:7px;height:7px;margin-right:8px;background:${COLORS.primary};vertical-align:middle;"></span><span style="vertical-align:middle;">${escapeHtml(topic)}</span>`,
      ],
      ["Sent", escapeHtml(sent)],
      ["Reply to", escapeHtml(input.email)],
    ])}
  </td>
</tr>
<tr>
  <td class="px" style="padding:28px 24px 0;">
    <p style="margin:0 0 4px;${monoLabel()}">While you wait</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">${nextStepRows()}</table>
  </td>
</tr>
<tr>
  <td class="px" style="padding:24px 24px 12px;">
    ${button("Browse components", `${DOCS_URL}/docs/components`)}
  </td>
</tr>`;

  const footer = `${textLink(CONTACT_EMAIL, `mailto:${CONTACT_EMAIL}`)} &nbsp;/&nbsp; ${textLink(CONTACT_PHONE.display, `tel:${CONTACT_PHONE.e164}`)} &nbsp;/&nbsp; ${escapeHtml(CONTACT_LOCATION)}<br><br>You got this email because this address was used on the contact form at ${textLink("www.cortexcn.dev", `${SITE_URL}/contact`)}. If that was not you, you can ignore it. ${textLink("Privacy policy", `${SITE_URL}/privacy`)}`;

  const html = emailDocument({
    title: subject,
    preheader: `Thanks, ${input.firstName}. Your message about ${topic.toLowerCase()} is in our inbox.`,
    eyebrow: "Contact form",
    label: "Message received",
    heading: `Thanks, ${input.firstName}.`,
    subheading: "Your message is in our inbox",
    body,
    footer,
  });

  const text = [
    `Thanks, ${input.firstName}.`,
    "",
    "Your message is in our inbox. A person reads every message, and the reply",
    `will come from ${CONTACT_EMAIL} to this address.`,
    "",
    `Topic: ${topic}`,
    `Sent: ${sent}`,
    "",
    "While you wait:",
    ...NEXT_STEPS.map((step) => `- ${step.label}: ${step.href}`),
    "",
    `${CONTACT_EMAIL} / ${CONTACT_PHONE.display} / ${CONTACT_LOCATION}`,
    "You got this email because this address was used on the contact form at www.cortexcn.dev. If that was not you, you can ignore it.",
  ].join("\n");

  return { subject, html, text };
}
