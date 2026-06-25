import {
  inject,
  onMounted,
  onUnmounted,
  nextTick,
  watch,
  ref,
  isRef,
  unref,
  type WatchSource,
} from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motionRuntimeKey } from '@/lib/motion/contracts'
import { scrollInjectionKey } from '@/composables/useLocomotiveScroll'
import { getMotionCapabilitiesSnapshot } from '@/lib/motion/motionCapabilities'

function resolveWatchSource(source: WatchSource<unknown>): unknown {
  if (typeof source === 'function' && !isRef(source)) {
    return source()
  }
  return unref(source)
}

/**
 * Vue lifecycle wrapper for GSAP timelines + ScrollTrigger.
 * Reverts all animations created inside the factory on unmount.
 */
export function useGsapTimeline(
  factory: () => void,
  options: {
    /** Re-run factory when source becomes truthy (e.g. after async load) */
    watchSource?: WatchSource<unknown>
  } = {},
) {
  const motionRuntime = inject(motionRuntimeKey, null)
  const scroll = inject(scrollInjectionKey, null)
  let ctx: gsap.Context | null = null
  let refreshRaf = 0
  const mounted = ref(false)

  function scheduleRefresh() {
    if (refreshRaf) return
    refreshRaf = requestAnimationFrame(() => {
      refreshRaf = 0
      ScrollTrigger.refresh()
    })
  }

  async function run() {
    if (import.meta.server) return
    if (!getMotionCapabilitiesSnapshot().animations) return

    ctx?.revert()
    ctx = null

    await nextTick()
    gsap.registerPlugin(ScrollTrigger)
    ctx = gsap.context(factory)
    if (motionRuntime) await motionRuntime.invalidate()
    else await scroll?.update()
    scheduleRefresh()
  }

  function revert() {
    if (refreshRaf) {
      cancelAnimationFrame(refreshRaf)
      refreshRaf = 0
    }
    ctx?.revert()
    ctx = null
  }

  if (options.watchSource) {
    watch(options.watchSource, (val) => {
      if (!mounted.value) return
      if (val) void run()
      else revert()
    })
  }

  onMounted(() => {
    mounted.value = true
    if (options.watchSource) {
      const val = resolveWatchSource(options.watchSource)
      if (val) void run()
    } else {
      void run()
    }
  })

  onUnmounted(revert)

  return { rebuild: run }
}

/** Collect HTMLElement refs from a template ref map */
export function collectRefs<T extends string>(
  refs: Partial<Record<T, HTMLElement | null>>,
  keys: T[],
): HTMLElement[] {
  return keys.map((k) => refs[k]).filter(Boolean) as HTMLElement[]
}
