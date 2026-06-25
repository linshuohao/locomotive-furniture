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

/** Conservative snapshot for SSR and hydration — upgraded on client after mount. */
export const SSR_MOTION_CAPABILITIES: MotionCapabilities = {
  tier: 'reduced',
  smoothScroll: true,
  parallax: false,
  webgl: false,
  pageTransition: true,
  animations: true,
}

function isSlowConnection(): boolean {
  const connection = (navigator as Navigator & { connection?: { effectiveType?: string } })
    .connection?.effectiveType
  return connection === '2g' || connection === 'slow-2g'
}

export function computeMotionCapabilities(): MotionCapabilities {
  if (typeof window === 'undefined') {
    return SSR_MOTION_CAPABILITIES
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
      animations: true,
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
let runtimeDegraded = false

const DEGRADED_CAPABILITIES: MotionCapabilities = {
  tier: 'reduced',
  smoothScroll: false,
  parallax: false,
  webgl: false,
  pageTransition: false,
  animations: true,
}

/** Runtime downgrade (jank guard) — disables smooth scroll / WebGL while keeping basic CSS motion */
export function forceMotionDegrade(reason: string): void {
  runtimeDegraded = true
  cachedKey = ''
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.motionDegraded = reason
    window.dispatchEvent(new CustomEvent('motion:degraded', { detail: { reason } }))
  }
}

export function isMotionRuntimeDegraded(): boolean {
  return runtimeDegraded
}

/** Clears runtime downgrade — for tests and hot-reload recovery */
export function resetMotionDegradeState(): void {
  runtimeDegraded = false
  cachedKey = ''
  if (typeof document !== 'undefined') {
    delete document.documentElement.dataset.motionDegraded
  }
}

export function getMotionCapabilitiesSnapshot(): MotionCapabilities {
  if (runtimeDegraded) {
    return DEGRADED_CAPABILITIES
  }

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
