# The DataTable is a sub-epic, split into features and atoms, shipped on the host app first

Deciding "which components" one by one is thankless and gives the list of the
host app's components, not a shareable heart. We therefore decide the **splitting
rule**: the DataTable is the design system's first sub-epic and splits into two
kinds of brick.

- An **atom** is a piece that exists and imports on its own: the dense table, the
  faceted filter, the pagination, the toolbar, the Meter, the tone vocabulary, a
  datum's freshness indicator. An atom is judged by what it renders **outside**
  the table — the Meter must serve a health card, otherwise it is not an atom but
  an internal detail.
- A **feature** is a behaviour the table knows how to render: sort, facets,
  pagination, row detail, density, selection. A feature is a capability, not a
  file.

Each brick passes the heart's rule (describable without naming a product) and
ships **on the host app first**: the host app is the pilot that proves the brick
stands on its own; GymLogic then receives a targeted work item that proves reuse.

The row detail follows the rule: the table owns "a row opens a detail", the app
provides the content, and the kit owns the placement (inline or overlay).
`IssueDetailSheet` is therefore not an atom — it is app content.

## Consequences

- The reference design system's precedent is useful and double-edged: it proves a
  split kit is viable (table, provider, toolbar, pagination, cell contents,
  separate filters) and it shows the price of letting go (their toolbar ends up
  coupled to query-params and to `react-intl`). We take the split, not the
  couplings.
- Sort is never hard-coded on a product word: it is carried by the column. This is
  the fix for the leak identified in the current DataTable.
