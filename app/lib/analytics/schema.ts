import { z } from 'zod'

export const MAX_ANALYTICS_BATCH_SIZE = 50

const shortText = z.string().max(500)
const slugText = z.string().max(200)

const FunnelStepSchema = z.enum(['view_collection', 'view_pdp', 'add_cart', 'checkout', 'purchase'])

export const AnalyticsEventSchema = z.discriminatedUnion('name', [
  z.object({ name: z.literal('page_view'), path: shortText }),
  z.object({ name: z.literal('product_view'), slug: slugText, price: z.number().finite() }),
  z.object({
    name: z.literal('add_to_cart'),
    slug: slugText,
    variantId: shortText,
    price: z.number().finite(),
  }),
  z.object({
    name: z.literal('begin_checkout'),
    itemCount: z.number().int().min(0).max(999),
    subtotal: z.number().finite().min(0),
  }),
  z.object({
    name: z.literal('purchase'),
    orderId: shortText,
    subtotal: z.number().finite().min(0),
  }),
  z.object({
    name: z.literal('funnel_step'),
    step: FunnelStepSchema,
    meta: z.record(z.string(), z.union([z.string().max(200), z.number().finite()])).optional(),
  }),
  z.object({ name: z.literal('motion_jank'), frameDeltaMs: z.number().finite().min(0) }),
  z.object({ name: z.literal('motion_skipped'), sceneId: shortText, reason: shortText }),
  z.object({
    name: z.literal('web_vital'),
    metric: shortText,
    value: z.number().finite(),
    rating: shortText,
  }),
  z.object({
    name: z.literal('app_error'),
    statusCode: z.number().int().min(100).max(599),
    message: shortText,
  }),
])

export const AnalyticsBatchSchema = z.object({
  events: z.array(AnalyticsEventSchema).min(1).max(MAX_ANALYTICS_BATCH_SIZE),
})

export type AnalyticsEventInput = z.infer<typeof AnalyticsEventSchema>
