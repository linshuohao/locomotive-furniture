<script setup lang="ts">
import CharReveal from '@/components/scroll/CharReveal.vue'
import HoverShuffleText from '@/components/scroll/HoverShuffleText.vue'
import ShuffleLink from '@/components/ui/ShuffleLink.vue'
import { useLocale } from '@/composables/useLocale'

const { t, localizedPath } = useLocale()
</script>

<template>
  <section
    class="home-agency section-pad px-6 bg-brand-50"
    data-scroll
    data-scroll-css-progress
    data-scroll-offset="0,0"
  >
    <div class="mx-auto max-w-7xl">
      <CharReveal tag="div">
        <p class="home-agency__body text-brand-700 leading-relaxed max-w-2xl text-base md:text-lg">
          <HoverShuffleText
            :text="t('home.agency.body')"
            effect="slide"
            tag="span"
          />
        </p>
      </CharReveal>

      <div
        class="home-agency__links mt-16 md:mt-28 flex flex-col sm:flex-row gap-6 sm:gap-12 lg:gap-20"
      >
        <ShuffleLink
          :to="localizedPath('/products')"
          :text="t('home.agency.collection')"
          effect="shuffle"
          class="home-agency__link font-display"
        />
        <ShuffleLink
          :to="localizedPath('/about')"
          :text="t('home.agency.about')"
          effect="skew"
          class="home-agency__link font-display"
        />
      </div>
    </div>
  </section>
</template>
