// Regenerate the CORPUS and QA_CACHE arrays inlined in src/app.jsx from the
// source data files (corpus/chunks.json, corpus/qa.json), so the artifact's
// embedded copy can never drift. Run: node scripts/sync-inline.mjs
import { readFileSync, writeFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const chunks = JSON.parse(readFileSync(new URL("corpus/chunks.json", root)));
const qa = JSON.parse(readFileSync(new URL("corpus/qa.json", root)));
const appPath = new URL("src/app.jsx", root);
let src = readFileSync(appPath, "utf8");

const arr = (name, items) =>
  `const ${name} = [\n` + items.map((o) => "  " + JSON.stringify(o) + ",").join("\n") + "\n];";

const before = src;
src = src.replace(/const CORPUS = \[[\s\S]*?\n\];/, arr("CORPUS", chunks));
src = src.replace(/const QA_CACHE = \[[\s\S]*?\n\];/, arr("QA_CACHE", qa));

if (src === before) {
  console.error("FAIL: could not find CORPUS/QA_CACHE arrays to replace");
  process.exit(1);
}
writeFileSync(appPath, src);
console.log(`Inlined ${chunks.length} chunks and ${qa.length} cached Q&A into src/app.jsx`);
