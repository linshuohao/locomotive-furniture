import type { MotionCapabilities } from '@/lib/motion/motionCapabilities'

export type SceneTrigger = 'mount' | 'inview' | 'intro-complete' | 'scrub'

export type SceneEffect =
  | 'hero-enter'
  | 'mask-lines'
  | 'clip-image'
  | 'scale-fade-grid'
  | 'pdp-copy'
  | 'success-enter'

export interface MotionSceneDescriptor {
  id: string
  trigger: SceneTrigger
  effect: SceneEffect
  /** Selectors relative to scene root element */
  targets: Record<string, string>
  options?: Record<string, number | boolean | string>
  requires?: Partial<MotionCapabilities>
}
