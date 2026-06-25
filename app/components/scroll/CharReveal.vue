<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGsapTimeline } from '@/composables/useGsapTimeline'
import { createHeroCharReveal, createSplitCharReveal } from '@/lib/scroll/animation'

const props = withDefaults(
  defineProps<{
    tag?: string
    hero?: boolean
    stagger?: number
    delay?: number
    /** Gate hero / mount-only reveals until parent signals ready (e.g. intro curtain) */
    ready?: boolean
  }>(),
  {
    tag: 'div',
    hero: false,
    stagger: 0.018,
    delay: 0,
    ready: true,
  },
)

const rootRef = ref<HTMLElement | null>(null)

const canAnimate = computed(() => props.ready && rootRef.value)

useGsapTimeline(
  () => {
    if (!rootRef.value) return
    if (props.hero) {
      createHeroCharReveal(rootRef.value, { stagger: props.stagger, delay: props.delay })
    } else {
      createSplitCharReveal(rootRef.value, { stagger: props.stagger, delay: props.delay })
    }
  },
  { watchSource: canAnimate },
)
</script>

<template>
  <component
    :is="tag"
    ref="rootRef"
    class="char-reveal"
  >
    <slot></slot>
  </component>
</template>
