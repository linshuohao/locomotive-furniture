export const API_TIMEOUT_MS = 3_000
export const CACHE_TTL_MS = 60_000

type CacheEntry<T> = { data: T; expiresAt: number }

const cache = new Map<string, CacheEntry<unknown>>()

export function getCached<T>(key: string): T | null {
  const entry = cache.get(key)
  if (!entry || Date.now() > entry.expiresAt) return null
  return entry.data as T
}

export function setCache<T>(key: string, data: T, ttlMs = CACHE_TTL_MS): void {
  cache.set(key, { data, expiresAt: Date.now() + ttlMs })
}

export function clearCache(): void {
  cache.clear()
}

export async function withTimeout<T>(fn: () => Promise<T>, ms = API_TIMEOUT_MS): Promise<T> {
  return Promise.race([
    fn(),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('API_TIMEOUT')), ms),
    ),
  ])
}

export async function simulateLatency<T>(data: T, latencyMs = 80): Promise<T> {
  await new Promise((r) => setTimeout(r, latencyMs))
  return data
}

function apiBaseUrl(): string {
  return (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')
}

export async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const base = apiBaseUrl()
  if (!base) {
    throw new Error('VITE_API_BASE_URL is not configured')
  }

  const url = `${base}${path.startsWith('/') ? path : `/${path}`}`
  const response = await fetch(url, {
    headers: { Accept: 'application/json', ...init?.headers },
    ...init,
  })

  if (!response.ok) {
    throw new Error(`HTTP_${response.status}`)
  }

  return response.json() as Promise<T>
}
