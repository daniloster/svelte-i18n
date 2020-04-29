/**
 * Return the default locale e.g. 'en-GB'
 */
export default function getLocale() {
  if (window.navigator.languages) {
    return window.navigator.languages[0]
  }

  return window.navigator.userLanguage || window.navigator.language
}
