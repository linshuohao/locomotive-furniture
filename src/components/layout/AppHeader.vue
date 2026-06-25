<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { computed } from 'vue'
import { useCartStore } from '@/store/cart'

defineProps<{
  hidden?: boolean
}>()

const cart = useCartStore()
const itemCount = computed(() => cart.itemCount)

const links = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Collection' },
  { to: '/about', label: 'About' },
]
</script>

<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 transition-transform duration-500 ease-brand"
    :class="hidden ? '-translate-y-full' : 'translate-y-0'"
  >
    <div
      class="mx-auto flex h-[var(--header-height)] max-w-7xl items-center justify-between px-6 backdrop-blur-md bg-brand-50/80 border-b border-brand-200/50"
    >
      <RouterLink to="/" class="font-display text-2xl tracking-wide text-brand-900">
        Atelier
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
        <a
          href="/docs/"
          class="text-sm uppercase tracking-widest text-brand-700 hover:text-brand-950 transition-colors"
        >
          Docs
        </a>
      </nav>

      <RouterLink
        to="/cart"
        class="relative text-sm uppercase tracking-widest text-brand-700 hover:text-brand-950 transition-colors"
      >
        Cart
        <span
          v-if="itemCount > 0"
          class="absolute -top-2 -right-4 flex h-5 w-5 items-center justify-center rounded-full bg-brand-900 text-[10px] text-brand-50"
        >
          {{ itemCount }}
        </span>
      </RouterLink>
    </div>
  </header>
</template>

<style scoped>
.ease-brand {
  transition-timing-function: var(--ease-brand);
}
</style>
