<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import type { MotionSceneDescriptor } from '@/lib/motion/scene'
import type { MotionCapabilities } from '@/lib/motion/motionCapabilities'
import { resolveSceneFactory } from '@/lib/motion/sceneRegistry'
import { useGsapTimeline } from '@/composables/useGsapTimeline'
import { trackMotionSkipped } from '@/lib/analytics/analytics'
import { getMotionCapabilitiesSnapshot } from '@/lib/motion/motionCapabilities'

const props = defineProps<{
  scene: MotionSceneDescriptor
  /** Overrides scene.trigger when provided */
  when?: boolean | string | number
}>()

const rootRef = ref<HTMLElement | null>(null)
const inViewActive = ref(false)

const isActive = computed(() => {
  if (props.when !== undefined) {
    return props.when !== false && props.when !== 0 && props.when !== ''
  }

  switch (props.scene.trigger) {
    case 'mount':
      return !!rootRef.value
    case 'inview':
      return inViewActive.value
    case 'intro-complete':
      return false
    case 'scrub':
      return !!rootRef.value
    default:
      return !!rootRef.value
  }
})

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
  const requires = props.scene.requires
  if (!requires) return true

  const caps = getMotionCapabilitiesSnapshot()
  return (Object.keys(requires) as (keyof MotionCapabilities)[]).every(
    (key) => caps[key] === requires[key],
  )
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
