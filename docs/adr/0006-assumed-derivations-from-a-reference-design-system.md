# Assumed derivations from a private reference design system

A private reference design system is the closest thing to what we are building. It
was analysed to draw explicit derivation points from it rather than a floating
inspiration. We **derive**: the primitive → semantic → component separation, the
five-tier status set, the typed accessors, the theme parity test, the partial
override merged in, the strict colocation of companion files, the `Props` types
with discriminated unions/XOR, `forwardRef` on the primitives, the generic over
row data, the per-prop JSDoc as the catalogue source, and the split of the
Datatable into separately exported pieces. We **diverge** on: token source in the
repo in DTCG format, CSS vehicle rather than a JS runtime, a typed theme interface
instead of a `DeepPartial`, dark mode and density designed from the start, i18n
and router neutrality, no Luxon in the API, and a local stdio MCP server with real
resources and a curated manifest.

This list, point by point and justified, is restated here: it is derived from a
private reference design system; the principles are restated, with no name and no
internal link.

## Consequences

- The reference design system's structural lesson is retained: its ADR of August
  2021 wanted to separate the generic from the business, and the shipped package
  was coupled (a toolbar tied to query-params and to `react-intl`). Hence the
  choice to **materialise** the boundary (ADR 0002, 0003) instead of leaving it as
  an intention.
- Four points have no precedent in the reference design system and are therefore
  to be built without a model: the `design-system/tokens` resource, the
  per-component resources, the curated manifest, and `preview_component` in MCP
  Apps.
