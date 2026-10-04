---
"@nomosui/react": patch
---

The `Badge` no longer recolours on hover and shows the default cursor.

A badge is a **non-interactive label** (its own manifest says so), yet the
`default`, `secondary` and `destructive` variants carried a `hover:bg-*/80`
recolour. When a caller overrode the resting tone — e.g.
`<Badge className="bg-primary/10 text-primary">` — the inherited hover flipped the
background to primary/80 while the text stayed primary, leaving rouille on rouille
(measured ≈1.5:1, below AA). The label also showed the text caret, as a `<div>`
with `cursor: auto` resolves to the I-beam over its text.

- the `hover:bg-*/80` backgrounds are dropped from all variants;
- the base carries `cursor-default`.

The shadcn badge this was ported from scoped its hover with `[a&]:hover:…`, so a
non-interactive label never recoloured — this restores that behaviour.
