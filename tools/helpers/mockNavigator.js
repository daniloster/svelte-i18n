export default function mockNavigator() {
  let mocked = null
  const _navigator = Object.getOwnPropertyDescriptor(window, 'navigator').get()

  Object.defineProperty(window, 'navigator', {
    get: () => {
      if (mocked) {
        return {
          ...mocked,
          restore: () => {
            mocked = null
          },
        }
      }

      return _navigator
    },
    set: (value) => {
      mocked = value
    },
  })
}
