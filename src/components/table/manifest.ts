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
    'Une grille dense de lignes, livrée en parts importables séparément (Table, ' +
    'TableHeader, TableBody, TableRow, TableHead, TableCell). Aucune part ne nomme un ' +
    "produit : les libellés et les cellules viennent de l'appelant.",
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
          createElement(TableHead, null, 'nom'),
          createElement(TableHead, null, 'valeur'),
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
      description: "Les classes de l'appelant, fusionnées après celles du cœur.",
    },
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      check: 'content',
      description: "Les parts de la table : un en-tête et un corps, ou une fiche dense.",
    },
  ],
  usages: [
    {
      when: 'une grille dense de lignes dans un pupitre',
      use: '<Table><TableHeader>…</TableHeader><TableBody>…</TableBody></Table>',
      avoid: 'un `<table>` brut : il perd les tokens de bordure, de survol et de densité',
    },
    {
      when: 'une fiche dense hors de toute table',
      use: 'importer Table / TableRow / TableCell séparément',
      avoid: 'réimplémenter une grille en `<div>` : la sémantique de table est perdue',
    },
  ],
}
