# Writing skills is part of the design system

The design system's surface is not only tokens and components: it is also **the
way we tell an agent to use them**. This repo already works through skills
("work goes through skills, not through memory", AGENTS.md), and the DS is
exposed to agents through its catalogue and its MCP server. We therefore decide
that **writing skills is a stakeholder part of the design system**, not
documentation written after the fact.

Concretely:

- The DS package **ships its own skills** — the agent-facing description of what
  the catalogue contains and which brick to take for which usage — alongside the
  tokens, the primitives, the blocks and the MCP server.
- These skills are written with the same discipline as the rest of the DS: a
  sharp trigger per skill, imperative rules, no journal or history.
- A DS change that changes its usage **updates the skill in the same change**.
  The skill is a DS deliverable, not a by-product.

## Consequences

- "Which components, for which usage" now has **two renderings** that read the
  same inventory: the MCP catalogue (machine form) and the skill (the agent's
  working instructions).
- A DS change is not finished until the skill says the same thing as the
  catalogue — just like the manifest/props consistency test.
- The heart / app boundary also holds for the skills: a skill that names a
  product belongs to the app, not the DS.
