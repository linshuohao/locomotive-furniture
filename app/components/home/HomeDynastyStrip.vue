<script setup lang="ts">
import HoverShuffleText from '@/components/scroll/HoverShuffleText.vue'
import { useLocale } from '@/composables/useLocale'

const { t, localizedPath } = useLocale()
</script>

<template>
  <div
    class="dynasty-strip"
    data-scroll
    data-scroll-css-progress
    data-scroll-offset="0,0"
  >
    <div class="dynasty-strip__inner mx-auto max-w-7xl">
      <span class="dynasty-strip__label type-eyebrow">
        <HoverShuffleText
          :text="t('home.dynasty.years')"
          effect="slide"
          tag="span"
        />
      </span>
      <NuxtLink
        :to="localizedPath('/products')"
        class="dynasty-strip__mega font-display dynasty-strip__mega-link"
      >
        <HoverShuffleText
          :text="t('home.dynasty.tagline')"
          effect="pop"
          tag="span"
        />
      </NuxtLink>
    </div>
  </div>
</template>
