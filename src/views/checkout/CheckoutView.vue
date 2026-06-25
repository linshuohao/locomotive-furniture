<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/store/cart'
import { formatPrice } from '@/data/products'
import type { CheckoutForm } from '@/types'
import { trackBeginCheckout } from '@/lib/analytics/analytics'
import BaseButton from '@/components/ui/BaseButton.vue'
import ScrollReveal from '@/components/scroll/ScrollReveal.vue'

const cart = useCartStore()
const router = useRouter()

const form = ref<CheckoutForm>({
  email: '',
  firstName: '',
  lastName: '',
  address: '',
  city: '',
  country: '',
  postalCode: '',
})

const errors = ref<Partial<Record<keyof CheckoutForm, string>>>({})
const submitting = ref(false)

const isValid = computed(() => {
  return (
    form.value.email.includes('@') &&
    form.value.firstName.trim() &&
    form.value.lastName.trim() &&
    form.value.address.trim() &&
    form.value.city.trim() &&
    form.value.country.trim() &&
    form.value.postalCode.trim()
  )
})

onMounted(() => {
  if (cart.items.length === 0) router.replace('/cart')
})

function validate(): boolean {
  errors.value = {}
  if (!form.value.email.includes('@')) errors.value.email = 'Valid email required'
  if (!form.value.firstName.trim()) errors.value.firstName = 'Required'
  if (!form.value.lastName.trim()) errors.value.lastName = 'Required'
  if (!form.value.address.trim()) errors.value.address = 'Required'
  if (!form.value.city.trim()) errors.value.city = 'Required'
  if (!form.value.country.trim()) errors.value.country = 'Required'
  if (!form.value.postalCode.trim()) errors.value.postalCode = 'Required'
  return Object.keys(errors.value).length === 0
}

async function submit() {
  if (!validate()) return
  submitting.value = true
  trackBeginCheckout(cart.itemCount, cart.subtotal)
  const subtotalBefore = cart.subtotal
  try {
    const result = await cart.submitCheckout(form.value)
    await router.push({
      name: 'checkout-success',
      query: { orderId: result.orderId, subtotal: String(subtotalBefore) },
    })
  } catch (err) {
    errors.value.email = err instanceof Error ? err.message : 'Checkout failed'
  } finally {
    submitting.value = false
  }
}

const fields: { key: keyof CheckoutForm; label: string; type?: string }[] = [
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'firstName', label: 'First Name' },
  { key: 'lastName', label: 'Last Name' },
  { key: 'address', label: 'Address' },
  { key: 'city', label: 'City' },
  { key: 'country', label: 'Country' },
  { key: 'postalCode', label: 'Postal Code' },
]
</script>

<template>
  <div class="pt-[var(--header-height)] min-h-screen">
    <div class="mx-auto max-w-4xl px-6 py-16">
      <ScrollReveal tag="h1" class="font-display text-4xl text-brand-900 mb-12">
        Checkout
      </ScrollReveal>

      <div class="grid lg:grid-cols-5 gap-12">
        <form class="lg:col-span-3 space-y-6" @submit.prevent="submit">
          <ScrollReveal v-for="field in fields" :key="field.key">
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
            <p v-if="errors[field.key]" class="text-red-600 text-xs mt-1">
              {{ errors[field.key] }}
            </p>
          </ScrollReveal>

          <ScrollReveal>
            <BaseButton type="submit" size="lg" class="w-full" :disabled="!isValid || submitting">
              {{ submitting ? 'Processing...' : 'Place Order (Demo)' }}
            </BaseButton>
          </ScrollReveal>
        </form>

        <ScrollReveal class="lg:col-span-2 bg-brand-100 p-8 h-fit">
          <h2 class="text-xs uppercase tracking-widest text-brand-900 mb-6">Order Summary</h2>
          <ul class="space-y-4 mb-6">
            <li
              v-for="item in cart.items"
              :key="`${item.productId}-${item.variantId}`"
              class="flex justify-between text-sm"
            >
              <span class="text-brand-700">{{ item.name }} × {{ item.quantity }}</span>
              <span>{{ formatPrice(item.price * item.quantity) }}</span>
            </li>
          </ul>
          <div class="border-t border-brand-300 pt-4 flex justify-between">
            <span class="uppercase tracking-widest text-xs text-brand-500">Total</span>
            <span class="font-display text-xl">{{ formatPrice(cart.subtotal) }}</span>
          </div>
        </ScrollReveal>
      </div>
    </div>
  </div>
</template>
