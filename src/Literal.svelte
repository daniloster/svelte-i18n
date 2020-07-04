<script>
import { readable } from 'svelte/store'
import Html from './literals/wrappers/Html'
import CustomComponent from './literals/wrappers/CustomComponent'

export let loadingContent = ''
export let errorContent = ''
export let i18nState = null
export let i18nAsyncStatus = readable('Success')
export let namespace = undefined
export let path = ''
export let modifiers = {}

if (!i18nState) {
  throw new Error(`Literal requires {i18nState} to be passed as property.`)
}

$: status = $i18nAsyncStatus
$: resolvers = i18nState.resolvers(namespace)
$: nodes = $resolvers.nodes(path, modifiers)
$: scopedNamespace = i18nState.resolveNamespace(namespace)
$: resolvedKeyPath = (scopedNamespace ? scopedNamespace + '.' + path : path)
$: resolvedKey = $resolvers.text(path, modifiers)
$: isResolved = resolvedKeyPath !== resolvedKey
</script>
{#if !isResolved}
  {loadingContent}
{:else if status === 'Error'}
  {errorContent}
{:else if status === 'Success' || isResolved}
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
{/if}
