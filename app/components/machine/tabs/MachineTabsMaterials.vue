<script setup lang="ts">
import type { MaterialsCollectionItem } from '@nuxt/content'

const props = defineProps<{
  modelId: string
  machineName: string
}>()

type MaterialTabItem = Pick<MaterialsCollectionItem, 'slug' | 'modelId' | 'type' | 'material' | 'stiffness' | 'shape' | 'core' | 'reinforced'>

const { data: materialsData } = await useAsyncData(`machine-tabs-materials-${props.modelId}`, () => {
  return queryCollection('materials')
    .select('slug', 'modelId', 'type', 'material', 'stiffness', 'shape', 'core', 'reinforced')
    .all()
})

const machineMaterials = computed<MaterialTabItem[]>(() => {
  return ((materialsData.value || []) as MaterialTabItem[])
    .filter(item => item.modelId === props.modelId)
})

const materialFamilies = computed<string[]>(() => {
  const families = new Set<string>()
  for (const item of machineMaterials.value) {
    for (const family of item.material || []) {
      families.add(family)
    }
  }
  return Array.from(families).sort((a, b) => a.localeCompare(b))
})

function toTitleCase(value: string): string {
  return value
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function crossSectionIcon(item: MaterialTabItem): string {
  const shape = item.shape || 'round'
  const core = item.core || 'hollow'
  const reinforced = item.reinforced || 'none'
  return `c-${shape}-${core}-${reinforced}`
}

function stiffnessIcon(item: MaterialTabItem): string {
  if (item.stiffness === 'rigid') {
    return 'c-rigid'
  }
  return 'c-flexible'
}
</script>

<template>
  <div class="space-y-4">
    <p class="text-muted">
      {{ props.machineName }} supports the following material families and profile configurations.
    </p>

    <div class="flex flex-wrap gap-2">
      <UBadge
        v-for="family in materialFamilies"
        :key="family"
        color="neutral"
        variant="soft"
        :label="toTitleCase(family)"
      />
    </div>

    <UPageGrid>
      <UCard
        v-for="materialItem in machineMaterials"
        :key="materialItem.slug"
        :ui="{ body: 'space-y-3' }"
      >
        <div class="flex items-center gap-3">
          <UIcon
            :name="crossSectionIcon(materialItem)"
            class="size-10 text-primary"
          />
          <UIcon
            :name="stiffnessIcon(materialItem)"
            class="size-10 text-primary"
          />
          <div>
            <p class="font-medium text-highlighted">
              {{ toTitleCase(materialItem.shape || 'round') }} {{ toTitleCase(materialItem.type) }}
            </p>
            <p class="text-sm text-muted">
              {{ toTitleCase(materialItem.stiffness === '*' ? 'flexible' : (materialItem.stiffness || 'flexible')) }} · {{ toTitleCase(materialItem.core || 'hollow') }} · {{ toTitleCase(materialItem.reinforced || 'none') }}
            </p>
          </div>
        </div>

        <div class="flex flex-wrap gap-2">
          <UBadge
            v-for="materialName in materialItem.material"
            :key="`${materialItem.slug}-${materialName}`"
            color="neutral"
            variant="outline"
            :label="toTitleCase(materialName)"
            size="sm"
          />
        </div>
      </UCard>
    </UPageGrid>
  </div>
</template>
