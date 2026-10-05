---
"@nomosui/react": minor
---

`Text.size` now covers the full semantic scale: `micro`, `caption`, `body`, `lead`, `title`,
`display`. It previously stopped at `lead`, so a `Text` that needed `text-2xl`/`text-lg` had
no role to read and the adopter fell back to a Tailwind utility. `Text` and `Heading` now
read the same six steps; hierarchy still goes through `Heading`, the size prop is for text.

**Migration note** — additive: `title` and `display` are new values on an existing prop; the
default stays `body` and the existing four values are unchanged.
