# Site chrome is a core bloc

The roadmap wants a public site (ADR 0028) and, with it, the generic chrome every
site carries: a top bar and a footer. The open question was where that chrome
lives — a **core bloc** the catalogue ships, or a **site-local shell** the
ancillary owns. ADR 0028 named the site an ancillary and left the chrome
unplaced; left open, the first site would either re-implement a header per app or
push a product-shaped shell into the heart. This ADR settles it: the **generic
chrome is a core bloc**.

## Decisions

1. **The generic chrome is a core bloc.** `Navbar` (and, when needed, `Footer`)
   are catalogued bricks at level `bloc`, like `Card` or `EmptyState`. They ship
   in `@nomosui/react`, carry a manifest and a registry entry, and are rendered by
   the style page and the MCP server like any other brick.

2. **The chrome is slots, not content.** `Navbar` exposes `brand`, `nav` and
   `actions` as injected `ReactNode`. The heart owns the **structure** — sticky
   top, bottom border, core background, the placement of the three zones — and
   nothing else. It invents no wordmark, no link, no label.

3. **No routing, no product vocabulary.** The heart knows no `href`, no route, no
   app name (ADR 0002). A navigation item is whatever the app passes; a link is
   the app's `Link` or its router's component. This is the same split as the form
   (ADR 0015): the heart structures, the app decides.

4. **The site composes the bloc; it does not own it.** The public site (ADR 0028)
   is an ancillary and a **consumer**: it imports `Navbar` and fills the slots
   with its own wordmark and links. The chrome is not site-local, so any app — the
   site, the starter, a host app — gets the same header without copying it.

## Consequences

- ADR 0028 is **clarified, not contradicted**: the site stays an ancillary; the
  generic chrome it uses is a core bloc, so the ancillary holds only the
  site-specific content (its wordmark, its routes), never the shell.
- The one-way boundary holds: `Navbar` imports no app code and no router; the app
  imports `Navbar` (ADR 0002).
- A new chrome brick is a normal catalogue addition: component, manifest,
  registry entry, skill inventory, changeset. It adds no MCP tool, URI or message
  literal beyond the per-brick ones the catalogue already generates (ADR 0019).
- The chrome is app-agnostic and testable on its own: it renders from its slots
  alone, with no provider.

## Alternatives considered

| Option | Why we didn't pick it |
|---|---|
| A site-local shell in the ancillary | Every app re-implements the header; the site and the starter drift apart, and the shell escapes the catalogue's manifest and tests. |
| A product-shaped header in the heart | Names a product and a route — the exact leak ADR 0002 forbids. |
| No chrome brick at all | The roadmap's site and starter both need one; leaving it out just moves the copy into each consumer. |

## References

ADR 0002 (app-agnostic boundary), 0005 (the catalogue), 0015 (the heart
structures, the app decides), 0019 (the agentic contract: a brick's view and
manifest), 0028 (the site is an ancillary — **clarified here**).
