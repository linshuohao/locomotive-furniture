<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import type { Product } from '@/types'
import type { QuickAddPayload } from '@/lib/product/contracts'
import ProductCardMedia from '@/components/product/ProductCardMedia.vue'
import HoverShuffleText from '@/components/scroll/HoverShuffleText.vue'
import { formatPrice } from '@/data/products'
import { useLocale } from '@/composables/useLocale'
import { useProductQuickAdd } from '@/composables/useProductQuickAdd'
import { isProductInStock } from '@/lib/product/stock'

const props = withDefaults(
  defineProps<{
    product: Product
    index?: number
  }>(),
  {
    index: 0,
  },
)

const emit = defineEmits<{
  'quick-add': [payload: QuickAddPayload]
}>()

const { locale, localizedPath, t } = useLocale()
const { handleQuickAdd } = useProductQuickAdd()

const justAdded = ref(false)
const addFailed = ref(false)
let addedTimer: ReturnType<typeof setTimeout> | undefined
let failedTimer: ReturnType<typeof setTimeout> | undefined

const imagePriority = computed(() => props.index < 6)

function onQuickAdd(payload: QuickAddPayload) {
  const ok = handleQuickAdd(payload)
  emit('quick-add', payload)
  if (!ok) {
    addFailed.value = true
    clearTimeout(failedTimer)
    failedTimer = setTimeout(() => {
      addFailed.value = false
    }, 2400)
    return
  }

  justAdded.value = true
  clearTimeout(addedTimer)
  addedTimer = setTimeout(() => {
    justAdded.value = false
  }, 1600)
}

onUnmounted(() => {
  clearTimeout(addedTimer)
  clearTimeout(failedTimer)
})
</script>

<template>
  <article
    class="product-card product-card--grid group"
    :class="{ 'product-card--sold-out': !isProductInStock(product) }"
  >
    <ProductCardMedia
      :product="product"
      :priority="imagePriority"
      :just-added="justAdded"
      @quick-add="onQuickAdd"
    />

    <NuxtLink
      :to="localizedPath(`/products/${product.slug}`)"
      class="product-card__meta"
    >
      <p class="product-card__category">
        {{ product.category }}
      </p>
      <h2 class="product-card__title font-display">
        <HoverShuffleText
          :text="product.name"
          tag="span"
        />
      </h2>
      <p class="product-card__price tabular-nums">
        {{ formatPrice(product.price, product.currency, locale) }}
        <span
          v-if="addFailed"
          class="product-card__price-note text-red-600"
        >
          — {{ t('cart.addFailed') }}
        </span>
        <span
          v-else-if="!isProductInStock(product)"
          class="product-card__price-note"
        >
          — {{ t('product.outOfStock') }}
        </span>
      </p>
    </NuxtLink>
  </article>
</template>
