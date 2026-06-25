export const DEFAULT_LOCALE = 'en' as const
export const ZH_LOCALE = 'zh-CN' as const

export const SUPPORTED_LOCALES = [DEFAULT_LOCALE, ZH_LOCALE] as const

export type AppLocale = (typeof SUPPORTED_LOCALES)[number]

export const LOCALE_PREFIX: Record<AppLocale, string> = {
  en: '',
  'zh-CN': '/zh',
}

export const LOCALE_BCP47: Record<AppLocale, string> = {
  en: 'en',
  'zh-CN': 'zh-CN',
}

export const LOCALE_INTL: Record<AppLocale, string> = {
  en: 'en-US',
  'zh-CN': 'zh-CN',
}

export function isAppLocale(value: string): value is AppLocale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value)
}

export function localeFromPath(path: string): AppLocale {
  return path === '/zh' || path.startsWith('/zh/') ? ZH_LOCALE : DEFAULT_LOCALE
}
