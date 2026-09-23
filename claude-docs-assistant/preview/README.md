# Local preview (zero cost, no API)

This folder renders `src/app.jsx` in a normal browser with **MOCK_MODE forced on**, so the entire interface works (gate, chat, retrieval trace, refusal, mobile) with no API call and no cost. It is a QA aid only; the real artifact runs on claude.ai. It never changes `src/app.jsx` (the mock flag is flipped only in the loaded copy).

## Run it

From the project root, start a static server and open the preview:

```bash
python -m http.server 8099
```

Then open this URL in your browser:

```
http://localhost:8099/preview/
```

You should see the acknowledgment gate. Click "I understand", then try the example pills or type a question. In mock mode every answer is a placeholder, but retrieval is real: the retrieval trace shows the actual chunks BM25 selected for your question, so you can sanity-check that the right sources come up.

Stop the server with Ctrl+C when done.

## What this does and does not prove

- Proves: layout, the gate, message anatomy, the retrieval trace and its scoring, the zero-score refusal, keyboard and mobile behavior, and that retrieval selects sensible chunks.
- Does not prove: real answer quality or grounding, which need a live API call. For that, paste `src/app.jsx` into a claude.ai chat to render it as an artifact (MOCK_MODE stays false there) and run the evaluation set in /eval.

## Retrieval-only check (no browser)

To check retrieval quality on the evaluation questions from the command line:

```bash
node eval/retrieval-test.mjs
```
