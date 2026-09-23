# Claude Docs Assistant

# End-to-End Project Workflow (Claude Code Edition)

Document type: Project Execution Workflow Version: 1.0 Author: Khushi Rana Companion documents: System Requirements v2.0 (the WHAT), UI/UX Design Spec v1.0 (the LOOK) Tooling: Claude Code (implementation, research, QA), Claude.ai (artifact runtime, spec discussions), GitHub (ks-rana)

How to read this document: Phases run in order. Each phase has a goal, numbered steps, exact prompts to paste into Claude Code (in blockquotes), decision gates marked ⛔ DECISION where YOU choose before work continues, and exit criteria that must be true before the next phase. Total estimated effort: 4 to 6 working sessions.

## Phase 0: Environment and repository setup

Goal: A clean workspace with version control from minute one.

Steps:

0.1 Install Claude Code (terminal or desktop app) and sign in with your Claude account.

0.2 Create the project directory and initialize git:

mkdir claude-docs-assistant && cd claude-docs-assistant

git init

0.3 Create the repo on GitHub (ks-rana/claude-docs-assistant), private for now, and connect the remote.

0.4 Create the folder skeleton:

/docs          → the three spec documents live here

/corpus        → raw pasted docs material + chunked JSON

/src           → the artifact source (single .jsx)

/eval          → evaluation questions and results

/.claude       → Claude Code project config, skills, CLAUDE.md

0.5 Copy the three documents into /docs: requirements v2.0, UI design spec v1.0, and this workflow.

0.6 First commit: "chore: project skeleton and specification documents".

Exit criteria: Repo exists, specs are committed, Claude Code opens the project.

## Phase 1: Project memory and skills setup

Goal: Teach Claude Code the project's rules ONCE so every future session inherits them, instead of re-explaining constantly. This is where the "skill and architecture" leverage happens.

Steps:

1.1 Create CLAUDE.md in the project root. This file is automatically read by Claude Code at the start of every session. Paste into Claude Code:

Create a CLAUDE.md project memory file with the following content, refined for clarity:

- This project builds a RAG chatbot artifact per /docs/requirements-v2.md and /docs/ui-design-spec.md. Requirements win all conflicts.

- Target runtime: a single-file React artifact for Claude.ai. Constraints: no form tags, no localStorage/sessionStorage/cookies, single default export, Tailwind core or inline styles only, API calls to https://api.anthropic.com/v1/messages with no API key header, model claude-sonnet-4-6, max_tokens 1000.

- Never use em dashes in any generated text, code comments, or documentation. Use commas, periods, or restructure.

- Never introduce: emoji, exclamation points in UI copy, avatars or mascots, human names for the bot, simulated typing effects, gradients, purple/indigo accents, glassmorphism, drop shadows heavier than subtle borders.

- All tunable values go in a CONFIG block. Corpus edits must be data-only.

- When the specs are silent on a decision, STOP and ask me rather than filling the gap with your own defaults.

1.2 Create project skills. Skills are reusable instruction files Claude Code loads when relevant. Ask Claude Code:

Create a .claude/skills directory with two skill files:

Skill 1, "design-guardrails": loaded whenever writing or reviewing UI code. Contents: the Honest Machine rules HM-1 to HM-10 from /docs/ui-design-spec.md section 2, the prohibited vocabulary list from section 7.3, the anti-generic rules (no gradients, no purple, no emoji, corner radius 10 to 12px maximum, accent under 10% of screen area, two-voice typography with mono for all system self-description), and the instruction to run the section 10 design QA checklist after any UI change.

Skill 2, "corpus-chunker": loaded whenever processing documentation material. Contents: the chunk schema from requirements section 4.1, the authoring rules from requirements section 12 (one section per chunk, 150 to 500 tokens, self-contained, keywords for vocabulary gaps, verified urls, id prefixes pe-/gr-/uc-/te-), and the instruction to output valid JSON matching the schema and flag any chunk that violates size limits.

