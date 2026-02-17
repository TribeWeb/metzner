<script setup lang="ts">
import type { Reactive } from 'vue'

const route = useRoute()
const state = inject('state') as Reactive<Partial<Schema>>

const { data: page } = await useAsyncData(`${route.path}-title`, () => {
  return queryCollection('machines').path(route.path).select('title').first()
})

await useAsyncData(`machinesData`, () => {
  return queryCollection('machines')
    .select('modelId', 'machineName', 'machineId', 'cutDiameter', 'cutWidth', 'cutHeight')
    .all()
})

const copy = computed(() => ({
  success: {
    title: `The ${page.value?.title || 'machine'} will cut the material you have specified`,
    description: 'The machine will cut the material you have specified with the dimensions and properties you have chosen.',
    icon: 'i-lucide-circle-check-big',
    actions: [
      {
        label: 'View specifications',
        trailingIcon: `${showDisplay.value ? 'i-lucide-arrow-big-up' : 'i-lucide-arrow-big-down'}`,
        onClick: openDisplay
      }
    ]
  },
  warning: {
    title: `The ${page.value?.title || 'machine'} will not cut the material you have specified`,
    description: 'View a list of compatible machines or please adjust your specifications and try again.',
    icon: 'i-lucide-triangle-alert',
    actions: [
      {
        label: 'View compatible machines',
        trailingIcon: 'i-tabler-blade-filled',
        onClick: openDisplay
      },
      {
        label: 'Edit specifications',
        trailingIcon: 'i-lucide-square-pen',
        onClick: openDisplayAndPicker
      }
    ]
  },
  info: {
    title: 'Machine choosing guide',
    description: 'Specify the material you need to cut, and we\'ll identify the most suitable cutting machines from our range...',
    icon: 'i-lucide-info',
    actions: [
      {
        label: 'Start now',
        trailingIcon: 'i-lucide-square-pen',
        onClick: openDisplayAndPicker
      }
    ]
  }
})
)

const noMachineMatch = computed(() => {
  return state.diameter ? state.diameter > 19 : false
})

const status = computed(() => {
  if (!state.shape || !state.core || !state.reinforced) {
    return 'info'
  }
  if (noMachineMatch.value) {
    return 'warning'
  }
  return 'success'
})

const showDisplay = ref(false)
function openDisplay() {
  showDisplay.value = !showDisplay.value
}
const showPicker = ref(false)

function openDisplayAndPicker() {
  showDisplay.value = true
  showPicker.value = true
}

const alertActions = computed(() => {
  return copy.value[status.value].actions
    .filter(action => action?.label && action?.onClick)
    .map(action => ({
      label: action.label,
      color: `${status.value}` as const,
      variant: 'subtle' as const,
      size: 'md' as const,
      trailingIcon: action.trailingIcon,
      onClick: action.onClick
    }))
})
</script>

<template>
  <UAlert
    v-bind="copy[status]"
    variant="subtle"
    :color="status"
    :ui="{ icon: 'size-11', title: 'text-lg' }"
    :actions="alertActions"
  />
  <Transition name="slide-fade">
    <div v-if="showDisplay">
      <MaterialDisplay :show-picker="showPicker" />
    </div>
  </Transition>
</template>

<style>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-80px);
  opacity: 0;
}
</style>
