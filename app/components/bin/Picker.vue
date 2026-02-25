<script setup lang="ts">
import type { MaterialsCollectionItem } from '@nuxt/content'
import { z } from 'zod'
import { materials, machines } from '#imports'
import type { Reactive } from 'vue'

export type FormItem = {
  id: keyof Schema | 'cutWidthHeight'
  category: string
  legend: string
  description: string
}

const { headerCopy, formItemsCopy } = defineProps({
  headerCopy: {
    type: Object as () => { title: string, description: string }
  },
  formItemsCopy: {
    type: Array as () => FormItem[]
  }
})

const _mergedCollectionItem = z.object({ ...materials.shape, ...machines.shape })
export type MergedCollectionItem = z.output<typeof _mergedCollectionItem>

const machineSchema = machines.pick({ cutDiameter: true, cutWidth: true, cutHeight: true })
const materialSchema = materials.pick({ stiffness: true, shape: true, reinforced: true, core: true })

const schema = z.object({ ...machineSchema.shape, ...materialSchema.shape })

// export type Schema = z.output<typeof schema>

// const state = reactive<Partial<Schema>>({})
const state = inject('state') as Reactive<Partial<Schema>>
// const coreSchema = z.array(z.union([z.literal('hollow'), z.literal('solid'), z.literal('mixed')])).optional()
// const coreSchema = materials.shape.core
// const querySchema = schema.omit({ core: true })
//   .extend({ core: z.preprocess((val) => {
//     return typeof val === 'string' ? [val] : val
//   }, coreSchema) })

const route = useRoute()
// const isReady = ref(false)

// onMounted(() => {
//   const parsedRoute = schema.parse(route.query) as Partial<Schema>
//   Object.assign(state, parsedRoute)
//   isReady.value = true
// })

// whenever(isReady, () => console.log(state))

const router = useRouter()
watchEffect(() => {
  if (state.shape === 'round') {
    state.cutWidth = undefined
    state.cutHeight = undefined
  } else {
    state.cutDiameter = undefined
  }
  router.replace({ query: state })
})

const itemKeys: (keyof MaterialsCollectionItem)[] = ['shape', 'core', 'reinforced', 'stiffness']
const allKeys: (keyof MaterialsCollectionItem)[] = [...itemKeys, 'slug', 'type', 'material', 'config', 'modelId', 'modelName']

const { data } = await useAsyncData(route.path, () => Promise.all([
  queryCollection('materials')
    .select(...allKeys)
    .all(),
  queryCollection('machines')
    .select('modelId', 'machineName', 'machineId', 'cutDiameter', 'cutWidth', 'cutHeight')
    .all()
]), {
  transform: ([allMaterials, allMachines]) => ({ allMaterials, allMachines })
})

const allMaterials = computed(() => data.value?.allMaterials || [])
const allMachines = computed(() => data.value?.allMachines)

// TODO merge materials and allMachines into a single collection where the key on which to join is `modelId`.
// The merge should behave as if it was an outer join so if a machine has several matching materials,
// it should should crate a new entry where the new key is a concatenation of machineId and slug.

const mergedCollection = computed<MergedCollectionItem[]>(() => {
  if (!allMaterials.value || !allMachines.value) return []

  return allMachines.value.flatMap((machine) => {
    const matchingMaterials = allMaterials.value.filter(
      material => material.modelId === machine.modelId
    )

    // If no matching materials, include machine with basic info

    // TODO return error instead - it shouldn't happen that a machine has no matching materials
    if (matchingMaterials.length === 0) {
      return [{
        ...machine,
        id: `${machine.machineId}-none`
      }]
    }

    // Create merged entries for each matching material
    return matchingMaterials.map(material => ({
      ...material,
      ...machine,
      id: `${machine.machineId}-${material.slug}`
    }))
  })
})

// TODO: create a method which filters the list of `materials` based on the provided current `state`, a `state` property and an associated value.
// It should return the count of unique modelIds and an array of values that are still present in the filtered list.
// It should adjust the filter based on the type of the `state` property (e.g. use `some` for arrays, `===` for strings, if undefined then skip etc.)
// If provided, the `state` property and value should be added to the filter even if the `state` property is not present in the `schema`.

