<script setup lang="ts">
import { ref, watch, onUnmounted, computed } from 'vue'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/data/products'
import { useLocale } from '@/composables/useLocale'
import { resolveCartLine } from '@/composables/useCartLine'

const cart = useCartStore()
const { t, locale, localizedPath } = useLocale()
const visible = ref(false)
let hideTimer: ReturnType<typeof setTimeout> | undefined

const recentLine = computed(() =>
  cart.recentAdd ? resolveCartLine(cart.recentAdd, locale.value) : null,
)

watch(
  () => cart.recentAdd,
  (item) => {
    if (!item) {
      visible.value = false
      return
    }
    visible.value = true
    clearTimeout(hideTimer)
    hideTimer = setTimeout(() => {
      visible.value = false
      cart.clearRecentAdd()
    }, 4500)
  },
)

function dismiss() {
  clearTimeout(hideTimer)
  visible.value = false
  cart.clearRecentAdd()
}

onUnmounted(() => clearTimeout(hideTimer))
</script>

<template>
  <Teleport to="body">
    <Transition name="cart-toast">
      <aside
        v-if="visible && cart.recentAdd && recentLine"
        class="cart-toast fixed z-[100] bottom-6 right-6 left-6 sm:left-auto sm:w-[22rem] bg-brand-900 text-brand-50 shadow-2xl border border-brand-700/50 p-4"
        role="status"
        aria-live="polite"
      >
        <div class="flex gap-4">
          <img
            :src="cart.recentAdd.image"
            :alt="recentLine.name"
            class="h-16 w-16 shrink-0 object-cover bg-brand-800"
          />
          <div class="min-w-0 flex-1">
            <p class="text-[10px] uppercase tracking-[0.2em] text-brand-300">
              {{ t('cart.toastAdded') }}
            </p>
            <p class="font-display text-lg leading-tight mt-0.5 truncate">
              {{ recentLine.name }}
            </p>
            <p class="text-xs text-brand-300 mt-1">
              {{ recentLine.variantName }} · {{ t('cart.toastQty') }}
              {{ cart.recentAdd.quantity }}
            </p>
            <p class="text-sm mt-1 tabular-nums">
              {{
                formatPrice(
                  cart.recentAdd.price * cart.recentAdd.quantity,
                  cart.recentAdd.currency,
                  locale,
                )
              }}
            </p>
          </div>
          <button
            type="button"
            class="shrink-0 text-brand-400 hover:text-brand-50 text-xl leading-none"
            :aria-label="t('cart.toastDismiss')"
            @click="dismiss"
          >
            ×
          </button>
        </div>
        <div class="mt-4 flex gap-2">
          <NuxtLink
            :to="localizedPath('/cart')"
            class="flex-1 text-center text-xs uppercase tracking-widest bg-brand-50 text-brand-900 py-2.5 hover:bg-white transition-colors"
            @click="dismiss"
          >
            {{ t('cart.toastViewCart', { count: cart.itemCount }) }}
          </NuxtLink>
          <button
            type="button"
            class="flex-1 text-xs uppercase tracking-widest border border-brand-600 py-2.5 hover:bg-brand-800 transition-colors"
            @click="dismiss"
          >
            {{ t('cart.toastContinue') }}
          </button>
        </div>
      </aside>
    </Transition>
  </Teleport>
</template>

<style scoped>
.cart-toast-enter-active,
.cart-toast-leave-active {
  transition:
    opacity 0.35s var(--ease-brand),
    transform 0.45s var(--ease-brand);
}

.cart-toast-enter-from,
.cart-toast-leave-to {
  opacity: 0;
  transform: translateY(1rem) scale(0.96);
}
</style>
