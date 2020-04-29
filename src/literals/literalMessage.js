import { get } from 'mutation-helper'

const DEFAULT_MODIFIERS = {}
/**
 * Gets message from resource based on the jsonPath and modifiers
 * @param {Object} defaultMessages - JSON with fields mapping messages where will be used when jsonPath is not found in messages
 * @param {Object} messages - JSON with fields mapping messages
 * @param {string} jsonPath - the path to access the template message
 * @param {object} modifiers - object with keys to values which should be replaced in the template
 * @returns {string}
 */
export default function literalMessage(
  defaultMessages,
  messages,
  jsonPath,
  modifiers = DEFAULT_MODIFIERS,
) {
  if (!jsonPath) {
    return null
  }

  const keys = Object.keys(modifiers)
  const templateMessage =
    get(messages, jsonPath) || get(defaultMessages, jsonPath)

  return keys.reduce(
    (message, key) =>
      message
        ? message.replace(new RegExp(`{${key}}`, 'g'), modifiers[key])
        : message,
    templateMessage,
  )
}
