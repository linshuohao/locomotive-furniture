<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { computed, ref, watch } from 'vue'
import { useCartStore } from '@/store/cart'
import { useLocale } from '@/composables/useLocale'
import LocaleSwitcher from '@/components/layout/LocaleSwitcher.vue'

defineProps<{
  hidden?: boolean
}>()

const cart = useCartStore()
const { t, localizedPath } = useLocale()
const itemCount = computed(() => cart.itemCount)
const badgeBump = ref(false)

const links = computed(() => [
  { to: localizedPath('/'), label: t('nav.home') },
  { to: localizedPath('/products'), label: t('nav.collection') },
  { to: localizedPath('/about'), label: t('nav.about') },
])

watch(itemCount, (next, prev) => {
  if (next > prev) {
    badgeBump.value = true
    setTimeout(() => {
      badgeBump.value = false
    }, 650)
  }
})
</script>

<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 transition-transform duration-500 ease-brand"
    :class="hidden ? '-translate-y-full' : 'translate-y-0'"
  >
    <div
      class="mx-auto flex h-[var(--header-height)] max-w-7xl items-center justify-between px-6 backdrop-blur-md bg-brand-50/80 border-b border-brand-200/50"
    >
      <RouterLink
        :to="localizedPath('/')"
        class="font-display text-2xl tracking-wide text-brand-900"
      >
        {{ t('brand.name') }}
      </RouterLink>

      <nav class="hidden md:flex items-center gap-8">
        <RouterLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="text-sm uppercase tracking-widest text-brand-700 hover:text-brand-950 transition-colors"
          active-class="text-brand-950"
        >
          {{ link.label }}
        </RouterLink>
      </nav>

      <div class="flex items-center gap-4">
        <LocaleSwitcher />
        <RouterLink
          :to="localizedPath('/cart')"
          class="relative text-sm uppercase tracking-widest text-brand-700 hover:text-brand-950 transition-colors"
        >
          {{ t('nav.cart') }}
          <span
            v-if="itemCount > 0"
            class="cart-badge absolute -top-2 -right-4 flex h-5 w-5 items-center justify-center rounded-full bg-brand-900 text-[10px] text-brand-50"
            :class="{ 'cart-badge--bump': badgeBump }"
          >
            {{ itemCount }}
          </span>
        </RouterLink>
      </div>
    </div>
  </header>
</template>

<style scoped>
.ease-brand {
  transition-timing-function: var(--ease-brand);
}

.cart-badge {
  transition: transform 0.3s var(--ease-brand);
}

.cart-badge--bump {
  animation: cart-badge-pop 0.65s var(--ease-brand);
}

@keyframes cart-badge-pop {
  0% {
    transform: scale(1);
  }
  35% {
    transform: scale(1.45);
  }
  70% {
    transform: scale(0.92);
  }
  100% {
    transform: scale(1);
  }
}
</style>
