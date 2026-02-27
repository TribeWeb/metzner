<script setup lang="ts">
import type { MaterialsCollectionItem, PeripheralsCollectionItem } from '@nuxt/content'

const props = defineProps<{
  modelId: string
  machineName: string
}>()

type MaterialStiffnessItem = Pick<MaterialsCollectionItem, 'modelId' | 'stiffness'>
type PeripheralTabItem = Pick<PeripheralsCollectionItem, 'title' | 'description' | 'path' | 'icon' | 'supportsFlexible' | 'supportsRigid' | 'peripheralOrder'>

const { data: materialsData } = await useAsyncData(`machine-tabs-peripherals-${props.modelId}`, () => {
  return queryCollection('materials')
    .select('modelId', 'stiffness')
    .all()
})

const { data: peripheralsData } = await useAsyncData('machine-tabs-peripherals-content', () => {
  return queryCollection('peripherals')
    .select('title', 'description', 'path', 'icon', 'supportsFlexible', 'supportsRigid', 'peripheralOrder')
    .all()
})

const supportsRigid = computed(() => {
  const modelMaterials = ((materialsData.value || []) as MaterialStiffnessItem[])
    .filter(item => item.modelId === props.modelId)

  return modelMaterials.some(item => item.stiffness === 'rigid' || item.stiffness === '*')
})

const peripheralItems = computed(() => {
  const allPeripherals = ((peripheralsData.value || []) as PeripheralTabItem[])
    .filter(item => Boolean(item.path))
    .sort((a, b) => {
      const aOrder = a.peripheralOrder ?? Number.MAX_SAFE_INTEGER
      const bOrder = b.peripheralOrder ?? Number.MAX_SAFE_INTEGER
      if (aOrder !== bOrder) {
        return aOrder - bOrder
      }
      return (a.title || '').localeCompare(b.title || '')
    })

  if (supportsRigid.value) {
    return allPeripherals
  }

  return allPeripherals.filter(item => item.supportsRigid === true)
})
</script>

<template>
  <div class="space-y-4">
    <p class="text-muted">
      {{ props.machineName }} can be expanded with peripherals to improve automation, throughput and output consistency.
    </p>

    <UPageGrid>
      <UPageCard
        v-for="item in peripheralItems"
        :key="item.title"
        :title="item.title"
        :description="item.description"
        :icon="item.icon"
        :to="item.path"
        variant="subtle"
      >
        <template #default>
          <div class="flex flex-wrap gap-2">
            <UBadge
              v-if="item.supportsFlexible"
              label="Flexible"
              color="primary"
              variant="soft"
            />
            <UBadge
              v-if="item.supportsRigid"
              label="Rigid"
              color="primary"
              variant="soft"
            />
          </div>
        </template>
      </UPageCard>
    </UPageGrid>
  </div>
</template>
