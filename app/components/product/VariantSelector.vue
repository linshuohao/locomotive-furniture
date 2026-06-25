<script setup lang="ts">
import type { ProductVariant } from '@/types'
import { useI18n } from 'vue-i18n'

defineProps<{
  variants: ProductVariant[]
  modelValue: string
}>()

defineEmits<{
  'update:modelValue': [value: string]
}>()

const { t } = useI18n()
</script>

<template>
  <div class="space-y-3">
    <p class="text-xs uppercase tracking-widest text-brand-500">
      {{ t('product.selectVariant') }}
    </p>
    <div class="flex flex-wrap gap-2">
      <button
        v-for="variant in variants"
        :key="variant.id"
        type="button"
        class="px-4 py-2 text-sm border transition-all duration-300"
        :class="
          modelValue === variant.id
            ? 'border-brand-900 bg-brand-900 text-brand-50'
            : 'border-brand-300 text-brand-700 hover:border-brand-600'
        "
        @click="$emit('update:modelValue', variant.id)"
      >
        {{ variant.name }}
      </button>
    </div>
  </div>
</template>
