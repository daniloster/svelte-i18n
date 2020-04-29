import factoryI18nState from '../src'
import en from './assets/locales/en'
import ptBR from './assets/locales/pt-BR'

const i18nState = factoryI18nState({
  defaultLocale: 'en',
  locales: {
    en,
    'pt-BR': ptBR,
  },
  persistence: {
    get: () => localStorage.getItem('locale'),
    set: (locale) => localStorage.getItem('locale', locale),
  },
})

export default i18nState
