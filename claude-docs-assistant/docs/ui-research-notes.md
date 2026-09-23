# UI research notes

Phase 2.1 output per /docs/workflow.md. Four research passes: AI answer interfaces (Perplexity, Claude.ai, ChatGPT search, Kagi, Phind), minimal product benchmarks (Linear, Stripe, Vercel/Geist, Notion), curated galleries (Mobbin, Awwwards, SiteInspire, Godly successor, The Monospace Web), and Refactoring UI hierarchy principles. No design decisions are made in this document. Date: July 9, 2026.

## Summary table: 12 concrete patterns

| # | Pattern | Seen in | Honest Machine fit |
|---|---------|---------|--------------------|
| 1 | Full-width answers, no chat bubbles: assistant turns render as flat document text, user turns distinguished by subtle shading or alignment only; "bubbles signal messenger and undermine the tool framing" | Setproduct 2026 AI-chat anatomy, analyzing Claude, ChatGPT, Perplexity, Cursor | Fits: strongest catalogued precedent for the document-not-person framing. Note: FR-5.7 still requires clear user/assistant differentiation |
| 2 | Sources-first layout: source references sit above or beside the answer, "there are the sources and then there is an answer, and it is not a conversation" | Perplexity (NN/g interview with design lead) | Fits conceptually; the favicon card strip variant is noisy, the collapsed "Sources (N)" text expander is the machine-plain variant |
| 3 | Inline numbered citation anchors with hover preview (title, domain, short excerpt) | Perplexity, ChatGPT search, Shape of AI pattern library | Fits: the numbered footnote is the most typographically restrained, print-like citation form found |
| 4 | Citation as strict data schema: each reference is exactly {title, snippet, url} | Kagi FastGPT API | Fits: machinery exposed as data, closest analogue to our chunk trace |
| 5 | Visible plan/step readout in plain language ("Searching the web"), collapsing to "Completed 2 steps" after; users wait longer when intermediate progress is shown | Perplexity Pro Search (LangChain case study) | Fits HM-3 exactly: machine-truthful status that increases patience |
| 6 | Persistent fallibility label pinned under the composer: "Claude can make mistakes. Please double-check responses." | Claude.ai | Fits: direct industry precedent for FR-5.5 and the input microfooter |
| 7 | Anthropomorphic spinner gerunds ("Pondering", "Percolating", ~184 words) | Claude Code | Violates HM-3: documented anti-pattern, users have filed issues requesting neutral status text |
| 8 | Ink-is-the-brand monochrome: #171717 on #FFFFFF, 10-step gray scale, no marketing accent at all; identity carried by mono type, hairlines, and whitespace | Vercel Geist (first-party design.md) | Fits fully: proof that a near-achromatic system reads as deliberate identity |
| 9 | Surface ladder plus 1px hairline borders instead of shadows; saturated color only on status and interactive elements, informational metadata stays gray | Linear (redesign post, token extraction) | Fits, except Linear's single accent is lavender #5E6AD2, which our rules exclude |
| 10 | Mono type as a system rule for machine content: mono label/copy variants, mono parameter names, tabular numerals for data | Vercel Geist typography, Stripe API docs | Fits: external validation of the two-voice typography concept |
| 11 | Warm-paper near-monochrome: off-white paper (#FAF9F5), near-black warm ink (#141413), warm gray ladder; warmth without hue | Anthropic brand system, Perplexity cream surface | Fits: the documented route to monochrome that does not feel sterile |
| 12 | Editorial index grammar: numbered rows, ruled hairlines, small mono metadata (date, category, index number) as the identity device | Awwwards editorial/typography winners, SiteInspire, The Monospace Web | Fits: maps directly onto retrieval trace and footnote design |

## Detail by research area

### AI answer interfaces

- Perplexity: answer as page, not transcript. Query becomes a heading, answer is a flat block, sources strip on top (favicon + title + domain cards), inline numbered anchors map to the strip, "Sources (N)" expander on mobile. Flat surfaces with no drop shadows on a warm cream (~#FAF8F5) with charcoal text; one turquoise accent family reserved for interactive and brand. Single mechanical grotesk (FK Grotesk) at 12 to 16px, weights 400/500 only. Pro Search shows live plain-language steps. Sources: nngroup.com/articles/perplexity-henry-modisett, aydesign.ai/blog/ai-citation-source-ui-patterns-2026, medium.com/smith-diction/branding-perplexity-ai, langchain.com/breakoutagents/perplexity.
- Claude.ai: warm canvas #FAF9F5, ink #141413, coral accent #CC785C, hairlines #E6DFD8, 12px radius cards. Serif display voice plus sans body plus JetBrains Mono for code. Persistent "Claude can make mistakes" label. Web search shows a literal "Searching the web…" status. Handles unsourced claims by verbal hedging rather than fabricating a citation. Sources: github.com/voltagent/awesome-design-md (claude), support.claude.com articles, clauder-navi.com/en/claude-web-search.
- ChatGPT search: hyperlink-first citations blended into prose, "Sources" button opens a right sidebar rollup. Less visually explicit for verification than numbered anchors. Source: help.openai.com/en/articles/9237897-chatgpt-search.
- Kagi FastGPT: bracketed [n] citations, each mapping to {title, snippet, url}; philosophy explicitly "encourage humans to look further into the answer". Source: help.kagi.com/kagi/api/fastgpt.html, blog.kagi.com/kagi-assistants.
- Anti-pattern on record: Claude Code's whimsical spinner gerunds, with user issues requesting neutral wording (github.com/anthropics/claude-code/issues/27766).

### Minimal product benchmarks

- Vercel/Geist: monochrome core #171717 on #FFFFFF, background-200 #FAFAFA used sparingly, 10-step gray scale plus a parallel alpha-black scale for borders; radii 6/12/16; shadows near-invisible (0 2px 2px rgba(0,0,0,0.04)); Geist Sans + Geist Mono with mono variants sized slightly larger than sans equivalents for balance; loading taxonomy (skeleton for known layouts, spinner for single actions, dots for indeterminate inline); Status Dot animates only in transient states; motion tokens 0/150/200/300ms honoring reduced motion. Spacing rhythm: 8px inside a group, 16px between groups, 32 to 40px between sections. Source: vercel.com/design.md, vercel.com/geist/typography, vercel.com/geist/status-dot, vercel.com/geist/skeleton.
- Linear: near-black canvas with a surface ladder and hairline borders instead of shadows; text ladder #F7F8F8 / #D0D6E0 / #8A8F98 / #62666D; one lavender accent used "never decoratively"; Linear Mono at 13px for technical captions; negative tracking scales with display size, approximately zero at 14px; changelog is the typography-and-whitespace benchmark (single column, date + bold title + paragraph, hairline rules). Sources: linear.app/now/how-we-redesigned-the-linear-ui, github.com/voltagent/awesome-design-md (linear).
- Stripe: three-column docs (nav, prose, sticky code panel) with hover-sync between prose and code lines; API reference generated from the OpenAPI spec so docs cannot drift; parameter names in mono with type labels; Sohne at light weights with tabular numerals for financial data; purple brand accent and pronounced shadows are outside our rules. Sources: moesif.com Stripe teardown, docs.stripe.com/api.
- Notion: warm neutral text ladder (#1A1A1A to #A4A097 on #FFFFFF/#F6F5F4), hairline-bordered flat cards, hierarchy carried by weight and size rather than color; Notion AI is task-scoped rather than a persona chat window. Purple CTA, pastel chips, and layered shadows are outside our rules. Source: github.com/voltagent/awesome-design-md (notion).
- Cross-cutting: three of four benchmarks anchor on a purple-family accent; only Vercel is genuinely achromatic. All four operate at or under a 12px radius for standard components. Borders-over-shadows holds fully for Linear and mostly for Vercel.

### Galleries and typography trend

- Mobbin's catalogued chat patterns skew persona-heavy (named bots, avatars, suggestion chips): useful mainly as the anti-reference. Entry points: mobbin.com/explore/web/screens/chat-bot.
- Docs-assistant baseline (Mintlify, GitBook): side-panel chat inside the docs shell with inline citations linking back to pages. Citation-first docs chat is the industry baseline, not a differentiator; our differentiation is the visible scoring trace and honest-machine identity.
- Editorial award sites recur on numbered indexes, ruled hairlines, and small mono metadata rows as identity devices (Awwwards typography/editorial categories, SiteInspire minimal/typography filters).
- The Monospace Web (Oskar Wickstrom): entire page on a fixed character grid, JetBrains Mono chosen for box-drawing support; the purest current "lab instrument" web reference.
- Recurring technical typefaces: IBM Plex Mono (strongest design character among open-source monos, squared industrial feel), JetBrains Mono (free workhorse), Geist Mono, Berkeley Mono (paid), Departure Mono (retro display). The dominant pairing structure is sans for body plus mono for metadata, labels, and numerals.
- Minimalism stats: roughly 49% of surveyed minimalist sites are monochromatic and 46% use one or two accents; warmth in minimal palettes comes from cream/beige substituted for pure white (bejamas.com survey, shopify.com minimalist examples).

### Hierarchy without color (Refactoring UI and typography practice)

- Two font weights suffice: 400/500 for most text, 600/700 for emphasis. Never use weights under 400 at UI sizes; de-emphasize with color or size instead.
- Limit text to two or three colors: dark primary, gray secondary, lighter gray tertiary. Emphasize by de-emphasizing the surroundings rather than inflating the primary.
- Labels are a last resort: fold the label into the value ("12 chunks" not "Chunks: 12"); when labels stay, the data gets the emphasis.
- Gray palette: 8 to 10 steps picked in advance, no pure black; grays may be slightly tinted (blue for cool, yellow for warm), with more saturation at the extremes.
- Separation order of preference: spacing first, then background-color difference, then subtle shadow, borders last. Two separation techniques at once is redundancy.
- Gray text de-emphasis only works on white/near-white; on tinted surfaces, pick a text color of the same hue as the surface.
- WCAG AA hard numbers: 4.5:1 for normal text (small metadata always falls in this bucket, no relaxation), 3:1 for large text and for non-text UI parts such as input borders.
- Small mono/uppercase metadata: never below roughly 12px for text meant to be read; all-caps labels need +0.05 to 0.1em letterspacing; never letterspace lowercase.
- Test hierarchy in grayscale: if it works with no color, the structure is real.

Sources: refactoringui.com previews, sglavoie.com and selcukcihan gist summaries, practicaltypography.com/letterspacing, w3.org WCAG 2.2 understanding docs, hype4.academy 60-30-10 article.

## Open questions for Khushi

1. Font loading. IBM Plex (or any web font) may not load inside a Claude.ai artifact because external fetches can be blocked. Is the plan: system stacks as the guaranteed baseline (system-ui for body, ui-monospace for machine voice), with the named typeface as a progressive enhancement if the artifact environment permits it? The two-voice concept survives on system stacks either way.
2. Score bar hue under a monochrome direction. If Gate 1 picks the monochrome direction, do the relevance bars stay amber (a second hue reserved for measurement, as the current spec does with teal + amber) or become solid ink-gray bars (length and ordering already carry the meaning, and the spec forbids color-only meaning anyway)?
3. Trace anatomy. The spec's 6.5 uses one card per chunk with a left accent border. The research suggests a numbered footnote-index variant (numbered rows, hairline rules, mono metadata) that is quieter and more editorial. Keep spec 6.5 as written, or adopt the index variant at Gate 1?
4. Light canvas confirmation. Linear demonstrates a strong dark-canvas instrument look, but the spec assumes light surfaces throughout. Confirm light-only for v1 so the directions do not need dark variants.
