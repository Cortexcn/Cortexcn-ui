import {
  CONTACT_LIMITS,
  CONTACT_TOPICS,
  type ContactTopic,
} from "./validation";

const TOPIC_PARAM = "topic";
const MESSAGE_PARAM = "message";

export interface ContactPrefill {
  topic?: ContactTopic;
  message?: string;
}

/** A link to /contact with the topic picked and a draft message filled in. */
export function contactHref(topic: ContactTopic, message: string) {
  const params = new URLSearchParams({
    [TOPIC_PARAM]: topic,
    [MESSAGE_PARAM]: message,
  });
  return `/contact?${params.toString()}`;
}

/** Reads a prefill from a query string, keeping only what the form accepts. */
export function readContactPrefill(search: string): ContactPrefill {
  const params = new URLSearchParams(search);
  const topicParam = params.get(TOPIC_PARAM);
  const topic = CONTACT_TOPICS.find(
    (option) => option.value === topicParam,
  )?.value;
  const message = params
    .get(MESSAGE_PARAM)
    ?.slice(0, CONTACT_LIMITS.messageMax);
  return { topic, message: message?.trim() ? message : undefined };
}
