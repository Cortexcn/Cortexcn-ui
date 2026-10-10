/**
 * A small line diff that prints unified diffs, enough for the files
 * apply_design_system touches (a few hundred lines at most).
 */

interface Op {
  kind: " " | "-" | "+";
  line: string;
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: the textbook LCS table and walk, clearer as one function
function operations(before: string[], after: string[]): Op[] {
  const n = before.length;
  const m = after.length;
  const width = m + 1;
  // lcs[i * width + j]: longest common subsequence of before[i..], after[j..].
  const lcs = new Int32Array((n + 1) * width);
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      lcs[i * width + j] =
        before[i] === after[j]
          ? (lcs[(i + 1) * width + j + 1] ?? 0) + 1
          : Math.max(
              lcs[(i + 1) * width + j] ?? 0,
              lcs[i * width + j + 1] ?? 0,
            );
    }
  }
  const ops: Op[] = [];
  let i = 0;
  let j = 0;
  while (i < n || j < m) {
    const a = before[i];
    const b = after[j];
    if (i < n && j < m && a === b) {
      ops.push({ kind: " ", line: a ?? "" });
      i++;
      j++;
    } else if (
      j >= m ||
      (i < n &&
        (lcs[(i + 1) * width + j] ?? 0) >= (lcs[i * width + j + 1] ?? 0))
    ) {
      ops.push({ kind: "-", line: a ?? "" });
      i++;
    } else {
      ops.push({ kind: "+", line: b ?? "" });
      j++;
    }
  }
  return ops;
}

const CONTEXT = 3;

/** Groups changed operations with up to CONTEXT unchanged lines around them. */
function hunkRanges(ops: Op[]): [number, number][] {
  const changed = ops
    .map((op, index) => (op.kind === " " ? -1 : index))
    .filter((index) => index >= 0);
  const ranges: [number, number][] = [];
  for (const index of changed) {
    const start = Math.max(0, index - CONTEXT);
    const end = Math.min(ops.length, index + CONTEXT + 1);
    const last = ranges.at(-1);
    if (last && start <= last[1]) {
      last[1] = end;
    } else {
      ranges.push([start, end]);
    }
  }
  return ranges;
}

/** A unified diff of `before` to `after`; `before` is null for a new file. */
export function unifiedDiff(
  path: string,
  before: string | null,
  after: string,
): string {
  const ops = operations(
    before === null ? [] : before.split("\n"),
    after.split("\n"),
  );
  // Line numbers before each operation, in the old and new files.
  const oldAt: number[] = [];
  const newAt: number[] = [];
  let oldLine = 1;
  let newLine = 1;
  for (const op of ops) {
    oldAt.push(oldLine);
    newAt.push(newLine);
    if (op.kind !== "+") {
      oldLine++;
    }
    if (op.kind !== "-") {
      newLine++;
    }
  }
  const lines = [
    `--- ${before === null ? "/dev/null" : `a/${path}`}`,
    `+++ b/${path}`,
  ];
  for (const [start, end] of hunkRanges(ops)) {
    const slice = ops.slice(start, end);
    const oldCount = slice.filter((op) => op.kind !== "+").length;
    const newCount = slice.filter((op) => op.kind !== "-").length;
    const oldStart = oldCount === 0 ? (oldAt[start] ?? 1) - 1 : oldAt[start];
    const newStart = newCount === 0 ? (newAt[start] ?? 1) - 1 : newAt[start];
    lines.push(
      `@@ -${oldStart},${oldCount} +${newStart},${newCount} @@`,
      ...slice.map((op) => `${op.kind}${op.line}`),
    );
  }
  return lines.join("\n");
}
