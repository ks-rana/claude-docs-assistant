// Guards against drift between the source corpus (corpus/chunks.json) and the
// copy inlined in src/app.jsx. The artifact ships the inlined copy, so the two
// must stay identical. Run: node eval/corpus-sync.mjs
import { readFileSync } from "node:fs";

const json = JSON.parse(readFileSync(new URL("../corpus/chunks.json", import.meta.url)));
const appSrc = readFileSync(new URL("../src/app.jsx", import.meta.url), "utf8");

const m = appSrc.match(/const CORPUS = (\[[\s\S]*?\]);\n/);
if (!m) {
  console.error("FAIL: could not find the CORPUS array in src/app.jsx");
  process.exit(1);
}
// The array is a plain JS literal (double-quoted values, unquoted keys); eval it.
const inlined = eval("(" + m[1] + ")");

const norm = (arr) =>
  JSON.stringify(
    [...arr]
      .sort((a, b) => a.id.localeCompare(b.id))
      .map((c) => ({ id: c.id, page: c.page, section: c.section, url: c.url, keywords: c.keywords, text: c.text }))
  );

if (json.length !== inlined.length) {
  console.error(`FAIL: chunk count differs (chunks.json ${json.length}, app.jsx ${inlined.length})`);
  process.exit(1);
}
if (norm(json) === norm(inlined)) {
  console.log(`PASS: corpus in sync (${json.length} chunks identical in chunks.json and src/app.jsx)`);
} else {
  const ids = new Set(json.map((c) => c.id));
  const inIds = new Set(inlined.map((c) => c.id));
  const missing = [...ids].filter((i) => !inIds.has(i));
  const extra = [...inIds].filter((i) => !ids.has(i));
  console.error("FAIL: corpus differs between chunks.json and src/app.jsx.");
  if (missing.length) console.error("  ids in chunks.json but not app.jsx: " + missing.join(", "));
  if (extra.length) console.error("  ids in app.jsx but not chunks.json: " + extra.join(", "));
  // Field-level diff for shared ids
  const byId = (arr) => Object.fromEntries(arr.map((c) => [c.id, c]));
  const a = byId(json), b = byId(inlined);
  for (const id of ids) {
    if (!b[id]) continue;
    for (const f of ["page", "section", "url", "text"]) {
      if (a[id][f] !== b[id][f]) console.error(`  ${id}.${f} differs`);
    }
    if (JSON.stringify(a[id].keywords) !== JSON.stringify(b[id].keywords)) console.error(`  ${id}.keywords differ`);
  }
  process.exit(1);
}
