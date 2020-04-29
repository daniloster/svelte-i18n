<script>
  import { onMount, onDestroy, setContext } from 'svelte'
  import PageOne from './PageOne'
  import PageTwo from './PageTwo'
  import i18nState from './i18nState'
  
  const Literal = i18nState.Literal
  setContext('i18n', i18nState)
  setContext('I18nLiteral', Literal)

  const onEnglish = () => {
    i18nState.setLocale('en')
  }

  const onPortuguese = () => {
    i18nState.setLocale('pt-BR')
  }
</script>

<style>
</style>

<svelte>
  <button type="button" on:click={onEnglish} data-testid="en">English</button>
  <button type="button" on:click={onPortuguese} data-testid="pt-BR">Portugues</button>
  <hr />
  <PageOne />
  <hr />
  <PageTwo />
</svelte>
