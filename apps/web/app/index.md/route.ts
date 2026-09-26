import { HOME_MARKDOWN } from "@/lib/home-markdown";
import { markdownResponse } from "@/lib/llms";
import { SITE_URL } from "@/lib/site-url";

export const dynamic = "force-static";

export function GET() {
  return markdownResponse(HOME_MARKDOWN, `${SITE_URL}/`);
}
