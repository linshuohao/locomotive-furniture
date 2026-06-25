import type { MotionSceneDescriptor } from '@/lib/motion/scene'
import {
  createHeroEnterTimeline,
  createClipImageReveal,
  createScaleFadeReveal,
  createPdpTimeline,
  createHeroMaskLines,
  createMaskLineReveal,
  createSuccessTimeline,
} from '@/lib/scroll/animation'

function query(root: HTMLElement, selector?: string): HTMLElement | null {
  if (!selector) return null
  return root.querySelector(selector)
}

export function resolveSceneFactory(effect: MotionSceneDescriptor['effect']) {
  const factories = {
    'hero-enter': (
      root: HTMLElement,
      targets: Record<string, string>,
      options?: Record<string, number | boolean | string>,
    ) =>
      createHeroEnterTimeline(
        {
          eyebrow: query(root, targets.eyebrow),
          title: query(root, targets.title),
          subtitle: query(root, targets.subtitle),
          cta: query(root, targets.cta),
          media: query(root, targets.media),
        },
        { delay: typeof options?.delay === 'number' ? options.delay : undefined },
      ),

    'clip-image': (root: HTMLElement, targets: Record<string, string>) => {
      const wrapper = query(root, targets.wrapper)
      const inner = query(root, targets.inner)
      if (wrapper && inner) return createClipImageReveal(wrapper, inner)
      return null
    },

    'scale-fade-grid': (
      root: HTMLElement,
      targets: Record<string, string>,
      options?: Record<string, number | boolean | string>,
    ) =>
      createScaleFadeReveal(root, targets.items ?? '[data-product-card]', {
        stagger: typeof options?.stagger === 'number' ? options.stagger : undefined,
      }),

    'pdp-copy': (root: HTMLElement) => createPdpTimeline(root),

    'mask-lines': (
      root: HTMLElement,
      targets: Record<string, string>,
      options?: Record<string, number | boolean | string>,
    ) => {
      const container = query(root, targets.container) ?? root
      const stagger = typeof options?.stagger === 'number' ? options.stagger : undefined
      const delay = typeof options?.delay === 'number' ? options.delay : undefined
      const scroll = options?.scroll !== false

      if (scroll) {
        return createMaskLineReveal(container, { stagger, delay })
      }
      return createHeroMaskLines(container, { stagger, delay })
    },

    'success-enter': (root: HTMLElement) => createSuccessTimeline(root),
  }

  return factories[effect]
}
