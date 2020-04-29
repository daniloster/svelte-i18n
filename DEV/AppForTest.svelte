<script>
  import { onMount, onDestroy, setContext } from 'svelte'
  import PageOne from './PageOne'
  import PageTwo from './PageTwo'
  import localizationState from './localizationState'
  
  const Literal = localizationState.Literal
  setContext('i18n', localizationState)
  setContext('I18nLiteral', Literal)

  const onEnglish = () => {
    localizationState.setLocale('en')
  }

  const onPortuguese = () => {
    localizationState.setLocale('pt-BR')
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
