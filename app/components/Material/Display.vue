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

const { data: materialsCopy } = await useAsyncData('materialsDisplay', () => {
  return queryCollection('materialsLanding').select('categories', 'attributes', 'attributeValues').first()
})

const materialCategories = computed(() => materialsCopy.value?.categories || [])
const materialAttributes = computed(() => materialsCopy.value?.attributes || [])
const materialAttributeValues = computed(() => materialsCopy.value?.attributeValues || [])
const icons = computed(() => {
  return {
    crossSection: `c-${state.shape}-${state.core}-${state.reinforced ? state.reinforced : 'none'}`,
    longitudinalSection: `c-${state.stiffness ? state.stiffness : 'flexible'}`,
    diameter: 'MaterialDiameterCircle',
    widthHeight: 'MaterialWidthHeightSquare'
  }
})

const descriptions = computed(() => {
  const descriptions: Record<string, string | number | undefined>[] = []
  for (const [key, value] of Object.entries(state)) {
    const formItem = materialAttributes.value?.find(item => item.id === key)
    descriptions.push({
      id: key,
      attr: formItem?.legend || key,
      value: materialAttributeValues.value?.find(av => av.attributeId === key)?.label || value,
      unit: formItem?.unit || '',
      category: formItem?.categoryId || ''
    })
  }
  return descriptions
})

const cards = computed(() => {
  const uniqueCategoryIds = [...new Set(descriptions.value.map(item => item.category))]
  const uniqueCategories = materialCategories.value
    .filter(category => uniqueCategoryIds.includes(category.id))
    .sort((a, b) => (a.order) - (b.order))
  return uniqueCategories.map((category) => {
    return {
      collection: category.collection,
      category: category.title,
      content: {
        icon: icons.value[category?.id as keyof typeof icons.value] || 'i-lucide-box',
        description: descriptions.value.filter(item => item.category === category.id)
      }
    }
  })
})
</script>

<template>
  <UPageGrid v-if="state.shape && state.core">
    <UPageCard
      v-for="(card, index) in cards"
      :key="index"
      variant="soft"
      orientation="vertical"

      v-bind="card"
      :ui="{ header: 'w-full flex justify-between text-base text-pretty font-semibold text-highlighted',
             body: 'w-full flex flex-row justify-between gap-4',
             container: 'p-2 sm:p-4'
      }"
    >
      <template #header>
        <p> {{ card.collection }} </p>
        <UBadge size="md" variant="soft" :label="card.category" class="block" />
      </template>
      <template #body>
        <div class="flex flex-col">
          <template v-for="(description, i) in card.content.description" :key="i">
            <p v-if="state[description.id as keyof typeof state]" class="text-sm text-muted">
              {{ description.attr }}:&nbsp;&nbsp;<span class="text-sm text-default">{{ description.value }}{{ description.unit }}</span>
            </p>
          </template>
        </div>
        <div class="flex items-center justify-center">
          <MaterialDiameterCircle v-if="card.content.icon === 'MaterialDiameterCircle'" />
          <MaterialWidthHeightSquare v-else-if="card.content.icon === 'MaterialWidthHeightSquare'" />
          <UIcon v-else :name="card.content.icon" :size="60" class="bg-primary" />
        </div>
      </template>
      <template #footer>
        <UFieldGroup>
          <UButton size="sm" variant="subtle" color="neutral">
            Edit
          </UButton>
          <UButton v-if="card.category === 'Cross section'" size="sm" variant="outline" color="neutral">
            Clear all
          </UButton>
        </UFieldGroup>
      </template>
    </UPageCard>
  </UPageGrid>
</template>
