<script setup lang="ts">
import { materials, machines } from '#imports'
import { z } from 'zod'

const machineSchema = machines.pick({ cutDiameter: true, cutWidth: true, cutHeight: true })
const materialSchema = materials.pick({ stiffness: true, shape: true, reinforced: true, core: true })

const schema = z.object({ ...machineSchema.shape, ...materialSchema.shape })
type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({})

const route = useRoute()
onMounted(() => {
  const parsedRoute = schema.parse(route.query) as Partial<Schema>
  Object.assign(state, parsedRoute)
})

const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('machines').path(route.path).select('title').first()
})

const noMachineMatch = computed(() => {
  return state.cutDiameter ? state.cutDiameter > 18 : true
})

const status = computed(() => {
  if (!state.shape || !state.core || !state.reinforced) {
    return 'incomplete'
  }
  if (noMachineMatch.value) {
    return 'error'
  }
  return 'success'
})

const showDisplay = ref(false)
function openSpecifications() {
  showDisplay.value = !showDisplay.value
}

const success = ref({
  title: `The ${page.value?.title || 'machine'} will cut the material you have specified`,
  color: 'success' as const,
  variant: 'subtle' as const,
  description: 'The machine will cut the material you have specified with the dimensions and properties you have chosen.',
  icon: 'i-lucide-check',
  actions: [
    {
      label: 'View specifications',
      color: 'success' as const,
      variant: 'subtle' as const,
      size: 'md' as const,
      trailingIcon: 'i-lucide-square-pen',
      onClick: openSpecifications
    }
  ],
  ui: {
    icon: 'size-11',
    title: 'text-lg'
  }
})

const incomplete = ref({
  title: 'Machine choosing guide',
  color: 'info' as const,
  variant: 'subtle' as const,
  description: 'Specify the material you need to cut, and we\'ll identify the most suitable cutting machines from our range..',
  icon: 'i-lucide-alert-triangle',
  actions: [
    {
      label: 'Start now',
      color: 'info' as const,
      variant: 'subtle' as const,
      size: 'md' as const,
      trailingIcon: 'i-lucide-square-play'
    }
  ],
  ui: {
    icon: 'size-11',
    title: 'text-lg'
  }
})

const error = ref({
  title: `The ${page.value?.title || 'machine'} will not cut the material you have specified`,
  color: 'warning' as const,
  variant: 'subtle' as const,
  description: 'View a list of compatible machines or please adjust your specifications and try again.',
  icon: 'i-lucide-x',
  actions: [
    {
      label: 'Compatible machines',
      color: 'warning' as const,
      variant: 'subtle' as const,
      size: 'md' as const,
      trailingIcon: 'i-tabler-blade-filled'
    },
    {
      label: 'Edit specifications',
      color: 'warning' as const,
      variant: 'outline' as const,
      size: 'md' as const,
      trailingIcon: 'i-lucide-square-play',
      onClick: openSpecifications
    }
  ],
  ui: {
    icon: 'size-11',
    title: 'text-lg'
  }
})
</script>

<template>
  <UAlert v-if="status === 'success'" v-bind="success" />
  <UAlert v-else-if="status === 'error'" v-bind="error" />
  <UAlert v-else-if="status === 'incomplete'" v-bind="incomplete" />
  <Transition name="slide-fade">
    <MaterialDisplay v-if="showDisplay" />
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
