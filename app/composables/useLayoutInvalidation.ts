import { inject } from 'vue'
import { motionRuntimeKey } from '@/lib/motion/contracts'
import { scrollInjectionKey } from '@/composables/useLocomotiveScroll'

/** Notify scroll kernel after layout-affecting DOM changes (images, async grids) */
export function useLayoutInvalidation() {
  const runtime = inject(motionRuntimeKey, null)
  const scroll = inject(scrollInjectionKey, null)

  return async function invalidateLayout() {
    if (runtime) {
      await runtime.invalidate()
      return
    }
    await scroll?.update()
  }
}
