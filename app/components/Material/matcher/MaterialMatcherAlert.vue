<script setup lang="ts">
import type { Reactive } from 'vue'
import type { MaterialMatcherContext } from '~/composables/useCompatibleMachines'

const route = useRoute()
const { data: page } = useNuxtData(route.path)

const state = inject('state') as Reactive<Partial<Schema>>
const materialMatcher = inject<MaterialMatcherContext | null>('materialMatcher', null)

const copy = computed(() => ({
  success: {
    title: `The ${page.value?.title || 'machine'} will cut the material you have specified`,
    description: 'The machine will cut the material you have specified with the dimensions and properties you have chosen.',
    icon: 'i-lucide-circle-check-big',
    actions: [
      {
        label: 'Your material',
        trailingIcon: 'i-lucide-eye',
        onClick: toggleModal
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
        onClick: toggleModal
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
    description: 'Tell us about the material you\'re cutting, and we\'ll identify the most suitable cutting machines from our range.',
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

const currentModelId = computed(() => page.value?.modelId)

const status = computed(() => {
  if (!state.shape || !state.core || !state.reinforced) {
    return 'info'
  }
  if (materialMatcher?.isModelCompatible(currentModelId.value)) {
    return 'success'
  }
  return 'warning'
})

const showModal = defineModel('open', {
  type: Boolean,
  default: false
})

provide('showMaterialDisplayModal', showModal)

function toggleModal() {
  showModal.value = !showModal.value
}

const showPicker = defineModel('picker', {
  type: Boolean,
  default: false
})

provide('showMaterialPicker', showPicker)

function openDisplayAndPicker() {
  showModal.value = true
  showPicker.value = true
}

watch(showModal, (newVal) => {
  if (!newVal) {
    showPicker.value = false
  }
})

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
  <MaterialDisplay />
</template>
