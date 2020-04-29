import { queryHelpers } from '@testing-library/dom'

export default async function waitQuerySelector(container, selector, options) {
  const { timeout = 5000, interval = 100 } = options || {}
  let element = null
  let currentTime = 0
  while (currentTime <= timeout) {
    element = container.querySelector(selector)
    if (!!element?.tagName) {
      return element
    }

    currentTime += interval

    await new Promise((resolve) => {
      setTimeout(resolve, interval)
    })
  }

  if (!element || !element.tagName) {
    throw queryHelpers.getElementError(
      `Unable to find an element by: "${selector}"`,
      container,
    )
  }

  return element
}
