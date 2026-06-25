<script setup lang="ts">
import { computed } from 'vue'
import ScrollSection from '@/components/scroll/ScrollSection.vue'
import ScrollReveal from '@/components/scroll/ScrollReveal.vue'
import MaskReveal from '@/components/scroll/MaskReveal.vue'
import MarqueeBand from '@/components/scroll/MarqueeBand.vue'
import LazyImage from '@/components/ui/LazyImage.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useLocale } from '@/composables/useLocale'

usePageSeo('meta.about')

const { t, localizedPath } = useLocale()

const marqueeItems = computed(() => [
  t('home.marquee.craftsmanship'),
  t('home.marquee.sustainability'),
  t('home.marquee.shipping'),
  t('home.marquee.curated'),
  t('home.marquee.artisan'),
])
</script>

<template>
  <div class="pt-[var(--header-height)]">
    <section class="min-h-[70vh] flex items-center px-6 bg-brand-900">
      <div class="mx-auto max-w-4xl text-center">
        <MaskReveal
          tag="p"
          class="text-brand-400 text-xs uppercase tracking-[0.3em] mb-6"
        >
          <span class="mask-line-wrap">
            <span data-mask-line>{{ t('about.eyebrow') }}</span>
          </span>
        </MaskReveal>
        <MaskReveal
          tag="h1"
          class="font-display text-5xl md:text-6xl text-brand-50"
          hero
        >
          <span class="mask-line-wrap">
            <span data-mask-line>{{ t('about.title') }}</span>
          </span>
        </MaskReveal>
      </div>
    </section>

    <MarqueeBand :items="marqueeItems" />

    <ScrollSection class="py-24 px-6">
      <div class="mx-auto max-w-7xl grid md:grid-cols-2 gap-16 items-center">
        <MaskReveal tag="div">
          <h2 class="font-display text-3xl text-brand-900 mb-6">
            <span class="mask-line-wrap">
              <span data-mask-line>{{ t('about.storyTitle') }}</span>
            </span>
          </h2>
          <p class="text-brand-600 leading-relaxed mb-4">
            {{ t('about.storyP1') }}
          </p>
          <p class="text-brand-600 leading-relaxed">
            {{ t('about.storyP2') }}
          </p>
        </MaskReveal>
        <ScrollReveal
          variant="clip"
          :speed="0.2"
        >
          <LazyImage
            src="/images/about.jpg"
            :alt="t('about.imageAlt')"
            aspect="4/5"
          />
        </ScrollReveal>
      </div>
    </ScrollSection>

    <section class="py-24 px-6 bg-brand-100 text-center">
      <ScrollReveal
        variant="scale"
        class="mx-auto max-w-2xl"
      >
        <h2 class="font-display text-3xl text-brand-900 mb-6">
          {{ t('about.ctaTitle') }}
        </h2>
        <NuxtLink :to="localizedPath('/products')">
          <BaseButton size="lg">
            {{ t('about.ctaButton') }}
          </BaseButton>
        </NuxtLink>
      </ScrollReveal>
    </section>
  </div>
</template>
