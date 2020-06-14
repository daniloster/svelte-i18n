<script>
import Html from './literals/wrappers/Html'
import CustomComponent from './literals/wrappers/CustomComponent'

export let i18nState = null
export let namespace = undefined
export let path = ''
export let modifiers = {}

if (!i18nState) {
  throw new Error(`Literal requires {i18nState} to be passed as property.`)
}

function log(nodes) {
  nodes.forEach(node => {
    if (node instanceof CustomComponent) {
      console.log('CustomComponent:', node.Component.prototype.constructor, JSON.stringify(node.props))
    } else if (node instanceof Html) {
      console.log('Html:', JSON.stringify(node.props))
    }
  })
}

$: resolvers = i18nState.resolvers(namespace)
$: nodes = $resolvers.nodes(path, modifiers)

// $: log(nodes)
</script>

{#each nodes as node}
  {#if node instanceof CustomComponent}
    <svelte:component this={node.Component} {...node.props} />
  {:else if node instanceof Html}
    {#if !node.props.children}
      {@html `<${node.props.tag} ${node.props.attrs.join(' ')} />`}
    {:else}
      {@html `<${node.props.tag} ${node.props.attrs.join(' ')}>`}
        {node.props.children}
      {@html `</${node.props.tag}>`}
    {/if}
  {:else}
    {node}
  {/if}
{/each}
