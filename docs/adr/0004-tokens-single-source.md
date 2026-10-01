# `tokens.json` is the single source, derived to the CSS and the MCP

Today the tokens are a `@theme` block in `src/styles/globals.css`, with hard-coded
values (`--color-teal`): neither a single source nor a contract the MCP could
serve. We decide that `tokens/tokens.json` is **the** single source, and nothing
else. No hard-coded colour value in a component.

The file has two tiers: the **primitives** (raw values) and the **semantic
tokens** (`color.status.ok`, `color.disposition.hitl`, density, radii). Components
only ever reference the semantic ones: this is what makes the skin replaceable.
The format follows the DTCG vocabulary (W3C Design Tokens Community Group,
`$value` / `$type`) so that another repo — GymLogic — can read it without a
home-grown convention.

A script derives from the JSON, in one pass, the block of CSS custom properties
(what `globals.css` carries today) and the MCP resource `design-system/tokens`.
Two renderings, one source. No heavy tooling (no Style Dictionary): the JSON is
written by hand, generation is a small script of ours.

The **theme interface** (ADR 0003) is the list of semantic slots a theme must
fill; the DS ships a default theme, the ops console (ADR 0001).
