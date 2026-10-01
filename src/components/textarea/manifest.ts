import type { ComponentManifest } from '@nomos/catalogue/contract'

/** Le manifeste du champ multiligne (ADR 0005, ADR 0015). */
export const textareaManifest: ComponentManifest = {
  name: 'textarea',
  title: 'Textarea',
  summary:
    "Un champ de saisie multiligne. Il porte le style des tokens et transmet tout attribut " +
    "HTML de `<textarea>` ; la valeur et le changement restent à l'appelant.",
  level: 'primitive',
  example: { placeholder: 'votre message' },
  variants: [],
  props: [
    {
      name: 'placeholder',
      type: 'string',
      required: false,
      check: 'attribute',
      description: "Le texte d'invite, affiché tant que le champ est vide.",
    },
    {
      name: 'className',
      type: 'string',
      required: false,
      check: 'class',
      description: "Les classes de l'appelant, fusionnées après celles du cœur.",
    },
  ],
  usages: [
    {
      when: 'saisir un texte de plusieurs lignes',
      use: '<Textarea rows={4} placeholder={…} />',
      avoid: 'un `<Input>` pour un texte long : le clavier et la hauteur ne s’y prêtent pas',
    },
    {
      when: 'un champ contrôlé dans un `Field`',
      use: '<Field label={…}><Textarea value={v} onChange={…} /></Field>',
      avoid: 'attendre un état interne du cœur : il n’en a pas',
    },
  ],
}
