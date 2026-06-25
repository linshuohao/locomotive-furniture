import { ref, nextTick, onMounted, onUnmounted, type Ref, type InjectionKey } from 'vue'
import LocomotiveScroll from 'locomotive-scroll'
import 'locomotive-scroll/dist/locomotive-scroll.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { LocomotiveScrollOptions } from '@/types'
import { FpsMonitor } from '@/lib/motion/performance'
import { trackScrollFps } from '@/lib/analytics/analytics'
import { getMotionCapabilitiesSnapshot, trackMotionJank } from '@/lib/motion/motionCapabilities'
import { LENIS_OPTIONS, SCROLL_CSS_VARS, SCROLL_TO_DURATION } from '@/lib/scroll/scrollConstants'

export type ScrollInstance = InstanceType<typeof LocomotiveScroll>

export interface ScrollContext {
  update: () => Promise<void>
  scrollTo: (target: string | number, options?: { offset?: number; duration?: number }) => void
}

export const scrollInjectionKey: InjectionKey<ScrollContext> = Symbol('scroll')

const scrollInstance: Ref<ScrollInstance | null> = ref(null)
const scrollProgress = ref(0)
const scrollDirection = ref<'up' | 'down'>('down')
const isScrolling = ref(false)

let fpsMonitor: FpsMonitor | null = null
let scrollTimeout: ReturnType<typeof setTimeout> | null = null
let lastScrollRef = 0
let lastFrameTime = 0
let jankTicker: ((time: number) => void) | null = null
let scrollCtx: gsap.Context | null = null
let updateRaf = 0

function isSmoothScrollEnabled(config: ReturnType<typeof useRuntimeConfig>): boolean {
  if (config.public.enableSmoothScroll === 'false') return false
  return getMotionCapabilitiesSnapshot().smoothScroll
}

function isParallaxEnabled(config: ReturnType<typeof useRuntimeConfig>): boolean {
  if (config.public.enableParallax === 'false') return false
  return getMotionCapabilitiesSnapshot().parallax
}

export function useLocomotiveScroll(options: LocomotiveScrollOptions = {}) {
  const runtimeConfig = useRuntimeConfig()

  const init = async () => {
    if (import.meta.server) return

    await nextTick()

    if (scrollInstance.value) {
      destroy()
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      document.documentElement.classList.remove('scroll-ready')
      return
    }

    const enableSmooth = options.enableSmooth ?? isSmoothScrollEnabled(runtimeConfig)
    const enableParallax = options.enableParallax ?? isParallaxEnabled(runtimeConfig)
    const caps = getMotionCapabilitiesSnapshot()

    // Static tier: no scroll runtime. Degraded tier keeps a lightweight instance for
    // data-scroll-css-progress without smooth wheel / parallax.
    if (!enableSmooth && !enableParallax && !caps.animations) {
      document.documentElement.classList.remove('scroll-ready')
      return
    }

    try {
      gsap.registerPlugin(ScrollTrigger)
      scrollCtx?.revert()
      scrollCtx = gsap.context(() => {})

      scrollInstance.value = new LocomotiveScroll({
        lenisOptions: {
          ...LENIS_OPTIONS,
          smoothWheel: enableSmooth,
          autoRaf: false,
        },
        scrollCallback: ({ direction, velocity, progress, scroll }) => {
          scrollProgress.value = progress
          isScrolling.value = velocity !== 0

          const current = scroll
          if (current > lastScrollRef + 2) scrollDirection.value = 'down'
          else if (current < lastScrollRef - 2) scrollDirection.value = 'up'
          lastScrollRef = current

          if (scrollTimeout) clearTimeout(scrollTimeout)
          scrollTimeout = setTimeout(() => {
            isScrolling.value = false
          }, 150)

          document.documentElement.style.setProperty(SCROLL_CSS_VARS.progress, String(progress))
          document.documentElement.style.setProperty(SCROLL_CSS_VARS.direction, String(direction))
        },
        initCustomTicker: (render) => {
          gsap.ticker.add(render)
        },
        destroyCustomTicker: (render) => {
          gsap.ticker.remove(render)
        },
      })

      scrollInstance.value.start()

      const lenis = scrollInstance.value.lenisInstance
      if (lenis) {
        ScrollTrigger.scrollerProxy(document.documentElement, {
          scrollTop(value) {
            if (arguments.length) {
              lenis.scrollTo(value as number, { immediate: true })
            }
            return lenis.scroll
          },
          getBoundingClientRect() {
            return {
              top: 0,
              left: 0,
              width: window.innerWidth,
              height: window.innerHeight,
            }
          },
          pinType: document.documentElement.style.transform ? 'transform' : 'fixed',
        })

        lenis.on('scroll', ScrollTrigger.update)
        gsap.ticker.lagSmoothing(0)
      }

      lastFrameTime = performance.now()
      jankTicker = (time: number) => {
        if (lastFrameTime) trackMotionJank(time - lastFrameTime)
        lastFrameTime = time
      }
      gsap.ticker.add(jankTicker)

      document.documentElement.classList.add('scroll-ready', 'lenis')

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          scrollInstance.value?.resize()
        })
      })

      if (import.meta.dev) {
        fpsMonitor = new FpsMonitor()
        fpsMonitor.start(trackScrollFps)
      }
    } catch (error) {
      console.warn('[LocomotiveScroll] Init failed, falling back to native scroll:', error)
      document.documentElement.classList.remove('scroll-ready')
    }
  }

  const update = async () => {
    if (import.meta.server) return
    await nextTick()
    if (updateRaf) return
    updateRaf = requestAnimationFrame(() => {
      updateRaf = 0
      scrollInstance.value?.resize?.()
      ScrollTrigger.refresh()
    })
  }

  const destroy = () => {
    if (updateRaf) {
      cancelAnimationFrame(updateRaf)
      updateRaf = 0
    }
    fpsMonitor?.stop()
    fpsMonitor = null
    if (jankTicker) {
      gsap.ticker.remove(jankTicker)
      jankTicker = null
    }
    lastFrameTime = 0
    scrollCtx?.revert()
    scrollCtx = null
    ScrollTrigger.scrollerProxy(document.documentElement, {})
    scrollInstance.value?.destroy?.()
    scrollInstance.value = null
    scrollProgress.value = 0
    lastScrollRef = 0
    document.documentElement.classList.remove('scroll-ready', 'lenis')
  }

  const scrollTo = (
    target: string | number,
    scrollOptions?: { offset?: number; duration?: number },
  ) => {
    scrollInstance.value?.scrollTo?.(target, {
      duration: scrollOptions?.duration ?? SCROLL_TO_DURATION,
      ...scrollOptions,
    })
  }

  return {
    scrollInstance,
    scrollProgress,
    scrollDirection,
    isScrolling,
    tier: getMotionCapabilitiesSnapshot().tier,
    get enableParallax() {
      return options.enableParallax ?? isParallaxEnabled(runtimeConfig)
    },
    init,
    update,
    destroy,
    scrollTo,
  }
}

export function useScrollLifecycle(options: LocomotiveScrollOptions = {}) {
  const scroll = useLocomotiveScroll(options)

  onMounted(() => {
    void scroll.init()
  })

  onUnmounted(() => {
    scroll.destroy()
  })

  return scroll
}
