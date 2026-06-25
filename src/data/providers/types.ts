import type { Product } from '@/data/schemas'
import type { CheckoutPayload, CommerceResponse } from '@/data/types'

export interface CommerceProvider {
  fetchProducts(): Promise<CommerceResponse<Product[]>>
  fetchProductBySlug(slug: string): Promise<CommerceResponse<Product>>
  submitCheckout(payload: CheckoutPayload): Promise<CommerceResponse<{ orderId: string }>>
}
