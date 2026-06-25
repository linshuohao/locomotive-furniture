<script setup lang="ts">
import { ref } from 'vue'
import { useGsapTimeline } from '@/composables/useGsapTimeline'
import { createHeroMaskLines, createMaskLineReveal } from '@/lib/scroll/animation'

const props = withDefaults(
  defineProps<{
    tag?: string
    /** Mount-only (hero) vs scroll-triggered */
    hero?: boolean
    stagger?: number
    delay?: number
  }>(),
  {
    tag: 'div',
    hero: false,
    stagger: 0.08,
    delay: 0,
  },
)

const rootRef = ref<HTMLElement | null>(null)

useGsapTimeline(
  () => {
    if (!rootRef.value) return
    if (props.hero) {
      createHeroMaskLines(rootRef.value, { stagger: props.stagger, delay: props.delay })
    } else {
      createMaskLineReveal(rootRef.value, { stagger: props.stagger, delay: props.delay })
    }
  },
  { watchSource: rootRef },
)
</script>

<template>
  <component :is="tag" ref="rootRef" class="mask-reveal">
    <slot />
  </component>
</template>

<style scoped>
.mask-reveal :deep([data-mask-line]) {
  display: block;
  will-change: transform;
}
</style>
