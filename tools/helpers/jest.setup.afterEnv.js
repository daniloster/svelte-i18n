// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect'
import { cleanup } from '@testing-library/svelte'
import matchAll from 'string.prototype.matchall'
import { noop } from 'svelte/internal'
import i18nState from '../../DEV/i18nState'
import mockMutationObserver from './mockMutationObserver'
import mockNavigator from './mockNavigator'

afterEach(cleanup)

beforeEach(() => {
  String.prototype.matchAll = function (...args) {
    let pointerIndex = -1
    const groups = matchAll(this, ...args)

    return {
      next: () => {
        if (groups.next) {
          return groups.next()
        }

        pointerIndex += 1
        const group = groups[pointerIndex]
        if (!group) {
          return {
            done: true,
          }
        }

        return group
      },
    }
  }
  mockMutationObserver()
  mockNavigator()
  HTMLElement.prototype.scrollIntoView = noop
  i18nState.setLocale('en')
})
