<script setup lang="ts">
import HoverShuffleText from '@/components/scroll/HoverShuffleText.vue'
import type { HoverTextEffect } from '@/lib/scroll/animation'

withDefaults(
  defineProps<{
    to: string
    text?: string
    effect?: HoverTextEffect
  }>(),
  {
    text: undefined,
    effect: 'shuffle',
  },
)
</script>

<template>
  <NuxtLink
    :to="to"
    data-hover-shuffle
    class="shuffle-link"
  >
    <HoverShuffleText
      v-if="text"
      :text="text"
      :effect="effect"
      tag="span"
    />
    <slot v-else></slot>
  </NuxtLink>
</template>
