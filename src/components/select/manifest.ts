import { createElement, Fragment } from 'react'

import type { ComponentManifest } from '@nomos/catalogue/contract'
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@nomos/components/select/select'

/**
 * Le manifeste du sélecteur (ADR 0005). Le catalogue enregistre la racine `Select` ; les
 * parts se composent dans l'exemple. La liste flottante lit le `z-index` tokenisé
 * (ADR 0027), jamais une valeur d’empilement en dur.
 */
export const selectManifest: ComponentManifest = {
  name: 'select',
  title: 'Select',
  summary:
    'A single-choice select: a trigger and a floating list of options. Shipped ' +
    'as separately importable parts; labels and values come from the app.',
  level: 'primitive',
  example: {
    defaultValue: 'open',
    children: createElement(
      Fragment,
      null,
      createElement(
        SelectTrigger,
        { className: 'w-48' },
        createElement(SelectValue, { placeholder: 'Status' }),
      ),
      createElement(
        SelectContent,
        null,
        createElement(SelectItem, { value: 'open' }, 'Open'),
        createElement(SelectItem, { value: 'closed' }, 'Closed'),
      ),
    ),
  },
  variants: [],
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      check: 'accepted',
      description: 'The select parts: a trigger, a value, a list of items.',
    },
    {
      name: 'value',
      type: 'string',
      required: false,
      check: 'accepted',
      description: 'The selected value, controlled by the app.',
    },
    {
      name: 'defaultValue',
      type: 'string',
      required: false,
      check: 'accepted',
      description: 'The initial value, when the app does not control it.',
    },
    {
      name: 'onValueChange',
      type: '(value: string) => void',
      required: false,
      check: 'accepted',
      description: 'Called when the user picks an option.',
    },
    {
      name: 'open',
      type: 'boolean',
      required: false,
      check: 'accepted',
      description: 'The controlled open state: it lives in the app.',
    },
    {
      name: 'defaultOpen',
      type: 'boolean',
      required: false,
      check: 'accepted',
      description: 'The initial open state, when the app does not control it.',
    },
    {
      name: 'onOpenChange',
      type: '(open: boolean) => void',
      required: false,
      check: 'accepted',
      description: 'Called when the user asks to open or close.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      required: false,
      check: 'accepted',
      description: 'Disables the select: neither opening nor change.',
    },
    {
      name: 'name',
      type: 'string',
      required: false,
      check: 'accepted',
      description: 'The field name, for form submission.',
    },
  ],
  usages: [
    {
      when: 'choosing a single value from a list of options',
      use: '<Select><SelectTrigger><SelectValue placeholder="…" /></SelectTrigger><SelectContent>…</SelectContent></Select>',
      avoid: 'a `DropdownMenu` for a form value: a menu carries actions, not a value',
    },
    {
      when: 'only a few options, all visible',
      use: 'a `RadioGroup`: the options stay on screen',
      avoid: 'a `Select` for two or three options meant to be compared at a glance',
    },
  ],
}
