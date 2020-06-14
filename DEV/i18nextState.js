import i18n from 'i18next'
import { factoryI18nextState } from '../src'
import en from './assets/locales/en'
import ptBR from './assets/locales/pt-BR'

i18n.init({
  fallbackLng: 'en',
  languages: ['en', 'pt-BR'],
  lng: 'en',
  resources: {
    en: {
      translation: en,
    },
    'pt-BR': {
      translation: ptBR,
    },
  },
})

const i18nState = factoryI18nextState({
  i18n,
  persistence: {
    get: () => localStorage.getItem('locale'),
    set: (locale) => localStorage.getItem('locale', locale),
  },
})

export default i18nState
