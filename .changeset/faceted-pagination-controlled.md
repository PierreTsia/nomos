---
'@nomosui/react': patch
---

Fix `FacetedDataTable` snapping back to page 1 when its state is controlled (for
example an app syncing it to the URL). TanStack's automatic page-index reset is now
disabled: the table only returns to page 1 on the intentional changes — search, sort,
facet and page size — via `resetPerPage`. A controlled table keeps the page the caller
gave it.
