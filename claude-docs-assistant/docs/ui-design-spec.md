# Claude Docs Assistant

# UI/UX Design Specification

Document type: Design Specification (companion to the System Requirements Document v2.0) Version: 1.0 Author: Khushi Rana (design strategy), AI-assisted drafting Status: Draft for implementation Relationship to other docs: This document owns all visual, interaction, and microcopy decisions. The Requirements Document (v2.0) owns functional behavior. Where they overlap (gate, labels, trace), requirements define WHAT must exist; this document defines HOW it looks, sounds, and feels. Requirements win any conflict.

## Table of contents

- Design strategy

- The honest-machine principle

- Patterns adopted from industry practice

- Patterns deliberately rejected, with rationale

- Visual identity

- Component design specifications

- Microcopy and voice guide

- Motion and feedback design

- Accessibility specification

- Design QA checklist

- References and inspiration sources

## 1. Design strategy

### 1.1 Positioning statement

This interface is a trustworthy instrument, not a simulated person. It should feel like using a well-made reference tool: approachable, calm, and legible, while every design signal reinforces that the user is operating a machine that retrieves and generates text, not conversing with someone who knows things.

### 1.2 The core tension and how we resolve it

Chatbot design convention pulls in two directions:

- Humanization (avatars, names, personalities, simulated typing) increases engagement and warmth, but inflates trust beyond what the system deserves and encourages users to treat outputs as a person's considered judgment.

- Cold machine aesthetics (raw terminal looks, dense technical chrome) keep trust calibrated but intimidate non-technical users and suppress legitimate use.

The resolution: approachability through craft, honesty through identity. Warmth comes from clarity, generous spacing, soft shapes, friendly color, and forgiving interactions. Machine identity comes from what the interface says it is, how it talks about itself, and what it visibly shows about its own workings. The tool is pleasant the way a good calculator or a well-designed library catalog is pleasant. It is never "friendly" the way a person is friendly.

### 1.3 Design north star

Every screen should pass this test: a first-time user should feel comfortable asking a question within ten seconds, and should never, at any point in the session, half-forget they are reading machine output.

### 1.4 Why this matters (the reliance argument)

Users calibrate trust from interface cues at least as much as from content quality. A face, a name, and simulated typing tell the user "someone is here", and users extend interpersonal trust to that someone, including forgiving errors and accepting claims without verification. This tool's entire value proposition is verifiability (grounded answers, visible retrieval, linked sources), so its design must push users toward verification behavior, not away from it. Anti-anthropomorphism here is not an aesthetic preference; it is a functional requirement of the product's trust model, and it aligns with the direction of emerging AI transparency norms and disclosure regulation.

## 2. The honest-machine principle

Ten binding rules. Every design and copy decision must comply.

- HM-1: No face. No avatar, headshot, mascot, character, or any图形 suggesting a being. The assistant's visual mark, if any, is an abstract glyph (suggested: a document/magnifier motif) that reads as "tool", never "creature". No eyes, no smile, nothing face-like.

- HM-2: No human name. The tool is named for what it does ("Claude Docs Assistant" or similar descriptive name). Never a person-name (no "Ava", "Max", "Dot"). The word "assistant" is acceptable because it describes function; a persona is not.

- HM-3: Machine-truthful process language. Status indicators describe computation, not human behavior. "Retrieving sections… generating answer…" is correct. "Typing…", "Thinking…", "Let me see…" are prohibited. No simulated keystroke delays, no artificial words-per-minute pacing: answers appear when ready.

- HM-4: No simulated emotion. The interface never claims feelings: no "Happy to help!", "I'd love to…", "Sorry to hear that". Errors state facts and next steps without theatrical apology.

- HM-5: Restrained first person. "I" is permitted only as a functional shorthand where avoiding it becomes awkward ("I couldn't find relevant sections"), never in social or emotional constructions ("I think you'll love this", "I'm here for you"). Prefer constructions naming the mechanism: "The loaded docs don't cover this."

