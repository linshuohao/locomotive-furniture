<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useImageTilt3d } from '@/composables/useImageTilt3d'
import { useLayoutInvalidation } from '@/composables/useLayoutInvalidation'

const props = withDefaults(
  defineProps<{
    variant?: 'default' | 'hero' | 'subtle'
    maxRotateX?: number
    maxRotateY?: number
    scale?: number
    depth?: number
  }>(),
  {
    variant: 'default',
    maxRotateX: undefined,
    maxRotateY: undefined,
    scale: undefined,
    depth: undefined,
  },
)

const rootRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)
const innerRef = ref<HTMLElement | null>(null)

const presets = {
  hero: { maxRotateX: 9, maxRotateY: 13, scale: 1.06, depth: 34 },
  default: { maxRotateX: 10, maxRotateY: 14, scale: 1.05, depth: 22 },
  subtle: { maxRotateX: 6, maxRotateY: 9, scale: 1.03, depth: 14 },
} as const

const preset = presets[props.variant]
const invalidateLayout = useLayoutInvalidation()

useImageTilt3d(rootRef, panelRef, innerRef, {
  maxRotateX: props.maxRotateX ?? preset.maxRotateX,
  maxRotateY: props.maxRotateY ?? preset.maxRotateY,
  scale: props.scale ?? preset.scale,
  depth: props.depth ?? preset.depth,
})

onMounted(() => {
  void invalidateLayout()
})
</script>

<template>
  <div
    ref="rootRef"
    class="image-tilt-3d"
    :class="`image-tilt-3d--${variant}`"
  >
    <div
      ref="panelRef"
      class="image-tilt-3d__panel"
    >
      <div
        ref="innerRef"
        class="image-tilt-3d__inner"
      >
        <slot></slot>
      </div>
    </div>
    <div
      class="image-tilt-3d__glare"
      aria-hidden="true"
    ></div>
  </div>
</template>
