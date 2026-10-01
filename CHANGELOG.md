# @nomosui/react

## 0.4.0

### Minor Changes

- 478e83b: The package publishes publicly as **`@nomosui/react`** (it was `@pierretsia/nomos`, on the
  private GitHub Packages registry). Import specifiers and the install source change; the
  JavaScript API, the token interface, the MCP contract and the skill are unchanged.
- f8c30ed: Drop the host-app references from the public contracts: the DTCG `$extensions` vendor key
  moves from `org.agent-os` to `org.nomos`, and the MCP view DOM ids move from `agent-os-view`
  / `agent-os-view-data` to `nomos-view` / `nomos-view-data` (the reference host frame id
  follows). A consumer reading `$extensions` in `tokens.json`, or targeting those ids, must
  update. The file names and the token/API/MCP shapes are otherwise unchanged.

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
