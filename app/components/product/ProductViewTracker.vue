<script setup lang="ts">
import { watch, onMounted } from 'vue'
import { trackProductView } from '@/lib/analytics/analytics'
import type { Product } from '@/data/schemas'

const props = defineProps<{
  product: Product
}>()

function report() {
  const variant = props.product.variants[0]
  const price = props.product.price + (variant?.priceModifier ?? 0)
  trackProductView(props.product.slug, price)
}

onMounted(report)
watch(() => props.product.slug, report)
</script>

<template>
  <span
    class="sr-only"
    aria-hidden="true"
  ></span>
</template>

<style scoped>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
