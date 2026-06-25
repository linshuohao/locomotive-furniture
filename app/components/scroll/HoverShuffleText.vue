<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import SplitText from '@/components/scroll/SplitText.vue'
import {
  createHoverTextEffect,
  type HoverTextEffect,
  type HoverTextController,
} from '@/lib/scroll/animation'
import { getMotionCapabilitiesSnapshot } from '@/lib/motion/motionCapabilities'

const props = withDefaults(
  defineProps<{
    text: string
    tag?: string
    effect?: HoverTextEffect
    /** Per-char stagger on hover (Locomotive nav ~0.024) */
    stagger?: number
  }>(),
  {
    tag: 'span',
    effect: 'shuffle',
    stagger: 0.024,
  },
)

const rootRef = ref<HTMLElement | null>(null)
let controller: HoverTextController | null = null

async function bindEffect() {
  controller?.kill()
  controller = null

  if (!rootRef.value || !getMotionCapabilitiesSnapshot().animations) return

  await nextTick()
  if (!rootRef.value) return

  controller = createHoverTextEffect(rootRef.value, props.effect, { stagger: props.stagger })
}

onMounted(() => {
  void bindEffect()
})

onUnmounted(() => {
  controller?.kill()
  controller = null
})

watch(
  () => [props.text, props.effect, props.stagger] as const,
  () => {
    void bindEffect()
  },
)
</script>

<template>
  <component
    :is="tag"
    ref="rootRef"
    class="hover-shuffle-text"
    :class="`hover-shuffle-text--${effect}`"
  >
    <SplitText
      :text="text"
      tag="span"
    />
  </component>
</template>

<style scoped>
.hover-shuffle-text {
  perspective: 600px;
}

.hover-shuffle-text--skew {
  perspective: 800px;
}

.hover-shuffle-text :deep([data-split-char]) {
  transform-origin: 50% 100%;
  will-change: transform;
}

.hover-shuffle-text--skew :deep([data-split-char]) {
  transform-origin: 50% 50%;
}

@media (prefers-reduced-motion: reduce) {
  .hover-shuffle-text :deep([data-split-char]) {
    will-change: auto;
  }
}
</style>
