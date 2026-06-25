import { getCommerceConfig } from '@/data/config'
import { httpProvider } from '@/data/providers/http'
import { mockProvider } from '@/data/providers/mock'
import type { CommerceProvider } from '@/data/providers/types'

let activeProvider: CommerceProvider | null = null

export function getCommerceProvider(): CommerceProvider {
  if (activeProvider) return activeProvider

  const { provider } = getCommerceConfig()
  activeProvider = provider === 'http' ? httpProvider : mockProvider
  return activeProvider
}

/** Test helper — reset cached provider between cases */
export function resetCommerceProvider(): void {
  activeProvider = null
}
