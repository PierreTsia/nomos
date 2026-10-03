/**
 * The English copy of the site. Every user-facing string lives here (issue #60): the
 * `Dictionary` type is inferred from this object, and `fr.ts` must satisfy it — key parity is
 * therefore a compile-time guarantee, and `i18n.test.tsx` keeps the copy honest at runtime.
 *
 * Not translated here: code snippets, component and folder names, ADR references, and the
 * `title`/`summary`/`usages` of the manifests — those are the package's data (the core's),
 * always English (ADR 0002, 0028).
 */
export const en = {
  /** The browser tab title, synced on language change (`document.title`). */
  meta: {
    title: 'Nomos — the laws of the interface',
  },
  language: {
    label: 'Language',
  },
  nav: {
    tokens: 'Tokens',
    docs: 'Docs',
    npm: 'npm',
    github: 'GitHub',
  },
  footer: {
    catalog: 'Catalog',
    tokens: 'Tokens',
    docs: 'Docs',
    legal: 'Nomos · νόμος, the laws of the interface · MIT',
  },
  sidebar: {
    ariaLabel: 'Catalogue',
    tokensGroup: 'Tokens',
    docsGroup: 'Docs',
    browse: 'Browse the catalogue',
  },
  /** The three catalogue levels, as shown (the manifest keeps the raw `jeton`/`primitive`/`bloc`). */
  levels: {
    jeton: 'tokens',
    primitive: 'primitives',
    bloc: 'blocks',
  },
  docs: {
    title: 'Docs',
    lead: 'Install it, wire the tokens, and learn the one rule that keeps the seams clean: imports go one way.',
    labels: {
      'getting-started': 'Getting started',
      boundary: 'The boundary rule',
      contributing: 'Contributing',
    },
    gettingStarted: {
      installTitle: 'Install',
      installBody: 'The core is @nomosui/react; React 19 is a peer.',
      wireTitle: 'Wire the tokens',
      wireBody:
        'Import Tailwind, the token values (the single source, ADR 0004) and the theme bridge, in this order:',
      useTitle: 'Use a brick',
      skinTitle: 'Make it yours: the skin',
      skinBody:
        "An app's identity is an overlay, never a fork: a skin changes token values, never the names (ADR 0022).",
    },
    boundary: {
      title: 'Imports go one way',
      body1:
        'An app may import Nomos; Nomos never imports app code (ADR 0002). If explaining a component needs a product word, it belongs to the app, not the heart.',
      body2:
        'Inside the package, imports go through @nomos/* and never a relative path — ESLint enforces it.',
    },
    contributing: {
      runTitle: 'Run it',
      replayTitle: 'Replay the generated artifacts',
      replayBody: 'CI fails if a generated file has drifted from its source; replay and commit it.',
      changesetTitle: 'A change to the package needs a changeset',
      changesetBody:
        'A structural change that contradicts a decision is raised in an ADR, never applied silently.',
    },
  },
  tokens: {
    title: 'Tokens',
    lead: 'The names every component speaks in. The values live in one file, and a skin replaces them (ADR 0003, 0004).',
  },
  brick: {
    unknown: (name: string) => `Unknown brick « ${name} ».`,
    allBricks: '← All bricks',
    previewTitle: 'Preview',
    previewCardTitle: 'Rendered with its example',
  },
  manifest: {
    props: (count: number) => `Props · ${count}`,
    name: 'Name',
    type: 'Type',
    defaultValue: 'Default',
    description: 'Description',
    variants: (count: number) => `Variants · ${count}`,
    defaultBadge: (value: string) => `default: ${value}`,
    usages: (count: number) => `Usages · ${count}`,
    use: 'use',
    avoid: 'avoid',
  },
  preview: {
    failed: 'Preview failed',
    noExample: 'No example props for this brick.',
  },
  prevNext: {
    navLabel: 'Brick navigation',
    previous: 'Previous brick',
    next: 'Next brick',
  },
  landing: {
    kicker: 'The laws of the interface',
    greekMeaning: 'Greek for law: the order a thing obeys',
    lead: 'Nomos is a design system that keeps its word. Tokens named once, components built from them, and one catalog that reads the same to a person and to an agent.',
    browseCatalog: 'Browse the catalog',
    readDocs: 'Read the docs',
    statsBricks: (count: number) => `${count} bricks`,
    statsTiers: 'two token tiers',
    statsThemes: 'dark and light',
    statsLicense: 'MIT',
    inventoryKicker: 'the inventory',
    inventoryTitle: 'One inventory, three faces',
    inventoryBody:
      "Every component is a single manifest. The catalog, the style page and the MCP server all read it, so the docs can't drift from the code.",
    generated: 'generated from the catalogue',
    spec: 'spec →',
    renderings: [
      {
        kicker: 'FOR PEOPLE',
        title: 'A page per brick',
        body: 'What it does, what it takes, and the honest case for reaching for it.',
      },
      {
        kicker: 'FOR SKINS',
        title: 'Values change, names do not',
        body: 'An app rebrands by filling in token values. No component gets forked.',
      },
      {
        kicker: 'FOR AGENTS',
        title: 'The same catalog, over MCP',
        body: 'Your coding agent reads the inventory and writes with your components, not around them.',
      },
    ],
    everyBrickTitle: 'Every brick',
    everyBrickLead: (count: number) => `All ${count} of them. Pick one and its page tells the whole story.`,
  },
}

export type Dictionary = typeof en
