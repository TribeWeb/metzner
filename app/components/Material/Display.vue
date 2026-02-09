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

const { data: copy } = await useAsyncData('materialsDisplay', () => {
  return queryCollection('materialsLanding').select('collections', 'categories', 'attributes', 'attributeValues').first()
})

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
    const attributes = copy.value?.attributes.find(item => item.id === key)
    descriptions.push({
      id: key,
      attr: attributes?.legend || key,
      value: copy.value?.attributeValues?.find(av => av.attributeId === key)?.label || value as string | number | undefined,
      unit: attributes?.unit || '',
      category: attributes?.categoryId || ''
    })
  }
  return descriptions
})

const cards = computed(() => {
  const uniqueCategoryIds = [...new Set(descriptions.value.map(item => item.category))]
  const uniqueCategories = (copy.value?.categories || [])
    .filter(category => uniqueCategoryIds.includes(category.id))
    .sort((a, b) => (a.order) - (b.order))
  return uniqueCategories.map((category) => {
    return {
      collection: copy.value?.collections.find(c => c.id === category.collectionId)?.title || '',
      collectionId: copy.value?.collections.find(c => c.id === category.collectionId)?.id || '',
      category: category.title,
      categoryId: category.id,
      slotContent: {
        icon: icons.value[category.id as keyof typeof icons.value] || 'i-lucide-box',
        description: descriptions.value.filter(item => item.category === category.id)
      }
    }
  })
})
</script>

<template>
  <UStepper
    :items="cards"
    class="w-full"
    size="xl"
    :ui="{
      title: 'flex flex-col gap-y-2 items-center justify-center text-base text-pretty font-semibold text-highlighted',
      // eslint-disable-next-line @stylistic/max-len
      trigger: 'p-1 rounded-sm ring-primary group-data-[state=completed]:ring-4 group-data-[state=active]:ring-4 group-data-[state=completed]:bg-elevated group-data-[state=active]:bg-elevated group-data-[state=completed]:text-default group-data-[state=active]:text-default',
      description: 'flex flex-col items-center justify-center',
      separator: 'group-data-[state=completed]:bg-primary'
    }"
  >
    <template #indicator="{ item }">
      <MaterialDiameterCircle v-if="item.slotContent.icon === 'MaterialDiameterCircle'" />
      <MaterialWidthHeightSquare v-else-if="item.slotContent.icon === 'MaterialWidthHeightSquare'" />
      <UIcon v-else :name="item.slotContent.icon" class="size-16" />
    </template>
    <template #title="{ item }">
      <UBadge size="md" variant="soft" :label="item.category" />
      <p> {{ item.collection }} </p>
    </template>
    <template #description="{ item }">
      <p v-for="(description, i) in item.slotContent.description" :key="i" class="text-sm text-muted">
        {{ description.attr }}:&nbsp;&nbsp;<span class="text-sm text-default">{{ description.value }}{{ description.unit }}</span>
      </p>
    </template>
    <template #content="{ item }">
      <UPageGrid>
        <div v-if="item?.collectionId==='profile'">
          {{ item?.collection }} - {{ item?.category }}
        </div>
        <div v-else-if="item?.collectionId==='stiffness'">
          {{ item?.collection }} - {{ item?.category }}
        </div>
        <div v-else-if="item?.collectionId==='dimensions'">
          {{ item?.collection }} - {{ item?.category }}
        </div>
      </UPageGrid>
    </template>
  </UStepper>
</template>
