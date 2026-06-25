<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Product } from '@/types'
import type { QuickAddPayload } from '@/lib/product/contracts'
import LazyImage from '@/components/ui/LazyImage.vue'
import HoverShuffleText from '@/components/scroll/HoverShuffleText.vue'
import { useLocale } from '@/composables/useLocale'
import { useMouseParallax } from '@/composables/useMouseParallax'
import { getDefaultVariant, isProductInStock } from '@/lib/product/stock'

const props = withDefaults(
  defineProps<{
    product: Product
    aspect?: string
    priority?: boolean
    justAdded?: boolean
  }>(),
  {
    aspect: '3/4',
    priority: false,
    justAdded: false,
  },
)

const emit = defineEmits<{
  'quick-add': [payload: QuickAddPayload]
}>()

const { t, localizedPath } = useLocale()

const inStock = computed(() => isProductInStock(props.product))
const defaultVariant = computed(() => getDefaultVariant(props.product))
const secondaryImage = computed(() => props.product.images[1] ?? null)
const swatches = computed(() => props.product.variants.slice(0, 5))

const adding = ref(false)
const secondaryActive = ref(false)
const mediaRef = ref<HTMLElement | null>(null)
const stackRef = ref<HTMLElement | null>(null)

useMouseParallax(mediaRef, stackRef, { maxX: 10, maxY: 8 })

function onMediaEnter() {
  secondaryActive.value = true
}

const productUrl = computed(() => localizedPath(`/products/${props.product.slug}`))

function onQuickAdd(event: MouseEvent) {
  event.preventDefault()
  event.stopPropagation()
  if (!inStock.value || adding.value) return

  adding.value = true
  const variant = defaultVariant.value
  emit('quick-add', {
    productId: props.product.id,
    variantId: variant.id,
    quantity: 1,
    slug: props.product.slug,
    price: props.product.price + variant.priceModifier,
  })
  adding.value = false
}
</script>

<template>
  <div
    ref="mediaRef"
    class="product-card__media product-card__media--grid"
    :class="{ 'product-card__media--sold-out': !inStock }"
    @mouseenter="onMediaEnter"
  >
    <NuxtLink
      :to="productUrl"
      class="product-card__image-link"
      :aria-label="product.name"
    >
      <div
        ref="stackRef"
        class="product-card__image-stack"
      >
        <LazyImage
          :src="product.images[0]!"
          :alt="product.name"
          :aspect="aspect"
          :priority="priority"
          class="product-card__image product-card__image--primary"
        />
        <LazyImage
          v-if="secondaryImage"
          :src="secondaryImage"
          :alt="product.name"
          fill
          defer
          :activated="secondaryActive"
          class="product-card__image product-card__image--secondary"
        />
      </div>
    </NuxtLink>

    <span
      v-if="!inStock"
      class="product-card__badge product-card__badge--sold-out"
    >
      {{ t('product.outOfStock') }}
    </span>

    <span
      v-else-if="product.featured"
      class="product-card__badge product-card__badge--new"
    >
      {{ t('product.new') }}
    </span>

    <div
      v-if="swatches.length > 1"
      class="product-card__swatches"
      aria-hidden="true"
    >
      <span
        v-for="variant in swatches"
        :key="variant.id"
        class="product-card__swatch"
        :style="{ '--swatch-color': variant.color }"
        :title="variant.name"
      ></span>
    </div>

    <div class="product-card__actions">
      <button
        type="button"
        class="product-card__bag"
        :class="{
          'product-card__bag--added': props.justAdded,
          'product-card__bag--disabled': !inStock,
        }"
        :disabled="!inStock || adding"
        :aria-label="inStock ? t('product.addToBag') : t('product.outOfStock')"
        @click="onQuickAdd"
      >
        <span
          class="product-card__bag-icon"
          aria-hidden="true"
        >
          <svg
            v-if="!props.justAdded"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path d="M6 6h15l-1.5 9h-12z" />
            <path d="M6 6 5 3H2" />
            <circle
              cx="9"
              cy="20"
              r="1"
            />
            <circle
              cx="18"
              cy="20"
              r="1"
            />
          </svg>
          <svg
            v-else
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        </span>
      </button>

      <NuxtLink
        :to="productUrl"
        class="product-card__view"
      >
        <HoverShuffleText
          :text="t('product.viewProduct')"
          tag="span"
        />
        <span
          class="product-card__view-arrow"
          aria-hidden="true"
        ></span>
      </NuxtLink>
    </div>

    <div
      v-if="!inStock"
      class="product-card__sold-out-veil"
      aria-hidden="true"
    ></div>
  </div>
</template>