1.3 Verify the setup: start a fresh Claude Code session and ask "what are this project's design constraints?" It should answer from CLAUDE.md without you pasting anything.

1.4 Commit: "chore: project memory and skills".

Exit criteria: A fresh session knows the constraints unprompted. Both skills exist and load.

Why this phase matters for your portfolio: this IS the architecture story. You are configuring an AI coding agent with persistent constraints, reusable skills, and escalation rules ("ask me when specs are silent"). That is AI governance applied to your own development process, and it is a genuinely strong interview talking point.

## Phase 2: UI research and direction decision

Goal: Ground the visual direction in the best real-world references, gathered by Claude Code, decided by you. Do NOT let the agent pick the aesthetic.

Steps:

2.1 Research prompt. Paste into Claude Code:

Research task, no code yet. Search the web for interface design references relevant to a minimal, text-focused documentation chatbot that must look deliberately designed and clearly machine-like (no avatars, no personas). Pull from sources known for high design quality, including: Mobbin (real product UI patterns), Godly and Land-book and SiteInspire (curated web design galleries), Awwwards (awarded sites, filter for minimal/typography categories), the marketing and product UIs of Linear, Stripe, Vercel, and Notion (widely treated as the modern minimal benchmark), Perplexity and Claude.ai themselves (state of the art for AI answer interfaces with source citation), and Refactoring UI principles for hierarchy without color. For each source, extract: what they do for (a) chat or answer layouts, (b) source citation and footnote patterns, (c) near-monochrome palettes, (d) typography systems, especially mono/sans pairings, (e) loading and status states. Produce a summary table of 8 to 12 concrete patterns with the site each came from and a one-line note on whether it fits our Honest Machine rules. Do not make any design decisions. End with open questions for me.

2.2 Review the research output. Ask follow-ups on anything interesting ("show me more about how Perplexity handles citations").

2.3 Direction synthesis prompt:

Using the research summary and /docs/ui-design-spec.md sections 1, 2, and 5, propose exactly three visual directions as short written concepts, each with: a name, palette (5 to 6 hex values), type pairing, one signature element, and which researched references inspired it. One direction must be near-monochrome, one must be the current spec's teal instrument direction, one is your synthesis of the research. Present as a comparison table. Do not build anything.

2.4 ⛔ DECISION GATE 1: You pick the direction (or a hybrid). Consider the three-way comparison already made in the claude.ai session (Direction A teal instrument, B ink-on-paper, C monochrome plus one functional color); direction C is the current leading candidate. Your choice here is final for v1.

2.5 Spec update prompt:

Update /docs/ui-design-spec.md section 5 to the chosen direction: [describe your choice]. Update the palette table, add the rule "hue appears only on interactive elements" if direction C was chosen, and list the changes made. Touch nothing outside section 5 except the version history.

2.6 Commit: "docs: UI direction decided and spec updated".

Exit criteria: One direction chosen by you, spec updated, research summary saved to /docs/ui-research-notes.md.

## Phase 3: Corpus construction

Goal: The highest-quality-possible chunk set, because corpus quality is the ceiling on everything downstream.

Steps:

3.1 Collect raw material. You manually visit the docs pages (prompt engineering set and guardrails set first, per risk R-9) and paste each page's content into /corpus/raw/ as one text file per page, named after the page. Add the page URL as the first line of each file.

3.2 Chunking prompt (the corpus-chunker skill loads automatically):

Process every file in /corpus/raw/ into chunks following the corpus-chunker skill. Output /corpus/chunks.json as a single JSON array. After generating, produce a validation report: chunk count per page, any chunk outside 150 to 500 tokens, any duplicate ids, any missing fields, and the full list of section names so I can spot gaps.

3.3 Review the validation report. Spot-check 5 random chunks against the original pages for fidelity and self-containedness.

3.4 Keyword pass:

