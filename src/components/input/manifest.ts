import type { ComponentManifest } from '@nomos/catalogue/contract'

/**
 * Le manifeste du champ de saisie (ADR 0005). Le cœur ne pose ni validation ni état :
 * l'appelant passe ses props HTML, la valeur et le rappel restent chez lui.
 */
export const inputManifest: ComponentManifest = {
  name: 'input',
  title: 'Input',
  summary:
    "A single-line input. It carries the token styling and forwards any " +
    "HTML attribute of an `<input>`; the value and change handling stay with the caller.",
  level: 'primitive',
  example: { placeholder: 'search' },
  variants: [],
  props: [
    {
      name: 'className',
      type: 'string',
      required: false,
      check: 'class',
      description: "The caller's classes, merged after the core's.",
    },
    {
      name: 'type',
      type: 'string',
      required: false,
      check: 'attribute',
      description: "The field's HTML type (`text`, `search`, `password`…).",
    },
    {
      name: 'placeholder',
      type: 'string',
      required: false,
      check: 'attribute',
      description: "The placeholder text, shown while the field is empty.",
    },
  ],
  usages: [
    {
      when: 'a search field in a toolbar',
      use: '<Input type="search" placeholder={…} />',
      avoid: 'a placeholder instead of a lasting label, for a form field',
    },
    {
      when: 'a controlled field',
      use: '<Input value={v} onChange={…} /> (state stays in the app)',
      avoid: 'expecting internal state from the core: it has none',
    },
  ],
}