function filter(
  mergedCollection: MergedCollectionItem[] = [],
  filterState: Partial<Schema>
): MergedCollectionItem[] {
  return mergedCollection?.filter((m) => {
    return Object.entries(filterState).every(([key, filterValue]) => {
      if (filterValue === undefined) return true
      if (Array.isArray(filterValue) && filterValue.length === 0) return true
      // console.log(m)
      const itemValue = m[key as keyof MergedCollectionItem]

      // Handle array values (like 'core')
      if (Array.isArray(itemValue)) {
        if (state.shape === 'round' && (state.core ?? []).length === 1 && !(state.core ?? []).includes(itemValue[0] as 'hollow' | 'solid')) {
          return false
        }
        return Array.isArray(filterValue)
          ? (itemValue as string[]).some(v => (filterValue as string[]).includes(v))
          : (itemValue as string[]).includes(String(filterValue))
      }

      // Handle special case for wildcard
      if (itemValue === '*') return true

      // console.log('key', key, 'itemValue', itemValue, 'filterValue', filterValue)
      // Handle number values (like 'cutDiameter')
      if (typeof itemValue === 'number' && typeof filterValue === 'number') {
        return itemValue >= filterValue
      }

      // Handle simple value comparison
      return itemValue === filterValue
    })
  }) || []
}

function getMaterialsResults(
  mergedCollection: MergedCollectionItem[] = [],
  currentState: Partial<Schema> = {},
  property?: keyof MergedCollectionItem,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any
) {
  const filterState = { ...currentState }

  if (property && value !== undefined) {
    filterState[property as keyof Schema] = value
  }

  const filtered = filter(mergedCollection, filterState)

  // Get unique model IDs from filtered results
  const uniqueModelIds = Array.from(new Set(filtered.map(item => item.modelId)))
  const uniqueMachineIds = Array.from(new Set(filtered.map(item => item.machineId)))

  // Get all possible values for the specified property in filtered results
  const remainingValues = property
    ? Array.from(new Set(filtered.map((item) => {
        const val = item[property]
        return Array.isArray(val) ? val : [val]
      }).flat()))
    : []

  return {
    count: uniqueModelIds.length,
    modelIds: uniqueModelIds,
    machineIds: uniqueMachineIds,
    remainingValues,
    filtered
  }
}

const normalizedItems = computed(() => {
  const map = itemKeys.map((key: keyof MaterialsCollectionItem) => {
    return {
      [key]: {
        items: getAllPossibleValues(allMaterials.value as MaterialsCollectionItem[], key).map((val) => {
          if (val === '*') return
          const filtered = getMaterialsResults(mergedCollection.value, state, key as keyof Schema, val)
          return {
            label: String(val).charAt(0).toUpperCase() + String(val).slice(1),
            value: val,
            description: `(${filtered.count} of ${getMaterialsResults(mergedCollection.value, { [key]: val }).count} machines)`,
            disabled: filtered.count < 1 ? true : false
          }
        }).filter(Boolean)
      }
    }
  })
  return Object.assign({}, ...map)
})

const filtered = computed(() => {
  return getMaterialsResults(mergedCollection.value, state)
})

function getAllPossibleValues(allValues: MaterialsCollectionItem[], key: keyof MaterialsCollectionItem): string[] {
  const values = allValues?.map((item) => {
    const val = item[key]
    if (val === null || val === undefined) {
      return []
    }
    if (Array.isArray(val)) {
      return val
    } else {
      return [String(val)]
    }
  }).flat()
  return Array.from(new Set(values)).sort()
}
</script>

