import { type ClassValue, clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

/**
 * Le `cn` du cœur. Il vit ici et pas dans l'app : un composant du design system ne
 * peut pas dépendre d'un utilitaire qui appartient au dashboard.
 *
 * `text-lead`, `text-body`… sont les tailles sémantiques du cœur (ADR 0004), pas des
 * couleurs : sans les déclarer, tailwind-merge croit que `text-<mot>` est une couleur de
 * texte et efface la taille dès qu'une couleur la suit (`tone`, `className` de l'app).
 * La table doit donc être la même que `tokens/theme.css`.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: ['micro', 'caption', 'body', 'lead', 'title', 'display'] }],
    },
  },
})

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))
