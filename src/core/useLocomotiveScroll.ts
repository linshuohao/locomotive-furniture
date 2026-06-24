import { ref, onMounted, onUnmounted, nextTick, type Ref } from 'vue'
import LocomotiveScroll from 'locomotive-scroll'
import 'locomotive-scroll/dist/locomotive-scroll.css'
import type { LocomotiveScrollOptions } from '@/types'
import { detectPerformanceTier, FpsMonitor, shouldEnableFeature } from '@/core/performance'
import { trackScrollFps } from '@/core/monitoring'

export type ScrollInstance = InstanceType<typeof LocomotiveScroll>

const scrollInstance: Ref<ScrollInstance | null> = ref(null)
const scrollProgress = ref(0)
const scrollDirection = ref<'up' | 'down'>('down')
const isScrolling = ref(false)

let fpsMonitor: FpsMonitor | null = null
let scrollTimeout: ReturnType<typeof setTimeout> | null = null

export function useLocomotiveScroll(options: LocomotiveScrollOptions = {}) {
  const tier = detectPerformanceTier()
  const enableSmooth =
    options.enableSmooth ??
    shouldEnableFeature('VITE_ENABLE_SMOOTH_SCROLL', (t) => t.smoothScroll)
  const enableParallax =
    options.enableParallax ?? shouldEnableFeature('VITE_ENABLE_PARALLAX', (t) => t.parallax)

  const init = async (_container?: HTMLElement | null) => {
    await nextTick()

    if (scrollInstance.value) {
      destroy()
    }

    if (!enableSmooth && !enableParallax) return

    try {
      scrollInstance.value = new LocomotiveScroll({
        lenisOptions: {
          lerp: options.lerp ?? 0.08,
          smoothWheel: enableSmooth,
        },
        scrollCallback: ({ direction, velocity, progress }) => {
          scrollProgress.value = progress
          scrollDirection.value = direction > 0 ? 'down' : 'up'
          isScrolling.value = velocity !== 0

          if (scrollTimeout) clearTimeout(scrollTimeout)
          scrollTimeout = setTimeout(() => {
            isScrolling.value = false
          }, 150)

          if (import.meta.env.DEV) {
            document.documentElement.style.setProperty('--scroll-progress', String(progress))
          }
        },
      })

      if (import.meta.env.DEV) {
        fpsMonitor = new FpsMonitor()
        fpsMonitor.start(trackScrollFps)
      }
    } catch (error) {
      console.warn('[LocomotiveScroll] Init failed, falling back to native scroll:', error)
    }
  }

  const update = async () => {
    await nextTick()
    scrollInstance.value?.resize?.()
  }

  const destroy = () => {
    fpsMonitor?.stop()
    fpsMonitor = null
    scrollInstance.value?.destroy?.()
    scrollInstance.value = null
    scrollProgress.value = 0
  }

  const scrollTo = (target: string | number, options?: { offset?: number; duration?: number }) => {
    scrollInstance.value?.scrollTo?.(target, options)
  }

  return {
    scrollInstance,
    scrollProgress,
    scrollDirection,
    isScrolling,
    tier,
    enableParallax,
    init,
    update,
    destroy,
    scrollTo,
  }
}

export function useScrollLifecycle(
  options: LocomotiveScrollOptions = {},
  autoInit = true,
) {
  const scroll = useLocomotiveScroll(options)

  onMounted(() => {
    if (autoInit) scroll.init()
  })

  onUnmounted(() => {
    scroll.destroy()
  })

  return scroll
}
