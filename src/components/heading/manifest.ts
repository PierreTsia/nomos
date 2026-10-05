import type { ComponentManifest } from '@nomos/catalogue/contract'

/**
 * Le manifeste du Titre (ADR 0005). `level` est la seule variante : elle choisit à la fois
 * la balise (`h1`..`h6`) et la taille sémantique, pour qu'un seul mot dise la hiérarchie.
 */
export const headingManifest: ComponentManifest = {
  name: 'heading',
  title: 'Heading',
  summary:
    'A section heading. The level (`level`) chooses the `h1`..`h6` tag and the ' +
    "semantic size; the text comes from the caller.",
  level: 'primitive',
  example: { level: 2, children: 'Section heading' },
  variants: [
    {
      name: 'level',
      values: ['1', '2', '3', '4', '5', '6'],
      default: '2',
      description:
        "The hierarchy level: it renders the corresponding `h1`..`h6` tag and reads the " +
        "semantic size (display, title, lead, body, caption, micro).",
    },
    {
      name: 'tone',
      values: ['default', 'muted', 'primary', 'danger'],
      default: 'default',
      description:
        'The ink of the heading, from the semantic palette: `muted` for a discreet title, ' +
        '`primary` for emphasis, `danger` for an error. Never a raw colour.',
    },
  ],
  props: [
    {
      name: 'className',
      type: 'string',
      required: false,
      check: 'class',
      description: "The caller's classes, merged after the variant's.",
    },
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      check: 'content',
      description: 'The heading text: short, it names the section.',
    },
  ],
  usages: [
    {
      when: "a view's main heading",
      use: 'level={1}',
      avoid: 'multiple `level={1}` in the same view: only one first-level heading',
    },
    {
      when: 'a section heading under the main heading',
      use: 'level={2}',
      avoid: 'skipping a level to make a heading bigger: the hierarchy must stay continuous',
    },
    {
      when: 'a block or card subheading',
      use: 'level={3}',
      avoid: 'a `level` chosen for its size rather than the document structure',
    },
  ],
}
