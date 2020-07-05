import { Writable } from 'svelte/store'
import Literal from './Literal.svelte'

export interface State<T> extends Writable<T> {
  get: () => T
}

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
  (locale: string): void
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
  loadingContent: string
  errorContent: string
  persistence: PersistanceService
}

type FetchError = { retry(): Promise<any> }

interface FetchErrorHandler {
  (error: FetchError): any
}

export interface LocalizationI18nextStateOptions {
  clearNamespace(namespace: string): string
  i18n: { t: (key: string) => string }
  onFetchError?: FetchErrorHandler
  loadingContent: string
  errorContent: string
  persistence: PersistanceService
}

export interface LocalizationObservable {
  subscribe(fn: LocalizationObservableSubscriber): Function
  set(state: LocalizationState): void
  update(transform: LocalizationObservableUpdater): void
  setLocale(locale: string): void
  resolvers(namespace: string): LocalizationObservableResolvers
  extend(locales: Object): void
  init(): Promise<void>
  Literal: Literal
}

export interface MarkupGroupValue extends Array {
  done: boolean
  value: {
    groups: { tag: string; selfClosing: string }
    index: number
    input: string
    length: number
  }
}

export interface MarkupGroupsTag {
  next(): MarkupGroupValue
}
