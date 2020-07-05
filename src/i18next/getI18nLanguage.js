export default function getI18nLanguage(i18n) {
  return []
    .concat(
      i18n.language ||
        i18n.languages ||
        i18n.options.language ||
        i18n.options.languages,
    )
    .shift()
}
