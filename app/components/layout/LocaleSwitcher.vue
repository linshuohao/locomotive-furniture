<script setup lang="ts">
import { useLocale } from '@/composables/useLocale'
import { DEFAULT_LOCALE, ZH_LOCALE } from '@/lib/i18n/constants'

const { locale, t, switchLocale } = useLocale()

function toggleLocale() {
  switchLocale(locale.value === DEFAULT_LOCALE ? ZH_LOCALE : DEFAULT_LOCALE)
}
</script>

<template>
  <button
    type="button"
    data-testid="locale-switcher"
    class="text-xs uppercase tracking-widest text-brand-700 hover:text-brand-950 transition-colors border border-brand-300 px-3 py-1.5"
    :aria-label="
      t('locale.switchTo', {
        language: locale === DEFAULT_LOCALE ? t('locale.zh') : t('locale.en'),
      })
    "
    @click="toggleLocale"
  >
    {{ locale === DEFAULT_LOCALE ? t('locale.zh') : t('locale.en') }}
  </button>
</template>
