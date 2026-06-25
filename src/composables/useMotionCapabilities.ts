import { ref, onMounted, onUnmounted } from 'vue'
import { getMotionCapabilitiesSnapshot, type MotionCapabilities } from '@/lib/motion/motionCapabilities'

export function useMotionCapabilities() {
  const capabilities = ref<MotionCapabilities>(getMotionCapabilitiesSnapshot())

  function refresh() {
    capabilities.value = getMotionCapabilitiesSnapshot()
  }

  let mq: MediaQueryList | null = null

  onMounted(() => {
    mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    mq.addEventListener('change', refresh)
    window.addEventListener('resize', refresh)
  })

  onUnmounted(() => {
    mq?.removeEventListener('change', refresh)
    window.removeEventListener('resize', refresh)
  })

  return { capabilities, refresh }
}
