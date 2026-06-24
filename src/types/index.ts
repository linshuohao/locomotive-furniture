export interface ProductVariant {
  id: string
  name: string
  color: string
  material: string
  priceModifier: number
}

export interface Product {
  id: string
  slug: string
  name: string
  tagline: string
  description: string
  category: string
  price: number
  currency: string
  images: string[]
  variants: ProductVariant[]
  dimensions: string
  featured: boolean
}

export interface CartItem {
  productId: string
  variantId: string
  quantity: number
  name: string
  price: number
  image: string
  variantName: string
}

export interface CheckoutForm {
  email: string
  firstName: string
  lastName: string
  address: string
  city: string
  country: string
  postalCode: string
}

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
