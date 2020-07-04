import getI18nDefaultNamespace from './getI18nDefaultNamespace'
import getI18nNsSeparator from './getI18nNsSeparator'

describe('utils getI18nDefaultNamespace', () => {
  test('getI18nDefaultNamespace getting from i18n default', () => {
    expect(getI18nDefaultNamespace({ options: { defaultNS: 'key1' } })).toEqual(
      'key1',
    )
  })

  test('getI18nDefaultNamespace getting from i18n fallback', () => {
    expect(
      getI18nDefaultNamespace({ options: { fallbackNS: 'key2' } }),
    ).toEqual('key2')
  })

  test('getI18nDefaultNamespace getting from lib default', () => {
    expect(getI18nDefaultNamespace({ options: {} })).toEqual('translation')
  })
})

describe('utils getI18nNsSeparator', () => {
  test('getI18nNsSeparator getting from i18n', () => {
    expect(getI18nNsSeparator({ options: { nsSeparator: 'key1' } })).toEqual(
      'key1',
    )
  })

  test('getI18nNsSeparator getting from lib default', () => {
    expect(getI18nNsSeparator({ options: {} })).toEqual(':')
  })
})
