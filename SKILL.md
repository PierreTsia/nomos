---
name: nomos
description: Choisir la brique du design system Nomos pour un usage donné — atomes (Badge, Chip, Meter, Freshness, Table, Button, Input, champ, blocs de formulaire), coquille de table, vocabulaire de tons, tokens et densité — et interroger le catalogue par le serveur MCP local, y compris les vues `ui://` rendues en conversation.
---

# Le design system Nomos

Un **cœur app-agnostique** (la racine de ce dépôt) : il ne connaît ni l'état d'une
app, ni son i18n, ni son router, ni ses query-params. Dès qu'il faut nommer un produit
pour expliquer une brique, elle appartient à l'app, pas au cœur.

## Quelle brique prendre

### Qualifier, situer

- **Qualifier d'un mot court** (un statut, un domaine) → `Badge`. Le ton vient d'une
  classe de `toneClasses`, jamais d'un mot produit.
- **Qualifier de façon retirable** (un filtre actif) → `Chip`, avec `onRemove` ; sans
  action, un `Chip` nu. Un statut qu'on ne retire pas reste un `Badge`.
- **Situer une valeur sur une échelle**, avec un seuil → `Meter` (barre large) ou
  `CompactMeter` (cellule dense). Le texte du seuil est injecté par l'appelant.
- **Dire l'âge d'une donnée** → `Freshness` ; l'âge est déjà formaté, `stale` est décidé
  par l'appelant.
- **Montrer l'avancement d'une tâche** (un total, sans seuil) → `ProgressBar`, sémantique
  `progressbar`.
