import type { PerformanceTier } from '@/types'
import {
  getMotionCapabilitiesSnapshot,
  type MotionCapabilities,
} from '@/lib/motion/motionCapabilities'

export type { MotionCapabilities } from '@/lib/motion/motionCapabilities'
export { getMotionCapabilitiesSnapshot, trackMotionJank } from '@/lib/motion/motionCapabilities'

function toPerformanceTier(caps: MotionCapabilities): PerformanceTier {
  if (caps.tier === 'static' || !caps.animations) {
    return {
      tier: 'low',
      smoothScroll: caps.smoothScroll,
      parallax: caps.parallax,
      animations: caps.animations,
    }
  }

  if (caps.tier === 'reduced') {
    return {
      tier: 'medium',
      smoothScroll: caps.smoothScroll,
      parallax: caps.parallax,
      animations: caps.animations,
    }
  }

  return {
    tier: 'high',
    smoothScroll: caps.smoothScroll,
    parallax: caps.parallax,
    animations: caps.animations,
  }
}

/** @deprecated Prefer getMotionCapabilitiesSnapshot() — kept for gradual migration */
export function detectPerformanceTier(): PerformanceTier {
  return toPerformanceTier(getMotionCapabilitiesSnapshot())
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
