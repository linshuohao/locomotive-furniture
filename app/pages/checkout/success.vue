<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { trackPurchase } from '@/lib/analytics/analytics'
import { consumeCheckoutSession } from '@/lib/checkoutSession'
import BaseButton from '@/components/ui/BaseButton.vue'
import MotionSceneHost from '@/components/scroll/MotionSceneHost.vue'
import { useLocale } from '@/composables/useLocale'

usePageSeo('meta.checkoutSuccess')

const route = useRoute()
const { t, localizedPath } = useLocale()
const slugParam = route.query.orderId
const orderId = typeof slugParam === 'string' ? slugParam : ''
const verifiedSession = ref<{ orderId: string; subtotal: number } | null>(null)
const resolved = ref(false)

const successScene = {
  id: 'checkout-success-enter',
  trigger: 'mount' as const,
  effect: 'success-enter' as const,
  targets: {},
}

onMounted(() => {
  if (!orderId) {
    void navigateTo(localizedPath('/products'), { replace: true })
    return
  }

  const session = consumeCheckoutSession(orderId)
  if (!session) {
    void navigateTo(localizedPath('/products'), { replace: true })
    return
  }

  verifiedSession.value = session
  trackPurchase(session.orderId, session.subtotal)
  resolved.value = true
})
</script>

<template>
  <div class="pt-[var(--header-height)] min-h-screen">
    <MotionSceneHost
      v-if="resolved && verifiedSession"
      :scene="successScene"
    >
      <div class="relative mx-auto max-w-2xl px-6 py-24 text-center">
        <div
          class="absolute inset-0 -z-10 opacity-30 pointer-events-none bg-gradient-to-b from-brand-100 to-brand-50"
        ></div>

        <p
          data-success-item
          class="text-xs uppercase tracking-widest text-brand-500 mb-4"
        >
          {{ t('checkoutSuccess.eyebrow') }}
        </p>
        <h1
          data-success-item
          class="font-display text-4xl text-brand-900 mb-4"
        >
          {{ t('checkoutSuccess.title') }}
        </h1>
        <p
          data-success-item
          class="text-brand-600 mb-2"
        >
          {{ t('checkoutSuccess.orderNumber', { orderId: verifiedSession.orderId }) }}
        </p>
        <p
          data-success-item
          class="text-brand-500 text-sm mb-10"
        >
          {{ t('checkoutSuccess.demoNote') }}
        </p>
        <div data-success-item>
          <NuxtLink :to="localizedPath('/products')">
            <BaseButton>{{ t('cart.continueShopping') }}</BaseButton>
          </NuxtLink>
        </div>
      </div>
    </MotionSceneHost>
  </div>
</template>
