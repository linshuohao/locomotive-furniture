<script setup lang="ts">
defineProps<{
  class?: string
}>()
</script>

<template>
  <div class="animate-pulse bg-brand-200" :class="$props.class" aria-hidden="true" />
</template>
