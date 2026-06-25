import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getCommerceConfig } from '@/data/config'
import { getCommerceProvider, resetCommerceProvider } from '@/data/providers'
import { mockProvider } from '@/data/providers/mock'
import { httpProvider } from '@/data/providers/http'
import { fetchProducts } from '@/data/api'
import { clearCache } from '@/data/client'
import { catalogFallback, FALLBACK_MESSAGE_KEY } from '@/data/fallback'

describe('commerce config', () => {
  it('defaults to mock provider', () => {
    expect(getCommerceConfig().provider).toBe('mock')
  })

  it('defaults payment to none', () => {
    expect(getCommerceConfig().paymentProvider).toBe('none')
  })
})

describe('commerce provider', () => {
  beforeEach(() => {
    resetCommerceProvider()
    clearCache()
  })

  it('selects mock provider by default', () => {
    expect(getCommerceProvider()).toBe(mockProvider)
  })

  it('selects http provider when env is http', () => {
    vi.stubEnv('NUXT_PUBLIC_COMMERCE_PROVIDER', 'http')
    resetCommerceProvider()
    expect(getCommerceProvider()).toBe(httpProvider)
    vi.unstubAllEnvs()
  })
})

describe('mock provider api', () => {
  beforeEach(() => {
    resetCommerceProvider()
    clearCache()
  })

  it('fetchProducts returns catalog', async () => {
    const result = await fetchProducts()
    expect(result.data).not.toBeNull()
    expect(result.data!.length).toBeGreaterThan(0)
    expect(result.error).toBeNull()
  })

  it('catalogFallback returns i18n message key', () => {
    const result = catalogFallback([])
    expect(result.error).toBe(FALLBACK_MESSAGE_KEY)
  })
})
