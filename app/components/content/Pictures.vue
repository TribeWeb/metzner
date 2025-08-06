<script setup lang="ts">
interface Props {
  orientation?: 'horizontal' | 'vertical'
}

const { orientation = 'horizontal' } = defineProps<Props>()
</script>

<template>
  <div
    class="flex items-center justify-between"
    :class="orientation === 'vertical' ? 'flex-col space-y-4' : 'flex-row space-x-4'"
  >
    <slot />
  </div>
</template>
