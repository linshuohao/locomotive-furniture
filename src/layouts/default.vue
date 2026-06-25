<script setup lang="ts">
import { computed, onMounted, provide, watch } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import CartAddedToast from '@/components/product/CartAddedToast.vue'
import { scrollInjectionKey, useLocomotiveScroll } from '@/composables/useLocomotiveScroll'
import { useMotionCapabilities } from '@/composables/useMotionCapabilities'
import { useLocale } from '@/composables/useLocale'

const route = useRoute()
const { t, localizedPath } = useLocale()
const {
  scrollDirection,
  isScrolling,
  scrollInstance,
  init,
  destroy,
  scrollProgress,
  update,
  scrollTo,
} = useLocomotiveScroll()
const { capabilities } = useMotionCapabilities()

provide(scrollInjectionKey, { update, scrollTo })

const headerHidden = computed(() => scrollDirection.value === 'down' && isScrolling.value)

const pageTransition = computed(() =>
  capabilities.value.pageTransition
    ? { name: 'page', mode: 'out-in' as const, onAfterEnter: onPageEnter }
    : false,
)

function onPageEnter() {
  void init().then(() => update())
}

onMounted(() => {
  if (!capabilities.value.pageTransition) {
    onPageEnter()
  }
})

watch(
  () => route.path,
  async () => {
    if (!import.meta.client) return

    if (capabilities.value.pageTransition) {
      destroy()
      document.documentElement.dataset.route = route.path
      return
    }

    if (scrollInstance.value) {
      await update()
      return
    }

    await onPageEnter()
  },
)
</script>

<template>
  <div
    class="min-h-screen"
    :style="{ '--scroll-progress': scrollProgress }"
  >
    <AppHeader :hidden="headerHidden" />
    <CartAddedToast />
    <main>
      <NuxtPage :transition="pageTransition" />
    </main>
    <footer class="border-t border-brand-200 bg-brand-100 py-12 px-6">
      <div class="mx-auto max-w-7xl flex flex-col md:flex-row justify-between gap-8">
        <div>
          <p class="font-display text-2xl text-brand-900">
            {{ t('brand.name') }}
          </p>
          <p class="text-sm text-brand-600 mt-2 max-w-xs">
            {{ t('footer.tagline') }}
          </p>
        </div>
        <div class="flex gap-12 text-sm text-brand-600">
          <div class="space-y-2">
            <p class="uppercase tracking-widest text-brand-900 text-xs">
              {{ t('footer.shop') }}
            </p>
            <NuxtLink
              :to="localizedPath('/products')"
              class="block hover:text-brand-900"
            >
              {{ t('nav.collection') }}
            </NuxtLink>
            <NuxtLink
              :to="localizedPath('/cart')"
              class="block hover:text-brand-900"
            >
              {{ t('nav.cart') }}
            </NuxtLink>
          </div>
          <div class="space-y-2">
            <p class="uppercase tracking-widest text-brand-900 text-xs">
              {{ t('footer.brand') }}
            </p>
            <NuxtLink
              :to="localizedPath('/about')"
              class="block hover:text-brand-900"
            >
              {{ t('nav.about') }}
            </NuxtLink>
          </div>
        </div>
      </div>
      <p class="text-center text-xs text-brand-500 mt-12">
        © {{ new Date().getFullYear() }} {{ t('brand.fullName') }}. {{ t('footer.rights') }}
      </p>
    </footer>
  </div>
</template>
