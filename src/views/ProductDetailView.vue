<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getProductBySlug, formatPrice } from '@/data/products'
import { useCartStore } from '@/store/cart'
import LazyImage from '@/components/base/LazyImage.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import VariantSelector from '@/components/business/VariantSelector.vue'

const route = useRoute()
const router = useRouter()
const cart = useCartStore()

const product = computed(() => getProductBySlug(route.params.slug as string))
const selectedVariant = ref('')
const quantity = ref(1)
const added = ref(false)

watch(
  product,
  (p) => {
    if (p) selectedVariant.value = p.variants[0]?.id ?? ''
  },
  { immediate: true },
)

const currentPrice = computed(() => {
  if (!product.value) return 0
  const variant = product.value.variants.find((v) => v.id === selectedVariant.value)
  return product.value.price + (variant?.priceModifier ?? 0)
})

const canAdd = computed(() => !!product.value && !!selectedVariant.value)

function addToCart() {
  if (!product.value || !selectedVariant.value) return
  cart.addItem(product.value.id, selectedVariant.value, quantity.value)
  added.value = true
  setTimeout(() => (added.value = false), 2000)
}

watch(
  () => route.params.slug,
  (slug) => {
    if (!getProductBySlug(slug as string)) router.replace('/products')
  },
  { immediate: true },
)
</script>

<template>
  <div v-if="product" class="pt-[var(--header-height)] min-h-screen">
    <div class="mx-auto max-w-7xl px-6 py-12">
      <nav class="text-sm text-brand-500 mb-8">
        <RouterLink to="/products" class="hover:text-brand-900">Collection</RouterLink>
        <span class="mx-2">/</span>
        <span class="text-brand-900">{{ product.name }}</span>
      </nav>

      <div class="grid lg:grid-cols-2 gap-12 lg:gap-16">
        <div class="space-y-4">
          <LazyImage
            :src="product.images[0]"
            :alt="product.name"
            aspect="4/5"
          />
          <div v-if="product.images[1]" class="grid grid-cols-2 gap-4">
            <LazyImage
              v-for="(img, i) in product.images.slice(1)"
              :key="i"
              :src="img"
              :alt="`${product.name} detail ${i + 2}`"
              aspect="1/1"
            />
          </div>
        </div>

        <div class="lg:py-8">
          <p class="text-xs uppercase tracking-widest text-brand-500">{{ product.category }}</p>
          <h1 class="font-display text-4xl md:text-5xl text-brand-900 mt-2">{{ product.name }}</h1>
          <p class="text-brand-600 mt-4">{{ product.tagline }}</p>
          <p class="font-display text-2xl text-brand-900 mt-6">
            {{ formatPrice(currentPrice, product.currency) }}
          </p>

          <div class="mt-8 space-y-6">
            <VariantSelector
              v-model="selectedVariant"
              :variants="product.variants"
            />

            <div class="flex items-center gap-4">
              <p class="text-xs uppercase tracking-widest text-brand-500">Quantity</p>
              <div class="flex items-center gap-3">
                <button
                  type="button"
                  class="w-8 h-8 border border-brand-300 flex items-center justify-center"
                  @click="quantity = Math.max(1, quantity - 1)"
                >
                  −
                </button>
                <span class="w-6 text-center">{{ quantity }}</span>
                <button
                  type="button"
                  class="w-8 h-8 border border-brand-300 flex items-center justify-center"
                  @click="quantity++"
                >
                  +
                </button>
              </div>
            </div>

            <BaseButton
              size="lg"
              class="w-full"
              :disabled="!canAdd"
              @click="addToCart"
            >
              {{ added ? 'Added to Cart' : 'Add to Cart' }}
            </BaseButton>

            <RouterLink to="/cart">
              <BaseButton variant="secondary" size="lg" class="w-full mt-3">
                View Cart
              </BaseButton>
            </RouterLink>
          </div>

          <div class="mt-12 space-y-6 border-t border-brand-200 pt-8">
            <div>
              <h2 class="text-xs uppercase tracking-widest text-brand-900 mb-2">Description</h2>
              <p class="text-brand-600 leading-relaxed">{{ product.description }}</p>
            </div>
            <div>
              <h2 class="text-xs uppercase tracking-widest text-brand-900 mb-2">Dimensions</h2>
              <p class="text-brand-600">{{ product.dimensions }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
