import nodes from './literals/literal'
import text from './literals/literalMessage'

const resolvers = {
  text,
  nodes,
}
function factoryResolver(type, namespace, currentState) {
  const resolver = resolvers[type]
  const prefixNamespace = namespace ? namespace + '.' : ''
  return (path, modifiers) => {
    const defaultMessages = currentState.locales[currentState.defaultLocale]
    const messages = currentState.locales[currentState.locale]

    const fragments = resolver(
      defaultMessages,
      messages,
      `${prefixNamespace}${path}`,
      modifiers,
    )

    return fragments
  }
}

export default function factoryResolvers(namespace, currentState) {
  return {
    text: factoryResolver('text', namespace, currentState),
    nodes: factoryResolver('nodes', namespace, currentState),
  }
}
