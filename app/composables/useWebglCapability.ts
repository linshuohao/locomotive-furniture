import { computed } from 'vue'
import { useMotionCapabilities } from '@/composables/useMotionCapabilities'

/** Shared WebGL capability gate for canvas-based scenes */
export function useWebglCapability() {
  const { capabilities } = useMotionCapabilities()
  return computed(() => capabilities.value.webgl)
}
