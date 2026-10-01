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
    "Un choix segmenté (`type=\"single\"`) ou multiple de bascules. Variant et taille se " +
    "posent sur le groupe et se propagent aux items ; l'état appartient à l'appelant.",
  level: 'primitive',
  example: {
    type: 'single',
    variant: 'outline',
    size: 'sm',
    children: createElement(
      Fragment,
      null,
      createElement(ToggleGroupItem, { value: 'un' }, 'un'),
      createElement(ToggleGroupItem, { value: 'deux' }, 'deux'),
    ),
  },
  variants: [
    {
      name: 'variant',
      values: ['default', 'outline'],
      default: 'default',
      description: 'Le ton des bascules du groupe.',
    },
    {
      name: 'size',
      values: ['default', 'sm', 'lg'],
      default: 'default',
      description: 'La taille des bascules du groupe.',
    },
  ],
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      check: 'content',
      description: 'Les items du groupe (`ToggleGroupItem`).',
    },
    {
      name: 'value',
      type: 'string',
      required: false,
      check: 'accepted',
      description: 'La valeur sélectionnée, contrôlée par l’appelant.',
    },
    {
      name: 'onValueChange',
      type: '(value: string) => void',
      required: false,
      check: 'accepted',
      description: 'Le rappel de sélection.',
    },
    {
      name: 'disabled',
      type: 'boolean',
      required: false,
      check: 'accepted',
      description: 'Désactive tout le groupe.',
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
      when: 'choisir une seule vue parmi quelques-unes (un segment)',
      use: '<ToggleGroup type="single" value={v} onValueChange={set}>…</ToggleGroup>',
      avoid: 'un `Select` pour deux ou trois choix courts : un segment se lit d’un coup',
    },
    {
      when: 'choisir plusieurs options indépendantes',
      use: 'type="multiple" (Radix), l’état reste dans l’app',
      avoid: 'attendre un état interne : le cœur n’en a pas',
    },
  ],
}
