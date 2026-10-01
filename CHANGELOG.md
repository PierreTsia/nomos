# @pierretsia/nomos

## 0.3.3

### Patch Changes

- d2e2e6a: La distribution expose le CSS et le skin (ADR 0025). Le paquet publie ses sous-exports
  `./tokens/theme.css`, `./tokens/tokens.generated.css` et `./tokens/tokens.json`, et
  `resolveSkin` / `renderCss` (avec `TokensDocument`) rejoignent la surface publique : une app
  externe peut charger le raccord Tailwind et dériver son CSS du même skin que les vues
  servies. `build:package` émet le type du module de dérivation et vérifie que chaque
  sous-export pointe un fichier livré.

## 0.3.2

### Patch Changes

- f12ecbf: Release de coordination : la **0.3.1** est prise par un autre fil. Aucun changement de la
  surface publique — l'alignement de version et le passage à changesets par `npx changeset publish`
  en direct.

## 0.3.1

### Patch Changes

- ebf6f94: Garde-fous de release : snapshot de la surface publique (`surface.generated.json`, tenu par
  `surface:check`), smoke du paquet consommé, et passages à changesets. Aucun changement de la
  surface publique (API JS, emplacements de tokens, contrat MCP, skill) — outillage seul.
