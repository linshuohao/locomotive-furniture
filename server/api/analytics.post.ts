import { readBody, getHeader, type H3Event } from 'h3'
import { AnalyticsBatchSchema } from '@/lib/analytics/schema'

const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX_EVENTS = 200

const buckets = new Map<string, { count: number; resetAt: number }>()

function pruneExpiredBuckets(now: number): void {
  for (const [key, bucket] of buckets) {
    if (now >= bucket.resetAt) buckets.delete(key)
  }
}

function getClientKey(event: H3Event): string {
  const forwarded = getHeader(event, 'x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]?.trim() ?? 'unknown'
  return getHeader(event, 'x-real-ip') ?? 'unknown'
}

function isRateLimited(key: string, batchSize: number): boolean {
  const now = Date.now()
  const bucket = buckets.get(key)

  if (!bucket || now >= bucket.resetAt) {
    buckets.set(key, { count: batchSize, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return false
  }

  bucket.count += batchSize
  return bucket.count > RATE_LIMIT_MAX_EVENTS
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = AnalyticsBatchSchema.safeParse(body)

  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid analytics payload' })
  }

  const { events } = parsed.data
  const clientKey = getClientKey(event)
  const now = Date.now()

  if (buckets.size > 500) pruneExpiredBuckets(now)

  if (isRateLimited(clientKey, events.length)) {
    throw createError({ statusCode: 429, statusMessage: 'Too many analytics events' })
  }

  // Phase 1: structured server log; Phase 2: Datadog / BigQuery sink
  console.info(
    '[analytics-batch]',
    JSON.stringify({
      count: events.length,
      names: events.map((entry) => entry.name),
    }),
  )

  return { ok: true, received: events.length }
})
