import type { Dictionary } from './en'

/**
 * The French copy of the site (issue #60). `satisfies Dictionary` makes the compiler the
 * parity gate: a key added to `en.ts` and forgotten here turns the build red.
 */
export const fr = {
  meta: {
    title: 'Nomos — les lois de l’interface',
  },
  language: {
    label: 'Langue',
  },
  nav: {
    catalogue: 'Catalogue',
    gallery: 'Galerie',
    tokens: 'Tokens',
    docs: 'Docs',
    npm: 'npm',
    github: 'GitHub',
  },
  footer: {
    catalog: 'Catalogue',
    tokens: 'Tokens',
    docs: 'Docs',
    legal: 'Nomos · νόμος, les lois de l’interface · MIT',
  },
  sidebar: {
    ariaLabel: 'Catalogue',
    overview: 'Vue d’ensemble',
    docsGroup: 'Docs',
    browse: 'Parcourir le catalogue',
  },
  levels: {
    jeton: 'tokens',
    primitive: 'primitives',
    bloc: 'blocs',
  },
  docs: {
    title: 'Docs',
    lead: 'Installez-le, branchez les tokens, et apprenez la règle qui garde les coutures propres : les imports vont dans un seul sens.',
    labels: {
      'getting-started': 'Démarrage',
      starter: 'Partir du starter',
      boundary: 'La règle de frontière',
      contributing: 'Contribuer',
    },
    gettingStarted: {
      installTitle: 'Installer',
      installBody: 'Le cœur est @nomosui/react ; React 19 est un pair.',
      wireTitle: 'Brancher les tokens',
      wireBody:
        'Importez Tailwind, les valeurs de tokens (la source unique, ADR 0004) et le raccord, dans cet ordre :',
      useTitle: 'Utiliser une brique',
      skinTitle: 'À vous de jouer : le skin',
      skinBody:
        "L’identité d’une app est une surcouche, jamais un fork : un skin change les valeurs des tokens, jamais les noms (ADR 0022).",
    },
    starter: {
      scaffoldTitle: 'Le générer',
      scaffoldBody:
        'On copie le starter, ou on le génère avec le CLI fourni — pas de générateur, pas de modèle, juste une copie.',
      renameTitle: 'Renommer',
      renameBody: 'Réglez le nom de l’app dans package.json et la marque dans la mise en page.',
      fillTitle: 'Remplir les pages',
      fillBody:
        'Faites correspondre chaque intention à des briques du catalogue ; le catalogue ici et le serveur MCP font autorité. Passez les libellés en props — le cœur n’a pas d’i18n.',
      skinTitle: 'L’habiller (skin)',
      skinBody:
        'Éditez skin.json, une surcouche sémantique ; le build en dérive le CSS de l’app (ADR 0022). Aucune couleur ne vit ailleurs.',
      runTitle: 'Le lancer',
    },
    boundary: {
      title: 'Les imports vont dans un seul sens',
      body1:
        'Une app peut importer Nomos ; Nomos n’importe jamais de code d’app (ADR 0002). Si expliquer un composant demande un mot produit, il appartient à l’app, pas au cœur.',
      body2:
        'Dans le paquet, les imports passent par @nomos/* et jamais par un chemin relatif — ESLint l’impose.',
    },
    contributing: {
      runTitle: 'Le lancer',
      replayTitle: 'Rejouer les artefacts générés',
      replayBody:
        'La CI échoue si un fichier généré a dérivé de sa source ; rejouez-le et committez-le.',
      changesetTitle: 'Un changement du paquet passe par un changeset',
      changesetBody:
        'Un changement structurant qui contredit une décision se signale dans un ADR, jamais appliqué en silence.',
    },
  },
  tokens: {
    title: 'Tokens',
    lead: 'Les noms que chaque composant parle. Les valeurs vivent dans un seul fichier, et un skin les remplace (ADR 0003, 0004).',
  },
  gallery: {
    title: 'Galerie de layouts',
    lead: 'Des écrans entiers assemblés à partir des briques, chacun avec sa source. Copie-le et fais-le tien.',
    source: 'Source',
  },
  brick: {
    unknown: (name: string) => `Brique inconnue « ${name} ».`,
    allBricks: '← Toutes les briques',
    interfaceTitle: 'Interface',
    interfaceCardTitle: 'Rendu avec son exemple',
    scenarioTitle: 'Mise en situation',
    scenarioCardTitle: 'La brique en contexte',
    snippetsTitle: 'Snippets',
    snippetInterface: 'Interface',
    snippetScenario: 'Scénario',
  },
  manifest: {
    props: (count: number) => `Props · ${count}`,
    name: 'Nom',
    type: 'Type',
    defaultValue: 'Défaut',
    description: 'Description',
    variants: (count: number) => `Variantes · ${count}`,
    defaultBadge: (value: string) => `défaut : ${value}`,
    usages: (count: number) => `Usages · ${count}`,
    use: 'utiliser',
    avoid: 'éviter',
  },
  preview: {
    failed: 'Aperçu échoué',
    noExample: 'Aucune prop d’exemple pour cette brique.',
  },
  prevNext: {
    navLabel: 'Navigation des briques',
    previous: 'Brique précédente',
    next: 'Brique suivante',
  },
  landing: {
    kicker: 'Les lois de l’interface',
    greekMeaning: 'Du grec « loi » : l’ordre qu’une chose obéit',
    lead: 'Nomos est un design system qui tient parole. Des tokens nommés une fois, des composants bâtis dessus, et un catalogue qui se lit pareil pour une personne et pour un agent.',
    browseCatalog: 'Parcourir le catalogue',
    readDocs: 'Lire la doc',
    statsBricks: (count: number) => `${count} briques`,
    statsTiers: 'deux étages de tokens',
    statsThemes: 'clair et sombre',
    statsLicense: 'MIT',
    agent: {
      kicker: 'agent d’abord',
      title: 'Un design system qu’une machine peut bâtir',
      lead: 'Le même inventaire se rend à un humain et à un agent. Un agent découvre une brique, lit son manifeste et écrit une UI cohérente — sans archéologie de captures.',
      flow: [
        {
          title: 'Découvrir',
          body: 'L’agent liste le catalogue via le serveur MCP et choisit une brique selon ce à quoi elle sert.',
        },
        {
          title: 'Lire le manifeste',
          body: 'Props, variantes et usages reviennent en données — le manifeste même que ce site rend.',
        },
        {
          title: 'Rendre',
          body: 'Il écrit le composant depuis la vraie API, et la vue ui:// montre le résultat.',
        },
      ],
      getsLabel: 'Ce qu’il va chercher',
      gets: [
        'Le serveur MCP stdio (nomos-mcp)',
        'Les vues ui://nomos/<name>',
        'Le skill livré',
      ],
    },
    inventoryKicker: 'l’inventaire',
    inventoryTitle: 'Un inventaire, trois visages',
    inventoryBody:
      'Chaque composant est un seul manifeste. Le catalogue, la page de style et le serveur MCP le lisent tous, donc la doc ne peut pas dériver du code.',
    generated: 'généré depuis le catalogue',
    spec: 'spec →',
    renderings: [
      {
        kicker: 'POUR LES HUMAINS',
        title: 'Une page par brique',
        body: 'Ce qu’elle fait, ce qu’elle prend, et l’argument honnête pour aller la chercher.',
      },
      {
        kicker: 'POUR LES SKINS',
        title: 'Les valeurs changent, pas les noms',
        body: 'Une app se re-marque en remplissant les valeurs de tokens. Aucun composant n’est forké.',
      },
      {
        kicker: 'POUR LES AGENTS',
        title: 'Le même catalogue, via MCP',
        body: 'Votre agent de code lit l’inventaire et écrit avec vos composants, pas à côté.',
      },
    ],
    boundary: {
      kicker: 'la frontière',
      title: 'Les imports vont dans un seul sens',
      body: 'Une app peut importer Nomos ; Nomos n’importe jamais de code d’app. Un mot produit appartient à l’app, pas au cœur (ADR 0002).',
      skinTitle: 'Les valeurs changent, pas les noms',
      skinBody: 'Une app se re-marque en remplissant les valeurs de tokens — un skin, jamais un fork (ADR 0022).',
    },
    showcaseTitle: 'Quelques briques',
    showcaseLead: 'Six d’entre elles, en direct. Le catalogue les contient toutes.',
    browseAll: 'Voir tout le catalogue →',
    entriesTitle: 'Où aller ensuite',
  },
  catalogue: {
    title: 'Catalogue',
    lead: (count: number) =>
      `Les ${count} briques de l’inventaire, groupées par niveau. Choisissez-en une : sa page raconte toute l’histoire.`,
  },
} satisfies Dictionary
