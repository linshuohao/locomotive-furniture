<script setup lang="ts">
import { inject, onMounted } from 'vue'
import { scrollInjectionKey } from '@/composables/useLocomotiveScroll'

withDefaults(
  defineProps<{
    speed?: number
    offset?: string
    cssProgress?: boolean
    scrollClass?: string
    tag?: string
    /** default | clip | scale — Locomotive-style reveal variants */
    variant?: 'default' | 'clip' | 'scale'
  }>(),
  {
    offset: '0,100px',
    scrollClass: 'is-inview',
    tag: 'div',
    variant: 'default',
    speed: undefined,
  },
)

const scroll = inject(scrollInjectionKey, null)

function notifyResize() {
  void scroll?.update()
}

onMounted(() => {
  notifyResize()
})
</script>

<template>
  <component
    :is="tag"
    data-scroll
    :data-scroll-offset="offset"
    v-bind="speed !== undefined ? { 'data-scroll-speed': speed } : {}"
    :data-scroll-class="scrollClass"
    :data-scroll-css-progress="cssProgress ? '' : undefined"
    class="scroll-reveal"
    :class="variant !== 'default' ? `scroll-reveal--${variant}` : undefined"
  >
    <div v-if="variant === 'clip'" class="scroll-reveal__inner">
      <slot />
    </div>
    <slot v-else />
  </component>
</template>
