<script setup lang="ts">
import { computed, provide, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import CartAddedToast from '@/components/product/CartAddedToast.vue'
import { scrollInjectionKey, useLocomotiveScroll } from '@/composables/useLocomotiveScroll'
import { useMotionCapabilities } from '@/composables/useMotionCapabilities'
import { useLocale } from '@/composables/useLocale'

const route = useRoute()
const { t, localizedPath } = useLocale()
const { scrollDirection, isScrolling, init, destroy, scrollProgress, update, scrollTo } =
  useLocomotiveScroll()
const { capabilities } = useMotionCapabilities()

provide(scrollInjectionKey, { update, scrollTo })

const headerHidden = computed(() => scrollDirection.value === 'down' && isScrolling.value)

watch(
  () => route.path,
  (path) => {
    destroy()
    if (capabilities.value.pageTransition) {
      document.documentElement.dataset.route = path
    } else {
      onPageEnter()
    }
  },
)

function onPageEnter() {
  void init().then(() => update())
}
</script>

<template>
  <div class="min-h-screen" :style="{ '--scroll-progress': scrollProgress }">
    <AppHeader :hidden="headerHidden" />
    <CartAddedToast />
    <main>
      <RouterView v-slot="{ Component, route: currentRoute }">
        <Transition
          v-if="capabilities.pageTransition"
          name="page"
          mode="out-in"
          @after-enter="onPageEnter"
        >
          <component :is="Component" :key="currentRoute.path" />
        </Transition>
        <component :is="Component" v-else :key="currentRoute.path" />
      </RouterView>
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
            <RouterLink :to="localizedPath('/products')" class="block hover:text-brand-900">
              {{ t('nav.collection') }}
            </RouterLink>
            <RouterLink :to="localizedPath('/cart')" class="block hover:text-brand-900">
              {{ t('nav.cart') }}
            </RouterLink>
          </div>
          <div class="space-y-2">
            <p class="uppercase tracking-widest text-brand-900 text-xs">
              {{ t('footer.brand') }}
            </p>
            <RouterLink :to="localizedPath('/about')" class="block hover:text-brand-900">
              {{ t('nav.about') }}
            </RouterLink>
          </div>
        </div>
      </div>
      <p class="text-center text-xs text-brand-500 mt-12">
        © {{ new Date().getFullYear() }} {{ t('brand.fullName') }}. {{ t('footer.rights') }}
      </p>
    </footer>
  </div>
</template>
