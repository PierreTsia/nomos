---
'@nomosui/react': minor
---

Expose the `LucideIcon` type and document icons as app-side.

Nomos now re-exports the `LucideIcon` type from `lucide-react`, so an app can
type the icon slots the heart offers (`icon?: LucideIcon`) without depending on
a curated set of the heart. The heart still exposes **no icon set**: the app
provides its own icons (ADR 0029).

Migration note: this is additive. No existing export changes; the only new
public name is the `LucideIcon` type. An app that already passes icons into the
heart's slots can now type them against `LucideIcon` instead of importing the
type from `lucide-react` directly.

Closes #70
