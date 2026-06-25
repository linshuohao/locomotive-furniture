<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchProductBySlug } from '@/data/api'
import type { Product } from '@/data/schemas'
import { getProductBySlug, formatPrice } from '@/data/products'
import { useCartStore } from '@/store/cart'
import LazyImage from '@/components/ui/LazyImage.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import VariantSelector from '@/components/product/VariantSelector.vue'
import ProductViewTracker from '@/components/product/ProductViewTracker.vue'
import ScrollReveal from '@/components/scroll/ScrollReveal.vue'
import Skeleton from '@/components/ui/Skeleton.vue'
import { useGsapTimeline } from '@/composables/useGsapTimeline'
import { createPdpTimeline } from '@/lib/scroll/animation'
import { useLocale } from '@/composables/useLocale'

const route = useRoute()
const router = useRouter()
const cart = useCartStore()
const { t, locale, localizedPath } = useLocale()

const product = ref<Product | null>(null)
const loading = ref(true)
const selectedVariant = ref('')
const quantity = ref(1)
const added = ref(false)

const copyColRef = ref<HTMLElement | null>(null)

async function loadProduct(slug: string) {
  loading.value = true
  const result = await fetchProductBySlug(slug)
  if (result.data) {
    product.value = result.data
    selectedVariant.value = result.data.variants[0]?.id ?? ''
  } else {
    router.replace(localizedPath('/products'))
  }
  loading.value = false
}

onMounted(() => {
  void loadProduct(route.params.slug as string)
})

watch(
  () => route.params.slug,
  (slug) => {
    if (typeof slug === 'string') void loadProduct(slug)
  },
)

watch(locale, () => {
  const slug = route.params.slug
  if (typeof slug === 'string') void loadProduct(slug)
})

useGsapTimeline(
  () => {
    if (!copyColRef.value) return
    createPdpTimeline(copyColRef.value)
  },
  { watchSource: computed(() => !loading.value && product.value) },
)

const currentPrice = computed(() => {
  if (!product.value) return 0
  const variant = product.value.variants.find((v) => v.id === selectedVariant.value)
  return product.value.price + (variant?.priceModifier ?? 0)
})

const canAdd = computed(() => {
  if (!product.value || !selectedVariant.value) return false
  const variant = product.value.variants.find((v) => v.id === selectedVariant.value)
  return variant?.inStock !== false
})

function addToCart() {
  if (!product.value || !selectedVariant.value) return
  const ok = cart.addItem(product.value.id, selectedVariant.value, quantity.value)
  if (!ok) return
  added.value = true
  setTimeout(() => (added.value = false), 2500)
}

watch(selectedVariant, () => {
  added.value = false
})

watch(
  () => route.params.slug,
  (slug) => {
    if (!loading.value && !getProductBySlug(slug as string, locale.value)) {
      router.replace(localizedPath('/products'))
    }
  },
)
</script>

<template>
  <div class="pt-[var(--header-height)] min-h-screen">
    <div v-if="loading" class="mx-auto max-w-7xl px-6 py-12">
      <div class="grid lg:grid-cols-2 gap-12">
        <Skeleton class="aspect-[4/5] w-full" />
        <div class="space-y-4">
          <Skeleton class="h-4 w-24" />
          <Skeleton class="h-12 w-3/4" />
          <Skeleton class="h-8 w-1/3" />
          <Skeleton class="h-12 w-full mt-8" />
        </div>
      </div>
    </div>

    <div v-else-if="product" class="mx-auto max-w-7xl px-6 py-12">
      <ProductViewTracker :product="product" />

      <ScrollReveal class="text-sm text-brand-500 mb-8" tag="nav">
        <RouterLink :to="localizedPath('/products')" class="hover:text-brand-900">
          {{ t('nav.collection') }}
        </RouterLink>
        <span class="mx-2">/</span>
        <span class="text-brand-900">{{ product.name }}</span>
      </ScrollReveal>

      <div class="grid lg:grid-cols-2 gap-12 lg:gap-16">
        <div class="space-y-4">
          <ScrollReveal :speed="-0.08">
            <LazyImage :src="product.images[0]" :alt="product.name" aspect="4/5" />
          </ScrollReveal>
          <div v-if="product.images[1]" class="grid grid-cols-2 gap-4">
            <ScrollReveal v-for="(img, i) in product.images.slice(1)" :key="i" :speed="0.06">
              <LazyImage :src="img" :alt="`${product.name} detail ${i + 2}`" aspect="1/1" />
            </ScrollReveal>
          </div>
        </div>

        <div ref="copyColRef" class="lg:py-8">
          <p data-pdp-reveal class="text-xs uppercase tracking-widest text-brand-500">
            {{ product.category }}
          </p>
          <h1 data-pdp-reveal class="font-display text-4xl md:text-5xl text-brand-900 mt-2">
            {{ product.name }}
          </h1>
          <p data-pdp-reveal class="text-brand-600 mt-4">
            {{ product.tagline }}
          </p>
          <p data-pdp-reveal class="font-display text-2xl text-brand-900 mt-6">
            {{ formatPrice(currentPrice, product.currency, locale) }}
          </p>

          <div class="mt-8 space-y-6">
            <div data-pdp-reveal>
              <VariantSelector v-model="selectedVariant" :variants="product.variants" />
            </div>

            <div data-pdp-reveal class="flex items-center gap-4">
              <p class="text-xs uppercase tracking-widest text-brand-500">
                {{ t('product.quantity') }}
              </p>
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
                  @click="quantity = Math.min(99, quantity + 1)"
                >
                  +
                </button>
              </div>
            </div>

            <div data-pdp-reveal>
              <BaseButton
                data-testid="add-to-cart"
                size="lg"
                class="w-full transition-transform duration-300"
                :class="added ? 'scale-[0.98]' : ''"
                :variant="added ? 'success' : 'primary'"
                :disabled="!canAdd"
                @click="addToCart"
              >
                <span v-if="added" class="inline-flex items-center justify-center gap-2">
                  <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path
                      fill-rule="evenodd"
                      d="M16.704 5.29a1 1 0 0 1 0 1.42l-7.25 7.25a1 1 0 0 1-1.42 0l-3.25-3.25a1 1 0 1 1 1.42-1.42l2.54 2.54 6.54-6.54a1 1 0 0 1 1.42 0Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  {{ t('product.addedToCart') }}
                </span>
                <span v-else>{{ t('product.addToCart') }}</span>
              </BaseButton>
            </div>

            <div data-pdp-reveal>
              <RouterLink :to="localizedPath('/cart')">
                <BaseButton variant="secondary" size="lg" class="w-full mt-3">
                  {{ t('product.viewCart') }}
                </BaseButton>
              </RouterLink>
            </div>
          </div>

          <div class="mt-12 space-y-6 border-t border-brand-200 pt-8">
            <div data-pdp-reveal>
              <h2 class="text-xs uppercase tracking-widest text-brand-900 mb-2">
                {{ t('product.description') }}
              </h2>
              <p class="text-brand-600 leading-relaxed">
                {{ product.description }}
              </p>
            </div>
            <div data-pdp-reveal>
              <h2 class="text-xs uppercase tracking-widest text-brand-900 mb-2">
                {{ t('product.dimensions') }}
              </h2>
              <p class="text-brand-600">
                {{ product.dimensions }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
