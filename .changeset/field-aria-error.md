---
"@nomosui/react": patch
---

Associate a `Field`'s message with its control. The error now carries an `id` and
`role="alert"`, the hint carries an `id`, and the core controls (`Input`, `Textarea`,
`NumberField`, `SearchField`, `SelectTrigger`) inherit `aria-invalid` and
`aria-describedby` — so a screen reader announces the error and marks the field
invalid. A caller's own `aria-describedby` is kept alongside the field's message, and
`aria-invalid` is `true` whenever the field shows an error. The label↔control
association (`htmlFor`) is unchanged. Fixes #91.
