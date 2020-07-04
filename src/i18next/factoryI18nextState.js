import { get } from 'mutation-helper'
import { noop } from 'svelte/internal'
import { readable, writable } from 'svelte/store'
import factoryStates from '../factoryStates'
import getNamespace from '../getNamespace'
import Literal from '../Literal.svelte'
import AsyncStatus from './AsyncStatus'
import factoryResolversI18next from './factoryResolversI18next'
import fetchLanguageWithNamespace from './fetchLanguageWithNamespace'
import getI18nDefaultNamespace from './getI18nDefaultNamespace'
import getI18nNsSeparator from './getI18nNsSeparator'

/**
 * Factories a localization state with resolvers and Literal component
 * @param {import('../types').LocalizationI18nextStateOptions} options
 * @returns {import('../types').LocalizationObservable}
 */
function factoryI18nextState(options) {
  const {
    clearNamespace = getNamespace,
    i18n,
    onFetchError = () => null,
    loadingContent,
    errorContent,
    persistence = { get: noop, set: noop },
  } = options

  const i18nAsyncStatus = writable(AsyncStatus.Success)
  const defaultNamespace = [].concat(getI18nDefaultNamespace(i18n)).shift()
  const nsSeparator = getI18nNsSeparator(i18n)
  const state = factoryStates({
    i18n,
    i18nAsyncStatus,
    locale: i18n.options.language,
    languages: i18n.options.languages,
  })

  function resolveNamespaceI18next(filename) {
    return (filename && filename.includes(nsSeparator)
      ? filename.split(nsSeparator)[0]
      : ''
    ).trim()
  }

  function resolveNamespace(filename) {
    const i18nextNamespace = resolveNamespaceI18next(filename)
    const filenamePath = filename && filename.split(nsSeparator).pop()

    return [i18nextNamespace, clearNamespace(filenamePath)]
      .filter((node) => !!node)
      .join(nsSeparator)
  }

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
        persistence.set(locale)
        return { ...old, locale }
      })
    },
    extend: (locales) => {
      state.update((old) => {
        Object.entries(locales).forEach(([languageAndNS, resource]) => {
          const [language, namespace] = languageAndNS.split(nsSeparator)
          old.i18n.addResourceBundle(
            language,
            namespace || defaultNamespace,
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
    resolveNamespace: (filename) =>
      resolveNamespace(filename).split(nsSeparator).pop(),
    resolvers: (filename) => {
      const i18nextNamespace = resolveNamespaceI18next(filename)
      const namespace = resolveNamespace(filename)
      /**
       * why do we need to fetch language with namespace here?
       * namespaces in i18next are defined with 2 aspects
       * 1. the json filename name to async load, '/assets/locales/{{lng}}/{{ns}}.json'
       * 1. a parent node in the bundle translation file, '/assets/locales/{{lng}}.json'
       * 2. the prefix of key resolution 'common:toolbar.confirm.text'
       */
      let i18nState = state.get()
      fetchLanguageWithNamespace(
        i18nState.i18n,
        i18nState.i18nAsyncStatus,
        i18nState.locale,
        i18nextNamespace || defaultNamespace,
      ).catch(onFetchError)
      let stateResolvers = factoryResolversI18next(namespace, i18nState)
      const getter = readable(stateResolvers, (set) => {
        const unsubscribeState = state.subscribe((newState) => {
          i18nState = newState
          stateResolvers = factoryResolversI18next(namespace, newState)
          set(stateResolvers)
        })
        const unsubscribeStatus = i18nState.i18nAsyncStatus.subscribe(
          (newStatus) => {
            if (newStatus !== AsyncStatus.Loading) {
              stateResolvers = factoryResolversI18next(namespace, i18nState)
              set(stateResolvers)
            }
          },
        )
        getter.unsubscribe = () => {
          unsubscribeState()
          unsubscribeStatus()
        }
      })

      return getter
    },
    init: () => {
      return new Promise((resolve, reject) => {
        const initialLocaleUnified = persistence.get() || i18n.options.lng
        observableState.setLocale(initialLocaleUnified)
        i18nAsyncStatus.subscribe((newStatus) => {
          if (newStatus === AsyncStatus.Success) {
            resolve()
          } else if (newStatus === AsyncStatus.Error) {
            reject()
          }
        })
      })
    },
  }

  observableState.subscribe((i18nState) => {
    fetchLanguageWithNamespace(
      i18nState.i18n,
      i18nState.i18nAsyncStatus,
      i18nState.locale,
      defaultNamespace,
    ).catch(onFetchError)
  })

  function EmbeddedStateLiteral(config) {
    const i18nState = get(config, 'props.i18nState')
    const localLoadingContent =
      get(config, 'props.loadingContent') || loadingContent
    const localErrorContent = get(config, 'props.errorContent') || errorContent
    const initConfig = { ...(config || {}) }
    initConfig.props = {
      ...initConfig.props,
      i18nState: i18nState || observableState,
      i18nAsyncStatus: i18nAsyncStatus || readable(Status.Success),
      ...(localLoadingContent && { loadingContent: localLoadingContent }),
      ...(localErrorContent && { errorContent: localErrorContent }),
    }
    return new Literal(initConfig)
  }
  observableState.Literal = EmbeddedStateLiteral

  return observableState
}

export default factoryI18nextState
