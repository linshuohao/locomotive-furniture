import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  SSR_MOTION_CAPABILITIES,
  STATIC_CAPABILITIES,
  forceMotionDegrade,
  getMotionCapabilitiesSnapshot,
  isMotionRuntimeDegraded,
  resetMotionDegradeState,
} from '@/lib/motion/motionCapabilities'

function stubDesktopNavigator(overrides: Partial<Navigator> = {}) {
  vi.stubGlobal('navigator', {
    hardwareConcurrency: 8,
    deviceMemory: 8,
    ...overrides,
  })
  Object.defineProperty(window, 'innerWidth', { value: 1024, configurable: true })
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  )
}

describe('motionCapabilities', () => {
  beforeEach(() => {
    resetMotionDegradeState()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('SSR snapshot disables webgl to avoid hydration flash', () => {
    expect(SSR_MOTION_CAPABILITIES.webgl).toBe(false)
    expect(SSR_MOTION_CAPABILITIES.parallax).toBe(false)
    expect(SSR_MOTION_CAPABILITIES.animations).toBe(true)
  })

  it('static tier disables all motion features', () => {
    expect(STATIC_CAPABILITIES.tier).toBe('static')
    expect(STATIC_CAPABILITIES.animations).toBe(false)
  })

  it('forceMotionDegrade returns reduced capabilities', () => {
    forceMotionDegrade('test')
    expect(isMotionRuntimeDegraded()).toBe(true)

    const caps = getMotionCapabilitiesSnapshot()
    expect(caps.tier).toBe('reduced')
    expect(caps.webgl).toBe(false)
    expect(caps.smoothScroll).toBe(false)
    expect(caps.animations).toBe(true)
  })

  it('lowEnd tier keeps animations for lightweight scroll runtime', () => {
    stubDesktopNavigator({ hardwareConcurrency: 2 })

    const caps = getMotionCapabilitiesSnapshot()
    expect(caps.tier).toBe('reduced')
    expect(caps.smoothScroll).toBe(false)
    expect(caps.webgl).toBe(false)
    expect(caps.animations).toBe(true)
  })
})
