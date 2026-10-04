/** Le prédicat « dépendance externe » partagé par le build et les gardes : elle est
 *  installée par le consommateur, jamais inlinée. React et `node:` le sont aussi. */
export function makeExternal(deps) {
  return (id) =>
    deps.some((dep) => id === dep || id.startsWith(`${dep}/`)) ||
    id === 'react' ||
    id === 'react-dom' ||
    id.startsWith('react/') ||
    id.startsWith('react-dom/') ||
    id.startsWith('node:')
}
