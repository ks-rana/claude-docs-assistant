# Claude Docs Assistant

A retrieval-augmented generation (RAG) chatbot that answers questions about the Claude Platform documentation, grounded only in a curated corpus. Every answer cites its sources with links, and questions outside the loaded docs get an explicit out-of-scope reply that points to the closest section instead of a guess. It runs as a single-file React artifact inside Claude.ai at zero infrastructure cost.

The design goal is verifiability over coverage: rather than trusting a model's memory of the docs, this tool retrieves real documentation content, shows exactly which sources it used, and refuses to answer beyond them.

## Run it

Version 1 runs as a Claude.ai artifact, with no server and no API key of your own.

1. Open a new chat on claude.ai.
2. Paste the entire contents of [`src/app.jsx`](src/app.jsx) into the message and send it.
3. Claude renders it as an interactive artifact. Click "I understand" on the notice, then ask a question.

The artifact calls the Anthropic Messages API through your own Claude session (keyless in the artifact environment), so usage counts against your own account and costs you nothing beyond your existing plan.

### Local preview (no API, for QA)

To see the interface and test retrieval offline with no API call, serve the repo and open the mock preview:

```bash
python -m http.server 8099
```

Then open `http://localhost:8099/preview/` . Mock mode fills in placeholder answers, but retrieval and the source trace are real, so you can check that questions surface sensible sources. See [`preview/README.md`](preview/README.md).

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
                          closest section link                    |
                          + matched words, no answer     one Messages API call
                                                          system prompt (rules
                                                          + current chunks) +
                                                          conversation history
                                                                  |
                                                          grounded answer with
                                                          numbered [n] citations
                                                          + a Sources list of links
```

Two tiers serve answers:

- Tier 1, a cached question-and-answer set ([`corpus/qa.json`](corpus/qa.json)) surfaced as type-ahead suggestions. Picking a suggestion serves a pre-written, source-cited answer instantly with no API call.
- Tier 2, the full retrieval pipeline for any typed question: client-side BM25-lite retrieval selects the top chunks, and a single Messages API call answers grounded only in them.

If the best retrieval score is below a relevance cutoff, the tool skips the API call and returns a graceful out-of-scope reply: it names the closest loaded section as a link and the query words that matched it, with no answer.

## Design decisions

- Lexical retrieval instead of embeddings (DD-1). The corpus is small and terminologically dense, where keyword overlap retrieves near-par with vector search, without an embedding API, cost, or latency.
- Chunks travel in the current call only (DD-2). Prior turns are resent as plain text without their historical chunks, which is the main token-saving mechanism.
- Refusal over recall (DD-3). The model is instructed to answer only from the provided excerpts, even when it knows more. A correct refusal is a success, because the product's promise is verifiability, not coverage.
- Relevance short-circuit. Clearly out-of-scope questions are answered client-side (closest-match link) with no API call. A lexical score cannot perfectly separate in-scope from out-of-scope, so the model's own refusal remains the authoritative judge for borderline questions in a live run.
- Zero infrastructure cost in v1: no API key, no hosting, no external services.

## Responsible AI

The tool is itself an AI system, so it models the practices it documents. The AI-generated nature is disclosed twice: a blocking acknowledgment gate on first load, and a persistent per-message label ("AI-generated, verify against official docs"). Every substantive claim is attributable to a retrievable source shown in the answer's Sources list, and the gate states plainly that this is an independent educational project, not affiliated with or endorsed by Anthropic.

## Corpus

Curated from the Claude Platform documentation across three areas: prompt engineering, guardrails, and build-with-Claude API features. 35 chunks across 11 source pages, captured July 2026. Content is condensed and paraphrased from the docs; each chunk links to its original page as the authoritative source.

- Raw source material: [`corpus/raw/`](corpus/raw) (one file per page, canonical URL on the first line).
- Built corpus: [`corpus/chunks.json`](corpus/chunks.json).
- Cached Q&A: [`corpus/qa.json`](corpus/qa.json).

Editing the corpus is data-only. After changing `chunks.json` or `qa.json`, regenerate the copy inlined in the artifact and validate:

```bash
node scripts/sync-inline.mjs
node corpus/validate.mjs
node eval/corpus-sync.mjs
node eval/qa-sync.mjs
```

Intentionally out of the corpus (so out-of-scope refusal can be tested): model pricing, rate limits, fine-tuning, the embeddings API, computer use setup, batch processing, files and PDF handling, the citations API, and context-window mechanics.

The corpus content was independently audited against the live official pages; see the accuracy pass recorded in [`docs/build-log.md`](docs/build-log.md).

## Evaluation

The evaluation set ([`eval/eval-set.md`](eval/eval-set.md)) is written from the raw docs pages, not the chunks, so it also catches curation gaps: 10 grounding questions (including partial-coverage cases), 5 out-of-corpus refusal questions, and 1 prompt-injection case, plus results tables for accessibility, resilience, and a token audit.

Zero-cost checks that run without any API call:

```bash
node eval/retrieval-test.mjs   # retrieval quality preview (E-3): 10/10 grounding, 4/4 example pills
node eval/corpus-sync.mjs      # corpus in chunks.json matches the copy inlined in app.jsx
node eval/qa-sync.mjs          # cached Q&A matches, source ids resolve, citations in range, no duplicate ids
```

Grounded answer quality and refusal behavior require a live run in the Claude.ai artifact (the E-1 and E-2 tests in the eval set).

## Deployment status

Version 1 is artifact-only by design, and free. It is not deployed to a public URL; it runs when pasted into a Claude.ai chat, and can be shared via Claude.ai's artifact share link.

A public deployment is deliberately out of scope for v1 because it costs money: a hosted version would call the API with a key you own and pay for, so it needs a serverless function to hold that key, per-visitor rate limiting, and a hard spend cap. See the roadmap.

## Known limitations

- The corpus is a snapshot; docs change, so answers can go out of date. Each chunk links to its live source for verification.
- Retrieval is lexical, so unusual phrasing can miss the right chunk; the keyword fields mitigate this and the cached Q&A covers common questions.
- Cached Tier 1 answers are served without a live grounding step, so they are author-verified against the docs rather than generated per request.
- No persistence: a page reload clears the conversation and shows the gate again (intended).

## Roadmap

- v2 deployment: Next.js on Vercel with a serverless function holding the API key, per-visitor rate limiting, and a hard spend cap in the Anthropic console. Alternative zero-cost public option: a bring-your-own-key field so each visitor supplies their own Anthropic key, allowing a static host with no cost to the author.
- v2 corpus tooling and history summarization for very long conversations.
- v3 hybrid retrieval (add embeddings only if corpus growth degrades retrieval quality).

## Repository layout

```
docs/        specification, UI design spec, workflow, build log, interview notes
corpus/      raw source pages, chunks.json, qa.json, validate.mjs
eval/        evaluation set and zero-cost check scripts
src/         app.jsx, the single-file artifact
preview/     local mock preview harness
scripts/     sync-inline.mjs (regenerate the inlined corpus)
.claude/     project memory and skills
```

This project was designed and its architecture and requirements authored by Khushi Rana, with AI-assisted implementation.
