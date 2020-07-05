<script>
  import { getContext } from 'svelte'
  import Bold from './Bold.svelte'
  import AddEventAlert from './AddEventAlert.svelte'
  
  // for this work, we need webpack to have `exports.module = { node: { filename: true }, ...otherConfigs }
  const namespace = `common:${__filename}`
  const i18n = getContext('i18n').resolvers(namespace)
  const Literal = getContext('I18nLiteral')
  
  let name = 'Hopeful I18n'
</script>

<div>
  <p>
    <Literal {namespace} path="hello" />
  </p>
  <p data-testid="PageCommon-basicInterpolation">
    <Literal
      {namespace}
      path="interpolation"
      modifiers="{{ name, decorator: [Bold, { children: name }] }}"
    />
  </p>

  <div>
    <input type="text" bind:value={name}>
    <br />
    <p data-testid="PageCommon-complexInterpolation">
      <Literal
        {namespace}
        path="description"
        modifiers="{{
          action: [
            AddEventAlert,
            {
              message: $i18n.text('action.message', { name })
            }
          ],
          breakline: { tag: 'br' }
        }}"
      />
    </p>
  </div>
</div>