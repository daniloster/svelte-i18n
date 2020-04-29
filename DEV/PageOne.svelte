<script>
  import { getContext } from 'svelte'
  // for this work, we need webpack to have `exports.module = { node: { filename: true }, ...otherConfigs }
  const namespace = __filename
  const Literal = getContext('I18nLiteral')
</script>

<div>
  <p>
    <Literal {namespace} path="hello" />
  </p>
  <p data-testid="PageOne-basicInterpolation">
    <Literal
      {namespace}
      path="interpolation"
      modifiers="{{ name: 'Super User', decorator: '<b>Testing One</b>' }}"
    />
  </p>
</div>