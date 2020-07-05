import { writable } from 'svelte/store'

/**
 * Creates a state
 * @param {Object} initialValue
 * @returns {import('./types').State}
 */
export default function factoryStates(initialValue) {
  const state = writable(initialValue)
  let value = initialValue
  state.subscribe((val) => {
    value = val
  })

  return {
    ...state,
    get: () => value,
  }
}
