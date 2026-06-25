import type { AnalyticsEvent } from '@/lib/analytics/analytics'
import { MAX_ANALYTICS_BATCH_SIZE } from '@/lib/analytics/schema'

const BATCH_SIZE = MAX_ANALYTICS_BATCH_SIZE
const FLUSH_MS = 5_000

let buffer: AnalyticsEvent[] = []
let timer: ReturnType<typeof setTimeout> | undefined
let flushing = false

function isTransportEnabled(): boolean {
  if (!import.meta.client) return false
  try {
    return useRuntimeConfig().public.enableAnalytics === 'true'
  } catch {
    return false
  }
}

export async function flushAnalytics(): Promise<void> {
  if (!isTransportEnabled() || !buffer.length || flushing) return

  flushing = true
  const batch = buffer.splice(0, BATCH_SIZE)
  let delivered = false

  try {
    const response = await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ events: batch }),
      keepalive: true,
    })
    if (!response.ok) {
      buffer.unshift(...batch)
    } else {
      delivered = true
    }
  } catch {
    buffer.unshift(...batch)
  } finally {
    flushing = false
    if (delivered && buffer.length) void flushAnalytics()
  }
}

export function enqueueTransport(event: AnalyticsEvent): void {
  if (!isTransportEnabled()) return

  buffer.push(event)

  if (buffer.length >= BATCH_SIZE) {
    void flushAnalytics()
    return
  }

  clearTimeout(timer)
  timer = setTimeout(() => void flushAnalytics(), FLUSH_MS)
}

export function getTransportBufferSize(): number {
  return buffer.length
}
