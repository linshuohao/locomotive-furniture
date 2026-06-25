export type CommerceProviderName = 'mock' | 'http'
export type PaymentProviderName = 'none' | 'stripe' | 'shopify'

export interface CommerceEnvConfig {
  provider: CommerceProviderName
  apiBaseUrl: string
  paymentProvider: PaymentProviderName
}

function readPublicEnv(
  configKey:
    | 'commerceProvider'
    | 'apiBaseUrl'
    | 'paymentProvider'
    | 'enableSmoothScroll'
    | 'enableParallax'
    | 'enableAnalytics'
    | 'siteUrl',
  fallback = '',
): string {
  const envKeys = {
    commerceProvider: 'NUXT_PUBLIC_COMMERCE_PROVIDER',
    apiBaseUrl: 'NUXT_PUBLIC_API_BASE_URL',
    paymentProvider: 'NUXT_PUBLIC_PAYMENT_PROVIDER',
    enableSmoothScroll: 'NUXT_PUBLIC_ENABLE_SMOOTH_SCROLL',
    enableParallax: 'NUXT_PUBLIC_ENABLE_PARALLAX',
    enableAnalytics: 'NUXT_PUBLIC_ENABLE_ANALYTICS',
    siteUrl: 'NUXT_PUBLIC_SITE_URL',
  } as const

  try {
    const config = useRuntimeConfig()
    const value = config.public[configKey]
    if (value !== undefined && value !== '') return String(value)
  } catch {
    // outside Nuxt context (vitest)
  }

  return process.env[envKeys[configKey]] ?? fallback
}

export function getCommerceConfig(): CommerceEnvConfig {
  const provider = readPublicEnv('commerceProvider', 'mock') === 'http' ? 'http' : 'mock'

  const paymentRaw = readPublicEnv('paymentProvider', 'none')
  const paymentProvider: PaymentProviderName =
    paymentRaw === 'stripe' || paymentRaw === 'shopify' ? paymentRaw : 'none'

  return {
    provider,
    apiBaseUrl: readPublicEnv('apiBaseUrl').replace(/\/$/, ''),
    paymentProvider,
  }
}
