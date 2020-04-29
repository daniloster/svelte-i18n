/* eslint-disable max-len */
export default {
  PageOne: {
    hello: 'Hello World',
    interpolation: 'Hello World <decorator>, {name}',
  },
  PageTwo: {
    hello: '[2] Hello World',
    interpolation: '[2] Hello World <decorator>, {name}',
    description:
      '[2] This is an example of interpolation with custom components. For more information, you may <action>',
    action: {
      message: '[2] Hello "{name}", you clicked on the button',
      label: '[2] CLICK',
    },
  },
}
/* eslint-enable max-len */
