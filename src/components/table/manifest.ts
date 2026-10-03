import { createElement, Fragment } from 'react'

import type { ComponentManifest } from '@nomos/catalogue/contract'
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@nomos/components/table/table'

/**
 * Le manifeste de la table (ADR 0005). La table est un atome composé : le catalogue
 * enregistre la coquille `Table`, et le manifeste documente le jeu de parts — c'est
 * l'ensemble qui se pose, pas la coquille seule.
 */
export const tableManifest: ComponentManifest = {
  name: 'table',
  title: 'Table',
  summary:
    'A dense grid of rows, shipped as separately importable parts (Table, ' +
    'TableHeader, TableBody, TableRow, TableHead, TableCell). No part names a ' +
    "product: labels and cells come from the caller.",
  level: 'primitive',
  example: {
    children: createElement(
      Fragment,
      null,
      createElement(
        TableHeader,
        null,
        createElement(
          TableRow,
          null,
          createElement(TableHead, null, 'name'),
          createElement(TableHead, null, 'value'),
        ),
      ),
      createElement(
        TableBody,
        null,
        createElement(
          TableRow,
          null,
          createElement(TableCell, null, 'spec'),
          createElement(TableCell, null, '2 / 3'),
        ),
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
      description: 'The table parts: a header and a body, or a dense record.',
    },
  ],
  usages: [
    {
      when: 'a dense grid of rows in a console',
      use: '<Table><TableHeader>…</TableHeader><TableBody>…</TableBody></Table>',
      avoid: 'a raw `<table>`: it loses the border, hover and density tokens',
    },
    {
      when: 'a dense record outside any table',
      use: 'importing Table / TableRow / TableCell separately',
      avoid: 'reimplementing a grid with `<div>`: the table semantics are lost',
    },
  ],
}
