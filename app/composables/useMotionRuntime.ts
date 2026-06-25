import { computed, provide, watch, type Ref } from 'vue'
import {
  motionRuntimeKey,
  type MotionDegradeReason,
  type MotionRuntime,
} from '@/lib/motion/contracts'
import { forceMotionDegrade, getMotionCapabilitiesSnapshot } from '@/lib/motion/motionCapabilities'
import { scrollInjectionKey, useLocomotiveScroll } from '@/composables/useLocomotiveScroll'

export function provideMotionRuntime(): {
  runtime: MotionRuntime
  scrollProgress: Ref<number>
  scrollDirection: ReturnType<typeof useLocomotiveScroll>['scrollDirection']
  isScrolling: ReturnType<typeof useLocomotiveScroll>['isScrolling']
  scrollInstance: ReturnType<typeof useLocomotiveScroll>['scrollInstance']
  init: () => Promise<void>
  destroy: () => void
} {
  const scroll = useLocomotiveScroll()
  const caps = computed(() => getMotionCapabilitiesSnapshot())
  const progressListeners = new Set<(progress: number) => void>()

  const runtime: MotionRuntime = {
    get capabilities() {
      return caps.value
    },
    invalidate: () => scroll.update(),
    scrollTo: scroll.scrollTo,
    onProgress(cb) {
      progressListeners.add(cb)
      return () => progressListeners.delete(cb)
    },
    degrade(reason: MotionDegradeReason) {
      forceMotionDegrade(reason)
      scroll.destroy()
      void scroll.init()
    },
  }

  watch(scroll.scrollProgress, (progress) => {
    progressListeners.forEach((cb) => cb(progress))
  })

  provide(motionRuntimeKey, runtime)
  provide(scrollInjectionKey, { update: scroll.update, scrollTo: scroll.scrollTo })

  return {
    runtime,
    scrollProgress: scroll.scrollProgress,
    scrollDirection: scroll.scrollDirection,
    isScrolling: scroll.isScrolling,
    scrollInstance: scroll.scrollInstance,
    init: scroll.init,
    destroy: scroll.destroy,
  }
}
