<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { trackPurchase } from '@/lib/analytics/analytics'
import BaseButton from '@/components/ui/BaseButton.vue'
import ScrollReveal from '@/components/scroll/ScrollReveal.vue'
import { useGsapTimeline } from '@/composables/useGsapTimeline'
import { createSuccessTimeline } from '@/lib/scroll/animation'
import { useLocale } from '@/composables/useLocale'

usePageSeo('meta.checkoutSuccess')

const route = useRoute()
const { t, localizedPath } = useLocale()
const orderId = (route.query.orderId as string) ?? ''
const containerRef = ref<HTMLElement | null>(null)

onMounted(() => {
  if (orderId) {
    const subtotal = Number(route.query.subtotal ?? 0)
    trackPurchase(orderId, subtotal)
  }
})

useGsapTimeline(
  () => {
    if (containerRef.value) createSuccessTimeline(containerRef.value)
  },
  { watchSource: containerRef },
)
</script>

<template>
  <div class="pt-[var(--header-height)] min-h-screen">
    <div ref="containerRef" class="relative mx-auto max-w-2xl px-6 py-24 text-center">
      <ScrollReveal :speed="-0.1" class="absolute inset-0 -z-10 opacity-30 pointer-events-none">
        <div class="h-full w-full bg-gradient-to-b from-brand-100 to-brand-50" />
      </ScrollReveal>

      <p data-success-item class="text-xs uppercase tracking-widest text-brand-500 mb-4">
        {{ t('checkoutSuccess.eyebrow') }}
      </p>
      <h1 data-success-item class="font-display text-4xl text-brand-900 mb-4">
        {{ t('checkoutSuccess.title') }}
      </h1>
      <p v-if="orderId" data-success-item class="text-brand-600 mb-2">
        {{ t('checkoutSuccess.orderNumber', { orderId }) }}
      </p>
      <p data-success-item class="text-brand-500 text-sm mb-10">
        {{ t('checkoutSuccess.demoNote') }}
      </p>
      <div data-success-item>
        <NuxtLink :to="localizedPath('/products')">
          <BaseButton>{{ t('cart.continueShopping') }}</BaseButton>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
