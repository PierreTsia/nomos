---
'@nomosui/react': patch
---

Open the catalogued overlay examples (Dialog, Popover, Sheet, DropdownMenu,
AlertDialog) with `defaultOpen` instead of a controlled `open` without an
`onOpenChange` handler. A rendered example can now be closed; previously it was
controlled-open and stuck.
