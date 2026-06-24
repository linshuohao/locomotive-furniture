<script setup lang="ts">
defineProps<{
  speed?: number
  sticky?: boolean
}>()
</script>

<template>
  <section
    :data-scroll="sticky ? undefined : ''"
    :data-scroll-sticky="sticky ? '' : undefined"
    :data-scroll-speed="speed"
    class="relative w-full"
  >
    <slot />
  </section>
</template>
