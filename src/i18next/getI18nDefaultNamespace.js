export default function getI18nDefaultNamespace(i18n) {
  return i18n.options.defaultNS || i18n.options.fallbackNS || 'translation'
}