For each chunk in /corpus/chunks.json, review the keywords field against this test: what would a beginner type who needs this chunk but doesn't know its terminology? Add missing synonym keywords. Show me a diff of changes only.

3.5 ⛔ DECISION GATE 2: You approve the corpus. Do not proceed with a corpus you haven't read.

3.6 Commit: "feat: corpus v1 (N chunks from M pages)".

Exit criteria: chunks.json validates, you have personally reviewed it, coverage areas documented in the README.

## Phase 4: Evaluation set (written BEFORE implementation)

Goal: Tests exist before the thing they test, so the build has a finish line.

Steps:

4.1 Prompt:

Read /docs/requirements-v2.md section 13. Create /eval/eval-set.md containing: 10 E-1 grounding questions written from the ORIGINAL docs pages in /corpus/raw/ (not from chunks.json), including 2 partially-covered questions; 5 E-2 refusal questions on topics genuinely absent from the corpus; 1 E-2 injection case; and empty results tables for E-1 through E-7 with pass criteria copied in.

4.2 Review the questions yourself. Adjust any that feel unfair or trivial.

4.3 Commit: "test: evaluation set v1".

Exit criteria: Eval file exists, you agree the questions are fair.

## Phase 5: Implementation

Goal: Build the artifact in the exact order from requirements section 16, one step per prompt, testing between steps. Never "build the whole thing" in one prompt.

Steps (each is one Claude Code prompt, then your review, then commit):

5.1 Scaffold and gate:

Create /src/app.jsx implementing ONLY: the CONFIG block (requirements section 14), the acknowledgment gate per FR-1.1 to FR-1.5 with the exact copy from requirements section 17, and an empty post-gate shell. Follow the design-guardrails skill. Stop there.

Test: paste into a claude.ai chat to render as an artifact, verify the gate blocks everything (E-4 informally). Commit.

5.2 Corpus and retrieval:

Add the corpus (import from chunks.json content inlined into the CONFIG area), tokenizer, and BM25 retrieval per FR-3.1 to FR-3.7, plus a temporary debug panel that shows the top 6 scores for any typed query. No API calls yet.

Test: type 5 eval questions into the debug panel, confirm correct chunks rank top-4 (E-3 informally). Fix keywords, not code, if retrieval misses. Commit.

5.3 Generation:

Add the prompt assembler implementing requirements section 6 verbatim, the API call per section 4.5, response parsing per 4.6, the history policy per FR-4.3, and the zero-score short-circuit per FR-3.6. Wire to a minimal message list.

Test: run 3 grounding questions and 2 refusal questions live. Commit.

5.4 Full UI:

Implement the complete interface per the updated ui-design-spec: header with system readout, empty state with example pills, message anatomy with the per-message AI label, retrieval trace per spec 6.5, status indicator per 6.6, input area per 6.7, new session control per 6.9. Remove the debug panel. Follow the design-guardrails skill strictly and flag anywhere the spec was silent.

Test: full manual pass on desktop and at 380px. Commit.

5.5 Error handling:

Implement FR-6.1 to FR-6.5 and edge cases EC-9, EC-10, EC-11, EC-13 from requirements section 10, including the retry affordance.

Test: simulate failure (temporarily break the endpoint URL), verify graceful behavior, restore. Commit.

5.6 Critique pass (separate session for fresh eyes):

Act as a demanding reviewer. Audit /src/app.jsx against: requirements sections 5, 8, 10 and design spec sections 2, 7, 10. List every violation with severity. Do not fix anything yet.

Then: review the list, decide what to fix, and instruct the fixes explicitly. Commit.

Exit criteria: All FR series implemented, critique findings dispositioned (fixed or consciously accepted), app runs as an artifact.

## Phase 6: Formal evaluation

Goal: Run section 13 for real and record results.

Steps:

6.1 Run E-1 (10 grounding), E-2 (6 refusal + injection), E-3 (retrieval traces) manually in the running artifact. Record pass/fail per question in /eval/eval-set.md with the date and corpus version.

