import { fireEvent, render } from '@testing-library/svelte'
import i18n from 'i18next'
import HttpApi from 'i18next-http-backend'
import { Response } from 'miragejs'
import AppForTest from '../DEV/AppForTest.svelte'
import factoryI18nextState from './i18next/factoryI18nextState'

function factoryState(stateOptions) {
  const options = {
    fallbackLng: 'en',
    fallbackNS: 'translation',
    languages: ['en', 'pt-BR', 'es'],
    lng: 'en',
    /**
     * Important to load only the language required
     * e.g. loading 'pt-BR', it won't load 'pt'
     */
    load: 'currentOnly',
    backend: {
      loadPath: '/assets/locales/{{lng}}/{{ns}}.json',
    },
  }

  i18n.use(HttpApi).init(options)

  const i18nState = factoryI18nextState({
    i18n,
    errorContent: 'error...',
    loadingContent: 'loading...',
    persistence: {
      get: () => localStorage.getItem('locale'),
      set: (locale) => localStorage.getItem('locale', locale),
    },
    ...stateOptions,
  })

  i18n.init().then(() => {
    i18nState.init()
  })

  return i18nState
}

function getAppForTestOptions(stateOptions) {
  return {
    props: {
      state: factoryState(stateOptions),
    },
  }
}

describe('i18nextStateAsync', () => {
  beforeEach(() => {
    try {
      /**
       * first time i18n is not initialized, then, we need to surround
       * the error because there is nothing to reset language
       */
      i18n.changeLanguage('en')
    } catch {}
  })

  test('if i18nextStateAsync handles remote resource loading', async () => {
    const wrapper = render(AppForTest, getAppForTestOptions())

    const loadingElements = await wrapper.findAllByText('loading...')
    expect(loadingElements).toBeTruthy()
    expect(loadingElements).toHaveLength(8)

    const hello = await wrapper.findByText('Hello World', {}, { timeout: 5000 })
    expect(hello).toBeTruthy()
  }, 10000)

  test('if i18nextStateAsync handles remote changes on language', async () => {
    const wrapper = render(AppForTest, getAppForTestOptions())

    await wrapper.findAllByText('Hello World', {}, { timeout: 5000 })

    fireEvent.click(await wrapper.findByText('pt: translation'))

    await wrapper.findAllByText('loading...', {}, { timeout: 5000 })
    const hello = await wrapper.findByText('Ola Mundo', {}, { timeout: 15000 })
    expect(hello).toBeTruthy()
  }, 25000)

  test('if i18nextStateAsync handles error on changes on language', async () => {
    const wrapper = render(AppForTest, getAppForTestOptions())

    await wrapper.findAllByText('Hello World', {}, { timeout: 5000 })

    global.server.get('/:language/:ns', () => new Response(500))

    fireEvent.click(await wrapper.findByText('es: translation'))

    const errors = await wrapper.findAllByText(
      'error...',
      {},
      { timeout: 15000 },
    )
    expect(errors).toBeTruthy()
    expect(errors.length > 0).toBe(true)
  }, 20000)

  test('if i18nextStateAsync handles error on changes on language with custom handler', async () => {
    const onFetchError = jest.fn()
    const wrapper = render(AppForTest, getAppForTestOptions({ onFetchError }))

    await wrapper.findAllByText('Hello World', {}, { timeout: 5000 })

    global.server.get('/:language/:ns', () => new Response(500))

    fireEvent.click(await wrapper.findByText('jp: translation'))

    const errors = await wrapper.findAllByText(
      'error...',
      {},
      { timeout: 15000 },
    )
    expect(errors).toBeTruthy()
    expect(errors.length > 0).toBe(true)

    expect(onFetchError).toHaveBeenCalled()
    expect(onFetchError).toHaveBeenCalledTimes(1)
    expect(onFetchError).toHaveBeenCalledWith({
      language: 'jp',
      retry: expect.any(Function),
    })
  }, 20000)
})
