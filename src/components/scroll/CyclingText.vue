<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import gsap from 'gsap'
import { getMotionCapabilitiesSnapshot } from '@/lib/motion/motionCapabilities'

const props = withDefaults(
  defineProps<{
    phrases: string[]
    interval?: number
    tag?: string
  }>(),
  {
    interval: 2800,
    tag: 'span',
  },
)

const rootRef = ref<HTMLElement | null>(null)
const index = ref(0)
const displayText = computed(() => props.phrases[index.value] ?? '')

let timer: ReturnType<typeof setInterval> | null = null
let activeAnim: gsap.core.Animation | null = null

function animationsEnabled(): boolean {
  return getMotionCapabilitiesSnapshot().animations
}

function animateSwap(nextIndex: number) {
  const el = rootRef.value
  if (!el || props.phrases.length <= 1) return

  activeAnim?.kill()
  const tl = gsap.timeline()
  tl.to(el, { y: '-100%', autoAlpha: 0, duration: 0.45, ease: 'expo.in' })
  tl.call(() => {
    index.value = nextIndex
  })
  tl.fromTo(
    el,
    { y: '100%', autoAlpha: 0 },
    { y: '0%', autoAlpha: 1, duration: 0.55, ease: 'expo.out' },
  )
  activeAnim = tl
}

function startCycle() {
  stopCycle()
  if (props.phrases.length <= 1 || !animationsEnabled()) return

  timer = setInterval(() => {
    const next = (index.value + 1) % props.phrases.length
    animateSwap(next)
  }, props.interval)
}

function stopCycle() {
  if (timer) clearInterval(timer)
  timer = null
  activeAnim?.kill()
  activeAnim = null
}

onMounted(startCycle)
onUnmounted(stopCycle)

watch(
  () => props.phrases,
  () => {
    index.value = 0
    if (rootRef.value) gsap.set(rootRef.value, { y: '0%', autoAlpha: 1 })
    startCycle()
  },
)
</script>

<template>
  <span class="cycling-text inline-flex overflow-hidden align-bottom">
    <component :is="tag" ref="rootRef" class="cycling-text__inner block">
      {{ displayText }}
    </component>
  </span>
</template>

<style scoped>
.cycling-text {
  min-width: 0.5em;
}

.cycling-text__inner {
  will-change: transform, opacity;
}

@media (prefers-reduced-motion: reduce) {
  .cycling-text__inner {
    will-change: auto;
  }
}
</style>
