import type { ComponentManifest } from '@nomos/catalogue/contract'

/** Le manifeste du bloc de formulaire (ADR 0005, ADR 0015). Mise en page seule, sans moteur. */
export const formManifest: ComponentManifest = {
  name: 'form',
  title: 'Form',
  summary:
    "A form's layout: a grid of fields and an actions area, inside a " +
    "`<form>`. No validation, no state, no text — the app provides the fields and actions.",
  level: 'bloc',
  example: { children: 'a field', columns: 1, actions: 'actions' },
  variants: [],
  props: [
    {
      name: 'columns',
      type: '1 | 2',
      required: false,
      default: '1',
      check: 'accepted',
      description: 'The number of columns of the field grid from the `md` breakpoint.',
    },
    {
      name: 'actions',
      type: 'ReactNode',
      required: false,
      check: 'accepted',
      description: "The actions area below the fields (buttons provided by the app).",
    },
    {
      name: 'onSubmit',
      type: 'FormEventHandler<HTMLFormElement>',
      required: false,
      check: 'accepted',
      description: 'The submission, handled by the caller (the core submits nothing).',
    },
    {
      name: 'className',
      type: 'string',
      required: false,
      check: 'class',
      description: "The caller's classes, merged after the core's.",
    },
  ],
  usages: [
    {
      when: 'lay out a controlled form',
      use: '<Form actions={<Button type="submit">…</Button>}><Fieldset>…</Fieldset></Form>',
      avoid: 'expecting the core to validate, submit or show an error: it does none of that',
    },
    {
      when: 'arrange fields in two columns',
      use: '<Form columns={2}> (two columns from the `md` breakpoint)',
      avoid: 'a homemade grid in the app when the block already provides one',
    },
  ],
}
