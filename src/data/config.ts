export type CommerceProviderName = 'mock' | 'http'
export type PaymentProviderName = 'none' | 'stripe' | 'shopify'

export interface CommerceEnvConfig {
  provider: CommerceProviderName
  apiBaseUrl: string
  paymentProvider: PaymentProviderName
}

export function getCommerceConfig(): CommerceEnvConfig {
  const provider = import.meta.env.VITE_COMMERCE_PROVIDER === 'http' ? 'http' : 'mock'

  const paymentRaw = import.meta.env.VITE_PAYMENT_PROVIDER
  const paymentProvider: PaymentProviderName =
    paymentRaw === 'stripe' || paymentRaw === 'shopify' ? paymentRaw : 'none'

  return {
    provider,
    apiBaseUrl: (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, ''),
    paymentProvider,
  }
}
