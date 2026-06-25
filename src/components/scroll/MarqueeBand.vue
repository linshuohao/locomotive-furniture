<script setup lang="ts">
withDefaults(
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
</script>

<template>
  <div
    class="marquee-band relative z-10 overflow-hidden border-y border-brand-300/40 bg-brand-100 py-4"
    data-lenis-prevent
    aria-hidden="true"
  >
    <div
      class="marquee-band__track"
      :class="{
        'marquee-band__track--slow': speed === 'slow',
        'marquee-band__track--fast': speed === 'fast',
        'marquee-band__track--reverse': reverse,
      }"
    >
      <span
        v-for="(item, i) in items"
        :key="`a-${i}`"
        class="marquee-band__item shrink-0 px-6 font-display text-[clamp(1.25rem,3vw,2rem)] uppercase tracking-[0.2em] text-brand-700 whitespace-nowrap"
      >
        {{ item }}<span class="marquee-band__sep">{{ separator }}</span>
      </span>
      <span
        v-for="(item, i) in items"
        :key="`b-${i}`"
        class="marquee-band__item shrink-0 px-6 font-display text-[clamp(1.25rem,3vw,2rem)] uppercase tracking-[0.2em] text-brand-700 whitespace-nowrap"
      >
        {{ item }}<span class="marquee-band__sep">{{ separator }}</span>
      </span>
    </div>
  </div>
</template>

<style scoped>
/* translate 与 Locomotive/GSAP 的 inline transform 互不干扰 */
.marquee-band__track {
  display: flex;
  width: max-content;
  animation: marquee-band-scroll 28s linear infinite;
  will-change: translate;
}

.marquee-band__track--slow {
  animation-duration: 40s;
}

.marquee-band__track--fast {
  animation-duration: 18s;
}

.marquee-band__track--reverse {
  animation-direction: reverse;
}

.marquee-band__sep {
  margin-left: 1.5rem;
  opacity: 0.35;
}

@keyframes marquee-band-scroll {
  from {
    translate: 0 0;
  }
  to {
    translate: -50% 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .marquee-band__track {
    animation: none;
    flex-wrap: wrap;
    width: 100%;
    justify-content: center;
    will-change: auto;
  }
}
</style>
