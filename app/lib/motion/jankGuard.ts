import type { MotionRuntime } from '@/lib/motion/contracts'
import { track } from '@/lib/analytics/analytics'

const JANK_THRESHOLD_MS = 32
const WINDOW_MS = 10_000
const MAX_JANK_RATE = 0.05
const JANK_TRACK_INTERVAL_MS = 5_000

export function installJankGuard(runtime: MotionRuntime): () => void {
  const samples: number[] = []
  let degraded = false
  let lastJankTrack = 0

  const onJank = (event: Event) => {
    if (degraded) return

    const { frameDeltaMs } = (event as CustomEvent<{ frameDeltaMs: number }>).detail
    if (frameDeltaMs < JANK_THRESHOLD_MS) return

    const now = performance.now()
    samples.push(now)

    while (samples.length && samples[0]! < now - WINDOW_MS) {
      samples.shift()
    }

    const estimatedFrames = WINDOW_MS / 16
    const rate = samples.length / estimatedFrames

    if (rate > MAX_JANK_RATE && runtime.capabilities.tier === 'full') {
      track({ name: 'motion_jank', frameDeltaMs })
      degraded = true
      runtime.degrade('jank')
      return
    }

    if (now - lastJankTrack >= JANK_TRACK_INTERVAL_MS) {
      lastJankTrack = now
      track({ name: 'motion_jank', frameDeltaMs })
    }
  }

  window.addEventListener('motion:jank', onJank)
  return () => window.removeEventListener('motion:jank', onJank)
}
