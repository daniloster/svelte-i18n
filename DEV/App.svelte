<script>
  import { onMount, onDestroy, setContext } from 'svelte'
  import PageOne from './PageOne'
  import PageTwo from './PageTwo'
  import localizationState from './localizationState'
  
  const namespace = __filename

  let intervalRef = null
  onMount(() => {
    const locales = Object.keys(localizationState.get().locales)
    let indexLocale = 0
    intervalRef = setInterval(() => {
      console.log({ locale: locales[indexLocale] })
      localizationState.setLocale(locales[indexLocale])
      indexLocale = (indexLocale + 1) % locales.length
    }, 5000)
  })

  onDestroy(() => {
    clearInterval(intervalRef)
  })

  const Literal = localizationState.Literal
  setContext('i18n', localizationState)
  setContext('I18nLiteral', Literal)
</script>

<style>
</style>

<svelte>
  <PageOne />
  <hr />
  <PageTwo />
</svelte>
