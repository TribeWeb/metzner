<script setup lang="ts">
import type { StepperItem } from '@nuxt/ui'

const props = defineProps<{
  stepper: StepperItem | null
  showPicker: boolean
}>()

const display = defineModel('display', { type: Boolean, default: false })

function toggleDisplay() {
  display.value = !display.value
}

onMounted(() => {
  if (props.showPicker) {
    display.value = true
  }
})
</script>

<template>
  <div class="mb-4">
    <Transition
      name="fade"
      mode="out-in"
    >
      <div
        v-if="!display"
        class="flex flex-row-reverse justify-between "
      >
        <UButton
          variant="solid"
          size="md"
          trailing-icon="i-lucide-square-pen"
          @click="toggleDisplay"
        >
          Edit
        </UButton>
      </div>
      <div
        v-else
        class="flex flex-row-reverse justify-between mb-2"
      >
        <UButton
          variant="subtle"
          color="neutral"
          size="md"
          trailing-icon="i-lucide-x"
          @click="toggleDisplay"
        >
          Close
        </UButton>
        <UFieldGroup>
          <UButton
            variant="subtle"
            leading-icon="i-lucide-arrow-left"
            :disabled="!stepper?.hasPrev"
            @click="stepper?.prev()"
          >
            Prev
          </UButton>

          <UButton
            variant="subtle"
            trailing-icon="i-lucide-arrow-right"
            :disabled="!stepper?.hasNext"
            @click="stepper?.next()"
          >
            Next
          </UButton>
        </UFieldGroup>
      </div>
    </Transition>
  </div>
</template>
