// Guards the Tier 1 cached Q&A: corpus/qa.json must match the QA_CACHE inlined
// in src/app.jsx, and every sourceId must reference a real corpus chunk.
// Run: node eval/qa-sync.mjs
import { readFileSync } from "node:fs";

const qa = JSON.parse(readFileSync(new URL("../corpus/qa.json", import.meta.url)));
const chunks = JSON.parse(readFileSync(new URL("../corpus/chunks.json", import.meta.url)));
const appSrc = readFileSync(new URL("../src/app.jsx", import.meta.url), "utf8");

const chunkIds = new Set(chunks.map((c) => c.id));
let fail = false;

// 0. Duplicate qa ids.
const seenQa = new Set();
for (const e of qa) {
  if (seenQa.has(e.id)) {
    console.error(`FAIL: duplicate qa id "${e.id}"`);
    fail = true;
  }
  seenQa.add(e.id);
}

// 1. Every sourceId resolves to a real chunk, and answer citations map to sources.
for (const e of qa) {
  for (const id of e.sourceIds) {
    if (!chunkIds.has(id)) {
      console.error(`FAIL: ${e.id} references unknown chunk "${id}"`);
      fail = true;
    }
  }
  const cited = [...new Set((e.answer.match(/\[(\d+)\]/g) || []).map((s) => parseInt(s.slice(1, -1), 10)))];
  for (const n of cited) {
    if (n < 1 || n > e.sourceIds.length) {
      console.error(`FAIL: ${e.id} cites [${n}] but has ${e.sourceIds.length} source(s)`);
      fail = true;
    }
  }
}

// 2. Inlined QA_CACHE matches qa.json.
const m = appSrc.match(/const QA_CACHE = (\[[\s\S]*?\]);\n/);
if (!m) {
  console.error("FAIL: could not find QA_CACHE in src/app.jsx");
  fail = true;
} else {
  const inlined = eval("(" + m[1] + ")");
  const norm = (arr) =>
    JSON.stringify([...arr].sort((a, b) => a.id.localeCompare(b.id)).map((e) => ({ id: e.id, question: e.question, answer: e.answer, sourceIds: e.sourceIds })));
  if (inlined.length !== qa.length || norm(inlined) !== norm(qa)) {
    console.error(`FAIL: QA_CACHE in app.jsx differs from qa.json (${inlined.length} vs ${qa.length})`);
    fail = true;
  }
}

if (fail) process.exit(1);
console.log(`PASS: ${qa.length} cached Q&A in sync, all sourceIds valid, all citations in range.`);