<template>
  <UContainer>
    <UForm
      :state="state"
      :schema="schema"
      class="space-y-4 mb-6"
    >
      <ProseH2>
        {{ headerCopy?.title }}
      </ProseH2>
      <ProseP>
        {{ headerCopy?.description }}
      </ProseP>

      <div class="md:grid md:grid-cols-3 lg:grid-cols-4 gap-2">
        <MaterialFormItem :copy="formItemsCopy?.find(item => item.id === 'shape')">
          <URadioGroup
            v-model="state.shape"
            name="shape"
            :items="normalizedItems.shape.items"
            variant="table"
            size="xs"
            :ui="{ label: 'relative' }"
          >
            <template #label="{ item: { label, value } }">
              <span>{{ label }}</span>
              <UIcon
                :name="`c-${value}-hollow-none`"
                class="absolute -top-1 right-3 size-10 text-muted"
                :class="{ 'bg-primary': state.core === value }"
              />
            </template>
            <template #description="{ item: { description } }">
              <span class="italic">{{ description }}</span>
            </template>
          </URadioGroup>
        </MaterialFormItem>
        <MaterialFormItem :copy="formItemsCopy?.find(item => item.id === 'core')">
          <URadioGroup
            v-model="state.core"
            name="core"
            :items="normalizedItems.core.items"
            variant="table"
            size="xs"
            :ui="{ label: 'relative' }"
          >
            <template #label="{ item: { label, value } }">
              <span>{{ label }}</span>
              <UIcon
                :name="`c-${state.shape || 'complex'}-${value || 'hollow'}-none`"
                class="absolute -top-1 right-3 size-10 text-muted"
                :class="{ 'bg-primary': state.core === value }"
              />
            </template>
            <template #description="{ item: { description } }">
              <span class="italic">{{ description }}</span>
            </template>
          </URadioGroup>
        </MaterialFormItem>
        <MaterialFormItem :copy="formItemsCopy?.find(item => item.id === 'reinforced')">
          <URadioGroup
            v-model="state.reinforced"
            name="reinforced"
            :items="normalizedItems.reinforced.items"
            variant="table"
            size="xs"
            :ui="{ label: 'relative' }"
          >
            <template #label="{ item: { label, value } }">
              <span>{{ label }}</span>
              <UIcon
                :name="`c-${state.shape || 'round'}-${state.core || 'hollow'}-${value || 'none'}`"
                class="absolute -top-1 right-3 size-10 text-muted"
                :class="{ 'bg-primary': state.reinforced === value }"
              />
            </template>
            <template #description="{ item: { description } }">
              <span class="italic">{{ description }}</span>
            </template>
          </URadioGroup>
        </MaterialFormItem>
        <MaterialFormItem :copy="formItemsCopy?.find(item => item.id === 'stiffness')">
          <URadioGroup
            v-model="state.stiffness"
            name="stiffness"
            :items="normalizedItems.stiffness.items"
            variant="table"
            size="xs"
            :ui="{ label: 'relative' }"
          >
            <template #label="{ item: { label, value } }">
              <span>{{ label }}</span>
              <UIcon
                :name="`c-${value}`"
                class="absolute -top-3 right-0 h-12 w-24 text-muted"
                :class="{ 'bg-primary': state.stiffness === value }"
              />
            </template>
            <template #description="{ item: { description } }">
              <span class="italic">{{ description }}</span>
            </template>
          </URadioGroup>
        </MaterialFormItem>
        <MaterialFormItem
          v-if="state.shape === 'round'"
          :copy="formItemsCopy?.find(item => item.id === 'cutDiameter')"
          :col-count="2"
        >
          <MaterialDiameter
            v-model="state.cutDiameter"
            :machines="allMachines"
          />
        </MaterialFormItem>
        <MaterialFormItem
          v-else
          :copy="formItemsCopy?.find(item => item.id === 'cutWidthHeight')"
          :col-count="2"
        >
          <MaterialWidthHeight
            v-model:cut-width="state.cutWidth"
            v-model:cut-height="state.cutHeight"
            :machines="allMachines"
          />
        </MaterialFormItem>
      </div>
    </UForm>
    <UPageList>
      <ProductCard
        v-for="machineId in filtered.machineIds"
        :key="machineId"
        :slug="machineId"
        collection="machines"
        class="mb-1"
      />
    </UPageList>
    <pre>{{ filtered.modelIds }}</pre>
  </UContainer>
</template>
