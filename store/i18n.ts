export const name = 'i18n'

export enum Languages {
  'zh-TW' = 'zh_TW',
  en = 'en',
  ja = 'jp',
}

export type State = {
  locale: keyof typeof Languages,
  messages: any
}
