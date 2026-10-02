import type { CatalogItem } from "@/lib/mcp/catalog";

const WORD = /[a-z0-9]+/g;

/** Words that say little about what someone is looking for. */
const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "for",
  "i",
  "in",
  "me",
  "my",
  "of",
  "on",
  "or",
  "show",
  "the",
  "to",
  "with",
  "need",
  "want",
  "add",
  "component",
  "components",
  "cortexcn",
]);

function words(text: string) {
  return (text.toLowerCase().match(WORD) ?? []).filter(
    (word) => !STOP_WORDS.has(word),
  );
}

/** "chart" matches "charts", "nav" matches "navigation", and so on. */
function matches(term: string, word: string) {
  return word === term || word.startsWith(term) || term.startsWith(word);
}

/** True when every letter of `term` appears in `text`, in order. */
function isSubsequence(term: string, text: string) {
  let at = 0;
  for (const letter of text) {
    if (letter === term[at]) {
      at += 1;
      if (at === term.length) {
        return true;
      }
    }
  }
  return false;
}

function fieldScore(term: string, fieldWords: string[], weight: number) {
  if (fieldWords.includes(term)) {
    return weight;
  }
  return fieldWords.some((word) => matches(term, word)) ? weight * 0.6 : 0;
}

/** How well an item matches the query. Zero means not at all. */
export function scoreItem(item: CatalogItem, query: string) {
  const terms = words(query);
  if (terms.length === 0) {
    return 0;
  }
  const name = words(item.name.replace(/-/g, " "));
  const title = words(item.title);
  const category = words(`${item.category} ${item.kind}`);
  const description = words(item.description);
  const phrase = query.trim().toLowerCase();

  let score = 0;
  let matched = 0;
  for (const term of terms) {
    const best = Math.max(
      fieldScore(term, name, 10),
      fieldScore(term, title, 8),
      fieldScore(term, category, 5),
      fieldScore(term, description, 3),
      term.length >= 4 && isSubsequence(term, item.name) ? 2 : 0,
    );
    if (best > 0) {
      matched += 1;
    }
    score += best;
  }
  if (matched === 0) {
    return 0;
  }
  // Prefer items that match every word, and exact names above all.
  score *= matched / terms.length;
  const titleText = item.title.toLowerCase();
  if (item.name === phrase || titleText === phrase) {
    score += 25;
  } else if (titleText.includes(" ") && phrase.includes(titleText)) {
    // "line chart with tooltip" names the Line Chart outright.
    score += 8;
  }
  return score;
}

export function searchItems(
  items: CatalogItem[],
  query: string,
  limit: number,
) {
  return items
    .map((item) => ({ item, score: scoreItem(item, query) }))
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.item.name.localeCompare(b.item.name))
    .slice(0, limit);
}
