import type { AppLocale } from '@/lib/i18n/constants'
import { DEFAULT_LOCALE, ZH_LOCALE } from '@/lib/i18n/constants'
import type { ProductTranslation } from '@/data/productTranslations/zh-CN'
import { zhCNProductTranslations } from '@/data/productTranslations/zh-CN'

const translationsByLocale: Partial<Record<AppLocale, Record<string, ProductTranslation>>> = {
  [ZH_LOCALE]: zhCNProductTranslations,
}

export function getProductTranslation(
  productId: string,
  locale: AppLocale,
): ProductTranslation | undefined {
  if (locale === DEFAULT_LOCALE) return undefined
  return translationsByLocale[locale]?.[productId]
}
