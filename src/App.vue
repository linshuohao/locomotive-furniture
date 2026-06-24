<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/base/AppHeader.vue'
import { useLocomotiveScroll } from '@/core/useLocomotiveScroll'

const route = useRoute()
const { scrollDirection, isScrolling, init, destroy, update, scrollProgress } =
  useLocomotiveScroll()

const headerHidden = computed(
  () =>
    scrollDirection.value === 'down' &&
    isScrolling.value &&
    Boolean(route.meta.scrollEffects),
)

onMounted(() => {
  if (route.meta.scrollEffects) init()
})

watch(
  () => route.path,
  async () => {
    destroy()
    await update()
    if (route.meta.scrollEffects) {
      await init()
    }
  },
)
</script>

<template>
  <div
    class="min-h-screen"
    :style="{ '--scroll-progress': scrollProgress }"
  >
    <AppHeader :hidden="headerHidden" />
    <main>
      <RouterView v-slot="{ Component, route: currentRoute }">
        <Transition name="page" mode="out-in">
          <component :is="Component" :key="currentRoute.path" />
        </Transition>
      </RouterView>
    </main>
    <footer class="border-t border-brand-200 bg-brand-100 py-12 px-6">
      <div class="mx-auto max-w-7xl flex flex-col md:flex-row justify-between gap-8">
        <div>
          <p class="font-display text-2xl text-brand-900">Atelier</p>
          <p class="text-sm text-brand-600 mt-2 max-w-xs">
            Curated furniture for modern living. Crafted with intention, shipped worldwide.
          </p>
        </div>
        <div class="flex gap-12 text-sm text-brand-600">
          <div class="space-y-2">
            <p class="uppercase tracking-widest text-brand-900 text-xs">Shop</p>
            <RouterLink to="/products" class="block hover:text-brand-900">Collection</RouterLink>
            <RouterLink to="/cart" class="block hover:text-brand-900">Cart</RouterLink>
          </div>
          <div class="space-y-2">
            <p class="uppercase tracking-widest text-brand-900 text-xs">Brand</p>
            <RouterLink to="/about" class="block hover:text-brand-900">About</RouterLink>
          </div>
        </div>
      </div>
      <p class="text-center text-xs text-brand-500 mt-12">
        © {{ new Date().getFullYear() }} Atelier Furniture. All rights reserved.
      </p>
    </footer>
  </div>
</template>
