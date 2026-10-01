import { createElement, Fragment } from 'react'

import type { ComponentManifest } from '@nomos/catalogue/contract'
import { RadioGroupItem } from '@nomos/components/radio/radio'

/** Le manifeste du groupe radio (ADR 0005, ADR 0015). */
export const radioManifest: ComponentManifest = {
  name: 'radio',
  title: 'RadioGroup',
  summary:
    'Un groupe de boutons radio où une seule option est retenue. Le cœur possède le ' +
    'groupe et ses items ; la valeur et le rappel restent à l’appelant.',
  level: 'primitive',
  example: {
    value: 'a',
    onValueChange: () => {},
    children: createElement(
      Fragment,
      null,
      createElement(
        'label',
        { className: 'flex items-center gap-2' },
        createElement(RadioGroupItem, { value: 'a' }),
        'Option A',
      ),
      createElement(
        'label',
        { className: 'flex items-center gap-2' },
        createElement(RadioGroupItem, { value: 'b' }),
        'Option B',
      ),
    ),
  },
  variants: [],
  props: [
    {
      name: 'className',
      type: 'string',
      required: false,
      check: 'class',
      description: "Les classes de l'appelant, fusionnées après celles du cœur.",
    },
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      check: 'content',
      description: 'Les `RadioGroupItem`, chacun avec sa valeur.',
    },
    {
      name: 'value',
      type: 'string',
      required: false,
      check: 'accepted',
      description: 'La valeur retenue ; la valeur est chez l’appelant.',
    },
    {
      name: 'onValueChange',
      type: '(value: string) => void',
      required: false,
      check: 'accepted',
      description: 'Le rappel de choix.',
    },
  ],
  usages: [
    {
      when: 'choisir une seule option parmi quelques-unes',
      use: '<RadioGroup value={v} onValueChange={set}><RadioGroupItem value="a" /></RadioGroup>',
      avoid: 'des `Checkbox` pour un choix exclusif : elles autorisent plusieurs valeurs',
    },
  ],
}
