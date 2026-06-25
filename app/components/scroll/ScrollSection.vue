<script setup lang="ts">
defineProps<{
  /** Prefer data-scroll-css-progress over speed parallax (see docs/RESEARCH.md) */
  speed?: number
  sticky?: boolean
}>()
</script>

<template>
  <section
    :data-scroll="sticky ? undefined : ''"
    :data-scroll-sticky="sticky ? '' : undefined"
    v-bind="speed !== undefined ? { 'data-scroll-speed': speed } : {}"
    class="relative w-full"
  >
    <slot></slot>
  </section>
</template>
