<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import CharReveal from '@/components/scroll/CharReveal.vue'
import HoverShuffleText from '@/components/scroll/HoverShuffleText.vue'
import CyclingText from '@/components/scroll/CyclingText.vue'
import MotionSceneHost from '@/components/scroll/MotionSceneHost.vue'
import ImageTilt3D from '@/components/ui/ImageTilt3D.vue'
import LazyImage from '@/components/ui/LazyImage.vue'
import { useMotionCapabilities } from '@/composables/useMotionCapabilities'
import { useLocale } from '@/composables/useLocale'
import { staticImages } from '@/lib/assets/paths'

const HeroDepthCanvas = defineAsyncComponent(
  () => import('@/components/scroll/HeroDepthCanvas.vue'),
)

const props = defineProps<{
  introComplete: boolean
  cyclingPhrasesPrimary: string[]
  cyclingPhrasesSecondary: string[]
}>()

const { t } = useLocale()
const { capabilities } = useMotionCapabilities()

const showWebglHero = computed(() => props.introComplete && capabilities.value.webgl)

const heroScene = {
  id: 'home-hero-enter',
  trigger: 'intro-complete' as const,
  effect: 'hero-enter' as const,
  targets: {
    eyebrow: '[data-hero-eyebrow]',
    subtitle: '[data-hero-subtitle]',
    media: '.hero-stage__media',
  },
}
</script>

<template>
  <MotionSceneHost
    :scene="heroScene"
    :when="introComplete"
  >
    <section
      class="hero-stage relative min-h-[100svh] overflow-hidden flex flex-col justify-between px-6"
      data-scroll
      data-scroll-css-progress
    >
      <div class="hero-stage__media absolute inset-0 z-0 min-h-screen">
        <ClientOnly>
          <template v-if="showWebglHero">
            <LazyImage
              :src="staticImages.marketing.hero"
              :alt="t('home.hero.imageAlt')"
              priority
              fill
              class="h-full w-full"
            />
            <HeroDepthCanvas :image-src="staticImages.marketing.hero" />
          </template>
          <LazyImage
            v-else-if="!introComplete"
            :src="staticImages.marketing.hero"
            :alt="t('home.hero.imageAlt')"
            priority
            aspect="4/3"
            class="h-full w-full"
          />
          <ImageTilt3D
            v-else
            variant="hero"
            class="h-full w-full"
          >
            <LazyImage
              :src="staticImages.marketing.hero"
              :alt="t('home.hero.imageAlt')"
              priority
              aspect="4/3"
              class="h-full w-full"
            />
          </ImageTilt3D>
          <template #fallback>
            <LazyImage
              :src="staticImages.marketing.hero"
              :alt="t('home.hero.imageAlt')"
              priority
              aspect="4/3"
              class="h-full w-full"
            />
          </template>
        </ClientOnly>
      </div>

      <div
        class="hero-stage__depth-grid pointer-events-none absolute inset-0 z-[1] min-h-screen"
        aria-hidden="true"
      ></div>

      <div
        class="absolute inset-0 z-[2] min-h-screen pointer-events-none bg-gradient-to-b from-brand-950/55 via-brand-950/25 to-brand-950/75"
      ></div>

      <div
        data-hero-eyebrow
        class="hero-stage__cycling relative z-10 mx-auto max-w-7xl w-full pt-[calc(var(--header-height)+1.5rem)]"
      >
        <p class="type-eyebrow text-brand-100">
          <CyclingText
            :phrases="cyclingPhrasesPrimary"
            hover-effect="wave"
            tag="span"
          />
        </p>
        <p class="type-eyebrow text-brand-200/80 mt-2">
          <CyclingText
            :phrases="cyclingPhrasesSecondary"
            :interval="3200"
            hover-effect="slide"
            tag="span"
          />
        </p>
      </div>

      <div
        class="hero-stage__content-3d relative z-10 mx-auto max-w-7xl w-full flex-1 flex flex-col justify-end pb-10 md:pb-14"
      >
        <div
          data-hero-title
          class="hero-stage__title-block"
        >
          <CharReveal
            hero
            tag="h1"
            class="font-display hero-stage__title text-brand-50 max-w-none"
            :stagger="0.022"
            :delay="0.12"
            :ready="introComplete"
          >
            <span class="mask-line-wrap">
              <span class="block">
                <span class="hero-stage__mark">
                  <HoverShuffleText
                    :text="t('home.hero.titleMark')"
                    effect="pop"
                    tag="span"
                  />
                </span>
                <HoverShuffleText
                  :text="t('home.hero.titleLine1')"
                  effect="shuffle"
                  tag="span"
                />
                <span class="hero-stage__title-rest">
                  <HoverShuffleText
                    :text="t('home.hero.titleLine2')"
                    effect="skew"
                    tag="span"
                  />
                </span>
                <span class="hero-stage__mark hero-stage__mark--end">
                  <HoverShuffleText
                    :text="t('home.hero.titleMarkEnd')"
                    effect="pop"
                    tag="span"
                  />
                </span>
              </span>
            </span>
          </CharReveal>
        </div>

        <p
          data-hero-subtitle
          class="hero-stage__copyright type-eyebrow text-brand-300/70 mt-10 md:mt-14"
        >
          <HoverShuffleText
            :text="t('home.hero.copyright')"
            effect="glitch"
            tag="span"
          />
        </p>
      </div>

      <div class="absolute bottom-0 left-0 right-0 z-10 h-px bg-white/20">
        <div class="hero-progress-bar h-full bg-white/90"></div>
      </div>
    </section>
  </MotionSceneHost>
</template>
