<script setup lang="ts">
import Skeleton from '@/components/ui/Skeleton.vue'
import ProductCardSkeleton from '@/components/ui/ProductCardSkeleton.vue'
</script>

<template>
  <div>
    <div class="mb-12">
      <Skeleton class="h-3 w-24 mb-2" />
      <Skeleton class="h-10 w-64" />
    </div>
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
      <ProductCardSkeleton
        v-for="i in 6"
        :key="i"
      />
    </div>
  </div>
</template>
