import { createElement, Fragment } from 'react'

import type { ComponentManifest } from '@nomos/catalogue/contract'
import { ToggleGroupItem } from '@nomos/components/toggle-group/toggle-group'

/**
 * Le manifeste du groupe de bascules (ADR 0005, ADR 0015). Le catalogue enregistre le
 * groupe ; les items sont des parts importables.
 */
export const toggleGroupManifest: ComponentManifest = {
  name: 'toggle-group',
  title: 'ToggleGroup',
  summary:
    "A segmented choice (`type=\"single\"`) or a multiple one of toggles. Variant and size are " +
    "set on the group and propagate to the items; the state belongs to the caller.",
  level: 'primitive',
  example: {
    type: 'single',
    variant: 'outline',
    size: 'sm',
    children: createElement(
      Fragment,
      null,
      createElement(ToggleGroupItem, { value: 'un' }, 'one'),
      createElement(ToggleGroupItem, { value: 'deux' }, 'two'),
    ),
  },
  variants: [
    {
      name: 'variant',
      values: ['default', 'outline'],
      default: 'default',
      description: 'The tone of the group’s toggles.',
    },
    {
      name: 'size',
      values: ['default', 'sm', 'lg'],
      default: 'default',
      description: 'The size of the group’s toggles.',
    },
  ],
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      check: 'content',
      description: 'The group’s items (`ToggleGroupItem`).',
    },
    {
      name: 'value',
      type: 'string',
      required: false,
      check: 'accepted',
      description: 'The selected value, controlled by the caller.',
    },
    {
      name: 'onValueChange',
      type: '(value: string) => void',
      required: false,
      check: 'accepted',
      description: 'The selection callback.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      required: false,
      check: 'accepted',
      description: 'Disables the whole group.',
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
      when: 'choosing a single view among a few (a segment)',
      use: '<ToggleGroup type="single" value={v} onValueChange={set}>…</ToggleGroup>',
      avoid: 'a `Select` for two or three short choices: a segment reads at a glance',
    },
    {
      when: 'choosing several independent options',
      use: 'type="multiple" (Radix), the state stays in the app',
      avoid: 'expecting internal state: the core has none',
    },
  ],
}
