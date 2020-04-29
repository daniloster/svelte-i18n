import { fireEvent, render } from '@testing-library/svelte'
import AppForTest from '../DEV/AppForTest'
import factoryI18nState from './factoryI18nState'

describe('I18n', () => {
  test('if factoryI18nState handles no arguments', () => {
    const i18nState = factoryI18nState()
    i18nState.init()
    expect(i18nState).toBeTruthy()
  })

  test('if factoryI18nState allow user to set value', () => {
    const persistence = { set: jest.fn(), get: jest.fn() }
    const i18nState = factoryI18nState({ persistence })

    i18nState.set({
      locale: 'test',
      defaultLocale: 'test2',
      locales: {},
    })

    expect(persistence.set).toHaveBeenCalled()
    expect(persistence.set).toHaveBeenCalledTimes(1)
    expect(persistence.set).toHaveBeenCalledWith('test')
  })

  test('if factoryI18nState does not propagate locale to persistence on set when is not valid', () => {
    const persistence = { set: jest.fn(), get: jest.fn() }
    const i18nState = factoryI18nState({ persistence })

    i18nState.set({
      locale: null,
      defaultLocale: 'test2',
      locales: {},
    })

    expect(persistence.set).not.toHaveBeenCalled()
  })

  test('if factoryI18nState does extend locales (es-ES)', () => {
    const i18nState = factoryI18nState()

    i18nState.extend({
      'es-ES': {
        PageOne: {
          hello: 'Holla',
        },
      },
    })
    i18nState.setLocale('es-ES')
    const wrapper = render(i18nState.Literal, { path: 'PageOne.hello' })

    expect(wrapper.container.textContent).toEqual('Holla')
  })

  test('if I18n presents the text with initial locale', async () => {
    const wrapper = render(AppForTest)
    /** PageOne */
    const hello = await wrapper.findByText('Hello World')
    expect(hello).toBeTruthy()
    const basicInterpolation = await wrapper.findByTestId(
      'PageOne-basicInterpolation',
    )
    expect(basicInterpolation).toBeTruthy()
    expect(basicInterpolation.textContent).toEqual(
      'Hello World Testing One, Super User',
    )

    /** PageTwo */
    const hello2 = await wrapper.findByText('[2] Hello World')
    expect(hello2).toBeTruthy()
    const basicInterpolation2 = await wrapper.findByTestId(
      'PageTwo-basicInterpolation',
    )
    expect(basicInterpolation2).toBeTruthy()
    expect(basicInterpolation2.textContent).toEqual(
      '[2] Hello World Hopeful I18n, Hopeful I18n',
    )
    const complexInterpolation = await wrapper.findByTestId(
      'PageTwo-complexInterpolation',
    )
    expect(complexInterpolation).toBeTruthy()
    expect(complexInterpolation.textContent).toEqual(
      '[2] This is an example of interpolation with custom components. For more information, you may [2] CLICK  ',
    )
    const buttonNestedInterpolation = await wrapper.findByText('[2] CLICK')
    expect(buttonNestedInterpolation).toBeTruthy()
    fireEvent.click(buttonNestedInterpolation)

    const feedbackInfo = await wrapper.findByTestId('AddEventAlert-message')
    expect(feedbackInfo).toBeTruthy()
    expect(feedbackInfo.textContent).toEqual(
      '[2] Hello "Hopeful I18n", you clicked on the button',
    )
  })

  test('if I18n changes the texts for pt-BR', async () => {
    const wrapper = render(AppForTest)
    fireEvent.click(await wrapper.findByText('Portugues'))

    /** PageOne */
    const hello = await wrapper.findByText('Ola Mundo')
    expect(hello).toBeTruthy()
    const basicInterpolation = await wrapper.findByTestId(
      'PageOne-basicInterpolation',
    )
    expect(basicInterpolation).toBeTruthy()
    expect(basicInterpolation.textContent).toEqual(
      'Ola Mundo Testing One, Super User',
    )

    /** PageTwo */
    const hello2 = await wrapper.findByText('[2] Ola Mundo')
    expect(hello2).toBeTruthy()
    const basicInterpolation2 = await wrapper.findByTestId(
      'PageTwo-basicInterpolation',
    )
    expect(basicInterpolation2).toBeTruthy()
    expect(basicInterpolation2.textContent).toEqual(
      '[2] Ola Mundo Hopeful I18n, Hopeful I18n',
    )
    const complexInterpolation = await wrapper.findByTestId(
      'PageTwo-complexInterpolation',
    )
    expect(complexInterpolation).toBeTruthy()
    expect(complexInterpolation.textContent).toEqual(
      '[2] Este eh um exemplo de interpolacao com component customizado. Para mais informacoes, vc pode accessar [2] AQUI  ',
    )
    const buttonNestedInterpolation = await wrapper.findByText('[2] AQUI')
    expect(buttonNestedInterpolation).toBeTruthy()
    fireEvent.click(buttonNestedInterpolation)

    const feedbackInfo = await wrapper.findByTestId('AddEventAlert-message')
    expect(feedbackInfo).toBeTruthy()
    expect(feedbackInfo.textContent).toEqual(
      '[2] Oi "Hopeful I18n", vc clicou no botao',
    )
  })
})
