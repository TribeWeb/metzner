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
  <UCard
    variant="soft"
    :class="`col-span-${colCount}`"
    class="max-w-136"
    :ui="{ body: 'h-full' }"
  >
    <UFormField
      :name="copy?.id"
      :description="copy?.description"
      :ui="{ label: 'w-full flex justify-between',
             description: 'pt-1 pb-3',
             root: 'h-full flex flex-col justify-between'
      }"
    >
      <template #label>
        <h3> {{ copy?.legend }} </h3>
        <UBadge size="md" variant="soft" :label="copy?.category" class="block" />
      </template>
      <slot />
    </UFormField>
  </UCard>
</template>
