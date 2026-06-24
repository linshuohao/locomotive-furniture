<script setup lang="ts">
import { ref, computed } from 'vue'
import { products } from '@/data/products'
import ProductCard from '@/components/business/ProductCard.vue'

const categories = ['All', ...new Set(products.map((p) => p.category))]
const activeCategory = ref('All')

const filtered = computed(() =>
  activeCategory.value === 'All'
    ? products
    : products.filter((p) => p.category === activeCategory.value),
)
</script>

<template>
  <div class="pt-[var(--header-height)] min-h-screen">
    <div class="mx-auto max-w-7xl px-6 py-16">
      <header class="mb-12">
        <p class="text-xs uppercase tracking-widest text-brand-500 mb-2">10 SPU Collection</p>
        <h1 class="font-display text-4xl md:text-5xl text-brand-900">The Collection</h1>
        <p class="text-brand-600 mt-4 max-w-xl">
          Curated furniture for modern living. Each piece designed to complement the others.
        </p>
      </header>

      <div class="flex flex-wrap gap-2 mb-12">
        <button
          v-for="cat in categories"
          :key="cat"
          type="button"
          class="px-4 py-2 text-sm border transition-all duration-300"
          :class="
            activeCategory === cat
              ? 'border-brand-900 bg-brand-900 text-brand-50'
              : 'border-brand-300 text-brand-700 hover:border-brand-600'
          "
          @click="activeCategory = cat"
        >
          {{ cat }}
        </button>
      </div>

      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
        <ProductCard
          v-for="product in filtered"
          :key="product.id"
          :product="product"
        />
      </div>
    </div>
  </div>
</template>
