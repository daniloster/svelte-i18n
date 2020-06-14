<script>
  import { onMount, onDestroy, setContext } from 'svelte'
  import PageOne from './PageOne'
  import PageTwo from './PageTwo'
  import i18nState from './i18nState'
  import i18nextState from './i18nextState'
  
  export let isI18n = false

  const i18n = isI18n ? i18nextState : i18nState

  const Literal = i18n.Literal
  setContext('i18n', i18n)
  setContext('I18nLiteral', Literal)

  const onEnglish = () => {
    i18n.setLocale('en')
  }

  const onPortuguese = () => {
    i18n.setLocale('pt-BR')
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
