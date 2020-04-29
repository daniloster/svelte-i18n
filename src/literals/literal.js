import interpolateLiteral from './interpolateLiteral'
import literalMessage from './literalMessage'

/**
 * Gets message from resource based on the jsonPath and modifiers
 * @param {Object} defaultMessages - JSON with fields mapping messages where will be used when jsonPath is not found in messages
 * @param {Object} messages - JSON with fields mapping messages
 * @param {string} jsonPath - the path to access the template message
 * @param {object} modifiers - object with keys to values which should be replaced in the template
 * @returns {array}
 */
export default function literal(
  defaultMessages,
  messages,
  jsonPath,
  modifiers,
) {
  const message = literalMessage(defaultMessages, messages, jsonPath, modifiers)

  if (/<([a-z]|[0-9])+>/gi.test(message)) {
    return interpolateLiteral(message, modifiers)
  }

  const fragments = [].concat(message || [])

  return fragments
}
