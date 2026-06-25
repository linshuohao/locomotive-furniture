export type MotionTier = 'full' | 'reduced' | 'static'

export interface MotionCapabilities {
  tier: MotionTier
  smoothScroll: boolean
  parallax: boolean
  webgl: boolean
  pageTransition: boolean
}

const LOW_CORE_THRESHOLD = 4
const LOW_MEMORY_GB = 4

export const STATIC_CAPABILITIES: MotionCapabilities = {
  tier: 'static',
  smoothScroll: false,
  parallax: false,
  webgl: false,
  pageTransition: false,
}

export function computeMotionCapabilities(): MotionCapabilities {
  if (typeof window === 'undefined') {
    return STATIC_CAPABILITIES
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const cores = navigator.hardwareConcurrency ?? 8
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    ?.saveData

  const lowEnd = cores <= LOW_CORE_THRESHOLD || memory <= LOW_MEMORY_GB || saveData === true

  if (reducedMotion || lowEnd) {
    return {
      tier: reducedMotion ? 'static' : 'reduced',
      smoothScroll: !reducedMotion,
      parallax: false,
      webgl: false,
      pageTransition: !reducedMotion,
    }
  }

  return {
    tier: 'full',
    smoothScroll: true,
    parallax: true,
    webgl: true,
    pageTransition: true,
  }
}

let cachedSnapshot: MotionCapabilities = STATIC_CAPABILITIES
let cachedKey = ''

export function getMotionCapabilitiesSnapshot(): MotionCapabilities {
  const next = computeMotionCapabilities()
  const key = `${next.tier}|${next.smoothScroll}|${next.parallax}|${next.webgl}|${next.pageTransition}`

  if (key !== cachedKey) {
    cachedKey = key
    cachedSnapshot = next
  }

  return cachedSnapshot
}

export function trackMotionJank(frameDeltaMs: number): void {
  if (frameDeltaMs > 32 && typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('motion:jank', { detail: { frameDeltaMs } }))
  }
}
