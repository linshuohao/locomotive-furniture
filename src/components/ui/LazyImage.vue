<script setup lang="ts">
import { ref, onMounted, inject } from 'vue'
import { scrollInjectionKey } from '@/composables/useLocomotiveScroll'

withDefaults(
  defineProps<{
    src: string
    alt: string
    lazy?: boolean
    aspect?: string
  }>(),
  {
    lazy: true,
    aspect: '4/3',
  },
)

const scroll = inject(scrollInjectionKey, null)
const imgRef = ref<HTMLImageElement | null>(null)
const loaded = ref(false)
const error = ref(false)

function markLoaded() {
  loaded.value = true
  void scroll?.update()
}

function onLoad() {
  markLoaded()
}

function onError() {
  error.value = true
  markLoaded()
}

onMounted(() => {
  const img = imgRef.value
  if (img?.complete && img.naturalWidth > 0) {
    markLoaded()
  }
})
</script>

<template>
  <div class="relative overflow-hidden bg-brand-200" :style="{ aspectRatio: aspect }">
    <div
      v-if="!loaded"
      class="absolute inset-0 animate-pulse bg-gradient-to-r from-brand-200 via-brand-100 to-brand-200"
    />
    <div
      v-if="error"
      class="absolute inset-0 flex items-center justify-center bg-brand-200 text-brand-500 text-sm"
    >
      Image unavailable
    </div>
    <img
      v-show="!error"
      ref="imgRef"
      :src="src"
      :alt="alt"
      :loading="lazy ? 'lazy' : 'eager'"
      :fetchpriority="lazy ? 'auto' : 'high'"
      decoding="async"
      class="h-full w-full object-cover transition-opacity duration-500"
      :class="loaded ? 'opacity-100' : 'opacity-0'"
      @load="onLoad"
      @error="onError"
    />
  </div>
</template>
