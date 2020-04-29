import getLocale from './getLocale'

describe('getLocale', () => {
  beforeEach(() => {
    window.navigator = {}
  })
  afterEach(() => {
    window.navigator.restore()
  })
  test('if getLocale gets from languages', () => {
    window.navigator = { languages: ['pt-BR'] }
    expect(getLocale()).toEqual('pt-BR')
  })

  test('if getLocale gets from language', () => {
    window.navigator = { language: 'en-IE' }
    expect(getLocale()).toEqual('en-IE')
  })
})
