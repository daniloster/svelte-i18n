const DEFAULT_MODIFIERS = {}
/**
 * Gets interpolated message given a template message and modifiers
 * @param {string} templateMessage - the template message
 * @param {object} modifiers - object with keys to values which should be replaced in the template
 * @returns {string}
 */
export default function interpolateText(
  templateMessage,
  modifiers = DEFAULT_MODIFIERS,
) {
  if (!templateMessage) {
    return null
  }

  const keys = Object.keys(modifiers)

  return keys.reduce(
    (message, key) =>
      message
        ? message.replace(new RegExp(`{${key}}`, 'g'), modifiers[key])
        : message,
    templateMessage,
  )
}
