import { get, set } from 'mutation-helper'
import { noop } from 'svelte/internal'
import { readable } from 'svelte/store'
import factoryStates from '../factoryStates'
import getNamespace from '../getNamespace'
import Literal from '../Literal.svelte'
import factoryResolversI18next from './factoryResolversI18next'

/**
 * Factories a localization state with resolvers and Literal component
 * @param {import('../types').LocalizationI18nextStateOptions} options
 * @returns {import('../types').LocalizationObservable}
 */
function factoryI18nextState(options) {
  const {
    clearNamespace = getNamespace,
    i18n,
    persistence = { get: noop, set: noop },
  } = options || {}

  const state = factoryStates({
    i18n,
    locale: i18n.options.language,
    languages: i18n.options.languages,
  })

  const observableState = {
    ...state,
    set: (value) => {
      if (value?.locale) {
        persistence.set(value.locale)
      }
      state.set(value)
    },
    update: (transform) => {
      state.update((old) => {
        const value = transform(old)
        persistence.set(value.locale)

        return value
      })
    },
    setLocale: (locale) => {
      observableState.update((old) => {
        old.i18n.changeLanguage(locale)
        return { ...old, locale }
      })
    },
    extend: (locales) => {
      state.update((old) => {
        Object.entries(locales).forEach(([language, resource]) => {
          old.i18n.addResourceBundle(
            language,
            'translation',
            resource,
            true,
            true,
          )
        })

        return {
          ...old,
          languages: old.i18n.options.languages,
        }
      })
    },
    resolvers: (filename) => {
      const namespace = clearNamespace(filename)
      const initialStateResolvers = factoryResolversI18next(
        namespace,
        state.get(),
      )
      const getter = readable(initialStateResolvers, (set) => {
        getter.unsubscribe = state.subscribe((newState) => {
          set(factoryResolversI18next(namespace, newState))
        })
      })

      return getter
    },
    init: () => {
      const initialLocaleUnified = persistence.get() || i18n.options.lng
      observableState.setLocale(initialLocaleUnified)
    },
  }

  function EmbeddedStateLiteral(config) {
    const configValues = config || {}
    const i18nState = get(configValues, 'props.i18nState')
    const initConfig = set(
      configValues,
      'props.i18nState',
      i18nState || observableState,
    )
    return new Literal(initConfig)
  }
  observableState.Literal = EmbeddedStateLiteral

  return observableState
}

export default factoryI18nextState
