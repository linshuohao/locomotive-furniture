<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    items: string[]
    speed?: 'slow' | 'normal' | 'fast'
    reverse?: boolean
    separator?: string
  }>(),
  {
    speed: 'normal',
    reverse: false,
    separator: '·',
  },
)

const trackClass = computed(() => [
  'marquee-track',
  `marquee-track--${props.speed}`,
  props.reverse ? 'marquee-track--reverse' : '',
])
</script>

<template>
  <div
    class="marquee-band overflow-hidden border-y border-brand-300/40 bg-brand-100/60 py-4"
    aria-hidden="true"
  >
    <div :class="trackClass">
      <span v-for="(item, i) in items" :key="`a-${i}`" class="marquee-item">
        {{ item }}<span class="marquee-sep">{{ separator }}</span>
      </span>
      <span v-for="(item, i) in items" :key="`b-${i}`" class="marquee-item">
        {{ item }}<span class="marquee-sep">{{ separator }}</span>
      </span>
    </div>
  </div>
</template>

<style scoped>
.marquee-track {
  display: flex;
  width: max-content;
  animation: marquee-scroll 28s linear infinite;
}

.marquee-track--slow {
  animation-duration: 40s;
}

.marquee-track--fast {
  animation-duration: 18s;
}

.marquee-track--reverse {
  animation-direction: reverse;
}

.marquee-item {
  flex-shrink: 0;
  padding: 0 1.5rem;
  font-family: var(--font-display);
  font-size: clamp(1.25rem, 3vw, 2rem);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: var(--color-brand-700);
  white-space: nowrap;
}

.marquee-sep {
  margin-left: 1.5rem;
  opacity: 0.35;
}

@keyframes marquee-scroll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .marquee-track {
    animation: none;
    flex-wrap: wrap;
    width: 100%;
    justify-content: center;
  }
}
</style>
