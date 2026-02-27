<script setup lang="ts">
import type { MaterialsCollectionItem } from '@nuxt/content'

const props = defineProps<{
  modelId: string
  machineName: string
}>()

type MaterialStiffnessItem = Pick<MaterialsCollectionItem, 'modelId' | 'stiffness'>

const { data: materialsData } = await useAsyncData(`machine-tabs-peripherals-${props.modelId}`, () => {
  return queryCollection('materials')
    .select('modelId', 'stiffness')
    .all()
})

const supportsRigid = computed(() => {
  const modelMaterials = ((materialsData.value || []) as MaterialStiffnessItem[])
    .filter(item => item.modelId === props.modelId)

  return modelMaterials.some(item => item.stiffness === 'rigid' || item.stiffness === '*')
})

const peripheralItems = computed(() => {
  const baseItems = [
    {
      title: 'Printers',
      description: 'Integrate inline marking and identification so products leave the line ready for handling and traceability.',
      icon: 'i-lucide-printer',
      to: '/peripherals/printers',
      supportsFlexible: true,
      supportsRigid: true
    },
    {
      title: 'Take-Off Conveyors',
      description: 'Automate product transfer away from the cutter to maintain flow and reduce manual handling interruptions.',
      icon: 'i-lucide-arrow-right-left',
      to: '/peripherals/take-off-conveyors',
      supportsFlexible: true,
      supportsRigid: true
    }
  ]

  if (!supportsRigid.value) {
    return baseItems
  }

  return [
    {
      title: 'Dereelers',
      description: 'Provide controlled unwinding for steady, tension-managed feeding into the machine.',
      icon: 'i-lucide-disc-3',
      to: '/peripherals/dereelers',
      supportsFlexible: true,
      supportsRigid: false
    },
    {
      title: 'Pre-Feeders',
      description: 'Deliver stable material advance before cutting, helping consistency and cycle reliability.',
      icon: 'i-lucide-gauge',
      to: '/peripherals/prefeeders',
      supportsFlexible: true,
      supportsRigid: false
    },
    {
      title: 'Loop Control',
      description: 'Maintain a buffered feed path to decouple line speeds and improve uninterrupted operation.',
      icon: 'i-lucide-git-compare-arrows',
      to: '/peripherals/loop-control',
      supportsFlexible: true,
      supportsRigid: false
    },
    ...baseItems
  ]
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
        :to="item.to"
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
