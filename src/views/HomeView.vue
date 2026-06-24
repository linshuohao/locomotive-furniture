<script setup lang="ts">
import { products } from '@/data/products'
import ProductCard from '@/components/business/ProductCard.vue'
import ScrollSection from '@/components/business/ScrollSection.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import LazyImage from '@/components/base/LazyImage.vue'
import { RouterLink } from 'vue-router'

const featured = products.filter((p) => p.featured)
</script>

<template>
  <div class="pt-[var(--header-height)]">
    <!-- Hero -->
    <section class="relative min-h-screen flex items-end pb-24 px-6">
      <div
        class="absolute inset-0 z-0"
        data-scroll
        data-scroll-speed="-0.5"
      >
        <LazyImage
          src="https://images.unsplash.com/photo-1618221193310-3def97536781?auto=format&fit=crop&w=1920&q=80"
          alt="Minimal luxury living room"
          :lazy="false"
          aspect="auto"
          class="h-full min-h-screen"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-brand-950/60 via-brand-950/20 to-transparent" />
      </div>
      <div class="relative z-10 mx-auto max-w-7xl w-full">
        <p
          data-scroll
          data-scroll-class="is-inview"
          class="text-brand-200 text-sm uppercase tracking-[0.3em] mb-4"
        >
          Cross-border furniture
        </p>
        <h1
          data-scroll
          data-scroll-class="is-inview"
          class="font-display text-5xl md:text-7xl lg:text-8xl text-brand-50 max-w-3xl leading-tight"
        >
          Design that lives with you
        </h1>
        <p
          data-scroll
          data-scroll-class="is-inview"
          class="text-brand-200 text-lg mt-6 max-w-xl"
        >
          Ten curated pieces. Timeless forms, sustainable materials, delivered to your door.
        </p>
        <div
          data-scroll
          data-scroll-class="is-inview"
          class="mt-10 flex gap-4"
        >
          <RouterLink to="/products">
            <BaseButton size="lg">Explore Collection</BaseButton>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Narrative block -->
    <ScrollSection class="py-32 px-6 bg-brand-50">
      <div class="mx-auto max-w-7xl grid md:grid-cols-2 gap-16 items-center">
        <div data-scroll data-scroll-class="is-inview">
          <p class="text-xs uppercase tracking-widest text-brand-500 mb-4">Our philosophy</p>
          <h2 class="font-display text-4xl md:text-5xl text-brand-900 leading-tight">
            Less clutter.<br />More character.
          </h2>
          <p class="text-brand-600 mt-6 leading-relaxed">
            We believe in fewer, better things. Each piece in our collection is selected for
            craftsmanship, longevity, and the quiet confidence it brings to your space.
          </p>
        </div>
        <div data-scroll data-scroll-speed="0.3">
          <LazyImage
            src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80"
            alt="Craftsmanship detail"
            aspect="4/5"
          />
        </div>
      </div>
    </ScrollSection>

    <!-- Featured products -->
    <section class="py-32 px-6 bg-brand-100">
      <div class="mx-auto max-w-7xl">
        <div data-scroll data-scroll-class="is-inview" class="text-center mb-16">
          <p class="text-xs uppercase tracking-widest text-brand-500 mb-2">Featured</p>
          <h2 class="font-display text-4xl text-brand-900">The Collection</h2>
        </div>
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div
            v-for="(product, index) in featured"
            :key="product.id"
            data-scroll
            data-scroll-class="is-inview"
            :style="{ transitionDelay: `${index * 0.1}s` }"
          >
            <ProductCard :product="product" />
          </div>
        </div>
        <div data-scroll data-scroll-class="is-inview" class="text-center mt-16">
          <RouterLink to="/products">
            <BaseButton variant="secondary">View All 10 Pieces</BaseButton>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Sticky narrative -->
    <ScrollSection sticky class="min-h-[200vh]">
      <div class="sticky top-[var(--header-height)] min-h-screen flex items-center px-6 bg-brand-900">
        <div class="mx-auto max-w-7xl grid md:grid-cols-2 gap-12 items-center">
          <div data-scroll data-scroll-class="is-inview">
            <p class="text-brand-400 text-xs uppercase tracking-widest mb-4">Crafted globally</p>
            <h2 class="font-display text-4xl md:text-5xl text-brand-50">
              From workshop to your home
            </h2>
            <p class="text-brand-300 mt-6 leading-relaxed">
              Partner ateliers across Europe and Asia. Carbon-conscious shipping. White-glove
              delivery available in select regions.
            </p>
          </div>
          <div
            data-scroll
            data-scroll-speed="0.2"
            class="hidden md:block"
          >
            <LazyImage
              src="https://images.unsplash.com/photo-1555041469-a586c638ea8e?auto=format&fit=crop&w=800&q=80"
              alt="Sofa in studio"
              aspect="4/3"
            />
          </div>
        </div>
      </div>
    </ScrollSection>

    <!-- CTA -->
    <section class="py-32 px-6 text-center bg-brand-50">
      <div data-scroll data-scroll-class="is-inview" class="mx-auto max-w-2xl">
        <h2 class="font-display text-4xl text-brand-900 mb-6">Begin your space</h2>
        <p class="text-brand-600 mb-10">
          Ten pieces. Infinite combinations. Start with what speaks to you.
        </p>
        <RouterLink to="/products">
          <BaseButton size="lg">Shop Now</BaseButton>
        </RouterLink>
      </div>
    </section>
  </div>
</template>
