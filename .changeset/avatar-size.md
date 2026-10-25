---
"@nomosui/react": minor
---

`Avatar` gains a **`size`** scale (`sm` / `default` / `lg`), closing #138. A consumer no
longer sets the box with a `size-8`/`size-9` utility class on the primitive: `sm` is the
dense size (`size-8`), `default` the current `size-10`, `lg` a profile-header `size-12`.
`avatarVariants` and `avatarVariantsConfig` join the public exports, as for the other
cva bricks.
