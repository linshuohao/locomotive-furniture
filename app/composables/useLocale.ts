import { computed } from 'vue'
import type { AppLocale } from '@/lib/i18n/constants'
import { DEFAULT_LOCALE, ZH_LOCALE } from '@/lib/i18n/constants'
import { clearCache } from '@/data/client'

export function useLocale() {
  const { locale, t, te } = useI18n()
  const localePath = useLocalePath()
  const switchLocalePath = useSwitchLocalePath()

  const currentLocale = computed(() => locale.value as AppLocale)

  function localizedPath(path: string) {
    return localePath(path)
  }

  function switchLocale(targetLocale: AppLocale) {
    clearCache()
    const path = switchLocalePath(targetLocale)
    return navigateTo(path)
  }

  return {
    locale: currentLocale,
    t,
    te,
    localizedPath,
    switchLocale,
    isZh: computed(() => currentLocale.value === ZH_LOCALE),
    isEn: computed(() => currentLocale.value === DEFAULT_LOCALE),
  }
}
