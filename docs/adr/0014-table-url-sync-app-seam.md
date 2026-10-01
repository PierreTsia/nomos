# The table's URL sync is a controlled seam, app-side

The reference design system does exactly what we want on the UX side — a DataTable
whose search, filters, sort and pagination live in the URL, hence shareable pages
— but it pays dearly: its toolbar and pagination **import** `react-router` and
`react-intl`. That is precisely the leak the host app forbids itself (ADR 0003,
ADR 0010).

We take the UX, not the coupling. The decision:

1. **The table kit stays router-agnostic.** No file in the DS package imports
   `react-router` / `react-router-dom` — enforced by lint (`no-restricted-imports`)
   **and** by a test, as the `@nomos/*` boundary already is.

2. **The heart exposes a controlled state seam.** `FacetedDataTable` optionally
   accepts `state` + `onStateChange` (and `rowKey` when the detail is synchronised).
   Without these props, it keeps its internal state — today's behaviour unchanged.
   With them, the app is the source of truth.

3. **The URL sync lives in the app.** A hook `useTableUrlState` (react-router
   `useSearchParams`) reads/writes the params and provides a `TableState` to the
   heart. Since the URL is the source of truth, back/forward works — parity with
   the reference design system is complete, without the coupling.

4. **The URL format is specific to the app**, readable and free of escaping
   pitfalls: `q` (search), `sort=<col>:asc|desc`, `page` (1-based), `size`,
   `f.<facetId>` (a **repeated** param, one value per occurrence) and
   `open=<rowKey>`. Default values are omitted from the URL. A missing `sort`
   falls back to the sort carried by the column (`meta.defaultSort`).

## Consequences

- TanStack pagination and detail opening become controllable from the outside:
  that is the seam, not a second state.
- A consumer that does not need the URL writes nothing more: the default stays
  uncontrolled.
- What is **not** part of this decision (and will be separate work items): row
  selection, column management, and the "copy link" affordance.
