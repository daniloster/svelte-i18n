<script>
  import { onMount, onDestroy, setContext } from 'svelte'
  import PageOne from './PageOne'
  import PageTwo from './PageTwo'
  import PageCommon from './PageCommon'
  
  export let state = null

  const i18n = state

  const Literal = i18n.Literal
  setContext('i18n', i18n)
  setContext('I18nLiteral', Literal)

  const setLocale = (locale) => {
    i18n.setLocale(locale)
  }
</script>

<style>
</style>

<svelte>
  <button type="button" on:click={() => setLocale('en')}>en: translation</button>
  <button type="button" on:click={() => setLocale('pt-BR')}>pt: translation</button>
  <button type="button" on:click={() => setLocale('es')}>es: translation</button>
  <button type="button" on:click={() => setLocale('jp')}>jp: translation</button>
  <hr />
  <PageOne />
  <hr />
  <PageTwo />
  <hr />
  <PageCommon />
</svelte>
