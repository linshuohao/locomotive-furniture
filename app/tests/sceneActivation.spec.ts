import { describe, it, expect } from 'vitest'
import { meetsSceneRequirements, resolveSceneActive } from '@/lib/motion/sceneActivation'
import { STATIC_CAPABILITIES, SSR_MOTION_CAPABILITIES } from '@/lib/motion/motionCapabilities'

describe('resolveSceneActive', () => {
  const base = {
    hasRoot: true,
    inViewActive: false,
    introComplete: false,
  }

  it('prefers when override over trigger', () => {
    expect(
      resolveSceneActive('intro-complete', { ...base, introComplete: false, when: true }),
    ).toBe(true)
    expect(resolveSceneActive('mount', { ...base, when: false })).toBe(false)
    expect(resolveSceneActive('mount', { ...base, when: 0 })).toBe(false)
    expect(resolveSceneActive('mount', { ...base, when: '' })).toBe(false)
  })

  it('activates intro-complete from injected page state', () => {
    expect(resolveSceneActive('intro-complete', { ...base, introComplete: false })).toBe(false)
    expect(resolveSceneActive('intro-complete', { ...base, introComplete: true })).toBe(true)
  })

  it('handles mount, inview, and scrub triggers', () => {
    expect(resolveSceneActive('mount', { ...base, hasRoot: false })).toBe(false)
    expect(resolveSceneActive('mount', { ...base, hasRoot: true })).toBe(true)
    expect(resolveSceneActive('inview', { ...base, inViewActive: true })).toBe(true)
    expect(resolveSceneActive('scrub', { ...base, hasRoot: true })).toBe(true)
  })
})

describe('meetsSceneRequirements', () => {
  it('passes when requires is undefined', () => {
    expect(meetsSceneRequirements(undefined, SSR_MOTION_CAPABILITIES)).toBe(true)
  })

  it('checks each required capability flag', () => {
    expect(meetsSceneRequirements({ animations: true }, SSR_MOTION_CAPABILITIES)).toBe(true)
    expect(meetsSceneRequirements({ animations: true }, STATIC_CAPABILITIES)).toBe(false)
    expect(meetsSceneRequirements({ webgl: true }, SSR_MOTION_CAPABILITIES)).toBe(false)
  })
})
