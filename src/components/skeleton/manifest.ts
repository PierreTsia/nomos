import type { ComponentManifest } from '@nomos/catalogue/contract'

/** Le manifeste du squelette de chargement (ADR 0005). */
export const skeletonManifest: ComponentManifest = {
  name: 'skeleton',
  title: 'Skeleton',
  summary:
    "A block that pulses to hold the place of content being loaded. " +
    'Its width and height come from the caller’s classes.',
  level: 'primitive',
  example: { className: 'h-8 w-72' },
  variants: [],
  props: [
    {
      name: 'className',
      type: 'string',
      required: false,
      check: 'class',
      description: "The caller's classes (dimensions): the core only knows the pulse style.",
    },
    {
      name: 'children',
      type: 'ReactNode',
      required: false,
      check: 'content',
      description: 'Rarely used: a skeleton is an empty surface.',
    },
  ],
  usages: [
    {
      when: 'holding the place of a text or a block while loading',
      use: '<Skeleton className="h-8 w-72" />',
      avoid: 'a `Skeleton` at default dimensions: it has no size of its own',
    },
    {
      when: 'several loading lines',
      use: 'several stacked `Skeleton`s',
      avoid: 'a spinner: the skeleton shows the shape of the content to come',
    },
  ],
}
