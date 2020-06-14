<script>
  import { onMount, onDestroy, setContext } from 'svelte'
  import PageOne from './PageOne'
  import PageTwo from './PageTwo'
  import i18nState from './i18nState'

  import i18nextState from './i18nextState'
  
  const namespace = __filename

  let intervalRef = null
  
  /**
   * You can choose what is the state you are going to use here
   * */
  let i18n = i18nState
  // let i18n = i18nextState

  onMount(() => {
    const locales = i18n.get().languages
    let indexLocale = 0
    intervalRef = setInterval(() => {
      i18n.setLocale(locales[indexLocale])
      indexLocale = (indexLocale + 1) % locales.length
    }, 5000)
  })

  onDestroy(() => {
    clearInterval(intervalRef)
  })

  const Literal = i18n.Literal
  setContext('i18n', i18n)
  setContext('I18nLiteral', Literal)
</script>

<style>
</style>

<svelte>
  <PageOne />
  <hr />
  <PageTwo />
</svelte>
