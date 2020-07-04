export default function getI18nDefaultNamespace(i18n) {
  return (
    [].concat(i18n.options.defaultNS || i18n.options.fallbackNS).shift() ||
    'translation'
  )
}
