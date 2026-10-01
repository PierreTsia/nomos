# The design system carries its own visual identity

The design system had no visual language of its own: `src/styles/globals.css` and
`src/components/ui/` were copies of the GymLogic app ("same slate palette"), and
every change was made by hand-copying from one repo to the other. We decide that
the design system has **its own identity**, deliberately distinct from the product
apps: an **ops console** — dark-first (light mode remains supported), high density
(it is a triage dashboard), monospace reserved for machine data (SHA, issue
numbers, contract keys, raw dispositions), a single accent that is not GymLogic's
slate, and a status palette derived from the domain (health green/orange/red,
disposition severities) rather than from the theme.

## Consequences

- Tokens become a single source (JSON) from which the app's CSS and the MCP
  server contract derive — no more hard-coded values in components.
- Any reference to `../workout-app/components.json` must disappear from the repo.
