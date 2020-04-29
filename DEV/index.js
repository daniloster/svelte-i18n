import '@babel/polyfill'
import App from './App.svelte'
import localizationState from './localizationState'

localizationState.init()

window.addEventListener('DOMContentLoaded', () => {
  const root = document.createElement('div')
  root.id = 'app'
  document.body.appendChild(root)

  new App({
    target: root,
  })
})