- HM-6: Show the machinery. The retrieval trace, corpus count, retrieval method, and model name are visible interface elements, not hidden internals. Seeing the mechanism is the strongest possible anti-anthropomorphic signal AND the strongest trust-calibration aid: the user watches evidence being selected.

- HM-7: Persistent provenance labeling. Every assistant message carries the "AI-generated · verify against official docs" label (per requirements FR-5.5). The label is part of the message's visual anatomy, styled as an integral footer, not an apologetic asterisk.

- HM-8: The gate is a real decision. The "I understand" screen (requirements FR-1) is designed to be actually read: short, plainly worded, no legalese, no visual noise competing with it. One action. Its purpose is informed consent, not liability theater.

- HM-9: Boundaries are stated, not softened. When the corpus lacks an answer, the refusal is direct and useful ("The docs sections loaded here don't cover this. Try searching the full docs for…"). No filler empathy, no pretending to be personally limited ("I wish I could help!").

- HM-10: The tool never refers to the relationship. No "welcome back", no "great question", no "chatting with me". There is no relationship; there is a session.

## 3. Patterns adopted from industry practice

From a review of current well-regarded chatbot UIs (builders and live deployments, see section 11), the following patterns are adopted because they serve usability without implying personhood:

| Pattern | Seen in (examples) | Why adopted | Our adaptation |
|---|---|---|---|
| Suggested conversation starters | Adidas, Fidelity, ChatBot, Zapier | Solves the blank-input problem; sets scope expectations | Example question pills, all answerable by the current corpus, phrased as documentation queries |
| Prominent AI disclosure | Help Scout, SeniorThrive, MISSI (Mississippi.gov) | Regulation-aligned; calibrates trust from the outset | Elevated further: blocking acknowledgment gate + per-message labels |
| Stated limitations up front | MISSI | Honesty about coverage prevents dead-end frustration | Corpus size and coverage areas shown in header; scope statement in empty state |
| Progress indication | AT&T, Help Scout | Reassures that a response is coming | Machine-truthful status text (HM-3), a process readout, not a fake "typing" bubble |
| Segmented answer blocks | Fidelity | Scannability; easy to revisit earlier answers | Clear message cards with strong user/assistant differentiation |
| Adjustable legibility | AT&T (font sizes) | Accessibility | Deferred to v2 as a control; v1 ships with generous base sizes instead |
| Restart affordance | SeniorThrive, MISSI | Recovery from derailed conversations | "New session" action that clears history (with confirm) |
| Response feedback | Ikea, MISSI, Fidelity | Signals fallibility, invites evaluation | v2 (requires storage/analytics we deliberately avoid in v1); the retrieval trace serves the evaluate-me function in v1 |
| Minimalism, restrained palette | Fin (Intercom), Zapier | Reduces cognitive load; focus on content | Core visual direction, see section 5 |

Industry consensus that a good chatbot UI "feels invisible", clean, fast, easy to read, with the focus on the conversation, is fully adopted. The one place this interface is deliberately NOT invisible is the machinery display (HM-6): the retrieval trace is meant to be noticed.

## 4. Patterns deliberately rejected, with rationale

| Rejected pattern | Common in industry | Why rejected here |
|---|---|---|
| Avatars, headshots, AI-generated faces, mascots | Jotform (selfie face-swap avatars), Progressive (Flo persona) | Directly manufactures interpersonal trust; contradicts HM-1 and the product's verify-don't-trust model |
| Human names and personalities | Widespread ("give your bot a personality") | Persona invites relational framing and over-reliance (HM-2) |
| Simulated typing speed / typing indicators | Landbot (adjustable WPM to mimic humans), many others | Performs humanness; wastes user time; dishonest about how generation works (HM-3) |
| Emotional/empathetic scripted copy | Support bots broadly | Feigned emotion is a dark pattern in a tool whose users must stay evaluative (HM-4) |
| Proactive engagement (auto-opening, promotional nudges) | HelpCrunch auto-messages, Drift targeting | This is a reference tool the user comes to with intent; interruption patterns are sales patterns |
| Gamified or cute error states | Consumer bots | Errors are information; cuteness obscures them (HM-9) |
| Voice, animation flourishes, decorative motion | Peloton transitions, Landbot backgrounds | Out of scope for a v1 instrument; motion budget reserved for functional feedback only (section 8) |
| Human handoff button | Tidio, Help Scout, Peloton | Nothing to hand off to; the equivalent affordance is the source link: the "human expert" here is the official documentation itself |

