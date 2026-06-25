<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue'
import { products } from '@/data/products'
import ProductCard from '@/components/product/ProductCard.vue'
import ScrollSection from '@/components/scroll/ScrollSection.vue'
import ScrollReveal from '@/components/scroll/ScrollReveal.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import LazyImage from '@/components/ui/LazyImage.vue'
import { RouterLink } from 'vue-router'
import { useGsapTimeline } from '@/composables/useGsapTimeline'
import { createHeroEnterTimeline, createNarrativeScrub } from '@/lib/scroll/animation'

const WebGLRevealMask = defineAsyncComponent(
  () => import('@/components/scroll/WebGLRevealMask.vue'),
)

const featured = products.filter((p) => p.featured)

const heroEyebrowRef = ref<HTMLElement | null>(null)
const heroTitleRef = ref<HTMLElement | null>(null)
const heroSubtitleRef = ref<HTMLElement | null>(null)
const heroCtaRef = ref<HTMLElement | null>(null)
const narrativeSectionRef = ref<HTMLElement | null>(null)
const narrativeInnerRef = ref<HTMLElement | null>(null)

useGsapTimeline(() => {
  createHeroEnterTimeline({
    eyebrow: heroEyebrowRef.value,
    title: heroTitleRef.value,
    subtitle: heroSubtitleRef.value,
    cta: heroCtaRef.value,
  })
})

useGsapTimeline(
  () => {
    if (narrativeSectionRef.value && narrativeInnerRef.value) {
      createNarrativeScrub(narrativeSectionRef.value, narrativeInnerRef.value)
    }
  },
  { watchSource: narrativeSectionRef },
)
</script>

<template>
  <div class="pt-[var(--header-height)]">
    <!-- Hero -->
    <section class="relative min-h-screen flex items-end pb-24 px-6">
      <WebGLRevealMask />
      <ScrollReveal tag="div" :speed="-0.35" class="absolute inset-0 z-0 min-h-screen overflow-hidden">
        <LazyImage
          src="/images/hero.jpg"
          alt="Minimal luxury living room"
          :lazy="false"
          aspect="4/3"
          class="!h-full min-h-screen w-full"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-brand-950/60 via-brand-950/20 to-transparent" />
      </ScrollReveal>
      <!-- Hero copy: plain elements for GSAP (not wrapped in ScrollReveal to avoid double-hide) -->
      <div class="relative z-10 mx-auto max-w-7xl w-full">
        <p
          ref="heroEyebrowRef"
          class="text-brand-200 text-sm uppercase tracking-[0.3em] mb-4"
        >
          Cross-border furniture
        </p>
        <h1
          ref="heroTitleRef"
          class="font-display text-5xl md:text-7xl lg:text-8xl text-brand-50 max-w-3xl leading-tight"
        >
          Design that lives with you
        </h1>
        <p ref="heroSubtitleRef" class="text-brand-200 text-lg mt-6 max-w-xl">
          Ten curated pieces. Timeless forms, sustainable materials, delivered to your door.
        </p>
        <div ref="heroCtaRef" class="mt-10 flex gap-4">
          <RouterLink to="/products">
            <BaseButton size="lg">Explore Collection</BaseButton>
          </RouterLink>
        </div>
      </div>
      <div class="absolute bottom-0 left-0 right-0 z-10 h-0.5 bg-white/20">
        <div class="hero-progress-bar h-full bg-white" data-scroll data-scroll-css-progress />
      </div>
    </section>

    <!-- Narrative block -->
    <ScrollSection class="py-32 px-6 bg-brand-50">
      <div class="mx-auto max-w-7xl grid md:grid-cols-2 gap-16 items-center">
        <ScrollReveal>
          <p class="text-xs uppercase tracking-widest text-brand-500 mb-4">Our philosophy</p>
          <h2 class="font-display text-4xl md:text-5xl text-brand-900 leading-tight">
            Less clutter.<br />More character.
          </h2>
          <p class="text-brand-600 mt-6 leading-relaxed">
            We believe in fewer, better things. Each piece in our collection is selected for
            craftsmanship, longevity, and the quiet confidence it brings to your space.
          </p>
        </ScrollReveal>
        <ScrollReveal :speed="0.15">
          <LazyImage
            src="/images/philosophy.jpg"
            alt="Craftsmanship detail"
            aspect="4/5"
          />
        </ScrollReveal>
      </div>
    </ScrollSection>

    <!-- Featured products -->
    <section class="py-32 px-6 bg-brand-100">
      <div class="mx-auto max-w-7xl">
        <ScrollReveal class="text-center mb-16">
          <p class="text-xs uppercase tracking-widest text-brand-500 mb-2">Featured</p>
          <h2 class="font-display text-4xl text-brand-900">The Collection</h2>
        </ScrollReveal>
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <ScrollReveal
            v-for="(product, index) in featured"
            :key="product.id"
            :style="{ transitionDelay: `${index * 0.08}s` }"
          >
            <ProductCard :product="product" />
          </ScrollReveal>
        </div>
        <ScrollReveal class="text-center mt-16">
          <RouterLink to="/products">
            <BaseButton variant="secondary">View All 10 Pieces</BaseButton>
          </RouterLink>
        </ScrollReveal>
      </div>
    </section>

    <!-- Narrative — Locomotive sticky (no GSAP pin) + subtle scrub -->
    <ScrollSection sticky class="min-h-[120vh]">
      <section
        ref="narrativeSectionRef"
        class="sticky top-[var(--header-height)] min-h-[calc(100vh-var(--header-height))] flex items-center px-6 bg-brand-900"
      >
        <div
          ref="narrativeInnerRef"
          class="mx-auto max-w-7xl grid md:grid-cols-2 gap-12 items-center w-full"
        >
          <ScrollReveal>
            <p class="text-brand-400 text-xs uppercase tracking-widest mb-4">Crafted globally</p>
            <h2 class="font-display text-4xl md:text-5xl text-brand-50">
              From workshop to your home
            </h2>
            <p class="text-brand-300 mt-6 leading-relaxed">
              Partner ateliers across Europe and Asia. Carbon-conscious shipping. White-glove
              delivery available in select regions.
            </p>
          </ScrollReveal>
          <ScrollReveal :speed="0.12" class="hidden md:block">
            <LazyImage
              src="/images/narrative-sofa.jpg"
              alt="Sofa in studio"
              aspect="4/3"
            />
          </ScrollReveal>
        </div>
      </section>
    </ScrollSection>

    <!-- CTA -->
    <section class="py-32 px-6 text-center bg-brand-50">
      <ScrollReveal class="mx-auto max-w-2xl">
        <h2 class="font-display text-4xl text-brand-900 mb-6">Begin your space</h2>
        <p class="text-brand-600 mb-10">
          Ten pieces. Infinite combinations. Start with what speaks to you.
        </p>
        <RouterLink to="/products">
          <BaseButton size="lg">Shop Now</BaseButton>
        </RouterLink>
      </ScrollReveal>
    </section>
  </div>
</template>
