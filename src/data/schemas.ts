import { z } from 'zod'

export const ProductVariantSchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string(),
  material: z.string(),
  priceModifier: z.number().default(0),
  inStock: z.boolean().default(true),
})

export const ProductSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  tagline: z.string(),
  description: z.string(),
  category: z.string(),
  price: z.number().positive(),
  currency: z.string().default('USD'),
  images: z.array(z.string()).min(1),
  dimensions: z.string(),
  materials: z.array(z.string()).default([]),
  variants: z.array(ProductVariantSchema).min(1),
  featured: z.boolean().default(false),
  seo: z
    .object({
      title: z.string(),
      description: z.string(),
    })
    .optional(),
})

export type Product = z.infer<typeof ProductSchema>
export type ProductVariant = z.infer<typeof ProductVariantSchema>

export const CartItemSchema = z.object({
  productId: z.string(),
  variantId: z.string(),
  quantity: z.number().int().min(1).max(99),
  slug: z.string(),
  name: z.string(),
  price: z.number(),
  image: z.string(),
  variantName: z.string(),
})

export type CartItem = z.infer<typeof CartItemSchema>

export const CheckoutFormSchema = z.object({
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  address: z.string(),
  city: z.string(),
  country: z.string(),
  postalCode: z.string(),
})

export type CheckoutForm = z.infer<typeof CheckoutFormSchema>

export const CartItemInputSchema = z.object({
  productId: z.string(),
  variantId: z.string(),
  quantity: z.number().int().min(1).max(99),
})

export type CartItemInput = z.infer<typeof CartItemInputSchema>

export function withDefaultSeo(
  product: z.input<typeof ProductSchema>,
): z.input<typeof ProductSchema> {
  const name = typeof product.name === 'string' ? product.name : ''
  const tagline = typeof product.tagline === 'string' ? product.tagline : ''
  return {
    ...product,
    seo: product.seo ?? {
      title: `${name} — Atelier Furniture`,
      description: tagline,
    },
  }
}
