export default function mockMutationObserver() {
  function MockMutationObserver() {

  }
  MockMutationObserver.prototype.observe = function observe() {}
  MockMutationObserver.prototype.disconnect = function disconnect() {}
  global.MutationObserver = MockMutationObserver
  global.window.MutationObserver = MockMutationObserver
}