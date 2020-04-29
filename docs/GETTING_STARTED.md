# Getting Started

The usage of `@daniloster/svelte-i18n` is based on some conventions which can speed up development experience.

## Importing and using

The library only exposes one function and the configuration has default values set in case they are not provided.

_`src/i18nState.js`_

```js
import factoryI18nState from '@daniloster/svelte-i18n'
const en = {
  containers: {
    Page: {
      hello: 'Hello {name}.',
      description: 'You are more than welcome.',
      interpolation: 'In here, we have an interpolation for you, <user>.',
    },
  },
}
const ptBR = {
  containers: {
    Page: {
      hello: 'Ola, {name}.',
      description: 'Vc eh mais do que bem-vindo.',
      interpolation: 'Aqui, teremos uma interpolacao para vc, <user>.',
    },
  },
}

const i18nState = factoryI18nState({
  defaultLocale: 'en', // (1) the fallback set of messages
  initialLocale: null, // (2) the initial locale to resolve set of messages
  locales: {
    // (3) dictionary with messages
    en,
    'pt-BR': ptBR,
  },
  persistence: {
    // (4) object to persist and get previous "locale"
    get: () => localStorage.getItem('locale'),
    set: (locale) => localStorage.getItem('locale', locale),
  },
})
```

Description of options for `factoryI18nState`.

|    Property    |            Type            |      default       | Description                                                                                                                                                    |
| :------------: | :------------------------: | :----------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| clearNamespace | `Function(String): String` | :heavy_check_mark: | The default function strips out initials `src/`, `DEV/` or `dist/.app`. Also, strips extensions (`.js`, `.jsx`, `.svelte`) and converts remaining `/` into `.` |
| defaultLocale  |          `String`          |                    | It is required, and it is the locale to fallback to in case message is not found in the current locale                                                         |
| initialLocale  |          `String`          | :heavy_check_mark: | _(`default: defaultLocale`)_ The locale to figure where to lookup for the message                                                                              |
|    locales     |   `Map<String, Object>`    | :heavy_check_mark: | _(`default: {}`)_ Where to look up for different locale message                                                                                                |
|  persistence   |          `Object`          | :heavy_check_mark: | _(`default: { get: noop, set: noop }`)_ The service to get and persist locale changes                                                                          |

**clearNamespace** Examples

- `clearNamespace('src/App.svelte')` => `App`
- `clearNamespace('src/containers/Page.svelte')` => `containers.Page`
- `clearNamespace('DEV/containers/Page.svelte')` => `containers.Page`

With this, it is possible to use `__filename` as namespace of messages.

_`src/App.svelte`_

```html
<script>
  import { setContext } from 'svelte'
  import i18nState from './i18nState'
  import Page from './containers/Page.svelte'

  setContext('i18n', i18nState)
  setContext('I18nLiteral', i18nState.Literal)

  const onEnglish = () => {
    i18nState.setLocale('en')
  }

  const onPortuguese = () => {
    i18nState.setLocale('pt-BR')
  }
</script>

<svelte>
  <button type="button" on:click="{onEnglish}">English</button>
  <button type="button" on:click="{onPortuguese}">
    Portugues
  </button>

  <hr />
  <!-- See Page.svelte implementation below -->
  <Page />
</svelte>
```

_`src/Bold.svelte`_

```html
<script>
  let children = ''
</script>

{children}
```

_`src/containers/Page.svelte`_

```html
<script>
  import { getContext } from 'svelte'
  import Bold from '../Bold.svelte'
  // for this work, we need webpack to have `exports.module = { node: { filename: true }, ...otherConfigs }
  const namespace = __filename
  const Literal = getContext('I18nLiteral')

  let name = 'Awesomeness'
</script>

<div>
  <input type="text" bind:value="{name}" />
  <p>
    <Literal {namespace} path="hello" modifiers="{{ name }}" />
  </p>
  <p>
    <Literal {namespace} path="description" />
  </p>
  <p>
    <Literal
      {namespace}
      path="interpolation"
      modifiers="{{ user: `<b>${name}</b>` }}"
    />
    <!-- Above, it is an example of inject HTML, only allowed when the template message has "<some_name>", in this case, it has "<user>" -->
  </p>
  <p>
    <Literal
      {namespace}
      path="interpolation"
      modifiers="{{ user: [Bold, { children: name }] }}"
    />
    <!-- Above, it is an example of inject a SvelteComponent, only allowed when the template message has "<some_name>", in this case, it has "<user>" -->
  </p>
</div>
```

## Usage Notes

For all examples, let assume component rendering is happening at `src/App.svelte` and the `namespace = __filename`.

### String interpolations

Template literals with `{value}` can get it replaced based on modifiers matching.

```json
{
  "App": {
    "hello": "Hello {name}"
  }
}
```

```html
<Literal {namespace} path="hello" modifiers="{{ name: 'Jane Doe' }}" />
```

### HTML interpolations

Template literals with `<value>` can get it replaced based on modifiers matching.

```json
{
  "App": {
    "hello": "Hello <name>"
  }
}
```

```html
<Literal {namespace} path="hello" modifiers="{{ name: '<i>Jane Doe</i>' }}" />
```

### SvelteComponent interpolations

Template literals with `<value>` can get it replaced based on modifiers matching.

_`src/Bold.svelte`_

```html
<script>
  let children = ''
</script>

{children}
```

```json
{
  "App": {
    "hello": "Hello <name>"
  }
}
```

```html
<Literal
  {namespace}
  path="hello"
  modifiers="{{ name: [Bold, { children: 'Jane Doe' }] }}"
/>
```

**Note**: Interpolating HTML and SvelteComponent into templates is not sanitized. It is important to Devs to escape dynamic texts before injecting.
