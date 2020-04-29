// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect'
import { cleanup } from '@testing-library/svelte'
import { noop } from 'svelte/internal'
import i18nState from '../../DEV/i18nState'
import mockMutationObserver from './mockMutationObserver'
import mockNavigator from './mockNavigator'

afterEach(cleanup)

beforeEach(() => {
  mockMutationObserver()
  mockNavigator()
  HTMLElement.prototype.scrollIntoView = noop
  i18nState.setLocale('en')
})