- **Mettre un chiffre en avant** → `Counter` (suffixe et libellé fournis par l'app).
- **Recueillir ou montrer une note** → `Rating` : interactif seulement si l'app fournit
  `onValueChange`, sinon un affichage.
- **Lister des événements datés** → `Timeline` (frise, présentation seule ; le format de
  la date vient de l'app).

### Agir, saisir

- **Agir** → `Button` (`variant` = le ton, `size` = la densité ; `asChild` pour poser le
  style sur un lien).
- **Saisir une ligne** → `Input` ; **un nombre borné** → `NumberField` (`step`, `min`,
  `max` du natif) ; **chercher avec icône et effacement** → `SearchField` ; **plusieurs
  lignes** → `Textarea`.
- **Cocher** → `Checkbox` (option indépendante) ; **basculer tout de suite** → `Switch` ;
  **choisir une seule option parmi quelques-unes** → `RadioGroup` ; **une bascule
  ponctuelle** (mode, filtre) → `Toggle`, **un segment** → `ToggleGroup`. Tous sont
  contrôlés par props : l'état reste dans l'app.

### Structurer

- **Une surface** (titre, corps, pied) → les parts de `Card`.
- **Un état vide, ou une panne à nommer** → `EmptyState` (la carte centrée ; le `detail`
  brut nomme la vraie panne, plutôt qu'un zéro silencieux).
- **Une information inline** qui demande l'attention sans bloquer → `Alert` (le ton vient
  du cœur ; `onClose` va avec `closeLabel`).
- **Séparer deux contenus** → `Separator` ; **tenir la place d'un contenu qui charge** →
  `Skeleton`.
- **Prévenir sans bloquer** → `Toast` via `useToast().show({ message })` (la file et
  l'auto-dismiss vivent dans `ToastProvider`).
- **Regrouper des actions derrière un déclencheur compact** → `DropdownMenu` en parts
  (`DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`, à cocher, radio,
  sous-menu ; les libellés et les actions viennent de l'app). Pour choisir une valeur de
  formulaire, c'est un `Select`.
- **Demander une décision dans une modale centrée** → `Dialog` (déclencheur, titre,
  description, corps, pied ; le libellé de fermeture vient de l'app). L'empilement, le
  voile et le mouvement viennent des tokens, jamais d'une valeur en dur.
- **Montrer un contenu ancré à un bord** → `Sheet` en parts (`SheetTrigger`, `SheetContent`
  avec `side`, `SheetHeader`, `SheetFooter`) ; `side="bottom"` est le **drawer** — le même
  panneau, un côté différent, pas un atome à part.
- **Parcourir une hiérarchie** → `Tree` (navigation, un nœud actif) ou `SelectionTree`
  (sélection multiple) ; ouverture et sélection sont contrôlées par props, le focus
  clavier (rôle `tree`, flèches) est interne.

### Formulaire

- **Mettre en page** → `Form` (grille de champs + zone d'actions, `columns` pour deux
  colonnes). Aucune validation, aucun état, aucun texte.
- **Un emplacement de champ** (libellé, contrôle, aide ou erreur) → `Field` ; **nommer un
  contrôle seul** → `Label` (`htmlFor`) ; **regrouper des champs apparentés** →
  `Fieldset` (`legend` fourni par l'app). Le message d'erreur est injecté, jamais calculé
  par le cœur.

### Tables

- **Une grille dense de lignes** → les parts de `Table` (`Table`, `TableHeader`,
  `TableBody`, `TableRow`, `TableHead`, `TableCell`), importables séparément.
- **Filtrer par une dimension** → `FacetFilter` (options, sélection et libellé « effacer »
  injectés) ; **rechercher, compter, gérer les colonnes** → `DataTableToolbar` ;
  **naviguer dans une page** → `DataTablePagination` (indépendante de la table).
- **Une table pilotée** (colonnes, facettes, tri, pagination, détail de ligne) → la
  feature `FacetedDataTable` : elle possède le comportement et le **placement** du détail
  (surcouche `overlay` ou dépli `inline`), l'app fournit le contenu et les `labels`.

### Tons et tokens

- **Un ton de statut** → `toneClasses` (`neutral`, `info`, `progress`, `attention`,
  `warning`, `danger`, `success`). C'est une **intention**, pas une couleur.
- **Couleurs, espacement, typographie** → les tokens (`tokens.json`, source unique). Le
  thème et la densité se posent sur la **racine du rendu** (`data-theme`, `data-density`),
  jamais sur `:root`.

Le tri par défaut est porté par la colonne (`meta.defaultSort`), jamais par le cœur.

## L'inventaire

La liste exacte des briques du catalogue, tenue par test (`src/mcp/skill.test.ts`) : une
brique ajoutée au catalogue sans être ici fait rougir, et une ligne qui n'existe plus
aussi.

<!-- inventaire : début — tenu par src/mcp/skill.test.ts -->
alert
badge
button
card
checkbox
chip
counter
data-table-pagination
data-table-toolbar
dialog
dropdown-menu
empty-state
facet-filter
field
fieldset
form
freshness
input
label
meter
number-field
progress-bar
radio
rating
search-field
separator
sheet
skeleton
switch
table
textarea
timeline
toast
toggle
toggle-group
tree
<!-- inventaire : fin -->

## Interroger le catalogue

Le serveur MCP local sert le même inventaire que la page de style, en lecture seule :

```sh
npm run mcp   # stdio, sans jeton
```

- `list_components { query? }` — quelles briques existent, et laquelle correspond à un mot.
- `get_component { name }` — le contrat complet d'une brique (props, variantes, usages).
- `preview_component { name }` — sa recette de rendu (exemple de props, variantes, usages).
- `list_scenes` — les **scènes composites** disponibles.
- `render_<nom>` / `render_scene_<nom>` — renvoient la recette, **portent les données**
  (`props`, optionnel) et **référencent la vue** par `_meta.ui.resourceUri`.

Les ressources portent les mêmes données que les outils : `nomos://tokens` (l'inventaire
aplati par mode) et `nomos://component/<nom>` (le manifeste).

## Le rendu en conversation

Au-delà du manifeste, chaque brique a une **vue** servie en `ui://nomos/<nom>` — un
document auto-suffisant (`text/html;profile=mcp-app`) que l'hôte rend dans un iframe
sandboxé. Une **scène composite** (`ui://nomos/composite/<nom>`) assemble plusieurs
briques en un écran qui a du sens (un formulaire, une carte de statut).

La vue **émet des intentions** (`ready`, `select`, `change`, `error`) et ne mute jamais
l'état : l'hôte décide. Il lui pousse l'apparence (`set-view` : thème, densité) et les
**données** (`set-data`, ADR 0023) — les `props` que l'outil de rendu a portées.

## Si tu changes le design system

Un changement qui change **l'usage** d'une brique met cette skill à jour dans le même
changement : la liste de l'inventaire et la prose. Un composant ajouté au catalogue sans
son manifeste (props, variantes, usages) fait rougir le test de cohérence
(`src/catalogue/coherence.test.ts`) ; une brique absente de l'inventaire fait rougir
`src/mcp/skill.test.ts`.
