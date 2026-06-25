import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { installJankGuard } from '@/lib/motion/jankGuard'
import type { MotionRuntime } from '@/lib/motion/contracts'

describe('jankGuard', () => {
  let runtime: MotionRuntime
  let removeGuard: (() => void) | undefined

  beforeEach(() => {
    vi.useFakeTimers()
    runtime = {
      capabilities: {
        tier: 'full',
        smoothScroll: true,
        parallax: true,
        webgl: true,
        pageTransition: true,
        animations: true,
      },
      invalidate: vi.fn(),
      scrollTo: vi.fn(),
      onProgress: vi.fn(() => () => {}),
      degrade: vi.fn(),
    }
    removeGuard = installJankGuard(runtime)
  })

  afterEach(() => {
    removeGuard?.()
    vi.useRealTimers()
  })

  it('calls runtime.degrade when jank rate exceeds threshold on full tier', () => {
    const now = 1_000
    vi.spyOn(performance, 'now').mockReturnValue(now)

    for (let i = 0; i < 40; i++) {
      window.dispatchEvent(new CustomEvent('motion:jank', { detail: { frameDeltaMs: 50 } }))
    }

    expect(runtime.degrade).toHaveBeenCalledWith('jank')
  })

  it('does not degrade when tier is already reduced', () => {
    removeGuard?.()
    const reducedRuntime: MotionRuntime = {
      capabilities: {
        tier: 'reduced',
        smoothScroll: false,
        parallax: false,
        webgl: false,
        pageTransition: false,
        animations: true,
      },
      invalidate: vi.fn(),
      scrollTo: vi.fn(),
      onProgress: vi.fn(() => () => {}),
      degrade: vi.fn(),
    }
    removeGuard = installJankGuard(reducedRuntime)

    for (let i = 0; i < 40; i++) {
      window.dispatchEvent(new CustomEvent('motion:jank', { detail: { frameDeltaMs: 50 } }))
    }

    expect(reducedRuntime.degrade).not.toHaveBeenCalled()
  })
})
