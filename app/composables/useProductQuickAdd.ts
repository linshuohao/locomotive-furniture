import { useCartStore } from '@/store/cart'
import type { QuickAddPayload } from '@/lib/product/contracts'

/** Commerce orchestration for product cards — keeps Pinia out of presentation components */
export function useProductQuickAdd() {
  const cart = useCartStore()

  function handleQuickAdd(payload: QuickAddPayload): boolean {
    return cart.addItem(payload.productId, payload.variantId, payload.quantity)
  }

  return { handleQuickAdd }
}
