/** Infrastructure & UI types — domain models live in @/data/schemas */

export interface LocomotiveScrollOptions {
  enableSmooth?: boolean
  enableParallax?: boolean
  lerp?: number
}

export interface PerformanceTier {
  tier: 'high' | 'medium' | 'low'
  smoothScroll: boolean
  parallax: boolean
  animations: boolean
}

export interface WebVitalsMetric {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
}

/** Re-export domain types from Zod schemas (single source of truth) */
export type {
  Product,
  ProductVariant,
  CartItem,
  CheckoutForm,
  CartItemInput,
} from '@/data/schemas'
