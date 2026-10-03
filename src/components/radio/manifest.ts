import { createElement, Fragment } from 'react'

import type { ComponentManifest } from '@nomos/catalogue/contract'
import { RadioGroupItem } from '@nomos/components/radio/radio'

/** Le manifeste du groupe radio (ADR 0005, ADR 0015). */
export const radioManifest: ComponentManifest = {
  name: 'radio',
  title: 'RadioGroup',
  summary:
    'A group of radio buttons where only one option is selected. The core owns the ' +
    'group and its items; the value and callback remain with the caller.',
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
      description: "The caller's classes, merged after the core's.",
    },
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      check: 'content',
      description: 'The `RadioGroupItem`s, each with its value.',
    },
    {
      name: 'value',
      type: 'string',
      required: false,
      check: 'accepted',
      description: 'The selected value; the value lives with the caller.',
    },
    {
      name: 'onValueChange',
      type: '(value: string) => void',
      required: false,
      check: 'accepted',
      description: 'The selection callback.',
    },
  ],
  usages: [
    {
      when: 'choosing a single option among a few',
      use: '<RadioGroup value={v} onValueChange={set}><RadioGroupItem value="a" /></RadioGroup>',
      avoid: '`Checkbox`es for an exclusive choice: they allow multiple values',
    },
  ],
}