6.2 Run E-4 (gate), E-5 (resilience), E-7 (keyboard and contrast). For E-6, ask Claude Code:

Estimate token counts for 5 representative exchanges using the chars/4 heuristic against the actual system prompt, average chunk sizes, and a 6-turn history. Show the arithmetic.

6.3 If any E-test fails: retrieval failures → fix corpus keywords first (Phase 3.4 loop). Grounding leaks → tighten section 6 prompt wording, rerun E-1 AND E-2. UI failures → fix and rerun only that test.

6.4 ⛔ DECISION GATE 3: You declare v1 done only when the section 13 pass bars are met. Commit: "test: v1 evaluation results".

Exit criteria: Results recorded, pass criteria met, failures documented with resolutions.

## Phase 7: Anti-generic design QA

Goal: The five-second test: nobody scrolling this should guess it was generated.

Steps:

7.1 Run the design spec section 10 checklist item by item yourself, in the running artifact.

7.2 The drift audit (generated code drifts toward defaults even against specs):

Audit /src/app.jsx for AI-default aesthetics that violate our spec: any gradient, any purple/indigo/blue accent, shadow classes beyond subtle borders, corner radii above 12px, emoji, exclamation points, Inter-only typography, centered-everything layout, bouncing dot loaders. Report line numbers.

7.3 Show the artifact to one real human (Navya counts) for 30 seconds and ask two questions only: "would you feel okay asking this thing a question?" and "does anything about it feel fake or annoying?" Fix accordingly.

7.4 Commit: "polish: design QA pass".

Exit criteria: Checklist passes, drift audit clean, one human reaction collected.

## Phase 8: Ship and portfolio packaging

Goal: The work becomes visible and tellable.

Steps:

8.1 README prompt:

Write README.md for this repo covering: what it is (one paragraph), the architecture diagram in ASCII (from requirements 3.1), the three headline design decisions DD-1 to DD-3 with rationale, the Honest Machine principle in three sentences, evaluation results summary with a link to /eval, how to run it (paste /src/app.jsx into a claude.ai artifact), known limitations (EC-15, EC-16, corpus date), and a roadmap section from requirements section 15. Plain tone, no hype words, no emoji.

8.2 Make the repo public. Pin it on the ks-rana profile.

8.3 Publish the artifact from claude.ai and save the share link into the README.

8.4 Portfolio entry on khushi-rana-website.vercel.app: title, one-line description, three screenshots (gate, an answered question with the trace expanded, a refusal), links to repo and live artifact. Frame consistently with your existing tools: governance architecture and design decisions by you, AI-assisted implementation.

8.5 Interview prep note. Write 5 bullet answers in your own words for: why lexical retrieval over embeddings (DD-1), how the token budget works (DD-2), why refusal is a feature (DD-3), what the Honest Machine principle is and why it exists (RAI-1, reliance), and what your evaluation found (E-2/E-3 as measurement validity). Keep in /docs/interview-notes.md, private branch if you prefer.

Exit criteria: Public repo with README and eval results, live artifact link, portfolio entry, interview notes written.

## Phase 9 (optional, later): v2 deployment

Deferred by design. When ready: Next.js on Vercel, serverless route holding the API key, per-visitor rate limit, hard spend cap in the console FIRST, then deploy. Alternatively bring-your-own-key. Revisit requirements section 15 at that point. Do not start this phase to procrastinate finishing v1.

## Standing rules for every Claude Code session

- One phase step per prompt. Small diffs, frequent commits.

- Review every diff before committing. You are the reviewer of record.

- If Claude Code makes an undirected aesthetic or architectural choice, ask it to name the spec section that authorized it. No section, no merge.

- When anything is ambiguous, the escalation order is: requirements doc → design spec → ask Khushi. Never "agent's best guess".

- End each session by asking: "summarize what changed this session and what the next step is per the workflow doc", and paste that summary into a running /docs/build-log.md.

End of document. Version 1.0, July 6, 2026.
