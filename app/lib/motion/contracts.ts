import type { InjectionKey } from 'vue'
import type { MotionCapabilities, MotionTier } from '@/lib/motion/motionCapabilities'

export type { MotionCapabilities, MotionTier }

export type MotionDegradeReason = 'jank' | 'memory' | 'user'

/** Scroll / motion kernel — UI must not instantiate LocomotiveScroll directly */
export interface MotionRuntime {
  readonly capabilities: Readonly<MotionCapabilities>
  invalidate(): Promise<void>
  scrollTo(target: string | number, opts?: { offset?: number; duration?: number }): void
  onProgress(cb: (progress: number) => void): () => void
  degrade(reason: MotionDegradeReason): void
}

export const motionRuntimeKey: InjectionKey<MotionRuntime> = Symbol('motion-runtime')
