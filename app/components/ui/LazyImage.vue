<script setup lang="ts">
import { ref, computed, watch, nextTick, onUnmounted } from 'vue'
import { useLayoutInvalidation } from '@/composables/useLayoutInvalidation'
import { LAZY_LOAD_ROOT_MARGIN } from '@/lib/scroll/scrollConstants'
import { useLocale } from '@/composables/useLocale'

const props = withDefaults(
  defineProps<{
    src: string
    alt: string
    /** Eager load + high fetch priority (above-the-fold) */
    priority?: boolean
    /** Wait for `activated` or viewport before setting src */
    defer?: boolean
    /** When defer is true, parent toggles this to start loading */
    activated?: boolean
    aspect?: string
    /** Fill parent container (for stacked / absolute image layers) */
    fill?: boolean
    class?: string
  }>(),
  {
    priority: false,
    defer: false,
    activated: true,
    aspect: '4/3',
    fill: false,
    class: '',
  },
)

const { t } = useLocale()
const invalidateLayout = useLayoutInvalidation()

const rootRef = ref<HTMLElement | null>(null)
const imgRef = ref<HTMLImageElement | null>(null)
const loaded = ref(false)
const error = ref(false)
const inView = ref(props.priority || !props.defer)

const shouldLoad = computed(() => {
  if (props.priority) return true
  if (!props.defer) return true
  return props.activated && inView.value
})

const resolvedSrc = computed(() => (shouldLoad.value ? props.src : undefined))

const isLazy = computed(() => !props.priority && !props.defer)

let observer: IntersectionObserver | undefined

function markLoaded() {
  loaded.value = true
  void invalidateLayout()
}

function onLoad() {
  markLoaded()
}

function onError() {
  error.value = true
  markLoaded()
}

function checkAlreadyLoaded() {
  const img = imgRef.value
  if (img?.complete && img.naturalWidth > 0) {
    markLoaded()
  }
}

watch(resolvedSrc, () => {
  loaded.value = false
  error.value = false
  if (resolvedSrc.value) {
    nextTick(() => checkAlreadyLoaded())
  }
})

onMounted(() => {
  if (props.priority || !props.defer) {
    checkAlreadyLoaded()
    return
  }

  const root = rootRef.value
  if (!root) return

  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry?.isIntersecting) {
        inView.value = true
        observer?.disconnect()
        observer = undefined
      }
    },
    { rootMargin: LAZY_LOAD_ROOT_MARGIN },
  )
  observer.observe(root)
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<template>
  <div
    ref="rootRef"
    class="lazy-image relative overflow-hidden bg-brand-200"
    :class="[$props.class, fill && 'h-full w-full']"
    :style="fill ? undefined : { aspectRatio: aspect }"
  >
    <div
      v-if="!loaded && !error"
      class="lazy-image__shimmer absolute inset-0"
      aria-hidden="true"
    ></div>
    <div
      v-if="error"
      class="absolute inset-0 flex items-center justify-center bg-brand-200 text-brand-500 text-sm"
    >
      {{ t('ui.imageUnavailable') }}
    </div>
    <img
      v-if="resolvedSrc"
      v-show="!error"
      ref="imgRef"
      :src="resolvedSrc"
      :alt="alt"
      :loading="isLazy ? 'lazy' : 'eager'"
      :fetchpriority="priority ? 'high' : 'auto'"
      :decoding="priority ? 'sync' : 'async'"
      class="h-full w-full object-cover transition-opacity duration-300 ease-out"
      :class="loaded ? 'opacity-100' : 'opacity-0'"
      @load="onLoad"
      @error="onError"
    />
  </div>
</template>
