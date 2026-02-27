<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'
import type { MachinesCollectionItem } from '@nuxt/content'

const props = defineProps<{
  page: MachinesCollectionItem
  slug: string
}>()

const items = [
  {
    label: 'Specifications',
    icon: 'i-lucide-notebook-tabs',
    content: 'Full list of specs.',
    slot: 'specifications' as const
  },
  {
    label: 'Materials',
    icon: 'i-fa6-solid-cubes',
    content: 'List of materials this machine can cut.',
    slot: 'materials' as const
  },
  {
    label: 'Peripherals',
    icon: 'i-lucide-square-plus',
    content: 'List of compatible peripherals.',
    slot: 'peripherals' as const
  }
] satisfies TabsItem[]
</script>

<template>
  <UTabs
    :items="items"
    :unmount-on-hide="false"
    variant="pill"
    :ui="{ trigger: 'md:grow',
           root: 'p-4 bg-default ring ring-default rounded-lg mt-6',
           content: 'my-4!'
    }"
    class="gap-4 display-block"
  >
    <template #specifications>
      <MachineTabsSpecifications
        :page="props.page"
        :slug="slug"
      />
    </template>
    <template #materials="{ item }">
      <MachineTabsMaterials
        :model-id="props.page.modelId"
        :machine-name="props.page.machineName"
      />
    </template>
    <template #peripherals>
      <MachineTabsPeripherals
        :model-id="props.page.modelId"
        :machine-name="props.page.machineName"
      />
    </template>
  </UTabs>
</template>
