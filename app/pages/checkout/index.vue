<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/data/products'
import { CheckoutFormSchema } from '@/data/schemas'
import { getCommerceConfig } from '@/data/config'
import { trackBeginCheckout } from '@/lib/analytics/analytics'
import { setCheckoutSession } from '@/lib/checkoutSession'
import { translateErrorKey } from '@/lib/i18n/translateError'
import BaseButton from '@/components/ui/BaseButton.vue'
import ScrollReveal from '@/components/scroll/ScrollReveal.vue'
import { useLocale } from '@/composables/useLocale'
import { resolveCartLine } from '@/composables/useCartLine'

usePageSeo('meta.checkout')

const cart = useCartStore()
const { t, te, locale, localizedPath } = useLocale()
const { paymentProvider } = getCommerceConfig()
const showPaymentDemoNote = paymentProvider !== 'none'

const form = ref({
  email: '',
  firstName: '',
  lastName: '',
  address: '',
  city: '',
  country: '',
  postalCode: '',
})

const errors = ref<Partial<Record<keyof typeof form.value, string>>>({})
const submitting = ref(false)
const ready = ref(false)

const isValid = computed(() => CheckoutFormSchema.safeParse(form.value).success)

onMounted(() => {
  if (cart.items.length === 0) {
    void navigateTo(localizedPath('/cart'), { replace: true })
    return
  }
  ready.value = true
})

function validate(): boolean {
  const result = CheckoutFormSchema.safeParse(form.value)
  errors.value = {}

  if (result.success) return true

  for (const issue of result.error.issues) {
    const field = issue.path[0]
    if (typeof field === 'string' && field in form.value) {
      errors.value[field as keyof typeof form.value] =
        field === 'email' ? t('checkout.errors.email') : t('checkout.errors.required')
    }
  }

  return false
}

async function submit() {
  if (!validate()) return
  submitting.value = true
  trackBeginCheckout(cart.itemCount, cart.subtotal)
  const subtotalBefore = cart.subtotal
  try {
    const result = await cart.submitCheckout(form.value)
    setCheckoutSession(result.orderId, subtotalBefore)
    await navigateTo({
      path: localizedPath('/checkout/success'),
      query: { orderId: result.orderId },
    })
  } catch (err) {
    const key = err instanceof Error ? err.message : 'checkout.errors.failed'
    errors.value.email = translateErrorKey(t, te, key)
  } finally {
    submitting.value = false
  }
}

const fields = computed(() => [
  { key: 'email' as const, label: t('checkout.email'), type: 'email' },
  { key: 'firstName' as const, label: t('checkout.firstName') },
  { key: 'lastName' as const, label: t('checkout.lastName') },
  { key: 'address' as const, label: t('checkout.address') },
  { key: 'city' as const, label: t('checkout.city') },
  { key: 'country' as const, label: t('checkout.country') },
  { key: 'postalCode' as const, label: t('checkout.postalCode') },
])

const resolvedItems = computed(() =>
  cart.items.map((item) => ({
    ...item,
    ...resolveCartLine(item, locale.value),
  })),
)
</script>

<template>
  <div
    v-if="ready"
    class="pt-[var(--header-height)] min-h-screen"
  >
    <div class="mx-auto max-w-4xl px-6 py-16">
      <ScrollReveal
        tag="h1"
        class="font-display text-4xl text-brand-900 mb-12"
      >
        {{ t('checkout.title') }}
      </ScrollReveal>

      <div class="grid lg:grid-cols-5 gap-12">
        <form
          class="lg:col-span-3 space-y-6"
          @submit.prevent="submit"
        >
          <ScrollReveal
            v-for="field in fields"
            :key="field.key"
          >
            <label
              :for="field.key"
              class="block text-xs uppercase tracking-widest text-brand-500 mb-2"
            >
              {{ field.label }}
            </label>
            <input
              :id="field.key"
              v-model="form[field.key]"
              :type="field.type || 'text'"
              class="w-full border border-brand-300 bg-white px-4 py-3 text-brand-900 focus:border-brand-900 focus:outline-none transition-colors"
            />
            <p
              v-if="errors[field.key]"
              class="text-red-600 text-xs mt-1"
            >
              {{ errors[field.key] }}
            </p>
          </ScrollReveal>

          <ScrollReveal>
            <p
              v-if="showPaymentDemoNote"
              class="text-xs text-brand-500 mb-4"
            >
              {{ t('checkout.paymentDemoNote', { provider: paymentProvider }) }}
            </p>
            <BaseButton
              data-testid="place-order"
              type="submit"
              size="lg"
              class="w-full"
              :disabled="!isValid || submitting"
            >
              {{ submitting ? t('checkout.processing') : t('checkout.placeOrder') }}
            </BaseButton>
          </ScrollReveal>
        </form>

        <ScrollReveal class="lg:col-span-2 bg-brand-100 p-8 h-fit">
          <h2 class="text-xs uppercase tracking-widest text-brand-900 mb-6">
            {{ t('checkout.orderSummary') }}
          </h2>
          <ul class="space-y-4 mb-6">
            <li
              v-for="item in resolvedItems"
              :key="`${item.productId}-${item.variantId}`"
              class="flex justify-between text-sm"
            >
              <span class="text-brand-700">{{ item.name }} × {{ item.quantity }}</span>
              <span>{{ formatPrice(item.price * item.quantity, item.currency, locale) }}</span>
            </li>
          </ul>
          <div class="border-t border-brand-300 pt-4 flex justify-between">
            <span class="uppercase tracking-widest text-xs text-brand-500">{{
              t('checkout.total')
            }}</span>
            <span class="font-display text-xl">{{
              formatPrice(cart.subtotal, cart.currency, locale)
            }}</span>
          </div>
        </ScrollReveal>
      </div>
    </div>
  </div>
</template>
