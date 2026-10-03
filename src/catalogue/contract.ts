import { z } from 'zod'

/**
 * Le contrat d'un manifeste de composant (ADR 0005).
 *
 * Le manifeste est écrit à la main, colocalisé avec son composant
 * (`src/components/<nom>/manifest.ts`), et validé ici : une erreur de forme se voit à
 * l'import du catalogue, pas dans la page de style ni dans le serveur MCP.
 *
 * `usages` est obligatoire et non vide : c'est la partie qu'un agent vient chercher —
 * l'intention (« quel badge pour un statut de production »), pas seulement le type.
 */

export const componentPropSchema = z.strictObject({
  name: z.string().min(1),
  type: z.string().min(1),
  required: z.boolean(),
  default: z.string().optional(),
  /** Comment le test de cohérence vérifie que la prop est réellement acceptée. */
  check: z.enum(['attribute', 'class', 'content', 'rendered', 'accepted']),
  description: z.string().min(1),
})

export const componentVariantSchema = z.strictObject({
  /** Le nom de la prop qui porte les variantes (`variant`, `size`, `tone`…). */
  name: z.string().min(1),
  values: z.array(z.string().min(1)).min(1),
  default: z.string().optional(),
  description: z.string().min(1),
})

export const componentUsageSchema = z.strictObject({
  when: z.string().min(1),
  use: z.string().min(1),
  avoid: z.string().optional(),
})

export const componentManifestSchema = z.strictObject({
  name: z
    .string()
    .regex(/^[a-z][a-z0-9-]*$/, 'the component name is kebab-case, like its folder'),
  title: z.string().min(1),
  summary: z.string().min(1),
  level: z.enum(['jeton', 'primitive', 'bloc']),
  props: z.array(componentPropSchema),
  variants: z.array(componentVariantSchema),
  /**
   * Les props avec lesquelles le composant se rend : la page de style s'en sert, et le
   * test de cohérence s'en sert comme base pour éprouver une prop « rendue ». Un
   * composant sans exemple reste documentable, mais il ne se rend pas tout seul.
   */
  example: z.record(z.string(), z.unknown()).optional(),
  usages: z
    .array(componentUsageSchema)
    .min(1, 'a manifest lists usages (the intent), not just props'),
})

export type ComponentManifest = z.infer<typeof componentManifestSchema>
export type ComponentProp = z.infer<typeof componentPropSchema>
export type ComponentVariant = z.infer<typeof componentVariantSchema>
export type ComponentUsage = z.infer<typeof componentUsageSchema>

/** Le message d'erreur d'un manifeste invalide : quel composant, quel champ, quoi. */
export function errorMessage(schemaName: string, error: z.ZodError): string {
  const issues = error.issues
    .map((issue) => `${issue.path.join('.') || '(racine)'} : ${issue.message}`)
    .join(' ; ')
  return `Catalogue: the manifest of \`${schemaName}\` does not satisfy the contract — ${issues}`
}