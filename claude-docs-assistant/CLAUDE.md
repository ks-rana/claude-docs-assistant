# Claude Docs Assistant, project memory

This project builds a RAG chatbot artifact per /docs/requirements-v2.md and /docs/ui-design-spec.md. The build process follows /docs/workflow.md phase by phase. Requirements win all conflicts.

## Target runtime

A single-file React artifact for Claude.ai. Hard platform constraints:

- No `<form>` tags; use onClick/onChange handlers.
- No localStorage, sessionStorage, cookies, or IndexedDB. React state only.
- Single default-export functional component. Tailwind core classes or inline styles only (no arbitrary-value Tailwind).
- API calls: POST to https://api.anthropic.com/v1/messages with no API key header (platform-injected in artifacts). Model claude-sonnet-4-6, max_tokens 1000.

## Writing rules

- Never use em dashes in any generated text, code comments, or documentation. Use commas, periods, or restructure the sentence.
- Never introduce: emoji, exclamation points in UI copy, avatars or mascots, human names for the bot, simulated typing effects, gradients, purple or indigo accents, glassmorphism, drop shadows heavier than subtle borders.

## Author design overrides (decided this session, July 9, 2026)

Khushi has overridden parts of the original design spec. These take precedence over the conflicting spec rules:

- Visual direction: use a Claude.ai-inspired aesthetic (warm paper palette, serif display, sans body, mono metadata, coral accent), overriding Direction C (monochrome) and the anti-Claude-resemblance stance in RAI-2 and risk R-6. Non-negotiable safeguard kept: the gate's "not affiliated with or endorsed by Anthropic" statement and the descriptive (non-persona) name stay, and no Anthropic logo or wordmark is used.
- Greetings: the empty state shows a randomized greeting each open, overriding HM-4 and HM-10. Still no emoji and no exclamation points.
- Citations: Copilot-style numbered [n] citations for each claim, with a numbered Sources list of links at the end (overrides the "(Page: Section)" inline format and collapsible-trace style).
- Out-of-scope: graceful refusal that shows the closest matching doc as a link plus why (matched terms), no answer, instead of a plain refusal.
- Architecture (planned): two-tier corpus. Tier 1 is a cached question-and-answer set surfaced as type-ahead suggestions and served directly when picked (zero API cost). Tier 2 is the full corpus RAG fallback when the user types a novel question. Expand the corpus with as much info as possible, strictly from the official Claude website.

## Architecture rules

- All tunable values go in a CONFIG block (requirements section 14). No magic numbers in logic.
- Corpus edits must be data-only: adding, editing, or removing a chunk touches only the corpus JSON array, never logic (US-7).
- MOCK_MODE: local UI testing may use a mock API mode, but it must be exactly one CONFIG boolean named MOCK_MODE that defaults to false in the shipped version. The Phase 7 design QA checklist includes verifying MOCK_MODE is false.

## Process rules

- When the specs are silent on a decision, STOP and ask Khushi rather than filling the gap with defaults. Escalation order: requirements doc, then design spec, then ask.
- One workflow phase step per prompt. Small diffs, frequent commits. Khushi reviews every diff and owns all decision gates.
- Any aesthetic or architectural choice must be traceable to a spec section. No section, no merge.
- At session end, summarize what changed and the next workflow step, and append it to /docs/build-log.md.
