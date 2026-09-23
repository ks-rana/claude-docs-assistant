# Interview notes

Draft talking points for co-op interviews. These are starting points; put them in your own words before an interview so they sound like you.

## 1. Why lexical retrieval instead of embeddings (DD-1)

The corpus is small (about 35 chunks) and terminologically dense, technical docs where the exact keywords matter. In that regime, keyword-overlap ranking (BM25) retrieves about as well as vector search, without adding an embedding API, its cost, or its latency. So I right-sized the solution to the problem rather than reaching for the heavier tool by default. I documented a revisit trigger: move to embeddings only if the corpus grows past a couple hundred chunks or the retrieval tests start failing.

## 2. How the token budget works (DD-2)

The dominant token cost is the retrieved documentation chunks injected into the prompt. So I only inject the chunks for the current question. Earlier turns are resent as plain text, but their historical chunks are not, because the earlier answers already summarize that evidence. This keeps cost roughly flat as a conversation grows instead of compounding. There is also a client-side short-circuit: if nothing relevant is retrieved, the tool answers "outside the loaded docs" without making an API call at all.

## 3. Why refusal is a feature, not a failure (DD-3)

The product's promise is verifiability, not coverage. The model is told to answer only from the provided excerpts, even when it knows the answer from training. If the docs do not cover a question, the right behavior is to say so and point to the closest source, not to produce a confident answer the user cannot check. I treat a correct refusal as a passing test case, and I wrote explicit out-of-corpus questions to measure it.

## 4. The disclosure and trust design

Because the tool is itself an AI system, it discloses that twice: a one-time acknowledgment gate on first load, and a persistent per-message label. Every answer shows a numbered Sources list linking to the official docs, so a user can verify any claim rather than trust the system's self-report. The gate also states plainly that this is an independent educational project, not an official Anthropic product. The point is to push users toward verification, which is the whole value proposition.

## 5. What the evaluation found

I wrote the evaluation set from the original docs pages, not from my own chunks, so the tests could also catch gaps in my curation. Retrieval quality is measured with a zero-cost Node harness: all 10 grounding questions and all 4 example prompts retrieve the correct chunk in the top four. I also ran an independent accuracy audit of every chunk and cached answer against the live docs, which caught a claim that was no longer on the current page and a couple of imprecise paraphrases; I corrected them. Grounded answer quality and refusal behavior are validated in a live run of the artifact.

## Framing for a portfolio

The strongest story is the engineering judgment, not the chatbot: choosing lexical retrieval on purpose, bounding token cost by design, treating refusal as a measured success case, and verifying the corpus against its sources with an independent audit. The architecture and requirements are mine; the implementation was AI-assisted, which is itself worth saying honestly.
