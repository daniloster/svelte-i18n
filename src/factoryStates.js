import { writable } from 'svelte/store'

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
