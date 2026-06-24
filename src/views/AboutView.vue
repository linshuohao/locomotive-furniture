<script setup lang="ts">
import ScrollSection from '@/components/business/ScrollSection.vue'
import LazyImage from '@/components/base/LazyImage.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="pt-[var(--header-height)]">
    <section class="min-h-[70vh] flex items-center px-6 bg-brand-900">
      <div class="mx-auto max-w-4xl text-center">
        <p
          data-scroll
          data-scroll-class="is-inview"
          class="text-brand-400 text-xs uppercase tracking-[0.3em] mb-6"
        >
          About Atelier
        </p>
        <h1
          data-scroll
          data-scroll-class="is-inview"
          class="font-display text-5xl md:text-6xl text-brand-50"
        >
          Furniture with intention
        </h1>
      </div>
    </section>

    <ScrollSection class="py-24 px-6">
      <div class="mx-auto max-w-7xl grid md:grid-cols-2 gap-16 items-center">
        <div data-scroll data-scroll-class="is-inview">
          <h2 class="font-display text-3xl text-brand-900 mb-6">Our story</h2>
          <p class="text-brand-600 leading-relaxed mb-4">
            Atelier was founded on a simple belief: your home deserves fewer, better things. We
            partner with independent workshops across Europe and Asia to bring you ten carefully
            curated pieces — each selected for craftsmanship, sustainability, and timeless design.
          </p>
          <p class="text-brand-600 leading-relaxed">
            We ship worldwide with carbon-conscious logistics. Every order is packed with care,
            and white-glove delivery is available in select regions.
          </p>
        </div>
        <div data-scroll data-scroll-speed="0.2">
          <LazyImage
            src="https://images.unsplash.com/photo-1618221193310-3def97536781?auto=format&fit=crop&w=800&q=80"
            alt="Atelier showroom"
            aspect="4/5"
          />
        </div>
      </div>
    </ScrollSection>

    <section class="py-24 px-6 bg-brand-100 text-center">
      <div data-scroll data-scroll-class="is-inview" class="mx-auto max-w-2xl">
        <h2 class="font-display text-3xl text-brand-900 mb-6">Ready to explore?</h2>
        <RouterLink to="/products">
          <BaseButton size="lg">View Collection</BaseButton>
        </RouterLink>
      </div>
    </section>
  </div>
</template>
