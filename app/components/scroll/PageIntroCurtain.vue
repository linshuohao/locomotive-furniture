<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getMotionCapabilitiesSnapshot } from '@/lib/motion/motionCapabilities'
import { createPageIntroCurtainTimeline } from '@/lib/scroll/animation'
import { useGsapTimeline } from '@/composables/useGsapTimeline'
import { useLocale } from '@/composables/useLocale'
import CyclingText from '@/components/scroll/CyclingText.vue'

const emit = defineEmits<{
  complete: []
}>()

const { t } = useLocale()
const curtainRef = ref<HTMLElement | null>(null)
const labelRef = ref<HTMLElement | null>(null)
const visible = ref(true)

const introPhrases = computed(() => [
  t('home.intro.cycling1'),
  t('home.intro.cycling2'),
  t('home.intro.cycling3'),
])

function finishIntro() {
  visible.value = false
  emit('complete')
}

onMounted(() => {
  if (!getMotionCapabilitiesSnapshot().animations) {
    finishIntro()
  }
})

useGsapTimeline(
  () => {
    const curtain = curtainRef.value
    const label = labelRef.value
    if (!curtain) {
      finishIntro()
      return
    }

    createPageIntroCurtainTimeline(curtain, label, finishIntro)
  },
  { watchSource: () => curtainRef.value },
)
</script>

<template>
  <ClientOnly>
    <div
      v-if="visible"
      ref="curtainRef"
      class="page-intro-curtain"
      aria-hidden="true"
    >
      <p
        ref="labelRef"
        class="page-intro-curtain__label font-display type-intro"
      >
        <CyclingText
          :phrases="introPhrases"
          hover-effect="wave"
          tag="span"
        />
      </p>
    </div>
  </ClientOnly>
</template>

<style scoped>
.page-intro-curtain__label :deep(.cycling-text__inner) {
  will-change: transform, opacity;
}
</style>
