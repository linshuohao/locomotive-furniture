<script setup lang="ts">
import ScrollSection from '@/components/scroll/ScrollSection.vue'
import ScrollReveal from '@/components/scroll/ScrollReveal.vue'
import LazyImage from '@/components/ui/LazyImage.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { RouterLink } from 'vue-router'
import { useLocale } from '@/composables/useLocale'

const { t, localizedPath } = useLocale()
</script>

<template>
  <div class="pt-[var(--header-height)]">
    <section class="min-h-[70vh] flex items-center px-6 bg-brand-900">
      <div class="mx-auto max-w-4xl text-center">
        <ScrollReveal class="text-brand-400 text-xs uppercase tracking-[0.3em] mb-6" tag="p">
          {{ t('about.eyebrow') }}
        </ScrollReveal>
        <ScrollReveal
          offset="0,120px"
          class="font-display text-5xl md:text-6xl text-brand-50"
          tag="h1"
        >
          {{ t('about.title') }}
        </ScrollReveal>
      </div>
    </section>

    <ScrollSection class="py-24 px-6">
      <div class="mx-auto max-w-7xl grid md:grid-cols-2 gap-16 items-center">
        <ScrollReveal>
          <h2 class="font-display text-3xl text-brand-900 mb-6">
            {{ t('about.storyTitle') }}
          </h2>
          <p class="text-brand-600 leading-relaxed mb-4">
            {{ t('about.storyP1') }}
          </p>
          <p class="text-brand-600 leading-relaxed">
            {{ t('about.storyP2') }}
          </p>
        </ScrollReveal>
        <ScrollReveal :speed="0.2">
          <LazyImage src="/images/about.jpg" :alt="t('about.imageAlt')" aspect="4/5" />
        </ScrollReveal>
      </div>
    </ScrollSection>

    <section class="py-24 px-6 bg-brand-100 text-center">
      <ScrollReveal class="mx-auto max-w-2xl">
        <h2 class="font-display text-3xl text-brand-900 mb-6">
          {{ t('about.ctaTitle') }}
        </h2>
        <RouterLink :to="localizedPath('/products')">
          <BaseButton size="lg">
            {{ t('about.ctaButton') }}
          </BaseButton>
        </RouterLink>
      </ScrollReveal>
    </section>
  </div>
</template>
