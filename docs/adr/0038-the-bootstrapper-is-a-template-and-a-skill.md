# The bootstrapper is a template and a skill, not a runtime

`ROADMAP.md` v2.0 sold the north star as "an MCP server that takes a brief and emits a
runnable app". The epic brief that opens the work resolves v2.0 to something narrower and
app-agnostic: a **starter template** the host agent copies, a **recipe in the skill** that
tells it how, and the **existing read-only MCP** as the authoritative catalogue. No
generator, no LLM, no API call inside the package. Left unsaid, "an MCP that emits an app"
reads as a runtime the heart would have to grow — a model client, a filesystem writer, a
brief parser — every one of which contradicts the decision that Nomos is app-agnostic
(ADR 0002). This ADR records what the bootstrapper actually is, so the roadmap stops
promising a generator the repo will never build.

## Decisions

1. **The bootstrapper is a template and a skill.** From a prompt, the **host agent**
   orchestrates: it reads the recipe in the shipped skill, copies `templates/starter`,
   maps intent to catalogued bricks, derives a skin, and runs the app. Nomos ships the
   **material** (the template, the skill, the catalogue); it performs none of the steps.

2. **No generator runtime enters the package.** No LLM client, no API call, no brief
   parser, no app emitter lives in `src/` — the heart stays app-agnostic and stays
   **read-only** (ADR 0002, 0013, 0024). An agent that reads a skill and runs a shell is
   the orchestrator — Claude Code, opencode, a local agent, a human; the contract is the
   skill, not a tool. A workflow engine (n8n and friends) is likewise not Nomos' job.

3. **The MCP is unchanged.** It stays the read-only catalogue the agent consults to
   pick bricks (ADR 0013, 0019, 0024): no new tool, no new URI, no new message literal,
   `surface.generated.json` untouched. The starter lands in the tarball as an ancillary
   `files` entry, not as a server capability.

4. **`templates/starter` is an ancillary.** The starter lives in this repo beside the
   site (ADR 0028): a **consumer** of the package, never imported by `src/`, its own
   config, its own CI job, its own lint/test scope. It is **shipped** deliberately (the
   `files` entry `templates/starter`) so an external consumer and the host agent receive
   it — the one ancillary that is published, by decision, not by default.

5. **Layout and app identity stay app-side.** The starter owns its layout, its router,
   its state, its i18n and its **skin** — nothing of that enters the catalogue or the
   heart. There is **no layout brick**; a shell, a nav and a page grid live in the
   template (ADR 0002, 0022). If a layout primitive is ever wanted in the core, it is a
   new epic and its own ADR, never a silent addition here.

## Consequences

- `ROADMAP.md` v2.0 is rewritten to name the template + skill + read-only MCP; the old
  "a generator MCP" framing is dropped.
- The skill grows a **bootstrapper recipe** (prompt → scaffold → bricks → skin → run),
  held by `src/mcp/skill.test.ts`, and `nomos-skill` ships `templates/starter` beside
  `SKILL.md`.
- `templates/starter` is built, type-checked and linted in its **own** CI job (ADR 0028
  dec. 4); a failure reads as *the starter broke*, never as *the core broke*.
- The public surface is unchanged except for the CLI's `bin` entry, which is a separate,
  explicit surface change with a minor changeset and a migration note (ADR 0024).
- An agent that needs a generator to be *more* than a copy-and-fill is out of scope; the
  template is deliberately app-agnostic and thin.

## Alternatives considered

| Option | Why we didn't pick it |
|---|---|
| An MCP tool `create-app(brief)` that emits files | A runtime in the package: a model client, a writer, a brief parser — contradicts ADR 0002; couples the heart to a vendor and a filesystem. |
| A `create-nomos-app` that generates the app itself | Generation is the agent's job; the template + skill already carry the shape. A CLI only **copies** the starter. |
| Layout/nav bricks in the catalogue | Puts app layout in the heart and forks the boundary; the template owns layout (ADR 0002). |
| Ship the starter outside the repo | Loses built-in-public adjacency and the "cannot rot" CI job; a second repo to keep in sync (ADR 0028). |

## References

ADR 0002 (app-agnostic core), 0007 (skills are part of the design system), 0013 / 0019
(the read-only MCP contract), 0022 (skin overlay), 0024 (the public surface), 0026
(built in public), 0028 (repo ancillaries), and `ROADMAP.md` / the app-bootstrapper epic
brief that name the template and the skill.
