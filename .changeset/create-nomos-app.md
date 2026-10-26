---
"@nomosui/react": minor
---

**New binary `create-nomos-app`**: it copies the packaged `templates/starter` into a target
directory and substitutes the app name — no network, no LLM, no generator runtime (ADR 0038).
An adopter gets a runnable Nomos app with one command.

**Migration** — additive, nothing to change. `bin` gains an entry, and the `bin` names are now
part of the frozen public surface (`surface.generated.json`); the previously undisclosed
`nomos-mcp` and `nomos-skill` are documented there too.
