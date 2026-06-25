<script setup lang="ts">
import CharReveal from '@/components/scroll/CharReveal.vue'
import HoverShuffleText from '@/components/scroll/HoverShuffleText.vue'
import { useLocale } from '@/composables/useLocale'

const { t } = useLocale()
</script>

<template>
  <section
    class="home-manifesto section-pad px-6 bg-brand-50"
    data-scroll
    data-scroll-css-progress
    data-scroll-offset="0,0"
  >
    <div class="mx-auto max-w-7xl">
      <CharReveal tag="div">
        <p class="home-manifesto__body font-display">
          <span class="home-manifesto__mark">
            <HoverShuffleText
              :text="t('home.manifesto.mark')"
              effect="pop"
              tag="span"
            />
          </span>
          <HoverShuffleText
            :text="t('home.manifesto.body')"
            effect="wave"
            tag="span"
          />
          <span class="home-manifesto__mark home-manifesto__mark--end">
            <HoverShuffleText
              :text="t('home.manifesto.markEnd')"
              effect="pop"
              tag="span"
            />
          </span>
        </p>
      </CharReveal>
    </div>
  </section>
</template>
