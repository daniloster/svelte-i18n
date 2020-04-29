import { render } from '@testing-library/svelte'
import { get, set } from 'mutation-helper'
import i18nState from '../DEV/i18nState'
import Literal from './Literal'

function I18nLiteral(config) {
  const initialLocalizationState = get(config || {}, 'props.i18nState')
  const initConfig = set(
    config || {},
    'props.i18nState',
    initialLocalizationState === null ? undefined : i18nState,
  )
  return new Literal(initConfig)
}

describe('Literal', () => {
  test('if Literal handles default props', async () => {
    const wrapper = render(I18nLiteral, {})
    expect(wrapper.container.textContent).toEqual('')
  })

  test('if Literal throws error for i18nState as null', async () => {
    try {
      render(I18nLiteral, { i18nState: null })
      expect(true).toEqual(false)
    } catch (e) {
      expect(e.message).toEqual(
        'Literal requires {i18nState} to be passed as property.',
      )
    }
  })

  test('if Literal handles empty namespace and full path (PageOne.hello)', async () => {
    const wrapper = render(I18nLiteral, {
      namespace: '',
      path: 'PageOne.hello',
    })
    expect(wrapper.container.textContent).toEqual('Hello World')
  })

  test('if Literal handles empty namespace and full path (PageOne.hello)', async () => {
    const wrapper = render(I18nLiteral, {
      namespace: '',
      path: 'PageOne.hello',
    })
    expect(wrapper.container.textContent).toEqual('Hello World')
  })
})
