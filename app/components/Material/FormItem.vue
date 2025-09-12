<script setup lang="ts">
import type { FormItem } from './Picker.vue'

const { copy } = defineProps({
  copy: {
    type: Object as () => FormItem
  },
  colCount: {
    type: Number,
    default: 1
  }
})
</script>

<template>
  <UCard variant="soft" :class="`col-span-${colCount}`" class="max-w-136">
    <UFormField
      :name="copy?.id"
      :description="copy?.description"
      :ui="{ label: 'w-full flex justify-between', description: 'pt-1 pb-3' }"
    >
      <template #label>
        <h3> {{ copy?.legend }} </h3>
        <UBadge size="sm" variant="soft" :label="copy?.category" class="block" />
      </template>
      <slot />
    </UFormField>
  </UCard>
</template>
