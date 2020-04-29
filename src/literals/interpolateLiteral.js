import CustomComponent from './wrappers/CustomComponent'
import Html from './wrappers/Html'

export default function interpolateLiteral(
  message,
  interpolationComponentsMap,
) {
  let baseMessage = message
  let interpolatedMessage = []
  let lastIndex = 0
  const markups = message.match(/(<[a-zA-Z]+>)/g) || []
  markups.forEach((markup) => {
    const index = baseMessage.indexOf(markup)
    const parsedMarkup = markup.substring(1, markup.length - 1)
    const node = Array.isArray(interpolationComponentsMap[parsedMarkup])
      ? new CustomComponent(...interpolationComponentsMap[parsedMarkup])
      : new Html(interpolationComponentsMap[parsedMarkup])
    interpolatedMessage.push(baseMessage.substring(lastIndex, index))
    interpolatedMessage.push(node)
    lastIndex = index + markup.length

    baseMessage = baseMessage.replace(markup, `|${parsedMarkup}|`)
  })

  interpolatedMessage.push(baseMessage.substring(lastIndex))

  return interpolatedMessage
}
