---
"@nomosui/react": minor
---

Add and catalog `Collapsible`, then `Accordion` (issue #16, ADR 0005 / 0019).

- New dependencies `@radix-ui/react-collapsible` and
  `@radix-ui/react-accordion` (the second depends on the first);
  `package-lock.json` is replayed so `npm ci` is reproducible.
- `src/components/collapsible/` (`Collapsible`, `CollapsibleTrigger`,
  `CollapsibleContent`) and `src/components/accordion/` (`Accordion`,
  `AccordionItem`, `AccordionHeader`, `AccordionTrigger`, `AccordionContent`),
  each with its hand-written manifest and a colocated test; the registry and
  `src/index.ts` expose both, so `render_collapsible` / `render_accordion`,
  their resources and views follow with no MCP file written.
- The height reveal reads the ADR 0027 motion decision: `tokens/theme.css` gains
  `animate-collapse-down/up`, driven by the motion tokens and the height Radix
  measures (`--nomos-collapse-height`), with the reduced-motion reset extended.
- `Accordion`'s `type` (`single` / `multiple`) is a documented variant.
- `surface.generated.json` and the view CSS/bundle are replayed; the SKILL
  inventory + prose follow.
