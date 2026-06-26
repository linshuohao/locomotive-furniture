import type { MotionCapabilities } from '@/lib/motion/motionCapabilities'
import type { SceneTrigger } from '@/lib/motion/scene'

export interface SceneActivationContext {
  hasRoot: boolean
  inViewActive: boolean
  introComplete: boolean
  when?: boolean | string | number
}

export function resolveSceneActive(trigger: SceneTrigger, ctx: SceneActivationContext): boolean {
  if (ctx.when !== undefined) {
    return ctx.when !== false && ctx.when !== 0 && ctx.when !== ''
  }

  switch (trigger) {
    case 'mount':
    case 'scrub':
      return ctx.hasRoot
    case 'inview':
      return ctx.inViewActive
    case 'intro-complete':
      return ctx.introComplete
    default:
      return ctx.hasRoot
  }
}

export function meetsSceneRequirements(
  requires: Partial<MotionCapabilities> | undefined,
  caps: MotionCapabilities,
): boolean {
  if (!requires) return true

  return (Object.keys(requires) as (keyof MotionCapabilities)[]).every(
    (key) => caps[key] === requires[key],
  )
}
