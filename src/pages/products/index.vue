<script setup lang="ts">
import { ref, computed, watch, nextTick, inject } from 'vue'
import { fetchProducts } from '@/data/api'
import type { Product } from '@/data/schemas'
import ProductCard from '@/components/product/ProductCard.vue'
import PageSkeleton from '@/components/ui/PageSkeleton.vue'
import ScrollReveal from '@/components/scroll/ScrollReveal.vue'
import { useGsapTimeline } from '@/composables/useGsapTimeline'
import { createHeroEnterTimeline, createScaleFadeReveal } from '@/lib/scroll/animation'
import { scrollInjectionKey } from '@/composables/useLocomotiveScroll'
import { useLocale } from '@/composables/useLocale'

usePageSeo('meta.collection')

const scroll = inject(scrollInjectionKey, null)
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

const heroRef = ref<HTMLElement | null>(null)
const eyebrowRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const productGridRef = ref<HTMLElement | null>(null)

const categories = computed(() => [
  t('catalog.allCategories'),
  ...new Set(products.value.map((product) => product.category)),
])
const activeCategory = ref('')

watch(
  locale,
  () => {
    activeCategory.value = t('catalog.allCategories')
  },
  { immediate: true },
)

watch(loading, async (isLoading) => {
  if (!isLoading) {
    await nextTick()
    await scroll?.update()
  }
})

useGsapTimeline(
  () => {
    createHeroEnterTimeline({
      eyebrow: eyebrowRef.value,
      title: titleRef.value,
      subtitle: subtitleRef.value,
    })
  },
  { watchSource: computed(() => !loading.value && heroRef.value) },
)

useGsapTimeline(
  () => {
    if (productGridRef.value) {
      createScaleFadeReveal(productGridRef.value, '[data-product-card]', { stagger: 0.08 })
    }
  },
  {
    watchSource: computed(
      () =>
        !loading.value &&
        productGridRef.value &&
        `${activeCategory.value}-${filtered.value.length}`,
    ),
  },
)

watch(activeCategory, async () => {
  await nextTick()
  await scroll?.update()
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
    <section
      ref="heroRef"
      class="relative mb-12 py-16 px-6 overflow-hidden"
    >
      <ScrollReveal
        :speed="-0.2"
        class="absolute inset-0 -z-10 pointer-events-none"
      >
        <div class="h-full w-full bg-gradient-to-br from-brand-200 via-brand-100 to-brand-50"></div>
      </ScrollReveal>

      <div class="mx-auto max-w-7xl relative">
        <p
          ref="eyebrowRef"
          class="text-xs uppercase tracking-widest text-brand-500 mb-2"
        >
          {{ t('catalog.eyebrow') }}
        </p>
        <h1
          ref="titleRef"
          class="font-display text-4xl md:text-6xl text-brand-900 max-w-2xl"
        >
          {{ t('catalog.title') }}
        </h1>
        <p
          ref="subtitleRef"
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

    <div class="mx-auto max-w-7xl px-6 pb-16">
      <PageSkeleton v-if="loading" />

      <template v-else>
        <ScrollReveal class="flex flex-wrap gap-2 mb-12">
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
        </ScrollReveal>

        <div
          ref="productGridRef"
          class="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12"
        >
          <div
            v-for="product in filtered"
            :key="product.id"
            data-product-card
          >
            <ProductCard :product="product" />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
