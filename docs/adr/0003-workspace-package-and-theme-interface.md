# The DS is a package; branding goes through a theme interface

"Shareable" requires a boundary that tooling enforces, not just an intention. The
design system therefore becomes a dedicated npm package with its own
`package.json` (name, exports), its tokens, its primitives, its tests and **its
MCP server** — the agentic surface belongs to the DS, not the app. The app
consumes it as a dependency. Nothing is published yet.

The branding of an app is not done by editing the DS: the heart exposes a
**theme interface** — the contract of semantic token slots and of the components
API — that each app fills with its identity. The host app provides the "ops
console" theme (ADR 0001); GymLogic would provide its own. A skin is an
implementation of this interface, not a fork of the package.

## Consequences

- Imports are one-way: a consuming app may import the DS, the DS never imports
  the app. Enforced by lint.
- Introducing a separate package touches the build (vite, tsconfig, resolution):
  a cost accepted in exchange for a real boundary.
- The DS's MCP serves the heart and its catalogue, never an app's data.
