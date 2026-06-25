<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    text: string
    tag?: string
  }>(),
  {
    tag: 'span',
  },
)

const chars = computed(() => [...props.text])
</script>

<template>
  <component
    :is="tag"
    class="split-text"
  >
    <span
      v-for="(char, index) in chars"
      :key="`${index}-${char}`"
      data-split-char
      class="split-text__char inline-block"
      :style="{ '--char-i': index }"
      :aria-hidden="char === ' ' ? true : undefined"
    >
      {{ char === ' ' ? '\u00A0' : char }}
    </span>
  </component>
</template>

<style scoped>
.split-text__char {
  will-change: transform;
}

@media (prefers-reduced-motion: reduce) {
  .split-text__char {
    will-change: auto;
  }
}
</style>
