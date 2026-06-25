import type { AppLocale } from '@/lib/i18n/constants'
import { DEFAULT_LOCALE, LOCALE_PREFIX } from '@/lib/i18n/constants'

export function localePath(path: string, locale: AppLocale = DEFAULT_LOCALE): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  const prefix = LOCALE_PREFIX[locale]

  if (!prefix) return normalized === '' ? '/' : normalized

  if (normalized === '/') return prefix
  return `${prefix}${normalized}`
}

export function stripLocalePrefix(path: string): string {
  if (path === '/zh') return '/'
  if (path.startsWith('/zh/')) return path.slice(3) || '/'
  return path
}

export function switchLocalePath(currentPath: string, targetLocale: AppLocale): string {
  const basePath = stripLocalePrefix(currentPath)
  return localePath(basePath, targetLocale)
}
