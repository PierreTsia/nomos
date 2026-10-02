import type { ComponentManifest } from '@nomos/catalogue/contract'

/**
 * Le manifeste du Code inline (ADR 0005). Il est écrit à la main : le type se génère,
 * l'usage s'écrit. Le test de cohérence du catalogue le confronte aux props réelles.
 */
export const codeManifest: ComponentManifest = {
  name: 'code',
  title: 'Code',
  summary:
    'Un extrait de code inline : une surface monospace discrète, posée dans une phrase. ' +
    'Le fond inset, la bordure et le rayon viennent des tokens ; la coloration syntaxique ' +
    "reste à l'app.",
  level: 'primitive',
  example: { children: 'npm install @nomosui/react' },
  variants: [],
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      check: 'content',
      description: "Le texte de l'extrait, injecté par l'appelant.",
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
      when: 'citer un identifiant, une commande ou un nom de fichier dans une phrase',
      use: 'Code',
      avoid: 'un `CodeBlock` pour un mot : le bloc casse la ligne de texte',
    },
    {
      when: "poser sa propre coloration syntaxique",
      use: 'children avec des nœuds colorés',
      avoid: 'attendre la coloration du cœur : elle est hors périmètre',
    },
  ],
}
