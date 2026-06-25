import { trackPageView, initErrorTracking } from '@/lib/analytics/analytics'
import { flushAnalytics } from '@/lib/analytics/transport'
import { initWebVitals } from '@/lib/analytics/webVitals'

export default defineNuxtPlugin(() => {
  const router = useRouter()

  initWebVitals()
  initErrorTracking()

  router.afterEach((to) => {
    trackPageView(to.fullPath)
  })

  window.addEventListener('pagehide', () => {
    void flushAnalytics()
  })
})
