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
    <div class="product-card__media overflow-hidden">
      <LazyImage
        :src="product.images[0]"
        :alt="product.name"
        aspect="3/4"
        class="product-card__image transition-transform duration-700 ease-out group-hover:scale-[1.06]"
      />
      <div
        class="product-card__overlay absolute inset-0 bg-brand-950/0 transition-colors duration-500 group-hover:bg-brand-950/10"
      />
    </div>
    <div class="mt-4 space-y-1">
      <p class="text-xs uppercase tracking-widest text-brand-500">
        {{ product.category }}
      </p>
      <h3
        class="product-card__title font-display text-xl text-brand-900 transition-colors duration-300 group-hover:text-brand-700"
      >
        {{ product.name }}
      </h3>
      <p class="text-sm text-brand-600">
        {{ formatPrice(product.price, product.currency, locale) }}
      </p>
    </div>
  </RouterLink>
</template>

<style scoped>
.product-card__media {
  position: relative;
}

.product-card__title {
  position: relative;
  display: inline-block;
}

.product-card__title::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 100%;
  height: 1px;
  background: currentColor;
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform 0.5s var(--ease-brand);
}

.group:hover .product-card__title::after {
  transform: scaleX(1);
}
</style>
