import { getCommerceProvider } from '@/data/providers'
import type { Product } from '@/data/schemas'
import type { CheckoutPayload, CommerceResponse } from '@/data/types'

export type { CommerceResponse, CheckoutPayload } from '@/data/types'
export { getCommerceConfig } from '@/data/config'
export type { CommerceProviderName, PaymentProviderName } from '@/data/config'

export async function fetchProducts(): Promise<CommerceResponse<Product[]>> {
  return getCommerceProvider().fetchProducts()
}

export async function fetchProductBySlug(slug: string): Promise<CommerceResponse<Product>> {
  return getCommerceProvider().fetchProductBySlug(slug)
}

export async function submitCheckout(
  payload: CheckoutPayload,
): Promise<CommerceResponse<{ orderId: string }>> {
  return getCommerceProvider().submitCheckout(payload)
}
