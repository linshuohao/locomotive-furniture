import { nextTick } from 'vue'
import {
  collectShuffleLinks,
  enhanceLinkForShuffle,
  type HoverShuffleController,
} from '@/lib/scroll/hoverShuffleDom'
import { getMotionCapabilitiesSnapshot } from '@/lib/motion/motionCapabilities'

const MAIN_SHUFFLE_ZONE = 'main[data-shuffle-zone]'

export default defineNuxtPlugin((nuxtApp) => {
  const controllers = new Map<HTMLElement, HoverShuffleController>()
  let observer: MutationObserver | null = null
  let appMounted = false

  function cleanup() {
    observer?.disconnect()
    observer = null
    controllers.forEach((controller, element) => {
      controller.kill()
      delete element.dataset.shuffleEnhanced
      const parent = element.parentElement
      if (parent instanceof HTMLAnchorElement) {
        delete parent.dataset.shuffleEnhanced
      }
    })
    controllers.clear()
  }

  function scan(root: ParentNode = document) {
    if (!getMotionCapabilitiesSnapshot().animations) return

    for (const link of collectShuffleLinks(root)) {
      if (controllers.has(link)) continue
      const controller = enhanceLinkForShuffle(link)
      if (controller) controllers.set(link, controller)
    }
  }

  function mountObserver() {
    observer?.disconnect()
    observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return
          if (node.matches('a[data-hover-shuffle]') || node.querySelector('a')) {
            scan(node)
          }
        })
      }
    })
    observer.observe(document.body, { childList: true, subtree: true })
  }

  function bootstrap() {
    cleanup()
    scan()
    mountObserver()
  }

  function deferAfterHydration(run: () => void) {
    requestAnimationFrame(() => {
      requestAnimationFrame(run)
    })
  }

  nuxtApp.hook('app:mounted', () => {
    appMounted = true
    deferAfterHydration(() => {
      bootstrap()
      window.addEventListener('motion:degraded', cleanup)
    })
  })

  nuxtApp.hook('page:finish', async () => {
    if (!appMounted) return

    await nextTick()
    deferAfterHydration(() => {
      const main = document.querySelector(MAIN_SHUFFLE_ZONE)
      if (main) scan(main)
    })
  })
})
