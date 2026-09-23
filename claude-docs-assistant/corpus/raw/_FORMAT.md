# Corpus raw file format

Each file in this folder is one Claude Platform documentation page, saved as the source material the corpus chunks are built from. The built corpus is /corpus/chunks.json; edits to coverage start here in the raw files, then chunks.json is regenerated.

## The format (3 rules)

1. The first line of each file is the full page URL, and nothing else on that line. This becomes the "verify against official docs" link, so it must be the real, working URL.
2. Leave one blank line, then the page content: headings, rules, techniques, parameters, and examples. Navigation menus, marketing, and repeated boilerplate are dropped. Paraphrasing and condensing are fine and preferred over wholesale reproduction (requirements FR-2.4).
3. One file per docs page. Filename is only a label; the page title is read from the content.

## To add or change coverage

Add a new .txt file here in this format, or edit an existing one, then regenerate and validate the corpus:

- Update /corpus/chunks.json so each new section becomes a chunk (schema in requirements 4.1: id, page, section, url, keywords, text, with ids prefixed pe-/gr-/uc-/te-).
- Run `node corpus/validate.mjs` and confirm it reports "PASS, all checks clean".

See reduce-hallucinations.txt for a filled example.
