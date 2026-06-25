import { DEFAULT_LOCALE, type AppLocale } from '@/lib/i18n/constants'

export function getCurrentLocale(): AppLocale {
  try {
    const { locale } = useI18n()
    return (locale.value as AppLocale) ?? DEFAULT_LOCALE
  } catch {
    return DEFAULT_LOCALE
  }
}
