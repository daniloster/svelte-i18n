/* eslint-disable max-len */
export default {
  PageOne: {
    hello: 'Ola Mundo',
    interpolation: 'Ola Mundo <decorator>{name}</decorator>!',
  },
  PageTwo: {
    hello: '[2] Ola Mundo',
    interpolation: '[2] Ola Mundo <decorator>{name}</decorator>!',
    description:
      '[2] Este eh um exemplo de interpolacao com component customizado.<breakline />Para mais informacoes, vc pode accessar <action>AQUI</action>',
    action: {
      message: '[2] Oi "{name}", vc clicou no botao',
    },
  },
}
/* eslint-enable max-len */
