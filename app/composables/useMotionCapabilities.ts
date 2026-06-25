import { ref, onMounted, onUnmounted } from 'vue'
import {
  getMotionCapabilitiesSnapshot,
  SSR_MOTION_CAPABILITIES,
  type MotionCapabilities,
} from '@/lib/motion/motionCapabilities'

export function useMotionCapabilities() {
  const capabilities = ref<MotionCapabilities>(SSR_MOTION_CAPABILITIES)

  function refresh() {
    capabilities.value = getMotionCapabilitiesSnapshot()
  }

  let mq: MediaQueryList | null = null

  onMounted(() => {
    refresh()
    mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    mq.addEventListener('change', refresh)
    window.addEventListener('resize', refresh)
    window.addEventListener('motion:degraded', refresh)
  })

  onUnmounted(() => {
    mq?.removeEventListener('change', refresh)
    window.removeEventListener('resize', refresh)
    window.removeEventListener('motion:degraded', refresh)
  })

  return { capabilities, refresh }
}
