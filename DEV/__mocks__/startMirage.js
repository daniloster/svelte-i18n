import { Server } from 'miragejs'
import enCommon from '../assets/locales/en/common.json'
import enTranslation from '../assets/locales/en/translation.json'
import esCommon from '../assets/locales/es/common.json'
import esTranslation from '../assets/locales/es/translation.json'
import ptBRCommon from '../assets/locales/pt-BR/common.json'
import ptBRTranslation from '../assets/locales/pt-BR/translation.json'

const resources = {
  en: {
    'translation.json': enTranslation,
    'common.json': enCommon,
  },
  'pt-BR': {
    'translation.json': ptBRTranslation,
    'common.json': ptBRCommon,
  },
  es: {
    'translation.json': esTranslation,
    'common.json': esCommon,
  },
}

/**
 * Creates a mock api server which mimics the api service behaviour
 * @param {string} environment - the definition of environment for mock api server
 * @return {object}
 */
export default function startMirage(environment = 'development') {
  const server = new Server({
    environment,

    routes() {
      this.namespace = 'assets/locales'
      /**
       * Request Handlers
       * 1st argument
       * @typedef Schema
       * @property {Object} [any model key in the plural]
       * 2nd argument
       * @typedef Request
       * @property {Object} params - params mapped in the URL
       * @property {Object} queryParams - attributes in the query string
       * @property {string} requestBody - the request body sent
       */

      this.get(
        '/:language/:ns',
        (schema, request) => {
          const { language, ns } = request.params

          return resources[language][ns]
        },
        { timing: 1000 },
      )
    },
  })

  return server
}
