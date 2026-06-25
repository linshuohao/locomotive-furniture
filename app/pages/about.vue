<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import ScrollSection from '@/components/scroll/ScrollSection.vue'
import ScrollReveal from '@/components/scroll/ScrollReveal.vue'
import MaskReveal from '@/components/scroll/MaskReveal.vue'
import MarqueeBand from '@/components/scroll/MarqueeBand.vue'
import MagneticButton from '@/components/ui/MagneticButton.vue'
import LazyImage from '@/components/ui/LazyImage.vue'
import { useLocale } from '@/composables/useLocale'
import { staticImages } from '@/lib/assets/paths'

const TeamScene3D = defineAsyncComponent(() => import('@/components/scroll/TeamScene3D.vue'))

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
        <ScrollReveal variant="clip">
          <LazyImage
            :src="staticImages.pages.about"
            :alt="t('about.imageAlt')"
            aspect="4/5"
          />
        </ScrollReveal>
      </div>
    </ScrollSection>

    <section
      class="about-team py-24 px-6 bg-brand-950"
      data-scroll
      data-scroll-css-progress
      data-scroll-offset="0,0"
    >
      <div class="mx-auto max-w-7xl grid md:grid-cols-2 gap-16 items-center">
        <ClientOnly>
          <TeamScene3D class="about-team__scene" />
        </ClientOnly>
        <div>
          <MaskReveal tag="div">
            <p class="text-brand-400 text-xs uppercase tracking-[0.28em] mb-4">
              <span class="mask-line-wrap">
                <span data-mask-line>{{ t('about.teamEyebrow') }}</span>
              </span>
            </p>
            <h2 class="font-display type-section-mega text-brand-50 mb-6">
              <span class="mask-line-wrap">
                <span data-mask-line>{{ t('about.teamTitle') }}</span>
              </span>
            </h2>
          </MaskReveal>
          <p class="text-brand-300 leading-relaxed max-w-md">
            {{ t('about.teamBody') }}
          </p>
        </div>
      </div>
    </section>

    <section class="py-24 px-6 bg-brand-100 text-center">
      <ScrollReveal
        variant="scale"
        class="mx-auto max-w-2xl"
      >
        <h2 class="font-display text-3xl text-brand-900 mb-6">
          {{ t('about.ctaTitle') }}
        </h2>
        <MagneticButton
          :to="localizedPath('/products')"
          size="lg"
        >
          {{ t('about.ctaButton') }}
        </MagneticButton>
      </ScrollReveal>
    </section>
  </div>
</template>

<style scoped>
.about-team__scene {
  box-shadow: 0 28px 72px rgb(0 0 0 / 0.4);
}
</style>
