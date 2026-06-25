<script setup lang="ts">
import { defineAsyncComponent, ref, computed, watch, nextTick } from 'vue'
import { fetchProducts } from '@/data/api'
import type { Product } from '@/data/schemas'
import ProductCard from '@/components/product/ProductCard.vue'
import ScrollSection from '@/components/scroll/ScrollSection.vue'
import ScrollReveal from '@/components/scroll/ScrollReveal.vue'
import MaskReveal from '@/components/scroll/MaskReveal.vue'
import MarqueeBand from '@/components/scroll/MarqueeBand.vue'
import CyclingText from '@/components/scroll/CyclingText.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import LazyImage from '@/components/ui/LazyImage.vue'
import { useGsapTimeline } from '@/composables/useGsapTimeline'
import {
  createHeroEnterTimeline,
  createHeroMaskLines,
  createNarrativeScrub,
  createClipImageReveal,
  createScaleFadeReveal,
} from '@/lib/scroll/animation'
import { useLocale } from '@/composables/useLocale'

usePageSeo('meta.home')

const WebGLRevealMask = defineAsyncComponent(
  () => import('@/components/scroll/WebGLRevealMask.vue'),
)

const { t, locale, localizedPath } = useLocale()

const { data: productsResult, pending: loadingFeatured } = await useAsyncData(
  () => `home-featured-${locale.value}`,
  () => fetchProducts(),
  { watch: [locale] },
)

const featured = computed(
  () => productsResult.value?.data?.filter((product: Product) => product.featured) ?? [],
)

watch(loadingFeatured, async (isLoading) => {
  if (!isLoading) {
    await nextTick()
  }
})

const marqueeItems = computed(() => [
  t('home.marquee.craftsmanship'),
  t('home.marquee.sustainability'),
  t('home.marquee.shipping'),
  t('home.marquee.curated'),
  t('home.marquee.artisan'),
])

const cyclingPhrases = computed(() => [
  t('home.hero.cycling1'),
  t('home.hero.cycling2'),
  t('home.hero.cycling3'),
])

const heroEyebrowRef = ref<HTMLElement | null>(null)
const heroTitleRef = ref<HTMLElement | null>(null)
const heroSubtitleRef = ref<HTMLElement | null>(null)
const heroCtaRef = ref<HTMLElement | null>(null)
const narrativeSectionRef = ref<HTMLElement | null>(null)
const narrativeInnerRef = ref<HTMLElement | null>(null)
const philosophyImageRef = ref<HTMLElement | null>(null)
const philosophyImageInnerRef = ref<HTMLElement | null>(null)
const featuredGridRef = ref<HTMLElement | null>(null)

useGsapTimeline(() => {
  createHeroEnterTimeline({
    eyebrow: heroEyebrowRef.value,
    subtitle: heroSubtitleRef.value,
    cta: heroCtaRef.value,
  })
  if (heroTitleRef.value) {
    createHeroMaskLines(heroTitleRef.value, { stagger: 0.1, delay: 0.2 })
  }
})

useGsapTimeline(
  () => {
    if (narrativeSectionRef.value && narrativeInnerRef.value) {
      createNarrativeScrub(narrativeSectionRef.value, narrativeInnerRef.value)
    }
  },
  { watchSource: narrativeSectionRef },
)

useGsapTimeline(
  () => {
    if (philosophyImageRef.value && philosophyImageInnerRef.value) {
      createClipImageReveal(philosophyImageRef.value, philosophyImageInnerRef.value)
    }
  },
  { watchSource: philosophyImageRef },
)

useGsapTimeline(
  () => {
    if (featuredGridRef.value) {
      createScaleFadeReveal(featuredGridRef.value, '[data-featured-card]')
    }
  },
  {
    watchSource: computed(
      () => !loadingFeatured.value && featuredGridRef.value && featured.value.length,
    ),
  },
)
</script>

