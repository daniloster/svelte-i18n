import CustomComponent from './wrappers/CustomComponent'
import Html from './wrappers/Html'

function getChildren(tag, sentence) {
  return sentence.replace(new RegExp(`\\</?${tag}(\\s*)\\>`, 'gi'), '')
}

export default function interpolateLiteral(
  message,
  interpolationComponentsMap,
) {
  let baseMessage = message
  let interpolatedMessage = []
  /** @type {import('../types').MarkupGroupsTag} */
  const markupGroups = message.matchAll(
    /(?<selfClosing>\<[A-Z0-9]*\s*\/\>)|\<(?<tag>[A-Z0-9]*)\b[^>]*\>.*?\<\/(\k<tag>)\>/gi,
  )
  let current = markupGroups.next()

  while (!current?.done) {
    const [sentence] = current.value
    const {
      groups: { tag, selfClosing },
    } = current.value
    const isSelfClosing = !!selfClosing

    const index = baseMessage.indexOf(sentence)
    const parsedMarkup = isSelfClosing
      ? selfClosing.replace(/[</>]/gi, '').trim()
      : tag // in case we have attributes
    const children = !isSelfClosing && getChildren(tag, sentence)
    const node = Array.isArray(interpolationComponentsMap[parsedMarkup])
      ? new CustomComponent(
          ...interpolationComponentsMap[parsedMarkup],
          children,
        )
      : new Html(interpolationComponentsMap[parsedMarkup], children)

    interpolatedMessage.push(baseMessage.substring(0, index))
    interpolatedMessage.push(node)

    baseMessage = baseMessage.substring(index + sentence.length)
    current = markupGroups.next()
  }

  interpolatedMessage.push(baseMessage)

  return interpolatedMessage
}
