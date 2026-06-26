<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import type { MotionSceneDescriptor } from '@/lib/motion/scene'
import { resolveSceneFactory } from '@/lib/motion/sceneRegistry'
import { useGsapTimeline } from '@/composables/useGsapTimeline'
import { usePageIntroComplete } from '@/composables/usePageIntroComplete'
import { trackMotionSkipped } from '@/lib/analytics/analytics'
import { getMotionCapabilitiesSnapshot } from '@/lib/motion/motionCapabilities'
import { meetsSceneRequirements, resolveSceneActive } from '@/lib/motion/sceneActivation'

const props = defineProps<{
  scene: MotionSceneDescriptor
  /** Overrides scene.trigger when provided */
  when?: boolean | string | number
}>()

const rootRef = ref<HTMLElement | null>(null)
const inViewActive = ref(false)
const pageIntroComplete = usePageIntroComplete()

const isActive = computed(() =>
  resolveSceneActive(props.scene.trigger, {
    hasRoot: !!rootRef.value,
    inViewActive: inViewActive.value,
    introComplete: pageIntroComplete?.value ?? false,
    when: props.when,
  }),
)

let observer: IntersectionObserver | undefined

function teardownObserver() {
  observer?.disconnect()
  observer = undefined
}

function setupInViewObserver(el: HTMLElement) {
  teardownObserver()
  inViewActive.value = false

  observer = new IntersectionObserver(
    ([entry]) => {
      inViewActive.value = entry?.isIntersecting ?? false
    },
    { threshold: 0.15 },
  )
  observer.observe(el)
}

watch(
  rootRef,
  (el) => {
    if (props.scene.trigger !== 'inview') return
    if (el) setupInViewObserver(el)
    else teardownObserver()
  },
  { immediate: true },
)

onUnmounted(teardownObserver)

function meetsRequirements(): boolean {
  return meetsSceneRequirements(props.scene.requires, getMotionCapabilitiesSnapshot())
}

useGsapTimeline(
  () => {
    if (!rootRef.value || !isActive.value) return

    if (!getMotionCapabilitiesSnapshot().animations) {
      trackMotionSkipped(props.scene.id, 'animations-disabled')
      return
    }

    if (!meetsRequirements()) {
      trackMotionSkipped(props.scene.id, 'capabilities-mismatch')
      return
    }

    const factory = resolveSceneFactory(props.scene.effect)
    factory(rootRef.value, props.scene.targets, props.scene.options)
  },
  { watchSource: computed(() => (isActive.value && rootRef.value ? isActive.value : false)) },
)
</script>

<template>
  <div ref="rootRef">
    <slot></slot>
  </div>
</template>
