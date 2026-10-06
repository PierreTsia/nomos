---
"@nomosui/react": minor
---

`Avatar` gains an optional **`imgProps`**: native `<img>` attributes are forwarded to the
internal image. An app can now set `referrerPolicy="no-referrer"`, `loading`, etc. — the
image URL, alt text and `onError` fallback stay owned by the core. Dependency-free, the
prop only forwards.
