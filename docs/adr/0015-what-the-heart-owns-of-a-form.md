# What the heart owns of a form, and what it leaves to the app

The reference design system ships a complete `forms/` domain — `fields`,
`selection-controls`, `pickers`, `steppers`, `Fieldset`, `Form`, `createFormHelper`,
`validations`, `useConditionalFieldForm` — but **coupled**: the components import
`react-hook-form`, a validation engine, `react-intl` and the router. That is
exactly the kind of leak the host app forbids itself (ADR 0002, ADR 0003, ADR
0010). We take the split, not the coupling.

## Decisions

1. **The heart owns the presentation.** `Label`, `Field` (the *label*, *hint* and
   *error* slots, without an engine), `Fieldset`, the controls (`Textarea`,
   `Checkbox`, `Radio`, `Switch`, `Select`, `NumberField`, `SearchField`) and a
   layout `Form` block. A control is **prop-controlled**: it receives a value and
   an `onChange`, it owns no state.

2. **The app owns state, validation, i18n, submission and the router.** The heart
   validates nothing, knows no business rule, no message. A `Field` receives an
   **already formatted** error message (`error?: string`); a label is an injected
   `string` / `ReactNode`.

3. **No form dependency in the heart.** No `react-hook-form`, no validation
   library, no `react-intl`. A consumer that wants these tools wires them
   **above** the heart's bricks.

4. **Assumed piloting.** The host app is read-only: the forms are not used there.
   The **pilot** of these bricks is the **Ladle** showcase (generated stories);
   the first real consumer is **GymLogic**. This is a written exception to "ship
   on the host app first" (ADR 0010), justified by the fact that the brick stays
   neutral.

## Consequences

- A `Field` carries `label`, `hint`, `error` as **slots**: the app decides their
  content and their presence. The heart invents no text.
- The controls have neither `name` nor `register`: the app wires them to its own
  state management. A control is testable on its own (rendering, interaction),
  without a provider.
- We **do not derive** (as long as a real need does not require it):
  `createFormHelper`, the `validations` engine, `useConditionalFieldForm`, the
  `pickers` (date, tree) and the `steppers`. Those are features to be settled case
  by case, not primitives.
- The boundary is the same as for the table: the heart structures, the app decides.
