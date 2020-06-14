export default class Html {
  /**
   * @param {{ tag: string, attrs: Array<string> }} props
   * @param {string} children
   */
  constructor(props, children) {
    this.props = {
      ...(!!children && { children }),
      attrs: [],
      tag: 'span',
      ...props,
    }
  }
}
