<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'ghost' | 'success'
    size?: 'sm' | 'md' | 'lg'
    disabled?: boolean
    type?: 'button' | 'submit'
  }>(),
  {
    variant: 'primary',
    size: 'md',
    disabled: false,
    type: 'button',
  },
)

const variantClasses = {
  primary: 'bg-brand-900 text-brand-50 hover:bg-brand-800',
  secondary: 'border border-brand-900 text-brand-900 hover:bg-brand-900 hover:text-brand-50',
  ghost: 'text-brand-700 hover:text-brand-950 underline-offset-4 hover:underline',
  success: 'bg-brand-700 text-brand-50 ring-2 ring-brand-400 ring-offset-2 ring-offset-brand-50',
}

const sizeClasses = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
}
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    class="inline-flex items-center justify-center uppercase tracking-widest transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
    :class="[variantClasses[variant], sizeClasses[size]]"
  >
    <slot />
  </button>
</template>
