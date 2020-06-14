/* eslint-disable max-len */
export default {
  PageOne: {
    hello: 'Hello World',
    interpolation: 'Hello World <decorator>{name}</decorator>.',
  },
  PageTwo: {
    hello: '[2] Hello World',
    interpolation: '[2] Hello World <decorator>{name}</decorator>.',
    description:
      '[2] This is an example of interpolation with custom components.<breakline />For more information, you may <action>CLICK</action>',
    action: {
      message: '[2] Hello "{name}", you clicked on the button',
    },
  },
}
/* eslint-enable max-len */
