import Literal from './Literal.svelte'

export interface LocalizationState {
  defaultLocale: string
  locale: string
  locales: Object
}

export interface LocalizationObservableUpdater {
  (state: LocalizationState): LocalizationState
}

export interface LocalizationObservableSubscriber {
  (state: LocalizationState): void
}

export interface ResolverArgs {
  path: string
  modifiers: Object
}

export interface LocalizationObservableResolvers {
  text(options: ResolverArgs): string
  nodes(options: ResolverArgs): Array
}

export interface setLocale {
  (locale: string): Promise
}

export interface PersistanceService {
  get(): Promise<string>
  set(locale: string): Promise
}

export interface LocalizationStateOptions {
  clearNamespace(namespace: string): string
  initialLocale: string
  defaultLocale: string
  locales: Object
  persistence: PersistanceService
}

export interface LocalizationObservable {
  subscribe(fn: LocalizationObservableSubscriber): Function
  set(state: LocalizationState): void
  update(transform: LocalizationObservableUpdater): void
  setLocale(locale: string): Promise<void>
  resolvers(namespace: string): LocalizationObservableResolvers
  extend(locales: Object): void
  init(): Promise<void>
  Literal: Literal
}
