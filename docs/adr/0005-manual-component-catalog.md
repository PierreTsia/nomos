# The component catalogue is a hand-written manifest, colocated and tested

The MCP server must answer "which components exist, which ones for a production
status", and the style page must list the same inventory. We decide that each
component carries its **hand-written manifest**, colocated
(`src/components/<name>/manifest.ts`): props, variants, usages, examples. It is
validated by zod against a contract, as data already is via `jsonSource`.

A **consistency test** compares the manifest to the component's real props: a
variant added to the component without the manifest makes the test fail. This is
what keeps the catalogue from rotting — without it, the manifest would be one
more dead doc.

The manifest is not generated from the TypeScript types (`react-docgen` and
friends): those tools extract the props, not the *intention* ("this badge serves
a production status, not a neutral label"), which is exactly what an agent comes
looking for. The type is generated, the usage is written.

## Consequences

- The MCP server (`list_components`, `get_component`) and the style page read the
  same manifest index: one inventory, two renderings.
- Adding a component means writing the component *and* its manifest.
