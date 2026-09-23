// Corpus validation per requirements 4.1 and 12. Run: node corpus/validate.mjs
import { readFileSync } from "node:fs";

const REQUIRED = ["id", "page", "section", "url", "keywords", "text"];
const MIN_TOKENS = 150;
const MAX_TOKENS = 500;
const estTokens = (s) => Math.round(s.length / 4); // chars/4 heuristic (requirements E-6)

const chunks = JSON.parse(readFileSync(new URL("./chunks.json", import.meta.url)));
const lines = [];
const log = (s) => lines.push(s);

log(`# Corpus validation report\n`);
log(`Total chunks: ${chunks.length}\n`);

// Per-page counts
const perPage = {};
for (const c of chunks) perPage[c.page] = (perPage[c.page] || 0) + 1;
log(`## Chunks per page`);
for (const [p, n] of Object.entries(perPage)) log(`- ${p}: ${n}`);
log("");

// Missing fields
const missing = [];
for (const c of chunks)
  for (const f of REQUIRED)
    if (!(f in c) || c[f] === "" || (Array.isArray(c[f]) && c[f].length === 0))
      missing.push(`${c.id || "(no id)"} missing ${f}`);
log(`## Missing required fields`);
log(missing.length ? missing.map((m) => `- ${m}`).join("\n") : "- none");
log("");

// Duplicate ids
const seen = new Map();
const dups = [];
for (const c of chunks) {
  if (seen.has(c.id)) dups.push(c.id);
  seen.set(c.id, true);
}
log(`## Duplicate ids`);
log(dups.length ? dups.map((d) => `- ${d}`).join("\n") : "- none");
log("");

// id prefix check
const badPrefix = chunks.filter((c) => !/^(pe|gr|uc|te|bc)-/.test(c.id)).map((c) => c.id);
log(`## Ids without a valid area prefix (pe-/gr-/uc-/te-)`);
log(badPrefix.length ? badPrefix.map((d) => `- ${d}`).join("\n") : "- none");
log("");

// keyword count check (3 to 8)
const badKw = chunks
  .filter((c) => !Array.isArray(c.keywords) || c.keywords.length < 3 || c.keywords.length > 8)
  .map((c) => `${c.id} has ${c.keywords ? c.keywords.length : 0} keywords`);
log(`## Keyword count outside 3 to 8`);
log(badKw.length ? badKw.map((d) => `- ${d}`).join("\n") : "- none");
log("");

// Token sizes
log(`## Token estimate per chunk (chars/4), flagged if outside ${MIN_TOKENS} to ${MAX_TOKENS}`);
const violations = [];
for (const c of chunks) {
  const t = estTokens(c.text);
  const flag = t < MIN_TOKENS ? " LOW" : t > MAX_TOKENS ? " HIGH" : "";
  if (flag) violations.push(`${c.id}: ${t}${flag}`);
  log(`- ${c.id}: ${t} tokens${flag}`);
}
log("");
log(`## Size violations`);
log(violations.length ? violations.map((v) => `- ${v}`).join("\n") : "- none");
log("");

// Section list for gap-spotting
log(`## All section names (for coverage gap review)`);
for (const c of chunks) log(`- [${c.id}] ${c.page} / ${c.section}`);
log("");

const clean = !missing.length && !dups.length && !violations.length && !badPrefix.length && !badKw.length;
log(`## Result: ${clean ? "PASS, all checks clean" : "ATTENTION, see flags above"}`);

console.log(lines.join("\n"));
