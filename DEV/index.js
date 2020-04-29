import '@babel/polyfill'
import App from './App.svelte'
import i18nState from './i18nState'

i18nState.init()

window.addEventListener('DOMContentLoaded', () => {
  const root = document.createElement('div')
  root.id = 'app'
  document.body.appendChild(root)

  new App({
    target: root,
  })
})
