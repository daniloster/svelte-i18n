import factoryLocalizationState from '../src'
import en from './assets/locales/en'
import ptBR from './assets/locales/pt-BR'

const localizationState = factoryLocalizationState({
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

export default localizationState
