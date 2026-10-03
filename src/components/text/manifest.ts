import type { ComponentManifest } from '@nomos/catalogue/contract'

/**
 * Le manifeste du Texte (ADR 0005). `size` lit l'échelle typographique sémantique ; `as`
 * choisit l'élément rendu (paragraphe ou `span` inline).
 */
export const textManifest: ComponentManifest = {
  name: 'text',
  title: 'Text',
  summary:
    "Body copy. The size (`size`) comes from the semantic scale; `as` chooses " +
    "the rendered element, a paragraph or an inline `span`.",
  level: 'primitive',
  example: { size: 'body', children: 'A paragraph of body copy.' },
  variants: [
    {
      name: 'size',
      values: ['lead', 'body', 'caption', 'micro'],
      default: 'body',
      description:
        "The semantic size: `lead` for a standfirst, `body` for body copy, " +
        '`caption` and `micro` for secondary mentions.',
    },
  ],
  props: [
    {
      name: 'as',
      type: "'p' | 'span'",
      required: false,
      check: 'rendered',
      description: "The rendered element: a paragraph by default, a `span` for inline text.",
    },
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
      description: 'The text content, provided by the app.',
    },
  ],
  usages: [
    {
      when: 'a paragraph of body copy',
      use: 'size="body"',
      avoid: 'a larger `size` to "make it stand out": hierarchy goes through `Heading`',
    },
    {
      when: 'a standfirst or a lede above the body',
      use: 'size="lead"',
      avoid: 'a `lead` for the whole body: it loses its standfirst role',
    },
    {
      when: 'a secondary mention (caption, help, timestamp)',
      use: 'size="caption"',
      avoid: 'a `caption` for essential content: it is meant to be discreet',
    },
    {
      when: 'inline text within a sentence',
      use: 'as="span"',
      avoid: 'a `span` for a whole paragraph: the browser loses the structure',
    },
  ],
}
