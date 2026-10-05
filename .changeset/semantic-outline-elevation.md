---
"@nomosui/react": minor
---

The heart opens two generic semantic slots — **`outline`** and **`elevation`** — so a skin
can restyle borders and floating-layer shadows without the app reaching for classes:

- `--nomos-color-outline`: a discrete border tone (a border variant can read `border-outline`);
- `--nomos-elevation-sm|md|lg`: the shadows the overlay bricks already use.

`tokens/theme.css` now bridges both: `--color-outline` and `--shadow-sm|md|lg` read the
tokens, so `dialog`, `sheet`, `popover`, `toast`, `tooltip`, `select`, `dropdown-menu` and
`alert-dialog` keep their `shadow-*` class and become skinnable with no component change.

**Migration note** — additive: the public exports are unchanged and the new names
(`--nomos-color-outline`, `--nomos-elevation-sm|md|lg`) extend the token surface. The
default `elevation` values mirror Tailwind's default `shadow-sm|md|lg`, so a consumer that
did not customize shadows sees no visual change.

**Caveat — colored shadows**: a shadow is now a token value, so the Tailwind
`--tw-shadow-color` hook is no longer substituted. A consumer that wrote e.g.
`shadow-md shadow-red-500` (a colored or arbitrary shadow) loses the color; the token
carries its own `rgb(0 0 0 / …)`. A consumer whose skin changed Tailwind's shadows directly
should move those values onto the `elevation` slot.
