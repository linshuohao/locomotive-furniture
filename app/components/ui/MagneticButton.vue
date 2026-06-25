<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useMagnetic } from '@/composables/useMagnetic'

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'ghost' | 'success'
    size?: 'sm' | 'md' | 'lg'
    disabled?: boolean
    type?: 'button' | 'submit'
    to?: string
    strength?: number
  }>(),
  {
    variant: 'primary',
    size: 'md',
    disabled: false,
    type: 'button',
    to: undefined,
    strength: 0.28,
  },
)

const shellRef = ref<HTMLElement | null>(null)
useMagnetic(shellRef, { strength: props.strength })
</script>

<template>
  <span
    ref="shellRef"
    class="magnetic-button inline-flex"
  >
    <NuxtLink
      v-if="to"
      :to="to"
      class="magnetic-button__link"
    >
      <BaseButton
        :variant="variant"
        :size="size"
        :disabled="disabled"
        type="button"
      >
        <slot></slot>
      </BaseButton>
    </NuxtLink>
    <BaseButton
      v-else
      :variant="variant"
      :size="size"
      :disabled="disabled"
      :type="type"
    >
      <slot></slot>
    </BaseButton>
  </span>
</template>

<style scoped>
.magnetic-button__link {
  display: inline-flex;
  text-decoration: none;
  color: inherit;
}
</style>
