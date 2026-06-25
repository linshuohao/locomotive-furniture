<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '@/data/schemas'
import ImageTilt3D from '@/components/ui/ImageTilt3D.vue'
import LazyImage from '@/components/ui/LazyImage.vue'
import HoverShuffleText from '@/components/scroll/HoverShuffleText.vue'
import { pickHoverTextEffect } from '@/lib/scroll/animation'
import { useLocale } from '@/composables/useLocale'

const props = defineProps<{
  product: Product
  index: number
}>()

const { t, localizedPath } = useLocale()

const titleLines = computed(() => splitProductTitle(props.product.name))
const imagePriority = computed(() => props.index < 3)
const titleEffect = computed(() => pickHoverTextEffect(props.index))
const lineEffects = computed(() => [
  pickHoverTextEffect(props.index * 2),
  pickHoverTextEffect(props.index * 2 + 1),
])

function splitProductTitle(name: string): [string, string] {
  const words = name.split(/\s+/)
  if (words.length <= 1) return [name, '']
  const mid = Math.ceil(words.length / 2)
  return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')]
}
</script>

<template>
  <li class="home-featured-work__item">
    <NuxtLink
      :to="localizedPath(`/products/${product.slug}`)"
      class="home-featured-work__link group"
    >
      <div
        class="home-featured-work__media"
        data-scroll
        data-scroll-css-progress
        data-scroll-offset="10%,0"
      >
        <div class="home-featured-work__media-depth">
          <ImageTilt3D variant="default">
            <LazyImage
              :src="product.images[0]!"
              :alt="product.name"
              :priority="imagePriority"
              aspect="16/10"
              class="home-featured-work__image"
            />
          </ImageTilt3D>
        </div>
      </div>

      <div class="home-featured-work__copy">
        <h3 class="home-featured-work__title font-display">
          <span class="home-featured-work__title-line block">
            <HoverShuffleText
              :text="titleLines[0]"
              :effect="lineEffects[0]"
              tag="span"
            />
          </span>
          <span
            v-if="titleLines[1]"
            class="home-featured-work__title-line block"
          >
            <HoverShuffleText
              :text="titleLines[1]"
              :effect="lineEffects[1] ?? titleEffect"
              tag="span"
            />
          </span>
        </h3>
        <span class="home-featured-work__cta type-eyebrow">
          <HoverShuffleText
            :text="t('home.featured.readMore')"
            effect="slide"
            tag="span"
          />
        </span>
      </div>
    </NuxtLink>
  </li>
</template>