The handoff insight is worth naming as a design idea: in support bots, the escape hatch is a human agent. In this tool, the escape hatch is the primary source. Every trace card linking to the official docs is this product's version of "talk to a human", and it should be styled with equivalent prominence.

## 5. Visual identity

> Author override (July 9, 2026, v1.4): the visual direction was changed from Direction C (monochrome) to a Claude.ai-inspired aesthetic at Khushi's explicit request, and greetings and citation format were changed too. The binding details are recorded in CLAUDE.md under "Author design overrides"; the implementation in src/app.jsx follows those. In short: warm paper palette (surface #faf9f5, ink #141413, coral accent #cc785c with darker #a9583e for link text to hold WCAG AA), serif display headings, sans body, mono for machine metadata; a randomized greeting on the empty state (overrides HM-4/HM-10); Copilot-style numbered [n] citations with an always-visible Sources list of only the cited sources (overrides the "(Page: Section)" inline format and the collapsible score-bar trace); and a graceful out-of-scope reply that links the closest section and names the matched words. Kept regardless: the gate's non-affiliation statement, the descriptive name, the machinery readout, the per-message AI label, WCAG AA, and no emoji or exclamation points. The subsections below (5.1 to 5.5) describe the superseded Direction C and are retained for history.

### 5.1 Aesthetic direction: "monochrome instrument, one signal"

A cool, near-achromatic system in the spirit of a precise measuring tool (Direction C, chosen at Gate 1). Grayscale surfaces, hairline borders, and monospace metadata carry the entire identity; a single functional hue (deep teal) appears only where the user can act, so color itself becomes the map of what is interactive. Warmth comes from generous spacing and soft 10 to 12px shapes, not from hue. Nothing glossy, nothing cute, nothing corporate-chat-widget. Reference lineage: Vercel Geist's ink-is-the-brand monochrome and its mono-as-metadata rule, Linear's hairline-over-shadow discipline, and the honest-machine principle made literal, the interface looks like the instrument it is.

### 5.2 Color palette (Radix Colors)

The palette is defined by Radix Colors scale steps, not hand-picked hexes, so contrast is guaranteed by construction. Neutrals use the Radix Gray scale, the single accent uses the Radix Teal scale, and error states use the Radix Red scale. Tokens follow Radix step conventions: steps 1 to 2 are backgrounds, 3 to 5 are component fills, 6 to 8 are borders, 9 to 10 are solid interactive fills, 11 is accessible accent and secondary text, 12 is high-contrast text.

| Token | Radix step | Hex (light, reference) | Role |
|---|---|---|---|
| ink | gray 12 | #202020 | Primary text, user message fill |
| ink-soft | gray 11 | #646464 | Secondary text, metadata (AA against gray 1 to 2) |
| surface | gray 2 | #f9f9f9 | App background |
| card | gray 1 | #fcfcfc | Message and panel surfaces |
| line | gray 6 | #d9d9d9 | Borders, dividers, hairlines |
| line-strong | gray 7 | #cecece | Focus rings, stronger separators |
| bar-fill | gray 11 | #646464 | Relevance score bar fill (solid ink-gray) |
| bar-track | gray 4 | #e8e8e8 | Relevance score bar track |
| accent-text | teal 11 | #008573 | Links, trace toggle, accent text (AA against gray 1 to 2) |
| accent-solid | teal 9 | #12a594 | Solid interactive fills (gate and send buttons) |
| accent-solid-hover | teal 10 | #0d9b8a | Hover state for solid fills |
| accent-soft | teal 3 | #e0f8f3 | Pill backgrounds, hover fills |
| accent-border | teal 7 | #83cdc1 | Trace card left border, accent element borders |
| alert-surface | red 3 | #feebec | Error card background |
| alert-text | red 11 | #ce2c31 | Error text (AA against red 2 to 3) |
| alert-border | red 6 | #fdbdbe | Error card border |

