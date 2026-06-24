<script setup lang="ts">
import type { CartItem } from '@/types'
import { formatPrice } from '@/data/products'
import LazyImage from '@/components/base/LazyImage.vue'
import BaseButton from '@/components/base/BaseButton.vue'

defineProps<{
  item: CartItem
}>()

const emit = defineEmits<{
  updateQuantity: [quantity: number]
  remove: []
}>()
</script>

<template>
  <div class="flex gap-6 py-6 border-b border-brand-200">
    <div class="w-24 shrink-0">
      <LazyImage :src="item.image" :alt="item.name" aspect="1/1" />
    </div>
    <div class="flex flex-1 flex-col justify-between">
      <div>
        <h3 class="font-display text-lg text-brand-900">{{ item.name }}</h3>
        <p class="text-sm text-brand-500 mt-1">{{ item.variantName }}</p>
      </div>
      <div class="flex items-center justify-between mt-4">
        <div class="flex items-center gap-3">
          <button
            type="button"
            class="w-8 h-8 border border-brand-300 flex items-center justify-center hover:border-brand-900 transition-colors"
            @click="emit('updateQuantity', item.quantity - 1)"
          >
            −
          </button>
          <span class="text-sm w-6 text-center">{{ item.quantity }}</span>
          <button
            type="button"
            class="w-8 h-8 border border-brand-300 flex items-center justify-center hover:border-brand-900 transition-colors"
            @click="emit('updateQuantity', item.quantity + 1)"
          >
            +
          </button>
        </div>
        <p class="text-sm font-medium">{{ formatPrice(item.price * item.quantity) }}</p>
      </div>
    </div>
    <BaseButton variant="ghost" size="sm" @click="emit('remove')">Remove</BaseButton>
  </div>
</template>
