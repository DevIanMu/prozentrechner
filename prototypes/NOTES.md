# Prototype Notes: ProzentRechner Calculator UX

## Question
Which calculator interaction pattern feels better for competing with prozentrechner.net / blitzrechner.de?

- **Variant A** (`prototype-prozentrechner.html`): one focused mode per view, side-by-side explanation panel, real-time.
- **Variant B** (`prototype-prozentrechner-conversational.html`): all modes stacked as conversational sentence forms on one page, still real-time.

## Files
- `prototype-prozentrechner.html` — focused single-mode + explanation
- `prototype-prozentrechner-conversational.html` — conversational all-modes wall

## Verdict
**Adopt a hybrid scheme.**

1. **Default per-mode pages use Variant A**: each calculation mode gets its own SEO-optimized page with a focused calculator card and a side-by-side explanation panel. This preserves strong SEO, clear information architecture, and the differentiated real-time step-by-step experience.
2. **Homepage includes a Variant B "Universal Calculator"**: a stacked, conversational calculator wall exposes all common percentage questions as inline sentence forms. It captures users who do not know which formula to use and would otherwise bounce, without diluting the dedicated mode pages.

## Rationale
- Variant A alone might lose users who arrive with a vague "I need to calculate a percentage" intent.
- Variant B alone would sacrifice SEO (one page competing for many keywords) and the educational step-by-step panel.
- The hybrid approach covers both intents: homepage for discovery, dedicated pages for search intent and depth.

## Design document updated
The decision has been folded into `docs/superpowers/specs/2026-06-10-prozentrechner-design.md`:
- Section 3.4 (Homepage) now describes the Universal Calculator.
- Section 4.9 (Universal Calculator) defines the component behaviour.

## Action
Delete this `prototypes/` folder once the validated decisions are implemented in the real Next.js codebase.
