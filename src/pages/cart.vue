<script setup lang="ts">
import { computed } from 'vue'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/data/products'
import CartItemRow from '@/components/product/CartItem.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import ScrollReveal from '@/components/scroll/ScrollReveal.vue'
import { useLocale } from '@/composables/useLocale'

usePageSeo('meta.cart')

const cart = useCartStore()
const { t, locale, localizedPath } = useLocale()
const isEmpty = computed(() => cart.items.length === 0)
</script>

<template>
  <div class="pt-[var(--header-height)] min-h-screen">
    <div class="mx-auto max-w-3xl px-6 py-16">
      <ScrollReveal class="mb-12">
        <h1 class="font-display text-4xl text-brand-900 mb-2">
          {{ t('cart.title') }}
        </h1>
        <p class="text-brand-500 text-sm">
          {{ cart.itemCount }}
          {{ cart.itemCount === 1 ? t('cart.item') : t('cart.items') }}
        </p>
      </ScrollReveal>

      <ScrollReveal
        v-if="isEmpty"
        class="text-center py-24"
      >
        <p class="text-brand-600 mb-8">
          {{ t('cart.empty') }}
        </p>
        <NuxtLink :to="localizedPath('/products')">
          <BaseButton>{{ t('cart.continueShopping') }}</BaseButton>
        </NuxtLink>
      </ScrollReveal>

      <template v-else>
        <div>
          <ScrollReveal
            v-for="item in cart.items"
            :key="`${item.productId}-${item.variantId}`"
          >
            <CartItemRow
              :item="item"
              @update-quantity="(q) => cart.updateQuantity(item.productId, item.variantId, q)"
              @remove="cart.removeItem(item.productId, item.variantId)"
            />
          </ScrollReveal>
        </div>

        <div class="mt-8 pt-8 border-t border-brand-200">
          <ScrollReveal>
            <div class="flex justify-between items-center">
              <p class="text-sm uppercase tracking-widest text-brand-500">
                {{ t('cart.subtotal') }}
              </p>
              <p class="font-display text-2xl text-brand-900">
                {{ formatPrice(cart.subtotal, 'USD', locale) }}
              </p>
            </div>

            <p class="text-xs text-brand-500 mt-2">
              {{ t('cart.shippingNote') }}
            </p>

            <div class="mt-8 flex flex-col sm:flex-row gap-4">
              <NuxtLink
                :to="localizedPath('/checkout')"
                class="flex-1"
              >
                <BaseButton
                  data-testid="cart-checkout"
                  size="lg"
                  class="w-full"
                >
                  {{ t('cart.checkout') }}
                </BaseButton>
              </NuxtLink>
              <NuxtLink :to="localizedPath('/products')">
                <BaseButton
                  variant="secondary"
                  size="lg"
                  class="w-full"
                >
                  {{ t('cart.continueShopping') }}
                </BaseButton>
              </NuxtLink>
            </div>
          </ScrollReveal>
        </div>
      </template>
    </div>
  </div>
</template>
