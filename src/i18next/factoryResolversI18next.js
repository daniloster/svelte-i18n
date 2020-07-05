import nodes from '../literals/interpolateLiteral'
import text from '../literals/interpolateText'

const resolvers = {
  text,
  nodes: (template, modifiers) => {
    const baseMessage = text(template, modifiers)
    return nodes(baseMessage, modifiers)
  },
}

function factoryResolver(type, namespace, currentState) {
  const resolver = resolvers[type]
  const prefixNamespace = namespace ? namespace + '.' : ''
  return (path, modifiers) => {
    const parts = prefixNamespace.split(currentState.nsSeparator)
    const i18nNS = parts.length > 1 ? parts[0] : currentState.defaultNamespace
    const template = currentState.i18n.hasResourceBundle(
      currentState.locale,
      i18nNS,
    )
      ? currentState.i18n.t(prefixNamespace + path)
      : parts.pop() + path

    const fragments = resolver(template, modifiers)

    return fragments
  }
}

export default function factoryResolversI18next(namespace, currentState) {
  return {
    text: factoryResolver('text', namespace, currentState),
    nodes: factoryResolver('nodes', namespace, currentState),
  }
}
