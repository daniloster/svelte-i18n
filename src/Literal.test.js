import { render } from '@testing-library/svelte'
import { get, set } from 'mutation-helper'
import localizationState from '../DEV/localizationState'
import Literal from './Literal'

function I18nLiteral(config) {
  const initialLocalizationState = get(config || {}, 'props.localizationState')
  const initConfig = set(
    config || {},
    'props.localizationState',
    initialLocalizationState === null ? undefined : localizationState,
  )
  return new Literal(initConfig)
}

describe('Literal', () => {
  test('if Literal handles default props', async () => {
    const wrapper = render(I18nLiteral, {})
    expect(wrapper.container.textContent).toEqual('')
  })

  test('if Literal throws error for localizationState as null', async () => {
    try {
      render(I18nLiteral, { localizationState: null })
      expect(true).toEqual(false)
    } catch (e) {
      expect(e.message).toEqual(
        'Literal requires {localizationState} to be passed as property.',
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
