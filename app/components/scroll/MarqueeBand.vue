<script setup lang="ts">
import { computed } from 'vue'
import HoverShuffleText from '@/components/scroll/HoverShuffleText.vue'
import type { HoverTextEffect } from '@/lib/scroll/animation'

const props = withDefaults(
  defineProps<{
    items: string[]
    speed?: 'slow' | 'normal' | 'fast'
    reverse?: boolean
    separator?: string
    variant?: 'light' | 'dark'
    shuffle?: boolean
    effect?: HoverTextEffect
  }>(),
  {
    speed: 'normal',
    reverse: false,
    separator: '·',
    variant: 'light',
    shuffle: true,
    effect: 'wave',
  },
)

const hoverEnabled = computed(() => props.shuffle)
</script>

<template>
  <div
    class="marquee-band relative z-10 overflow-hidden border-y py-5"
    :class="
      variant === 'dark'
        ? 'marquee-band--dark border-brand-800 bg-brand-900'
        : 'border-brand-300/40 bg-brand-100'
    "
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
        class="marquee-band__item shrink-0 px-8 font-display text-[clamp(1.5rem,4vw,3rem)] uppercase tracking-[0.25em] whitespace-nowrap"
        :class="variant === 'dark' ? 'text-brand-200' : 'text-brand-800'"
      >
        <template v-if="!hoverEnabled">
          {{ item }}<span class="marquee-band__sep">{{ separator }}</span>
        </template>
        <template v-else>
          <HoverShuffleText
            :text="item"
            :effect="effect"
            tag="span"
          />
          <span class="marquee-band__sep">{{ separator }}</span>
        </template>
      </span>
      <span
        v-for="(item, i) in items"
        :key="`b-${i}`"
        class="marquee-band__item shrink-0 px-8 font-display text-[clamp(1.5rem,4vw,3rem)] uppercase tracking-[0.25em] whitespace-nowrap"
        :class="variant === 'dark' ? 'text-brand-200' : 'text-brand-800'"
      >
        <template v-if="!hoverEnabled">
          {{ item }}<span class="marquee-band__sep">{{ separator }}</span>
        </template>
        <template v-else>
          <HoverShuffleText
            :text="item"
            :effect="effect"
            tag="span"
          />
          <span class="marquee-band__sep">{{ separator }}</span>
        </template>
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
