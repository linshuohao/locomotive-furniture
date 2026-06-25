<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import gsap from 'gsap'
import SplitText from '@/components/scroll/SplitText.vue'
import {
  createHoverTextEffect,
  type HoverTextEffect,
  type HoverTextController,
} from '@/lib/scroll/animation'
import { getMotionCapabilitiesSnapshot } from '@/lib/motion/motionCapabilities'

const props = withDefaults(
  defineProps<{
    phrases: string[]
    interval?: number
    tag?: string
    /** @deprecated use hoverEffect */
    shuffle?: boolean
    hoverEffect?: HoverTextEffect | null
  }>(),
  {
    interval: 2800,
    tag: 'span',
    shuffle: false,
    hoverEffect: null,
  },
)

const resolvedHoverEffect = computed<HoverTextEffect | null>(() => {
  if (props.hoverEffect) return props.hoverEffect
  if (props.shuffle) return 'shuffle'
  return null
})

const rootRef = ref<HTMLElement | null>(null)
const index = ref(0)
const displayText = computed(() => props.phrases[index.value] ?? '')

let timer: ReturnType<typeof setInterval> | null = null
let activeAnim: gsap.core.Animation | null = null
let hoverController: HoverTextController | null = null

async function bindHoverEffect() {
  hoverController?.kill()
  hoverController = null

  const effect = resolvedHoverEffect.value
  if (!effect || !rootRef.value || !getMotionCapabilitiesSnapshot().animations) return

  await nextTick()
  if (!rootRef.value) return
  hoverController = createHoverTextEffect(rootRef.value, effect)
}

function animationsEnabled(): boolean {
  return getMotionCapabilitiesSnapshot().animations
}

function animateSwap(nextIndex: number) {
  const el = rootRef.value
  if (!el || props.phrases.length <= 1) return

  activeAnim?.kill()
  const tl = gsap.timeline()
  tl.to(el, { y: '-100%', autoAlpha: 0, duration: 0.5, ease: 'expo.in' })
  tl.call(() => {
    index.value = nextIndex
  })
  tl.fromTo(
    el,
    { y: '100%', autoAlpha: 0 },
    { y: '0%', autoAlpha: 1, duration: 0.65, ease: 'expo.out' },
  )
  tl.call(() => {
    void bindHoverEffect()
  })
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

onMounted(() => {
  void bindHoverEffect()
  startCycle()
})

onUnmounted(() => {
  stopCycle()
  hoverController?.kill()
  hoverController = null
})

watch(
  () => props.phrases,
  () => {
    index.value = 0
    if (rootRef.value) gsap.set(rootRef.value, { y: '0%', autoAlpha: 1 })
    void bindHoverEffect()
    startCycle()
  },
)

watch([displayText, resolvedHoverEffect], () => {
  void bindHoverEffect()
})
</script>

<template>
  <span
    class="cycling-text inline-flex overflow-hidden align-bottom"
    :class="{ 'cycling-text--hover': resolvedHoverEffect }"
  >
    <component
      :is="tag"
      ref="rootRef"
      class="cycling-text__inner block"
      :class="resolvedHoverEffect ? `hover-shuffle-text--${resolvedHoverEffect}` : undefined"
    >
      <SplitText :text="displayText" />
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

.cycling-text--hover .cycling-text__inner {
  perspective: 600px;
}

.cycling-text--hover :deep([data-split-char]) {
  transform-origin: 50% 100%;
}

@media (prefers-reduced-motion: reduce) {
  .cycling-text__inner {
    will-change: auto;
  }
}
</style>
