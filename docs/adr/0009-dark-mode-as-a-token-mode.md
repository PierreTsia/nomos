# Dark mode is a token mode; `dark:` is banned from components

The reference design system has no dark mode — its "dark" is only one tier of a
semantic colour, and its alternative theme is a light skin. We decide that light
and dark are two **modes of the same set of slots**: same names, two values.
Resolution happens through a custom property on the theme root (`data-theme`,
default = system via `prefers-color-scheme`).

The rule that bounds it: **a DS component does not know the mode.** No `dark:`
variant (Tailwind or otherwise) and no branching on the mode inside a component —
otherwise the mode leaks into the component and the parity test can no longer
guarantee anything. A component that needs two treatments speaks in semantic
tones, not in modes.

## Consequences

- The theme parity test, derived from the reference design system
  (`src/theme/themes/themes.test.ts` there), becomes our guardrail: light and dark
  must fill **exactly the same slots**, and so must a third-party app's theme. A
  missing slot fails the test instead of producing a silent blank.
- The theme switch is an app concern (it already exists in a host app, via
  `next-themes`); the DS only carries its contract.