Mapping from the earlier single "accent" token (for the section 6 references, which are unchanged): link and trace-toggle text resolve to accent-text (teal 11), solid button fills resolve to accent-solid (teal 9), soft pill and hover fills resolve to accent-soft (teal 3), and the trace card left border resolves to accent-border (teal 7).

Rules: teal is the only hue in the interface and appears ONLY on interactive elements (links, buttons, focus states, the trace toggle and its accent-bordered cards), never exceeding roughly 10% of any screen's area. Informational and measurement elements are grayscale: relevance score bars use gray fill on a gray track, carrying meaning through length and ordering, never hue (this also satisfies the no-color-only-meaning rule). Red is the one semantic exception, error states only. No second decorative hue. No gradients. No pure black: Radix gray 12 (#202020) is the darkest ink.

Accessibility: Radix step 11 is constructed to meet WCAG AA (at least 4.5:1) for text against steps 1 to 2 of its scale. Accent link text (teal 11) on the app background (gray 1 to 2) measures about 4.6:1, so it passes AA. This replaces the earlier hand-picked accent #0E7C7B (about 4:1, borderline) and closes the accessibility flag recorded in the build log. Text on solid accent fills (teal 9 buttons) uses whichever of white or gray 12 is verified at 4.5:1 or better during implementation.

Implementation note: a Claude.ai artifact cannot load Radix's stylesheet (no external CSS is permitted). The implementer inlines the published Radix light-theme hex values above into the CONFIG color block. The Radix steps remain the source of truth, so any Radix version bump is re-inlined from the same step mapping rather than re-picked by eye.

### 5.3 Typography

| Role | Face | Usage |
|---|---|---|
| Body | IBM Plex Sans (fallback: system-ui) | Messages, gate text, general UI. 14 to 15px base, 1.55 to 1.6 line height |
| Machine voice | IBM Plex Mono (fallback: ui-monospace) | ALL system self-description: corpus stats, status readouts, trace metadata, AI labels, section eyebrows. 10.5 to 12px, letterspaced uppercase for eyebrows |
| Display | IBM Plex Sans SemiBold | Title and gate heading only |

The two-voice type system IS the identity concept: prose is for content, mono is for the machine talking about itself. Users learn the code within one session: whenever they see mono, the system is describing its own operation. This gives anti-anthropomorphism a consistent visual grammar instead of relying on copy alone.

### 5.4 Shape and space

- Corner radius: 10 to 12px on cards and inputs; message bubbles use an asymmetric radius (one tight corner pointing to the sender) for direction without avatars.

- Spacing: 16px between message groups, 20px page padding, max content width 720px centered.

- Density: generous. This is a reading tool; whitespace is a feature.

### 5.5 Sender differentiation without faces

User messages: right-aligned, ink-filled, white text. Assistant messages: left-aligned, white card, 1px border, mono label footer. Differentiation is carried by alignment + fill + shape (never color alone), satisfying accessibility and eliminating any need for avatars.

## 6. Component design specifications

### 6.1 Acknowledgment gate (S0)

- Centered card on the surface background, max width 480px.

- Mono eyebrow: "BEFORE YOU START".

- Four short statements (per requirements FR-1.1), set in body type at full size, no bullets smaller than body text, no scrolling required at 380px width.

- Docs link visibly styled as a link (accent, underline on hover/focus).

- One button: "I understand". Full accent fill, high contrast, min touch target 44px.

- No decorative imagery. The gate's plainness is intentional (HM-8).

### 6.2 Header

- Title (display type) + a one-line mono system readout: "corpus: {n} chunks · retrieval: client-side BM25 · generation: Sonnet".

- The readout is the always-visible machinery statement (HM-6) and satisfies requirements AC-5a.

### 6.3 Empty state (S1)

