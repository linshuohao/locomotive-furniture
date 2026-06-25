import { trackPageView, initErrorTracking } from '@/lib/analytics/analytics'
import { initWebVitals } from '@/lib/analytics/webVitals'

export default defineNuxtPlugin(() => {
  const router = useRouter()

  initWebVitals()
  initErrorTracking()

  router.afterEach((to) => {
    trackPageView(to.fullPath)
  })
})
