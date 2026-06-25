<script setup lang="ts">
import Skeleton from '@/components/ui/Skeleton.vue'
</script>

<template>
  <div class="space-y-4">
    <Skeleton class="aspect-[4/5] w-full rounded-sm" />
    <Skeleton class="h-3 w-1/3" />
    <Skeleton class="h-5 w-2/3" />
    <Skeleton class="h-4 w-1/4" />
  </div>
</template>
