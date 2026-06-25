import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import type { AppLocale } from '@/lib/i18n/constants'
import { DEFAULT_LOCALE, ZH_LOCALE } from '@/lib/i18n/constants'
import { localePath, switchLocalePath } from '@/lib/i18n/localePath'

export function useLocale() {
  const { locale, t } = useI18n()
  const route = useRoute()
  const router = useRouter()

  const currentLocale = computed(() => locale.value as AppLocale)

  function localizedPath(path: string) {
    return localePath(path, currentLocale.value)
  }

  function switchLocale(targetLocale: AppLocale) {
    const nextPath = switchLocalePath(route.fullPath, targetLocale)
    locale.value = targetLocale
    void router.push(nextPath)
  }

  return {
    locale: currentLocale,
    t,
    localizedPath,
    switchLocale,
    isZh: computed(() => currentLocale.value === ZH_LOCALE),
    isEn: computed(() => currentLocale.value === DEFAULT_LOCALE),
  }
}
