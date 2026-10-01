import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Le `cn` du cœur. Il vit ici et pas dans l'app : un composant du design system ne
 * peut pas dépendre d'un utilitaire qui appartient au dashboard.
 */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))
