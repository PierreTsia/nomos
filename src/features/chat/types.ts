/**
 * Le contrat d'une conversation, côté cœur (ADR 0032).
 *
 * Le cœur **structure** la conversation et possède sa machine à états ; il ne possède
 * ni le transport, ni l'appel au modèle, ni la persistance, ni l'erreur (ADR 0018).
 * L'app injecte un `ChatTransport` — une seule fonction `send` — et le cœur l'ignore :
 * une edge function, un pipeline, un mock local sont la même couture.
 *
 * Un message porte des **parts**, pas une chaîne : un signal structuré (« le brouillon
 * est prêt », un artefact d'extraction, un résultat d'outil) est une part de premier
 * ordre que la surface rend, jamais un sentinelle pêchée dans la prose.
 */

/** Qui parle. `tool` porte le résultat d'un outil, pas un tour de conversation. */
export type ChatRole = 'user' | 'assistant' | 'system' | 'tool'

/** Un fragment de contenu d'un message. */
export type ChatPart =
  | { type: 'text'; text: string }
  | { type: 'reasoning'; text: string; state?: 'streaming' | 'done' }
  | {
      type: 'tool'
      name: string
      state: 'pending' | 'running' | 'success' | 'error'
      input?: unknown
      output?: unknown
      /** Le libellé affiché ; absent, l'app décide quoi montrer du `name`. */
      label?: string
    }
  | { type: 'data'; name: string; payload: unknown }

/** L'état d'un message : `streaming` tant que des deltas arrivent, `done` sinon. */
export type ChatMessageStatus = 'streaming' | 'done' | 'error'

/** Un message : un rôle et une suite ordonnée de parts, jamais une chaîne seule. */
export type ChatMessage = {
  id: string
  role: ChatRole
  parts: ChatPart[]
  status?: ChatMessageStatus
  /** Format l'app : ISO ou epoch, le cœur ne l'interprète pas (il ne l'affiche pas). */
  createdAt?: string | number
}

/**
 * Un incrément de réponse. Le transport est **streaming-ready** (ADR 0032) : un
 * transport par requête/réponse rend un unique `message`, un transport qui streame
 * rend des `text-delta` et des `part` que le contrôleur assemble.
 */
export type ChatDelta =
  | { kind: 'text-delta'; text: string }
  | { kind: 'part'; part: ChatPart }
  | { kind: 'message'; message: ChatMessage }
  | { kind: 'error'; error: string }

/** Ce qu'un envoi reçoit : le texte de l'utilisateur et le signal d'annulation. */
export type ChatSendInput = { text: string; signal: AbortSignal }

/**
 * La couture unique que l'app fournit. `send` rend un flux de deltas **ou** un message
 * complet ; le contrôleur normalise les deux. Le cœur n'appelle jamais de modèle, ne
 * connaît aucun endpoint et ne voit aucune erreur réseau (ADR 0018).
 */
export type ChatTransport = {
  send: (input: ChatSendInput) => AsyncIterable<ChatDelta> | Promise<ChatMessage>
}

/** L'état de la conversation, du point de vue de la surface. */
export type ChatStatus = 'idle' | 'submitted' | 'streaming' | 'error'

/**
 * Les libellés et textes accessibles, tous injectés par l'app : le cœur n'invente aucun
 * mot (ADR 0015). `roleNames` nomme les rôles pour les lecteurs d'écran.
 */
export type ChatLabels = {
  composerPlaceholder: string
  send: string
  stop: string
  retry: string
  regenerate: string
  empty: string
  scrollToBottom: string
  typing: string
  roleNames?: Partial<Record<ChatRole, string>>
}
