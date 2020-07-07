import { factoryI18nextState } from '@daniloster/svelte-i18n'
import i18n from 'i18next'
import HttpApi from 'i18next-http-backend'

i18n
  .use(HttpApi)
  .init({
    debug: true,
    fallbackLng: 'en',
    fallbackNS: 'translation',
    languages: ['en', 'pt-BR', 'es'],
    lng: 'en',
    // namespaces: ['translation', 'mobile'],
    /**
     * Important to load only the language required
     * e.g. loading 'pt-BR', it won't load 'pt'
     */
    load: 'currentOnly',
    backend: {
      loadPath: '/assets/locales/{{lng}}/{{ns}}.json',
    },
  })
  .then(() => {
    i18nState.init()
  })

const i18nState = factoryI18nextState({
  i18n,
  errorContent: 'error...',
  loadingContent: 'loading...',
  persistence: {
    get: () => localStorage.getItem('locale'),
    set: (locale) => localStorage.getItem('locale', locale),
  },
})

export default i18nState
