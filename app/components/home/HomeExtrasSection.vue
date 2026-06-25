<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '@/data/schemas'
import ImageTilt3D from '@/components/ui/ImageTilt3D.vue'
import LazyImage from '@/components/ui/LazyImage.vue'
import ShuffleLink from '@/components/ui/ShuffleLink.vue'
import HoverShuffleText from '@/components/scroll/HoverShuffleText.vue'
import { pickHoverTextEffect } from '@/lib/scroll/animation'
import { formatPrice } from '@/data/products'
import { useLocale } from '@/composables/useLocale'

defineProps<{
  storeProducts: Product[]
}>()

const { t, locale, localizedPath } = useLocale()

const articles = computed(() => [
  t('home.extras.articles.items.a1'),
  t('home.extras.articles.items.a2'),
  t('home.extras.articles.items.a3'),
  t('home.extras.articles.items.a4'),
  t('home.extras.articles.items.a5'),
  t('home.extras.articles.items.a6'),
])

const culture = computed(() => [
  t('home.extras.culture.items.c1'),
  t('home.extras.culture.items.c2'),
  t('home.extras.culture.items.c3'),
  t('home.extras.culture.items.c4'),
  t('home.extras.culture.items.c5'),
  t('home.extras.culture.items.c6'),
])

function productPrice(product: Product) {
  return formatPrice(product.price, product.currency, locale.value)
}
</script>

<template>
  <section class="home-extras section-pad px-6 bg-brand-50">
    <div class="mx-auto max-w-7xl">
      <h2 class="home-extras__heading font-display type-section-mega text-brand-900 mb-16 md:mb-24">
        <HoverShuffleText
          :text="t('home.extras.title')"
          effect="pop"
          tag="span"
        />
      </h2>

      <div class="home-extras__grid grid gap-16 md:grid-cols-3 md:gap-12 lg:gap-20">
        <div class="home-extras__column">
          <h3
            class="home-extras__column-title font-display text-2xl md:text-3xl text-brand-900 mb-8"
          >
            <HoverShuffleText
              :text="t('home.extras.articles.heading')"
              effect="wave"
              tag="span"
            />
          </h3>
          <ul class="home-extras__list space-y-4">
            <li
              v-for="(item, i) in articles"
              :key="`article-${i}`"
            >
              <NuxtLink
                :to="localizedPath('/about')"
                class="home-extras__list-link group"
              >
                <HoverShuffleText
                  :text="item"
                  :effect="pickHoverTextEffect(i + 1)"
                  tag="span"
                />
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div class="home-extras__column">
          <h3
            class="home-extras__column-title font-display text-2xl md:text-3xl text-brand-900 mb-8"
          >
            <HoverShuffleText
              :text="t('home.extras.culture.heading')"
              effect="skew"
              tag="span"
            />
          </h3>
          <ul class="home-extras__list space-y-4">
            <li
              v-for="(item, i) in culture"
              :key="`culture-${i}`"
            >
              <NuxtLink
                :to="localizedPath('/about')"
                class="home-extras__list-link group"
              >
                <HoverShuffleText
                  :text="item"
                  effect="slide"
                  tag="span"
                />
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div class="home-extras__column home-extras__column--store">
          <h3
            class="home-extras__column-title font-display text-2xl md:text-3xl text-brand-900 mb-8"
          >
            <HoverShuffleText
              :text="t('home.extras.store.heading')"
              effect="shuffle"
              tag="span"
            />
          </h3>
          <ShuffleLink
            :to="localizedPath('/products')"
            :text="t('home.extras.store.link')"
            effect="wave"
            class="home-extras__store-link type-eyebrow text-brand-600 mb-10 block"
          />

          <ul class="home-extras__store-products space-y-12">
            <li
              v-for="(product, i) in storeProducts"
              :key="product.id"
            >
              <NuxtLink
                :to="localizedPath(`/products/${product.slug}`)"
                class="home-extras__product group block"
              >
                <div class="home-extras__product-media overflow-hidden bg-brand-200 mb-5">
                  <ImageTilt3D variant="subtle">
                    <LazyImage
                      :src="product.images[0]!"
                      :alt="product.name"
                      aspect="4/3"
                      class="home-extras__product-image"
                    />
                  </ImageTilt3D>
                </div>
                <h4
                  class="home-extras__product-title font-display text-xl md:text-2xl text-brand-900"
                >
                  <HoverShuffleText
                    :text="product.name"
                    :effect="pickHoverTextEffect(i + 2)"
                    tag="span"
                  />
                </h4>
                <p class="home-extras__product-price tabular-nums text-brand-600 mt-2">
                  <HoverShuffleText
                    :text="productPrice(product)"
                    effect="glitch"
                    tag="span"
                  />
                </p>
                <span
                  class="home-extras__product-cta type-eyebrow text-brand-900 mt-3 inline-block"
                >
                  <HoverShuffleText
                    :text="t('home.extras.store.buyNow')"
                    effect="pop"
                    tag="span"
                  />
                </span>
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
