import { inject, onMounted, onUnmounted, nextTick, watch, type WatchSource } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { scrollInjectionKey } from '@/composables/useLocomotiveScroll'
import { detectPerformanceTier } from '@/lib/motion/performance'

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
  const scroll = inject(scrollInjectionKey, null)
  let ctx: gsap.Context | null = null

  async function run() {
    const tier = detectPerformanceTier()
    if (!tier.animations) return

    ctx?.revert()
    ctx = null

    await nextTick()
    gsap.registerPlugin(ScrollTrigger)
    ctx = gsap.context(factory)
    await scroll?.update()
    ScrollTrigger.refresh()
  }

  function revert() {
    ctx?.revert()
    ctx = null
  }

  if (options.watchSource) {
    watch(
      options.watchSource,
      (val) => {
        if (val) void run()
        else revert()
      },
      { immediate: true },
    )
  } else {
    onMounted(() => {
      void run()
    })
  }

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
