import { createI18n } from 'vue-i18n'
import { DEFAULT_LOCALE } from '@/lib/i18n/constants'
import en from '@/i18n/locales/en.json'
import zhCN from '@/i18n/locales/zh-CN.json'

export const i18n = createI18n({
  legacy: false,
  locale: DEFAULT_LOCALE,
  fallbackLocale: DEFAULT_LOCALE,
  messages: {
    en,
    'zh-CN': zhCN,
  },
})

export function getCurrentLocale() {
  return i18n.global.locale.value
}
