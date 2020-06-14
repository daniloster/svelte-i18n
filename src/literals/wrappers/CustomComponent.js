export default class CustomComponent {
  constructor(Component, props, children) {
    this.Component = Component
    this.props = children ? { children, ...props } : props
  }
}
