<script>
  import { onMount, onDestroy, setContext } from 'svelte'
  import PageOne from './PageOne'
  import PageTwo from './PageTwo'
  import i18nState from './i18nState'
  
  const namespace = __filename

  let intervalRef = null
  onMount(() => {
    const locales = Object.keys(i18nState.get().locales)
    let indexLocale = 0
    intervalRef = setInterval(() => {
      console.log({ locale: locales[indexLocale] })
      i18nState.setLocale(locales[indexLocale])
      indexLocale = (indexLocale + 1) % locales.length
    }, 5000)
  })

  onDestroy(() => {
    clearInterval(intervalRef)
  })

  const Literal = i18nState.Literal
  setContext('i18n', i18nState)
  setContext('I18nLiteral', Literal)
</script>

<style>
</style>

<svelte>
  <PageOne />
  <hr />
  <PageTwo />
</svelte>
