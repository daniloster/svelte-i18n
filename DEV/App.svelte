<script>
  import { onMount, onDestroy, setContext } from 'svelte'
  import PageOne from './PageOne'
  import PageTwo from './PageTwo'
  import PageCommon from './PageCommon'
  // import i18nState from './i18nState'
  // import i18nextState from './i18nextState'
  import i18nextStateAsync from './i18nextStateAsync'

  /**
   * You can choose what is the state you are going to use here
   * */
  // let i18n = i18nState
  // let i18n = i18nextState
  let i18n = i18nextStateAsync

  const Literal = i18n.Literal
  setContext('i18n', i18n)
  setContext('I18nLiteral', Literal)

  function setLocale(language) {
    i18n.setLocale(language)
  }

  let showCommon = false
  onMount(() => {
    setTimeout(() => {
      showCommon = true
    }, 5000)
  })
</script>

<style>
</style>

<svelte>
  <button type="button" on:click={() => setLocale('en')}>en: translation</button>
  <button type="button" on:click={() => setLocale('pt-BR')}>pt: translation</button>
  <button type="button" on:click={() => setLocale('es')}>es: translation</button>
  <hr />
  <PageOne />
  <hr />
  <PageTwo />
  {#if showCommon}
    <hr />
    <PageCommon />
  {/if}
</svelte>
