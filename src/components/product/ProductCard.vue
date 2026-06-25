<script setup lang="ts">
import type { Product } from '@/types'
import { formatPrice } from '@/data/products'
import LazyImage from '@/components/ui/LazyImage.vue'
import { RouterLink } from 'vue-router'
import { useLocale } from '@/composables/useLocale'

defineProps<{
  product: Product
}>()

const { locale, localizedPath } = useLocale()
</script>

<template>
  <RouterLink :to="localizedPath(`/products/${product.slug}`)" class="group block">
    <div class="overflow-hidden">
      <LazyImage
        :src="product.images[0]"
        :alt="product.name"
        aspect="3/4"
        class="transition-transform duration-700 group-hover:scale-105"
      />
    </div>
    <div class="mt-4 space-y-1">
      <p class="text-xs uppercase tracking-widest text-brand-500">
        {{ product.category }}
      </p>
      <h3 class="font-display text-xl text-brand-900 group-hover:text-brand-700 transition-colors">
        {{ product.name }}
      </h3>
      <p class="text-sm text-brand-600">
        {{ formatPrice(product.price, product.currency, locale) }}
      </p>
    </div>
  </RouterLink>
</template>
