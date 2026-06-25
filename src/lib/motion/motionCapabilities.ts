export type MotionTier = 'full' | 'reduced' | 'static'

export interface MotionCapabilities {
  tier: MotionTier
  smoothScroll: boolean
  parallax: boolean
  webgl: boolean
  pageTransition: boolean
  animations: boolean
}

const LOW_CORE_THRESHOLD = 2
const LOW_MEMORY_GB = 2
const MOBILE_BREAKPOINT = 768

export const STATIC_CAPABILITIES: MotionCapabilities = {
  tier: 'static',
  smoothScroll: false,
  parallax: false,
  webgl: false,
  pageTransition: false,
  animations: false,
}

function isSlowConnection(): boolean {
  const connection = (navigator as Navigator & { connection?: { effectiveType?: string } })
    .connection?.effectiveType
  return connection === '2g' || connection === 'slow-2g'
}

export function computeMotionCapabilities(): MotionCapabilities {
  if (typeof window === 'undefined') {
    return {
      tier: 'full',
      smoothScroll: true,
      parallax: true,
      webgl: true,
      pageTransition: true,
      animations: true,
    }
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const cores = navigator.hardwareConcurrency ?? 8
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    ?.saveData
  const isMobile = window.innerWidth < MOBILE_BREAKPOINT

  const lowEnd =
    cores <= LOW_CORE_THRESHOLD ||
    memory <= LOW_MEMORY_GB ||
    saveData === true ||
    isSlowConnection()

  if (reducedMotion) {
    return STATIC_CAPABILITIES
  }

  if (lowEnd) {
    return {
      tier: 'reduced',
      smoothScroll: false,
      parallax: false,
      webgl: false,
      pageTransition: false,
      animations: false,
    }
  }

  if (isMobile) {
    return {
      tier: 'reduced',
      smoothScroll: true,
      parallax: false,
      webgl: false,
      pageTransition: true,
      animations: true,
    }
  }

  return {
    tier: 'full',
    smoothScroll: true,
    parallax: true,
    webgl: true,
    pageTransition: true,
    animations: true,
  }
}

let cachedSnapshot: MotionCapabilities = STATIC_CAPABILITIES
let cachedKey = ''

export function getMotionCapabilitiesSnapshot(): MotionCapabilities {
  const next = computeMotionCapabilities()
  const key = `${next.tier}|${next.smoothScroll}|${next.parallax}|${next.webgl}|${next.pageTransition}|${next.animations}`

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
