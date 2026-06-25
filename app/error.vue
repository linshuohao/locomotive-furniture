<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { track } from '@/lib/analytics/analytics'
import { useLocale } from '@/composables/useLocale'

const props = defineProps<{
  error: {
    statusCode?: number
    message?: string
  }
}>()

const { t, localizedPath } = useLocale()

const displayMessage = computed(() =>
  import.meta.dev ? (props.error.message ?? t('error.body')) : t('error.body'),
)

onMounted(() => {
  track({
    name: 'app_error',
    statusCode: props.error.statusCode ?? 500,
    message: props.error.message ?? 'Unknown error',
  })
})

function recover() {
  clearError({ redirect: localizedPath('/') })
}
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-brand-50">
    <h1 class="font-display text-4xl text-brand-900 mb-4">
      {{ t('error.title') }}
    </h1>
    <p class="text-brand-600 mb-8 max-w-md">
      {{ displayMessage }}
    </p>
    <button
      type="button"
      class="px-8 py-3 bg-brand-900 text-brand-50 text-sm uppercase tracking-widest hover:bg-brand-800 transition-colors"
      @click="recover"
    >
      {{ t('error.backHome') }}
    </button>
  </div>
</template>
