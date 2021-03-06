# Getting Started

The usage of `@daniloster/svelte-i18n` is based on some conventions which can speed up development experience.

[Example of Application under DEV folder](https://github.com/daniloster/svelte-i18n/tree/master/DEV)

## Importing and using

The library only exposes 2 functions (`factoryI18nState` and `factoryI18nextState`) and the configuration has default values set in case they are not provided.

Here we are starting development with a simple case, the proper lib is taking care of the internationalization. Basically, the look up for the text related to the json path.

_`src/i18nState.js`_

```js
// Either
import factoryI18nState from '@daniloster/svelte-i18n'
// or
// import { factoryI18nState } from '@daniloster/svelte-i18n'
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
  /**
   * Webpack related instruction
   * - for this work, we need webpack to have `exports.module = { node: { filename: true }, ...otherConfigs }
   *
   * i18next related instruction
   * - i18next also provides namespace concept, in case it is required to use the its feature namespace should
   * be declared as per: const namespace = `i18next_namespace:${__filename}`
   * */
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
    "hello": "Hello <effect>{name}</effect>"
  }
}
```

```html
<Literal
  {namespace}
  path="hello"
  modifiers="{{ name: 'Jane Doe', effect: { tag: 'i' } }}"
/>
```

### SvelteComponent interpolations

Template literals with `<effect>some content here {dynamicValue}</effect>` can get it replaced based on modifiers matching.

_`src/Bold.svelte`_

```html
<script>
  let weight = 600
  let children = ''
</script>

<b>{children}</b> {weight}
```

```json
{
  "App": {
    "hello": "Hello <SvelteCustomComponent>{name}</SvelteCustomComponent>"
  }
}
```

```html
<Literal
  {namespace}
  path="hello"
  modifiers="{{ name: 'Jane Doe', SvelteCustomComponent: [Bold, { weight: 900 }] }}"
/>
```

The output will be

```html
<b>Jane Doe</b> 900
```

**Note**: Interpolating HTML and SvelteComponent into templates is not sanitized. It is important to Devs to escape dynamic texts before injecting.

## Integrating i18next [static]

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
      interpolation:
        'In here, we have an interpolation for you, <effect>{user}</effect>.',
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
      interpolation:
        'Aqui, teremos uma interpolacao para vc, <effect>{user}</effect>.',
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

## Integrating i18next [remote]

From static usage to remote (fetching resources on demand), the `i18next` the library will need to have the property `load: 'currentOnly'`. In the example below, we are using the `i18next-http-backend` which requires the `loadPath`.

Nonetheless, it requires to install the `i18next` dependency as it is peer dependency.

_`src/i18nextState.js`_

```js
import { factoryI18nextState } from '@daniloster/svelte-i18n'
import i18n from 'i18next'
import HttpApi from 'i18next-http-backend'

i18n
  .use(HttpApi)
  .init({
    // debug: true,
    fallbackLng: 'en',
    fallbackNS: 'translation',
    languages: ['en', 'pt-BR', 'es'],
    lng: 'en',
    /**
     * Important to load only the language required
     * e.g. loading 'pt-BR', it won't load 'pt'
     */
    load: 'currentOnly',
    backend: {
      loadPath: '/assets/locales/{{lng}}/{{ns}}.json',
    },
  })
  .then(() => {
    i18nState.init()
  })

const i18nState = factoryI18nextState({
  i18n,
  errorContent: 'error...',
  loadingContent: 'loading...',
  persistence: {
    get: () => localStorage.getItem('locale'),
    set: (locale) => localStorage.getItem('locale', locale),
  },
})

export default i18nState
```

## Description of options for `factoryI18nextState`. (i18next)

|    Property    |            Type            |       default       | Description                                                                                                                                                    |
| :------------: | :------------------------: | :-----------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| clearNamespace | `Function(String): String` | :heavy_check_mark:  | The default function strips out initials `src/`, `DEV/` or `dist/.app`. Also, strips extensions (`.js`, `.jsx`, `.svelte`) and converts remaining `/` into `.` |
|  errorContent  |          `String`          |    `'error...'`     | Text to be displayed when error happens while fetching resource (this can be overridden at the `Literal` component level)                                      |
| loadingContent |          `String`          |   `'loading...'`    | Text to be displayed when loading resource (this can be overridden at the `Literal` component level)                                                           |
|      i18n      |         `i18next`          |                     | It is required, and it is the mechanism to resolve messages                                                                                                    |
|  persistence   |          `Object`          | :heavy\*check_mark: | \*(`default: { get: noop, set: noop }`)\_ The service to get and persist locale changes                                                                        |

## Integrating i18next - namespace

`svelte-i18n` has a different semantic meaning for namespace when compared to `i18next`. It is not to pick which is correct, both independently are correct.

While `svelte-i18n` uses namespace to not repeat itself to resolve i18n path, `i18next` uses to map subset of data which can be fetched remotely. From the version `svelte-i18n@^1.0.1`, the namespace feature are combined. Follow the example below.

### Solely namespace for svelte-i18n

```jsx
/**
 * Webpack related instruction
 * - for this work, we need webpack to have `exports.module = { node: { filename: true }, ...otherConfigs }
 * */
const namespace = __filename
// Assuming the file is src/container/pages/Home.svelte
// svelte-i18n will resolve the namespace as "container.pages.Home"

// ...

// this will look after json path: "container.pages.Home.greeting"
<Literal {namespace} path="greeting" />
// this will look after json path: "container.pages.Home.description"
<Literal {namespace} path="description" />
```

### namespace for svelte-i18n + i18next

```jsx
/**
 * Webpack related instruction
 * - for this work, we need webpack to have `exports.module = { node: { filename: true }, ...otherConfigs }
 *
 * i18next related instruction
 * - i18next also provides namespace concept, in case it is required to use the its feature namespace should
 * be declared as per: const namespace = `i18next_namespace:${__filename}`
 *
 * - For instance, we are using the i18next 'common' namespace + the svelte-i18n namespace to avoid repetition
 * in the path resolution.
 *
 * -When a namespace for i18next is not provided, the library will fallback to the default defined in i18next.
 * */
const namespace = `common:${__filename}`
// Assuming the file is src/container/pages/Home.svelte
// svelte-i18n will resolve the namespace as "container.pages.Home"

// ...

//                                 [i18nextNamespace, svelteI18nNamespace]
// this will look after json path: ["common", "container.pages.Home.greeting"]
<Literal {namespace} path="common:greeting" />
// this will look after json path: [defaultI18nextNamespace, "container.pages.Home.description"]
<Literal {namespace} path="description" />
```

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
<b rel="something">Amazing</b><br />Mary.
```
