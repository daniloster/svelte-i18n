import { get } from 'mutation-helper'
import { noop } from 'svelte/internal'
import { readable } from 'svelte/store'
import factoryResolvers from './factoryResolvers'
import factoryStates from './factoryStates'
import getNamespace from './getNamespace'
import Literal from './Literal.svelte'
import getLocale from './literals/getLocale'

/**
 * Factories a localization state with resolvers and Literal component
 * @param {import('./types').LocalizationStateOptions} options
 * @returns {import('./types').LocalizationObservable}
 */
function factoryI18nState(options) {
  const {
    clearNamespace = getNamespace,
    defaultLocale = getLocale(),
    initialLocale = defaultLocale,
    locales = {},
    loadingContent,
    errorContent,
    persistence = { get: noop, set: noop },
  } = options || {}

  const state = factoryStates({
    defaultLocale,
    locale: initialLocale,
    locales,
    languages: Object.keys(locales),
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
      observableState.update((old) => ({ ...old, locale }))
    },
    extend: (locales) => {
      state.update((old) => ({
        ...old,
        locales: {
          ...old.locales,
          ...locales,
        },
      }))
    },
    resolveNamespace: clearNamespace,
    resolvers: (filename) => {
      const namespace = clearNamespace(filename)
      const initialStateResolvers = factoryResolvers(namespace, state.get())
      const getter = readable(initialStateResolvers, (set) => {
        getter.unsubscribe = state.subscribe((newState) => {
          set(factoryResolvers(namespace, newState))
        })
      })

      return getter
    },
    init: () => {
      const initialLocaleUnified = persistence.get() || initialLocale
      observableState.setLocale(initialLocaleUnified)
    },
  }

  function EmbeddedStateLiteral(config) {
    const i18nState = get(config, 'props.i18nState')
    const initConfig = { ...(config || {}) }
    initConfig.props = {
      ...initConfig.props,
      i18nState: i18nState || observableState,
      ...(loadingContent && { loadingContent }),
      ...(errorContent && { errorContent }),
    }
    return new Literal(initConfig)
  }
  observableState.Literal = EmbeddedStateLiteral

  return observableState
}

export default factoryI18nState
