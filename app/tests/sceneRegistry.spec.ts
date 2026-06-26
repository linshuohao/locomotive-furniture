import { describe, it, expect, vi, beforeEach } from 'vitest'
import { resolveSceneFactory } from '@/lib/motion/sceneRegistry'

vi.mock('@/lib/scroll/animation', () => ({
  createHeroEnterTimeline: vi.fn(() => ({ kill: vi.fn() })),
  createClipImageReveal: vi.fn(() => ({ kill: vi.fn() })),
  createScaleFadeReveal: vi.fn(() => ({ kill: vi.fn() })),
  createPdpTimeline: vi.fn(() => ({ kill: vi.fn() })),
  createHeroMaskLines: vi.fn(() => ({ kill: vi.fn() })),
  createMaskLineReveal: vi.fn(() => ({ kill: vi.fn() })),
  createSuccessTimeline: vi.fn(() => ({ kill: vi.fn() })),
}))

import {
  createHeroEnterTimeline,
  createClipImageReveal,
  createScaleFadeReveal,
  createPdpTimeline,
  createSuccessTimeline,
} from '@/lib/scroll/animation'

describe('sceneRegistry', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('exposes a factory for every scene effect', () => {
    const effects = [
      'hero-enter',
      'clip-image',
      'scale-fade-grid',
      'pdp-copy',
      'mask-lines',
      'success-enter',
    ] as const

    for (const effect of effects) {
      expect(typeof resolveSceneFactory(effect)).toBe('function')
    }
  })

  it('hero-enter queries targets relative to scene root', () => {
    const root = document.createElement('div')
    const eyebrow = document.createElement('p')
    eyebrow.setAttribute('data-hero-eyebrow', '')
    root.appendChild(eyebrow)

    const factory = resolveSceneFactory('hero-enter')
    factory(root, { eyebrow: '[data-hero-eyebrow]' })

    expect(createHeroEnterTimeline).toHaveBeenCalledWith(
      expect.objectContaining({ eyebrow }),
      expect.any(Object),
    )
  })

  it('clip-image returns null when targets are missing', () => {
    const root = document.createElement('div')
    const factory = resolveSceneFactory('clip-image')
    expect(factory(root, { wrapper: '.missing', inner: '.missing' })).toBeNull()
    expect(createClipImageReveal).not.toHaveBeenCalled()
  })

  it('scale-fade-grid delegates to createScaleFadeReveal', () => {
    const root = document.createElement('div')
    const factory = resolveSceneFactory('scale-fade-grid')
    factory(root, { items: '[data-card]' }, { stagger: 0.2 })

    expect(createScaleFadeReveal).toHaveBeenCalledWith(root, '[data-card]', { stagger: 0.2 })
  })

  it('pdp-copy and success-enter use scene root', () => {
    const root = document.createElement('div')

    resolveSceneFactory('pdp-copy')(root, {})
    resolveSceneFactory('success-enter')(root, {})

    expect(createPdpTimeline).toHaveBeenCalledWith(root)
    expect(createSuccessTimeline).toHaveBeenCalledWith(root)
  })
})