- One short scope paragraph (what it covers, what it does when it can't answer).

- 3 to 5 example question pills (accent-soft fill, mono type). Pills disabled pre-gate and while loading.

### 6.4 Messages

- Assistant message anatomy, top to bottom: answer text (body type, pre-wrap), hairline divider, mono footer label "AI-generated · verify against official docs".

- The label is inside the message card, styled as part of its anatomy (HM-7), ink-soft color, passing AA contrast.

- Inline citations appear in the answer text as "(Page: Section)" in the same body type; they are content, not chrome.

### 6.5 Retrieval trace

- Toggle line under each generated answer: mono, accent color, "▸ Retrieval trace · {n} chunks".

- Expanded: one card per chunk. Left accent border (3px teal; the card is itself a link, so the hue marks an interactive element per section 5.2). Contents: "{Page} / {Section}" in mono, relevance bar (solid ink-gray bar-fill on a hairline bar-track, length = score / top score, min visible width), entire card is a link to the source URL (new tab).

- The trace is the signature element. It should feel like reading an instrument readout: precise, quiet, and genuinely informative.

### 6.6 Status indicator (loading)

- Mono text line in the message flow: "retrieving sections → generating answer…" (or a two-stage readout if implementation surfaces stages).

- No bouncing dots, no pulsing avatar, no fake bubble (HM-3). A subtle opacity shimmer on the text is permitted (disabled under reduced motion).

### 6.7 Input area

- Textarea grows to 4 rows max. Placeholder: "Ask the docs…".

- Send button labeled "Ask". Disabled state visibly distinct (line-gray fill) when empty or loading.

- Beneath the input, a permanent one-line mono microfooter: "Answers grounded in loaded docs chunks only · sources linked in each retrieval trace".

### 6.8 Error card

- Alert surface card rendered in-flow under the failed question.

- Copy pattern: what happened + what to do. Includes a "Try again" text button that resends the failed question.

- No exclamation marks, no apology theater (HM-4, HM-9).

### 6.9 New session control

- Small mono text button in the header: "New session".

- Tapping asks a one-line inline confirm ("Clear this conversation?" Confirm / Keep) since history is unrecoverable.

## 7. Microcopy and voice guide

### 7.1 Voice definition

Plain, precise, unhurried. The register of good technical documentation: sentence case, active voice, short sentences, no filler, no enthusiasm markers, no exclamation points anywhere in the product.

### 7.2 Do / don't table

| Situation | Write | Never write |
|---|---|---|
| Greeting/empty state | "Ask anything covered by the loaded docs sections." | "Hi there! 👋 I'm here to help!" |
| Loading | "retrieving sections → generating answer…" | "Thinking…" / "Typing…" |
| Out of corpus | "The docs sections loaded here don't cover this. Try searching the full docs for {topic}." | "I'm so sorry, I wish I could help with that!" |
| Error | "Request failed. Try sending the message again." | "Oops! Something went wrong 😅" |
| Successful answer | (the answer, with citations) | "Great question! Here's what I found for you:" |
| Session reset | "Clear this conversation? This can't be undone." | "Are you sure you want to leave me?" |
| Self-reference | "This tool retrieves from {n} loaded docs sections." | "I've read all the docs and I know…" |

### 7.3 Prohibited vocabulary

Anywhere in the interface: "I feel", "I think you'll", "happy to", "love to", "my pleasure", "chat with me", "I'm here for you", "trust me", pet names, emoji, exclamation points.

### 7.4 Required vocabulary consistency

The action is "Ask" everywhere. The sources are "the docs" in answer text and "Retrieval trace" in chrome. The disclaimer noun is "AI-generated". Never vary these terms (interface vocabulary is signposting; synonyms create doubt).

## 8. Motion and feedback design

Motion budget is spent only on functional feedback:

- Permitted: trace expand/collapse (120ms ease), new message fade-in (100ms), status text shimmer, button hover/active states, auto-scroll.

- Prohibited: simulated typing/character streaming effects, bouncing indicators, celebratory animations, decorative page-load sequences, parallax, avatar idle animations (no avatar exists).

- prefers-reduced-motion: all transitions collapse to instant state changes; auto-scroll becomes non-smooth jump.

Rationale: motion that performs "aliveness" is anthropomorphic signaling (HM-3). Motion that confirms state changes is instrumentation. Only the latter belongs here.

## 9. Accessibility specification

- WCAG 2.1 AA contrast for all text, explicitly including the mono metadata sizes and the per-message AI label (test ink-soft on white and on card).

- Full keyboard path: gate button → input → send → trace toggles → trace links → new session. Visible focus (2px accent outline, offset).

- Touch targets ≥ 44px for gate button, send, pills; trace cards full-width tappable.

- Screen readers: gate content read in order before the button; trace toggle uses aria-expanded; score bars carry an aria-label ("relevance: high/medium/low relative to top result") since the bar itself is visual-only; per-message AI label is real text, never a ::before decoration.

- No color-only meaning anywhere (score bars pair with ordering; roles pair alignment with fill; errors pair color with an explicit "Request failed" string).

- Base type sizes chosen for legibility without a size control in v1 (14 to 15px body, never below 10.5px mono); a font-size control is the first accessibility addition slated for v2.

## 10. Design QA checklist

Run before calling the UI done. Every item must pass.

Honest-machine compliance

- Zero faces, mascots, or being-like glyphs anywhere, including favicon/loading states

- No human name in title, copy, or code-visible strings

- Status text describes computation, appears without artificial delay pacing

- No emotional claims or prohibited vocabulary (7.3) in any string

- Mono/prose two-voice system applied consistently (all self-description in mono)

- Machinery readout visible in header; trace present on every generated answer

- AI label present and legible on every assistant message including canned replies

- Gate readable in under 30 seconds, single action, nothing bypasses it

Approachability

- First question askable within 10 seconds of passing the gate (empty state test with a non-technical reader)

- Example pills present, scoped to corpus, phrased in user language

- Refusals include a constructive next step, never a dead end

- Error states name the problem and the fix

Craft

- Accent (single functional hue) under ~10% of screen area and only on interactive elements; score bars are grayscale

- 380px layout clean, no horizontal scroll, targets ≥ 44px

- Keyboard-only full journey completed; focus visible throughout

- Reduced-motion verified

- Contrast checks pass for the three smallest text styles

- Mock mode disabled: the MOCK_MODE CONFIG boolean is false in the shipped artifact

## 11. References and inspiration sources

- Jotform, "The 20 best looking chatbot UIs in 2026" (jotform.com/ai/agents/best-chatbot-ui/): survey of current builder capabilities and live deployments; source for adopted patterns (section 3) and several rejected humanization patterns (section 4). Notable positive references within it: Help Scout's upfront AI/human choice, Mississippi.gov's limitation-forward welcome, Fidelity's segmented answers, AT&T's legibility features.

- Design lineage for the "honest machine" stance: transparency-forward government and enterprise deployments (MISSI's beta disclosure), plus emerging AI-disclosure regulation referenced in industry commentary.

- Anti-patterns catalogued from the same survey: avatar face-swapping, adjustable human typing speed simulation, mascot personas.

End of document. Version history: 1.0, initial design specification, July 6, 2026. 1.1, added mock mode check to section 10 QA checklist per author instruction, July 9, 2026. 1.2, Gate 1 decision applied: section 5 updated to Direction C (monochrome, one signal), palette rewritten, "hue only on interactive elements" rule added, score bars changed from amber to solid ink-gray; two downstream references (6.5 relevance bar, section 10 craft checklist) reconciled to match, July 9, 2026. 1.3, section 5.2 palette redefined as Radix Colors scale steps (gray neutrals, teal accent, red errors) instead of raw hexes; step 11 on step 1 to 2 satisfies WCAG AA, closing the accent contrast flag, July 9, 2026. 1.4, author override: visual direction changed to a Claude.ai-inspired aesthetic, randomized greetings, and Copilot-style numbered citations with a cited-only Sources list; graceful out-of-scope with closest-match link; superseded Direction C subsections retained for history; binding details in CLAUDE.md, July 9, 2026.
