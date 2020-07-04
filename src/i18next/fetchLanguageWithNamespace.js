import { noop } from 'svelte/internal'
import AsyncStatus from './AsyncStatus'

export default function fetchLanguageWithNamespace(
  i18n,
  i18nAsyncStatus,
  language,
  namespace,
) {
  if (!i18nAsyncStatus) {
    return Promise.resolve(i18n)
  }

  const retry = () =>
    fetchLanguageWithNamespace(i18n, i18nAsyncStatus, language, namespace)

  i18nAsyncStatus.set(AsyncStatus.Loading)

  return new Promise((resolve, reject) => {
    const languageChanged = () => {
      if (i18n.hasLoadedNamespace(namespace)) {
        i18nAsyncStatus.set(AsyncStatus.Success)
        binding('off', resolve)
      } else {
        const onLoaded = () => {
          i18nAsyncStatus.set(AsyncStatus.Success)
          binding('off', resolve)
        }

        i18n.loadNamespaces(namespace).then(onLoaded).catch(onFailed)
      }
    }
    const onFailed = (language) => {
      i18nAsyncStatus.set(AsyncStatus.Error)
      binding('off', () => reject({ language, retry }))
    }
    const binding = (type, callback = noop) => {
      i18n[type]('languageChanged', languageChanged)
      i18n[type]('failedLoading', onFailed)

      callback()
    }

    binding('on')
    i18n.changeLanguage(language, (error) => {
      if (error) {
        i18nAsyncStatus.set(AsyncStatus.Error)
        binding('off', () => reject({ ...error, retry }))
      }
    })
  })
}
