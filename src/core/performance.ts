import type { PerformanceTier } from '@/types'

const MOBILE_BREAKPOINT = 768

export function detectPerformanceTier(): PerformanceTier {
  if (typeof window === 'undefined') {
    return { tier: 'medium', smoothScroll: true, parallax: true, animations: true }
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion) {
    return { tier: 'low', smoothScroll: false, parallax: false, animations: false }
  }

  const isMobile = window.innerWidth < MOBILE_BREAKPOINT
  const cores = navigator.hardwareConcurrency ?? 4
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4
  const connection = (navigator as Navigator & { connection?: { effectiveType?: string } })
    .connection?.effectiveType

  const isSlowConnection = connection === '2g' || connection === 'slow-2g'
  const isLowEnd = cores <= 2 || memory <= 2 || isSlowConnection

  if (isLowEnd || isMobile) {
    return {
      tier: isLowEnd ? 'low' : 'medium',
      smoothScroll: !isLowEnd,
      parallax: false,
      animations: true,
    }
  }

  return { tier: 'high', smoothScroll: true, parallax: true, animations: true }
}

export function shouldEnableFeature(
  envKey: string,
  tierCheck: (tier: PerformanceTier) => boolean,
): boolean {
  const envEnabled = import.meta.env[envKey] !== 'false'
  if (!envEnabled) return false
  return tierCheck(detectPerformanceTier())
}

export class FpsMonitor {
  private frames = 0
  private lastTime = performance.now()
  private fps = 60
  private rafId = 0
  private callback?: (fps: number) => void

  start(callback?: (fps: number) => void) {
    this.callback = callback
    this.tick()
  }

  stop() {
    if (this.rafId) cancelAnimationFrame(this.rafId)
  }

  getFps() {
    return this.fps
  }

  private tick = () => {
    this.frames++
    const now = performance.now()
    if (now - this.lastTime >= 1000) {
      this.fps = Math.round((this.frames * 1000) / (now - this.lastTime))
      this.callback?.(this.fps)
      this.frames = 0
      this.lastTime = now
    }
    this.rafId = requestAnimationFrame(this.tick)
  }
}
