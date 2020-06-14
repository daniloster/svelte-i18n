# Getting Started

The usage of `@daniloster/svelte-i18n` is based on some conventions which can speed up development experience.

[Example of Application under DEV folder](https://github.com/daniloster/svelte-i18n/tree/master/DEV)

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
      buttonLabel: 'Click',
      buttonTitle: 'Click me',
    },
  },
}
const ptBR = {
  containers: {
    Page: {
      hello: 'Ola, {name}.',
      description: 'Vc eh mais do que bem-vindo.',
      interpolation: 'Aqui, teremos uma interpolacao para vc, <user>.',
      buttonLabel: 'Clique',
      buttonTitle: 'Clique me',
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
  const i18nState = getContext('i18n')

  let name = 'Awesomeness'

  $: resolvers = i18nState.resolvers(namespace)
  $: text = $resolvers.text
</script>

<div>
  <button type="button" title="{text('buttonTitle')}">
    <Literal {namespace} path="buttonLabel" />
  </button>
  <br />
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

## Integrating i18next

To use the `i18next` the library only require to initialize the i18next and pass to the proper factory `factoryI18nextState`. Once the i18nextState is built, you just need to use like the normal state. Nonetheless, it requires to install the `i18next` dependency as it is peer dependency.

_`src/i18nextState.js`_

```js
import i18n from 'i18next'
import { factoryI18nextState } from '@daniloster/svelte-i18n'
const en = {
  containers: {
    Page: {
      hello: 'Hello {name}.',
      description: 'You are more than welcome.',
      interpolation: 'In here, we have an interpolation for you, <user>.',
      buttonLabel: 'Click',
      buttonTitle: 'Click me',
    },
  },
}
const ptBR = {
  containers: {
    Page: {
      hello: 'Ola, {name}.',
      description: 'Vc eh mais do que bem-vindo.',
      interpolation: 'Aqui, teremos uma interpolacao para vc, <user>.',
      buttonLabel: 'Clique',
      buttonTitle: 'Clique me',
    },
  },
}

i18n.init({
  fallbackLng: 'en',
  languages: ['en', 'pt-BR'],
  lng: 'en',
  resources: {
    en: {
      translation: en,
    },
    'pt-BR': {
      translation: ptBR,
    },
  },
})

const i18nState = factoryI18nextState({
  i18n,
  persistence: {
    get: () => localStorage.getItem('locale'),
    set: (locale) => localStorage.getItem('locale', locale),
  },
})

export default i18nState
```

Description of options for `factoryI18nState`.

|    Property    |            Type            |      default       | Description                                                                                                                                                    |
| :------------: | :------------------------: | :----------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| clearNamespace | `Function(String): String` | :heavy_check_mark: | The default function strips out initials `src/`, `DEV/` or `dist/.app`. Also, strips extensions (`.js`, `.jsx`, `.svelte`) and converts remaining `/` into `.` |
|      i18n      |         `i18next`          |                    | It is required, and it is the mechanism to resolve messages                                                                                                    |
|  persistence   |          `Object`          | :heavy_check_mark: | _(`default: { get: noop, set: noop }`)_ The service to get and persist locale changes                                                                          |

## Breaking change

Moving to version `1.0.0` requires to change the template strings. Previously, it was not allowed to have template strings with nested children translated content, now it is. Besides, usage of messages to interpolate with components or html is a bit different. Lets go bit by bit.

### How to use components now?

Your `key` must contain a message with tag per examples below.

#### Open and Close Tag

**resource**

```json
{
  "PageOne": {
    "hello": "Hello <bold>user</bold> {name}." // (open and close tag to have children pre-populated)
  }
}
```

**svelte**

`Bold.svelte`

```html
<script>
  export let children = ''
</script>

<b>{children}</b>
```

Usage inside the PageOne component

```html
<Literal
  {namespace}
  path="hello"
  modifiers="{{
      bold: [
        Bold,
        {}
      ],
      name: 'Mary'
    }}"
/>
```

The output will be

```html
Hello <b>user</b> Mary.
```

#### Self Closing Tag

**resource**

```json
{
  "PageOne": {
    "hello": "<greeting /> {name}." // (open and close tag to have children pre-populated)
  }
}
```

**svelte**

`Greeting.svelte`

```html
<b><i>Magic Greeting<i></b>
```

Usage inside the PageOne component

```html
<Literal
  {namespace}
  path="hello"
  modifiers="{{
      greeting: [
        Greeting,
        {}
      ],
      name: 'Mary'
    }}"
/>
```

The output will be

```html
<b><i>Magic Greeting<i></b> Mary.
```

#### HTML Tags

The HTML Tags follow the same principles described above for components regarding the resource. The difference is how to define the tag in code.

**resource**

```json
{
  "PageOne": {
    "hello": "<bold>Amazing</bold><breakline />{name}." // (open and close tag to have children pre-populated)
  }
}
```

**svelte**

The definition of HMTL Tags must be objects different from components that are arrays.

Usage inside the PageOne component

```html
<Literal
  {namespace}
  path="hello"
  modifiers="{{
      bold: { tag: 'b', attrs: ['rel=something'] },
      breakline: { tag: 'br' },
      name: 'Mary'
    }}"
/>
```

The output will be

```html
<b>Amazing</b><br />Mary.
```
