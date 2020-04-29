<script>
  export let children = 'Button'
  export let message = ''
  export let onClick = () => {
    isClicked = true
  }

  let isClicked = false
</script>

<button type="button" on:click={onClick}>{children}</button>
<br />
{#if isClicked}
  <p data-testid="AddEventAlert-message">{@html message}</p>
{/if}