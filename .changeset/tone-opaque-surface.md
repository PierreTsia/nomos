---
'@nomosui/react': patch
---

Make the toned components opaque. `toneClasses` painted the status background as a
translucent tint (`bg-status-<tone>/15`), so a floating `Toast` let the page show through
it — visible in dark mode in particular. Each status ramp now carries an opaque surface
stop (`100` in light, `900` in dark: the tone `500` composited over the mode background,
the exact colour the tint produced on a page), exposed to the theme as
`status-<tone>-surface`, and `toneClasses` reads it. `Toast`, `Alert` and `Chip` keep
their tone wash but no longer reveal what sits behind them.

Closes #64
