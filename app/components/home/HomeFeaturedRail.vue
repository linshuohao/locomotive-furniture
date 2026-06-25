<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '@/data/schemas'
import HomeFeaturedWorkItem from '@/components/home/HomeFeaturedWorkItem.vue'
import CharReveal from '@/components/scroll/CharReveal.vue'
import HoverShuffleText from '@/components/scroll/HoverShuffleText.vue'
import ShuffleLink from '@/components/ui/ShuffleLink.vue'
import { useLocale } from '@/composables/useLocale'

const props = defineProps<{
  featured: Product[]
  loading: boolean
  ready: boolean
  fallbackNotice?: string | null
}>()

const { t, localizedPath } = useLocale()

const displayFeatured = computed(() => props.featured.slice(0, 4))
</script>

<template>
  <section class="home-featured-work section-pad bg-brand-950">
    <div class="mx-auto max-w-7xl px-6">
      <CharReveal tag="div">
        <h2 class="font-display type-section-mega text-brand-50 mb-12 md:mb-20">
          <HoverShuffleText
            :text="t('home.featured.title')"
            effect="pop"
            tag="span"
          />
        </h2>
        <p
          v-if="fallbackNotice"
          class="text-brand-400 text-xs mb-6"
        >
          {{ fallbackNotice }}
        </p>
      </CharReveal>

      <ul
        v-if="ready"
        class="home-featured-work__list"
      >
        <HomeFeaturedWorkItem
          v-for="(product, index) in displayFeatured"
          :key="product.id"
          :product="product"
          :index="index"
        />

        <li class="home-featured-work__item home-featured-work__item--all">
          <ShuffleLink
            :to="localizedPath('/products')"
            :text="t('home.featured.allWork')"
            effect="skew"
            class="home-featured-work__all-link font-display"
          />
          <span class="home-featured-work__cta type-eyebrow text-brand-400">
            <HoverShuffleText
              :text="t('home.featured.viewAll')"
              effect="wave"
              tag="span"
            />
          </span>
        </li>
      </ul>

      <p
        v-else-if="!loading"
        class="text-center text-brand-400 text-sm"
      >
        <HoverShuffleText
          :text="t('catalog.subtitle')"
          effect="slide"
          tag="span"
        />
      </p>
    </div>
  </section>
</template>
