<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import CartAddedToast from '@/components/product/CartAddedToast.vue'
import { provideMotionRuntime } from '@/composables/useMotionRuntime'
import { useMotionCapabilities } from '@/composables/useMotionCapabilities'
import { installJankGuard } from '@/lib/motion/jankGuard'
import { useLocale } from '@/composables/useLocale'
import HoverShuffleText from '@/components/scroll/HoverShuffleText.vue'

const route = useRoute()
const { t, localizedPath } = useLocale()
const { runtime, scrollProgress, scrollDirection, isScrolling, scrollInstance, init, destroy } =
  provideMotionRuntime()
const { capabilities } = useMotionCapabilities()

let removeJankGuard: (() => void) | undefined

const headerHidden = computed(() => scrollDirection.value === 'down' && isScrolling.value)

const pageTransition = computed(() =>
  capabilities.value.pageTransition
    ? { name: 'page', mode: 'out-in' as const, onAfterEnter: onPageEnter }
    : false,
)

function onPageEnter() {
  void init().then(() => runtime.invalidate())
}

onMounted(() => {
  removeJankGuard = installJankGuard(runtime)
  // Always init on first load — Nuxt page transitions only fire on client route changes
  onPageEnter()
})

onUnmounted(() => {
  removeJankGuard?.()
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
      await runtime.invalidate()
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
    <main data-shuffle-zone>
      <NuxtPage :transition="pageTransition" />
    </main>
    <footer
      class="border-t border-brand-200 bg-brand-100 py-12 px-6"
      data-shuffle-zone
    >
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
              <HoverShuffleText
                :text="t('nav.collection')"
                tag="span"
              />
            </NuxtLink>
            <NuxtLink
              :to="localizedPath('/cart')"
              class="block hover:text-brand-900"
            >
              <HoverShuffleText
                :text="t('nav.cart')"
                tag="span"
              />
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
              <HoverShuffleText
                :text="t('nav.about')"
                tag="span"
              />
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
