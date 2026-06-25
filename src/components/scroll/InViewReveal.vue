<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const root = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

onMounted(() => {
  const el = root.value
  if (!el) return

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-inview')
          observer?.unobserve(entry.target)
        }
      })
    },
    { rootMargin: '0px 0px -80px 0px', threshold: 0.1 },
  )

  observer.observe(el)
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<template>
  <div ref="root" class="inview-reveal">
    <slot />
  </div>
</template>

<style scoped>
.inview-reveal:not(.is-inview) {
  opacity: 0;
  transform: translateY(24px);
  transition:
    opacity 0.6s var(--ease-brand, ease),
    transform 0.6s var(--ease-brand, ease);
}

.inview-reveal.is-inview {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .inview-reveal {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
}
</style>
