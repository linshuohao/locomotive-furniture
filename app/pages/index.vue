<script setup lang="ts">
import { computed } from 'vue'
import { providePageIntroComplete } from '@/composables/usePageIntroComplete'
import { fetchProducts } from '@/data/api'
import type { Product } from '@/data/schemas'
import HomeHeroSection from '@/components/home/HomeHeroSection.vue'
import HomePhilosophySection from '@/components/home/HomePhilosophySection.vue'
import HomeFeaturedRail from '@/components/home/HomeFeaturedRail.vue'
import HomeAgencySection from '@/components/home/HomeAgencySection.vue'
import HomeDynastyStrip from '@/components/home/HomeDynastyStrip.vue'
import HomeExtrasSection from '@/components/home/HomeExtrasSection.vue'
import MarqueeBand from '@/components/scroll/MarqueeBand.vue'
import PageIntroCurtain from '@/components/scroll/PageIntroCurtain.vue'
import { useLocale } from '@/composables/useLocale'
import { staticImages } from '@/lib/assets/paths'

usePageSeo('meta.home')

const {
  public: { siteUrl },
} = useRuntimeConfig()

useHead({
  link: [
    {
      rel: 'preload',
      as: 'image',
      href: `${siteUrl}${staticImages.marketing.hero}`,
      fetchpriority: 'high',
    },
  ],
})

const { t, te, locale } = useLocale()

const { data: productsResult, pending: loadingFeatured } = await useAsyncData(
  () => `home-featured-${locale.value}`,
  () => fetchProducts(),
  { watch: [locale] },
)

const featured = computed(
  () => productsResult.value?.data?.filter((product: Product) => product.featured) ?? [],
)

const featuredReady = computed(() => !loadingFeatured.value && featured.value.length > 0)

const fallbackNotice = computed(() => {
  const error = productsResult.value?.error
  if (!error) return null
  return te(error) ? t(error) : t('fallback.offlineCatalog')
})

const storeTeasers = computed(() => featured.value.slice(0, 2))

const { introComplete, markIntroComplete } = providePageIntroComplete()

const cyclingPhrasesPrimary = computed(() => [
  t('home.hero.cycling1a'),
  t('home.hero.cycling1b'),
  t('home.hero.cycling1c'),
])

const cyclingPhrasesSecondary = computed(() => [
  t('home.hero.cycling2a'),
  t('home.hero.cycling2b'),
  t('home.hero.cycling2c'),
])

const talentMarquee = computed(() => [t('home.marquee.talent')])
</script>

<template>
  <div class="pt-[var(--header-height)]">
    <PageIntroCurtain @complete="markIntroComplete" />

    <HomeHeroSection
      :intro-complete="introComplete"
      :cycling-phrases-primary="cyclingPhrasesPrimary"
      :cycling-phrases-secondary="cyclingPhrasesSecondary"
    />

    <HomeDynastyStrip />

    <HomeFeaturedRail
      :featured="featured"
      :loading="loadingFeatured"
      :ready="featuredReady"
      :fallback-notice="fallbackNotice"
    />

    <HomePhilosophySection />

    <MarqueeBand
      :items="talentMarquee"
      effect="glitch"
      speed="slow"
    />

    <HomeAgencySection />

    <HomeExtrasSection :store-products="storeTeasers" />
  </div>
</template>
