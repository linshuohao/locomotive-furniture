<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { fetchProducts } from '@/data/api'
import type { Product } from '@/data/schemas'
import ProductCard from '@/components/product/ProductCard.vue'
import PageSkeleton from '@/components/ui/PageSkeleton.vue'
import ScrollReveal from '@/components/scroll/ScrollReveal.vue'
import MotionSceneHost from '@/components/scroll/MotionSceneHost.vue'
import { useLayoutInvalidation } from '@/composables/useLayoutInvalidation'
import { useLocale } from '@/composables/useLocale'
import { trackFunnelStep } from '@/lib/analytics/analytics'
import { REQUIRES_ANIMATIONS } from '@/lib/motion/sceneRequirements'

usePageSeo('meta.collection')

const invalidateLayout = useLayoutInvalidation()
const { t, locale } = useLocale()

const { data: productsResult, pending: loading } = await useAsyncData(
  () => `products-${locale.value}`,
  () => fetchProducts(),
  { watch: [locale] },
)

const products = computed(() => productsResult.value?.data ?? [])
const fallbackNotice = computed(() => {
  const error = productsResult.value?.error
  return error ? t(error as 'fallback.offlineCatalog') : null
})

const categories = computed(() => [
  t('catalog.allCategories'),
  ...new Set(products.value.map((product) => product.category)),
])
const activeCategory = ref('')

const heroScene = {
  id: 'products-hero-enter',
  trigger: 'mount' as const,
  effect: 'hero-enter' as const,
  requires: REQUIRES_ANIMATIONS,
  targets: {
    eyebrow: '[data-hero-eyebrow]',
    title: '[data-hero-title]',
    subtitle: '[data-hero-subtitle]',
  },
}

const gridScene = computed(() => ({
  id: 'products-grid-reveal',
  trigger: 'mount' as const,
  effect: 'scale-fade-grid' as const,
  requires: REQUIRES_ANIMATIONS,
  targets: { items: '[data-product-card]' },
  options: { stagger: 0.12 },
}))

const gridReady = computed(
  () => !loading.value && `${activeCategory.value}-${filtered.value.length}`,
)

watch(
  locale,
  () => {
    activeCategory.value = t('catalog.allCategories')
  },
  { immediate: true },
)

watch(loading, async (isLoading) => {
  if (!isLoading) {
    trackFunnelStep('view_collection')
    await nextTick()
    await invalidateLayout()
  }
})

watch(activeCategory, async () => {
  await nextTick()
  await invalidateLayout()
})

const filtered = computed(() => {
  const allLabel = t('catalog.allCategories')
  return activeCategory.value === allLabel || !activeCategory.value
    ? products.value
    : products.value.filter((product: Product) => product.category === activeCategory.value)
})
</script>

<template>
  <div class="pt-[var(--header-height)] min-h-screen">
    <MotionSceneHost
      :scene="heroScene"
      :when="!loading"
    >
      <section class="relative mb-12 py-16 px-6 overflow-hidden">
        <div
          class="absolute inset-0 -z-10 pointer-events-none bg-gradient-to-br from-brand-200 via-brand-100 to-brand-50"
        ></div>

        <div class="mx-auto max-w-7xl relative">
          <p
            data-hero-eyebrow
            class="text-xs uppercase tracking-widest text-brand-500 mb-2"
          >
            {{ t('catalog.eyebrow') }}
          </p>
          <h1
            data-hero-title
            class="font-display text-4xl md:text-6xl text-brand-900 max-w-2xl"
          >
            {{ t('catalog.title') }}
          </h1>
          <p
            data-hero-subtitle
            class="text-brand-600 mt-4 max-w-xl"
          >
            {{ t('catalog.subtitle') }}
          </p>
          <p
            v-if="fallbackNotice"
            class="text-brand-500 text-xs mt-2"
          >
            {{ fallbackNotice }}
          </p>
        </div>
      </section>
    </MotionSceneHost>

    <div class="mx-auto max-w-7xl px-6 pb-16">
      <PageSkeleton v-if="loading" />

      <template v-else>
        <ScrollReveal class="flex flex-wrap gap-2 mb-12">
          <button
            v-for="cat in categories"
            :key="cat"
            type="button"
            class="px-4 py-2 text-sm border transition-all duration-500 ease-brand"
            :class="
              activeCategory === cat
                ? 'border-brand-900 bg-brand-900 text-brand-50'
                : 'border-brand-300 text-brand-700 hover:border-brand-600'
            "
            @click="activeCategory = cat"
          >
            {{ cat }}
          </button>
        </ScrollReveal>

        <MotionSceneHost
          :scene="gridScene"
          :when="!loading && filtered.length > 0 && !!gridReady"
        >
          <div
            class="product-grid grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-14 md:gap-x-8 md:gap-y-16"
          >
            <div
              v-for="(product, index) in filtered"
              :key="product.id"
              data-product-card
            >
              <ProductCard
                :product="product"
                :index="index"
              />
            </div>
          </div>
        </MotionSceneHost>
      </template>
    </div>
  </div>
</template>
