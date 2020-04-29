import { queryHelpers } from '@testing-library/dom'

export default async function waitQuerySelectorAll(
  container,
  selector,
  options,
) {
  const { timeout = 5000, interval = 100 } = options || {}
  let elements = null
  let currentTime = 0
  while (currentTime <= timeout) {
    elements = container.querySelectorAll(selector)
    if (!!elements?.length) {
      return elements
    }

    currentTime += interval

    await new Promise((resolve) => {
      setTimeout(resolve, interval)
    })
  }

  if (!elements || !elements.length) {
    throw queryHelpers.getElementError(
      `Unable to find an elements by: "${selector}"`,
      container,
    )
  }

  return elements
}