<template>
  <div class="pt-[var(--header-height)]">
    <section class="relative min-h-screen overflow-hidden flex items-end pb-24 px-6">
      <ClientOnly>
        <WebGLRevealMask />
      </ClientOnly>
      <ScrollReveal
        tag="div"
        :speed="-0.35"
        class="absolute inset-0 z-0 min-h-screen overflow-hidden"
      >
        <LazyImage
          src="/images/hero.jpg"
          :alt="t('home.hero.imageAlt')"
          :lazy="false"
          aspect="4/3"
          class="!h-full min-h-screen w-full scale-110"
        />
        <div
          class="absolute inset-0 bg-gradient-to-t from-brand-950/60 via-brand-950/20 to-transparent"
        />
      </ScrollReveal>
      <div class="relative z-10 mx-auto max-w-7xl w-full">
        <p ref="heroEyebrowRef" class="text-brand-200 text-sm uppercase tracking-[0.3em] mb-4">
          <CyclingText :phrases="cyclingPhrases" tag="span" />
          <span class="mx-2 opacity-40">—</span>
          {{ t('home.hero.eyebrow') }}
        </p>
        <h1
          ref="heroTitleRef"
          class="font-display text-5xl md:text-7xl lg:text-8xl text-brand-50 max-w-3xl leading-[0.95]"
        >
          <span class="mask-line-wrap">
            <span data-mask-line>{{ t('home.hero.titleLine1') }}</span>
          </span>
          <span class="mask-line-wrap">
            <span data-mask-line>{{ t('home.hero.titleLine2') }}</span>
          </span>
        </h1>
        <p ref="heroSubtitleRef" class="text-brand-200 text-lg mt-6 max-w-xl">
          {{ t('home.hero.subtitle') }}
        </p>
        <div ref="heroCtaRef" class="mt-10 flex gap-4">
          <NuxtLink :to="localizedPath('/products')">
            <BaseButton size="lg">
              {{ t('home.hero.cta') }}
            </BaseButton>
          </NuxtLink>
        </div>
      </div>
      <div class="absolute bottom-0 left-0 right-0 z-10 h-0.5 bg-white/20">
        <div class="hero-progress-bar h-full bg-white" data-scroll data-scroll-css-progress />
      </div>
    </section>

    <MarqueeBand :items="marqueeItems" speed="slow" />

    <ScrollSection class="py-32 px-6 bg-brand-50">
      <div class="mx-auto max-w-7xl grid md:grid-cols-2 gap-16 items-center">
        <MaskReveal tag="div">
          <p class="text-xs uppercase tracking-widest text-brand-500 mb-4">
            <span class="mask-line-wrap">
              <span data-mask-line>{{ t('home.philosophy.eyebrow') }}</span>
            </span>
          </p>
          <h2 class="font-display text-4xl md:text-5xl text-brand-900 leading-tight">
            <span class="mask-line-wrap">
              <span data-mask-line>{{ t('home.philosophy.titleLine1') }}</span>
            </span>
            <span class="mask-line-wrap">
              <span data-mask-line>{{ t('home.philosophy.titleLine2') }}</span>
            </span>
          </h2>
          <p class="text-brand-600 mt-6 leading-relaxed">
            {{ t('home.philosophy.body') }}
          </p>
        </MaskReveal>
        <div ref="philosophyImageRef">
          <ScrollReveal :speed="0.15">
            <div ref="philosophyImageInnerRef" class="overflow-hidden">
              <LazyImage
                src="/images/philosophy.jpg"
                :alt="t('home.philosophy.imageAlt')"
                aspect="4/5"
              />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </ScrollSection>

    <section class="py-32 px-6 bg-brand-100">
      <div class="mx-auto max-w-7xl">
        <ScrollReveal variant="scale" class="text-center mb-16">
          <p class="text-xs uppercase tracking-widest text-brand-500 mb-2">
            {{ t('home.featured.eyebrow') }}
          </p>
          <h2 class="font-display text-4xl text-brand-900">
            {{ t('home.featured.title') }}
          </h2>
        </ScrollReveal>
        <div ref="featuredGridRef" class="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="product in featured" :key="product.id" data-featured-card>
            <ProductCard :product="product" />
          </div>
        </div>
        <p
          v-if="!loadingFeatured && featured.length === 0"
          class="text-center text-brand-500 text-sm"
        >
          {{ t('catalog.subtitle') }}
        </p>
        <ScrollReveal variant="scale" class="text-center mt-16">
          <NuxtLink :to="localizedPath('/products')">
            <BaseButton variant="secondary">
              {{ t('home.featured.viewAll') }}
            </BaseButton>
          </NuxtLink>
        </ScrollReveal>
      </div>
    </section>

    <MarqueeBand :items="marqueeItems" reverse speed="fast" />

    <ScrollSection sticky class="min-h-[120vh]">
      <section
        ref="narrativeSectionRef"
        class="sticky top-[var(--header-height)] min-h-[calc(100vh-var(--header-height))] flex items-center px-6 bg-brand-900"
      >
        <div
          ref="narrativeInnerRef"
          class="mx-auto max-w-7xl grid md:grid-cols-2 gap-12 items-center w-full"
        >
          <MaskReveal tag="div">
            <p class="text-brand-400 text-xs uppercase tracking-widest mb-4">
              <span class="mask-line-wrap">
                <span data-mask-line>{{ t('home.narrative.eyebrow') }}</span>
              </span>
            </p>
            <h2 class="font-display text-4xl md:text-5xl text-brand-50">
              <span class="mask-line-wrap">
                <span data-mask-line>{{ t('home.narrative.title') }}</span>
              </span>
            </h2>
            <p class="text-brand-300 mt-6 leading-relaxed">
              {{ t('home.narrative.body') }}
            </p>
          </MaskReveal>
          <ScrollReveal variant="clip" :speed="0.12" class="hidden md:block">
            <LazyImage
              src="/images/narrative-sofa.jpg"
              :alt="t('home.narrative.imageAlt')"
              aspect="4/3"
            />
          </ScrollReveal>
        </div>
      </section>
    </ScrollSection>

    <section class="py-32 px-6 text-center bg-brand-50">
      <MaskReveal tag="div" class="mx-auto max-w-2xl">
        <h2 class="font-display text-4xl text-brand-900 mb-6">
          <span class="mask-line-wrap">
            <span data-mask-line>{{ t('home.cta.title') }}</span>
          </span>
        </h2>
        <p class="text-brand-600 mb-10">
          {{ t('home.cta.body') }}
        </p>
        <NuxtLink :to="localizedPath('/products')">
          <BaseButton size="lg">
            {{ t('home.cta.button') }}
          </BaseButton>
        </NuxtLink>
      </MaskReveal>
    </section>
  </div>
</template>
