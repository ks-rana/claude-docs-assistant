# Claude Docs Assistant

A retrieval-augmented generation (RAG) chatbot that answers questions about the Claude Platform documentation, grounded only in a curated corpus. Every answer cites its sources with links, and questions outside the loaded docs get an explicit "outside scope" reply that points to the closest section instead of a guess. It runs as a single-file React artifact at zero infrastructure cost.

The design goal is verifiability over coverage: rather than trusting a model's memory of the docs, this tool retrieves real documentation content, shows exactly which sources it used, and refuses to answer beyond them.

**[▶ Live demo](REPLACE-WITH-YOUR-PUBLISHED-LINK)** · Independent educational project, not affiliated with or endorsed by Anthropic.

## Run it

Version 1 runs as a Claude.ai artifact, with no server and no API key of your own.

1. Open a new chat on claude.ai.
2. Paste the entire contents of `src/app.jsx` and send it.
3. Claude renders it as an interactive artifact. Click "I understand" on the notice, then ask a question.

The artifact calls the Anthropic Messages API through your own Claude session (keyless in the artifact environment), so usage counts against your own account.

### Local preview (no API, for QA)

Serve the repo and open the mock preview to test the interface and retrieval offline:

```
python -m http.server 8099
```

Then open `http://localhost:8099/preview/` . Mock mode fills in placeholder answers, but retrieval and the source list are real, so you can check that questions surface sensible sources.

## How it works

```
                 user question
                      |
        +-------------+--------------------------+
        | as you type                            | on submit
        v                                        v
   Tier 1: cached Q&A                   Client-side retrieval
   type-ahead suggestions               BM25-lite over the corpus
        |                                        |
   pick one -> served instantly          best score >= cutoff ?
   (no API call), with sources          /                    \
                                       no                      yes
                                        |                        |
                          Graceful out-of-scope:        top-k chunks (k=4)
                          closest section link          + one Messages API call
                          + matched words, no answer    grounded answer with
                                                         numbered [n] citations
                                                         + a Sources list of links
```

Two tiers serve answers:

- **Tier 1** is a cached question-and-answer set surfaced as type-ahead suggestions. Picking a suggestion serves a pre-written, source-cited answer instantly with no API call.
- **Tier 2** is the full retrieval pipeline for any typed question: client-side BM25-lite retrieval selects the top chunks, and a single Messages API call answers grounded only in them.

If the best retrieval score is below a relevance cutoff, the tool skips the API call and returns a graceful out-of-scope reply naming the closest loaded section and the query words that matched it.

## Design decisions

- **Lexical retrieval instead of embeddings.** The corpus is small and terminologically dense, where keyword overlap retrieves near-par with vector search, without an embedding API, cost, or latency.
- **Chunks travel in the current call only.** Prior turns are resent as plain text without their historical chunks, the main token-saving mechanism.
- **Refusal over recall.** The model answers only from the provided excerpts, even when it knows more. A correct refusal is a success, because the promise is verifiability, not coverage.
- **Zero infrastructure cost in v1:** no API key, no hosting, no external services.

## Responsible AI

The tool is itself an AI system, so it models the practices it documents. Its AI-generated nature is disclosed twice: a blocking acknowledgment gate on first load, and a persistent per-message label. Every claim is attributable to a source shown in the answer's Sources list, and the gate states plainly that this is an independent educational project, not affiliated with or endorsed by Anthropic.

## Corpus

Curated from the Claude Platform documentation across three areas: prompt engineering, guardrails, and build-with-Claude API features. 35 chunks across 11 source pages. Content is condensed from the docs; each chunk links to its original page as the authoritative source, and the whole corpus was independently audited against the live official pages.

- Raw source material: `corpus/raw/` (one file per page, canonical URL on the first line)
- Built corpus: `corpus/chunks.json` · Cached Q&A: `corpus/qa.json`

Editing the corpus is data-only. After changing `chunks.json` or `qa.json`, regenerate the inlined copy and validate:

```
node scripts/sync-inline.mjs
node corpus/validate.mjs
node eval/corpus-sync.mjs
node eval/qa-sync.mjs
```

## Evaluation

The evaluation set (`eval/eval-set.md`) is written from the raw docs pages, not the chunks, so it also catches curation gaps: 10 grounding questions, 5 out-of-corpus refusal questions, and 1 prompt-injection case.

Zero-cost checks that run without any API call:

```
node eval/retrieval-test.mjs   # retrieval quality: 10/10 grounding, 4/4 example pills, plus a regression set
node eval/corpus-sync.mjs      # corpus matches the copy inlined in app.jsx
node eval/qa-sync.mjs          # cached Q&A: sources resolve, citations in range, no duplicate ids
```

Grounded answer quality and refusal behavior are validated in a live run of the artifact.

## Known limitations

- The corpus is a snapshot; docs change, so answers can go out of date. Each chunk links to its live source.
- Retrieval is lexical, so unusual or very broad phrasing can miss the right chunk; keyword fields and the cached Q&A mitigate this.
- Cached Tier 1 answers are served without a live grounding step, so they are author-verified against the docs.
- No persistence: a reload clears the conversation and shows the gate again (intended).

## Roadmap

- v2 deployment: a serverless function holding the API key with per-visitor rate limiting and a spend cap, or a bring-your-own-key field for a zero-cost public build.
- v2 corpus tooling and history summarization for long conversations.
- v3 hybrid retrieval (add embeddings only if corpus growth degrades retrieval quality).

## Repository layout

```
docs/        specification, UI design spec, workflow, build log, interview notes
corpus/      raw source pages, chunks.json, qa.json, validate.mjs
eval/        evaluation set and zero-cost check scripts
src/         app.jsx, the single-file artifact
preview/     local mock preview harness
scripts/     sync-inline.mjs (regenerate the inlined corpus)
```

Designed, specified, and architected by Khushi Rana, with AI-assisted implementation. Licensed under MIT.
