# UI direction proposal (Gate 1 input)

Phase 2.3 output per /docs/workflow.md, drawing on /docs/ui-research-notes.md and /docs/ui-design-spec.md sections 1, 2, and 5. Three directions, no builds. The decision at Gate 1 is Khushi's and is final for v1.

## Gate 1 decision (July 9, 2026)

Chosen: Direction C, monochrome with one signal. Score bars: solid ink-gray (no amber). Applied to design spec section 5 in version 1.2. This decision is final for v1.

## Comparison table

| | A: Teal instrument | B: Ink on paper | C: Monochrome, one signal |
|---|---|---|---|
| Concept | The current spec section 5 as written: reading-room instrument, cool off-white, teal machinery, amber measurement | Warm editorial print: the interface as a well-set lab notebook, zero hue, warmth from paper tint and type | Cool achromatic system where the single functional hue appears only on interactive elements |
| Palette | ink #182530, surface #F4F7F8, card #FFFFFF, line #D8E0E4, accent #0E7C7B, signal #D9932C | paper #FAF9F5, card #FFFFFF, ink #141413, ink-soft #6C6A64, line #E8E6DC, muted #B0AEA5 (decorative only, fails AA for text) | bg #FFFFFF, surface #FAFAFA, ink #171717, ink-soft #666666, line #E4E4E4, functional #0E7C7B |
| Type pairing | IBM Plex Sans + IBM Plex Mono (system-ui / ui-monospace fallbacks) | Source Serif or Georgia for answer prose, ui-monospace for all machine voice | Inter or system-ui body + JetBrains Mono or ui-monospace machine voice |
| Signature element | Retrieval trace as instrument readout: teal left-border chunk cards with amber score bars | Everything is ink: ink-filled buttons, underlined ink links, solid ink score bars, ruled hairlines; reads as print | Hue is the affordance map: anything teal is clickable, everything informational is grayscale; trace as numbered footnote index with ink-gray bars |
| Researched references | IBM Plex Mono's industrial character (typeface trend survey); Perplexity's single-technical-accent near-monochrome; MISSI/Help Scout disclosure-forward patterns | Anthropic warm-paper palette (#FAF9F5/#141413); Perplexity cream ink-on-paper flatness; Awwwards editorial index grammar; Bejamas warm-minimal survey | Vercel Geist ink-is-the-brand monochrome and mono-as-metadata rule; Linear hairline discipline (minus its lavender); Kagi numbered citation schema; The Monospace Web; Refactoring UI grayscale-first hierarchy |
| Risk | Two hues to govern (teal + amber); closest to "tasteful default", least distinctive of the three | Serif prose for AI answers is an editorial statement some readers may misread as a publication rather than a tool; zero hue makes affordances work harder (underlines, fills) | Grayest of the three; craft must carry it (spacing, hairlines, mono grammar) or it reads unfinished |
| Spec impact if chosen | None: section 5 stays as written | Rewrite 5.2 palette and 5.3 type; adjust 6.5 trace and score bar treatment | Rewrite 5.2 palette (drop amber or keep, open question 2), add rule "hue appears only on interactive elements", adjust 6.5 if index variant adopted |

## Notes common to all three

- All three keep: the two-voice typography system (mono for machine self-description), 10 to 12px radii, hairline borders over shadows, accent under 10% of screen area, no gradients, no purple, flat surfaces.
- All three assume light canvas (open question 4) and system-stack font fallbacks (open question 1).
- Direction C was already the leading candidate in the prior claude.ai comparison and remains the strongest fit with the research: it is the only direction with a first-party proven reference (Vercel publishes its tokens) and it turns the honest-machine constraint into the visual identity itself.
