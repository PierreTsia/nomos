---
"@nomosui/react": minor
---

Add `Heading` and `Text`, mapped to the semantic type scale. `Heading` renders `h1`..`h6`
from its `level` and reads the matching size token; `Text` renders a paragraph or a `span`
at a semantic `size`. `tokens/theme.css` now maps the type scale to Tailwind utilities
(`text-body`, `font-strong`, `font-sans`).
