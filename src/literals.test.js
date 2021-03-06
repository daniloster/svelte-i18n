import interpolateLiteral from './literals/interpolateLiteral'
import literalMessage from './literals/literalMessage'

describe('literals', () => {
  test('if literalMessage fallback to empty array for no match', async () => {
    const matchSpy = jest.spyOn(String.prototype, 'matchAll')
    matchSpy.mockImplementation(() => ({ next: () => ({ done: true }) }))
    const message = interpolateLiteral('Hello', {})
    expect(message).toEqual(['Hello'])
    matchSpy.mockRestore()
  })

  test('if literalMessage fallback to default locale messages', async () => {
    const matchSpy = jest.spyOn(String.prototype, 'matchAll')
    const message = literalMessage({ hello: 'Hello' }, {}, 'hello')
    expect(message).toEqual('Hello')
    matchSpy.mockRestore()
  })

  test('if literalMessage handle message not found', async () => {
    const message = literalMessage({ hello: '' }, {}, 'hello', { someKey: '' })
    expect(message).toEqual('')
  })

  test('if literalMessage handle undefined message', async () => {
    const message = literalMessage({}, {}, 'hello')
    expect(message).toEqual('')
  })
})
