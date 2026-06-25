<script setup lang="ts">
import { inject, onMounted } from 'vue'
import { scrollInjectionKey } from '@/composables/useLocomotiveScroll'

const props = withDefaults(
  defineProps<{
    speed?: number
    offset?: string
    cssProgress?: boolean
    scrollClass?: string
    tag?: string
  }>(),
  {
    offset: '0,100px',
    scrollClass: 'is-inview',
    tag: 'div',
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
  >
    <slot />
  </component>
</template>
