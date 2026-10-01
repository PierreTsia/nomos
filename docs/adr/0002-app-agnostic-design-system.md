# The design system is app-agnostic and shareable

This work was born from a need specific to a single host app and explicitly put
sharing a design package with other apps out of scope. We reverse that
framing: the design system is **app-agnostic** and designed to be **shared by
several apps** (and the projects after that). It therefore splits
into two layers:

1. **The heart** — token contract (semantic colours, typography, density, radii)
   and component primitives (structure, API, variants). No app state, no product
   vocabulary, no dependency on a router or on the host app's queries. This is
   the part that travels: this is what is "app-agnostic".
2. **The skin** — the palette, accent and density that give an app its identity.
   The host app keeps its own (the ops console, ADR 0001); GymLogic would set its
   own.

Direct consequence: the heart is not written as app code reused by chance, but as
a package — named, with its own boundary and entry point — even though nothing is
published yet (a single real consumer today). Reuse must be neither a copy nor a
fork: GymLogic takes the heart, sets its skin.
