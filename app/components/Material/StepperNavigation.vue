<script setup lang="ts">
import type { StepperItem } from '@nuxt/ui'

defineProps<{
  stepper: StepperItem | null
}>()

const showPicker = inject<Ref<boolean>>('showMaterialPicker')!
</script>

<template>
  <UButton
    v-if="!showPicker"
    variant="solid"
    size="md"
    trailing-icon="i-lucide-square-pen"
    @click="showPicker = !showPicker"
  >
    Edit
  </UButton>
  <UButton
    v-if="showPicker"
    variant="solid"
    trailing-icon="i-lucide-arrow-right"
    :disabled="!stepper?.hasNext"
    @click="stepper?.next()"
  >
    Next
  </UButton>
  <UButton
    v-if="showPicker"
    variant="solid"
    leading-icon="i-lucide-arrow-left"
    :disabled="!stepper?.hasPrev"
    @click="stepper?.prev()"
  >
    Prev
  </UButton>
</template>
