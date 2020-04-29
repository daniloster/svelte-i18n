<script>
import Html from './literals/wrappers/Html'
import CustomComponent from './literals/wrappers/CustomComponent'

export let localizationState = null
export let namespace = undefined
export let path = ''
export let modifiers = {}

if (!localizationState) {
  throw new Error(`Literal requires {localizationState} to be passed as property.`)
}

$: resolvers = localizationState.resolvers(namespace)
$: nodes = $resolvers.nodes(path, modifiers)
</script>

{#each nodes as node}
  {#if node instanceof CustomComponent}
    <svelte:component this={node.Component} {...node.props} />
  {:else if node instanceof Html}
    {@html node.toString()}
  {:else}
    {node}
  {/if}
{/each}
